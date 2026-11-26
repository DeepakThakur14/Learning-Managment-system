require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const { randomUUID } = require('crypto');
const { pool, initDb } = require('./db');
const { seedCatalogIfEmpty } = require('./seed');
const { signToken, requireAuth, requireRole } = require('./auth');

const app = express();
app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
const allowedOrigins = (process.env.FRONTEND_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({ origin(origin, cb) {
  if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) return cb(null, true);
  return cb(new Error('Origin is not allowed by CORS.'));
}, allowedHeaders: ['Content-Type', 'Authorization', 'X-Setup-Key'], methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'] }));
app.use(express.json({ limit: '2mb' }));
// Login, logout and registration are not throttled so legitimate role switching is not blocked.

const asyncRoute = fn => (req,res,next) => Promise.resolve(fn(req,res,next)).catch(next);
const safeUser = u => ({ id:u.id, name:u.name, email:u.email, role:u.role, status:u.status });

app.get('/api/health', asyncRoute(async (_req,res) => {
  await pool.query('SELECT 1');
  res.json({ ok:true, service:'LearnX LMS API', database:'connected' });
}));

app.post('/api/auth/register', asyncRoute(async (req,res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const requestedRole = req.body.role === 'instructor' ? 'instructor' : 'student';
  if (name.length < 2 || name.length > 100) return res.status(400).json({ error:'Enter a name between 2 and 100 characters.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error:'Enter a valid email address.' });
  if (password.length < 10 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) return res.status(400).json({ error:'Password must be at least 10 characters and include uppercase, lowercase, number and special character.' });
  const [existing] = await pool.execute('SELECT id FROM users WHERE email=?', [email]);
  if (existing.length) return res.status(409).json({ error:'An account with this email already exists.' });
  const id = randomUUID();
  const hash = await bcrypt.hash(password, 12);
  const status = 'active';
  await pool.execute('INSERT INTO users(id,name,email,password_hash,role,status) VALUES(?,?,?,?,?,?)', [id,name,email,hash,requestedRole,status]);
  res.status(201).json({ success:true, message: requestedRole === 'instructor' ? 'Instructor account created and activated. You can now sign in.' : 'Student account created. You can now sign in.' });
}));

app.post('/api/auth/login', asyncRoute(async (req,res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const requestedRole = req.body.role;
  const [rows] = await pool.execute('SELECT * FROM users WHERE email=? LIMIT 1', [email]);
  if (!rows.length || !(await bcrypt.compare(password, rows[0].password_hash))) return res.status(401).json({ error:'Email or password is incorrect.' });
  const user = rows[0];
  if (user.status !== 'active') return res.status(403).json({ error: user.status === 'pending' ? 'Your instructor account is waiting for admin approval.' : 'This account has been disabled.' });
  if (requestedRole && requestedRole !== user.role) return res.status(403).json({ error:`This account belongs to the ${user.role} portal.` });
  res.json({ success:true, token:signToken(user), user:safeUser(user) });
}));

app.get('/api/auth/me', requireAuth, (req,res) => res.json({ user:safeUser(req.user) }));
app.post('/api/auth/logout', (_req,res) => res.json({ success:true }));

// One-time first-admin bootstrap. Disabled automatically once any admin exists.
app.post('/api/setup/initial-admin', rateLimit({ windowMs: 15 * 60 * 1000, limit: 5 }), asyncRoute(async (req,res) => {
  const setupKey = process.env.INITIAL_ADMIN_SETUP_KEY || '';
  if (!setupKey || req.headers['x-setup-key'] !== setupKey) return res.status(403).json({ error:'Invalid setup key.' });
  const [admins] = await pool.execute("SELECT id FROM users WHERE role='admin' LIMIT 1");
  if (admins.length) return res.status(409).json({ error:'An admin already exists. Bootstrap is permanently closed.' });
  const name=String(req.body.name||'').trim(), email=String(req.body.email||'').trim().toLowerCase(), password=String(req.body.password||'');
  if(name.length<2 || !/^\S+@\S+\.\S+$/.test(email) || password.length<12) return res.status(400).json({error:'Provide a name, valid email and password of at least 12 characters.'});
  const [existing]=await pool.execute('SELECT id FROM users WHERE email=?',[email]);
  if(existing.length) return res.status(409).json({error:'This email is already registered.'});
  const hash=await bcrypt.hash(password,12);
  await pool.execute("INSERT INTO users(id,name,email,password_hash,role,status) VALUES(?,?,?,?,'admin','active')",[randomUUID(),name,email,hash]);
  res.status(201).json({success:true,message:'First admin created. Remove INITIAL_ADMIN_SETUP_KEY from Railway Variables now.'});
}));

function mapCourse(row, modules) {
  return { id:row.id, title:row.title, slug:row.slug, category:row.category, level:row.level, duration:row.duration,
    instructorId:row.instructor_id || '', instructor:row.instructor_name, rating:Number(row.rating), reviewsCount:row.reviews_count,
    enrolledCount:row.enrolled_count, badge:row.badge, thumbnail:row.thumbnail || '', description:row.description || '',
    objectives: typeof row.objectives === 'string' ? JSON.parse(row.objectives || '[]') : (row.objectives || []),
    curriculum:modules, totalLessons:modules.reduce((n,m)=>n+m.lessons.length,0), status:row.status, createdAt:row.created_at };
}

async function getCourseRows({ includeDrafts=false, user=null }={}) {
  let sql = `SELECT c.* FROM courses c`;
  const args=[];
  if (!includeDrafts) sql += ` WHERE c.status='published'`;
  else if (user?.role === 'instructor') { sql += ` WHERE c.instructor_id=? OR c.status='published'`; args.push(user.id); }
  const [courses] = await pool.execute(sql + ' ORDER BY c.created_at ASC', args);
  if (!courses.length) return [];
  const ids = courses.map(c=>c.id); const placeholders=ids.map(()=>'?').join(',');
  const [mods] = await pool.query(`SELECT * FROM course_modules WHERE is_active=1 AND course_id IN (${placeholders}) ORDER BY position`, ids);
  const modIds = mods.map(m=>m.id);
  let lessons=[];
  if (modIds.length) { const ph=modIds.map(()=>'?').join(','); [lessons] = await pool.query(`SELECT * FROM lessons WHERE is_active=1 AND module_id IN (${ph}) ORDER BY position`, modIds); }
  const lessonsByMod=new Map();
  for (const l of lessons) { if(!lessonsByMod.has(l.module_id)) lessonsByMod.set(l.module_id,[]); lessonsByMod.get(l.module_id).push({ id:l.id,title:l.title,duration:l.duration||'',minutes:l.minutes,videoUrl:l.video_url||'',summary:l.summary||'' }); }
  const modsByCourse=new Map();
  for (const m of mods) { if(!modsByCourse.has(m.course_id)) modsByCourse.set(m.course_id,[]); modsByCourse.get(m.course_id).push({ id:m.id,title:m.title,lessons:lessonsByMod.get(m.id)||[] }); }
  return courses.map(c=>mapCourse(c,modsByCourse.get(c.id)||[]));
}

app.get('/api/courses', asyncRoute(async (req,res)=> {
  const courses=await getCourseRows({ includeDrafts:req.query.manage==='1' && !!req.headers.authorization, user:req.user });
  res.json({ courses });
}));
app.get('/api/courses/:id', asyncRoute(async (req,res)=> {
  const courses=await getCourseRows({ includeDrafts:false, user:req.user });
  const course=courses.find(c=>c.id===req.params.id);
  if(!course) return res.status(404).json({error:'Course not found.'});
  res.json({course});
}));

async function writeCourse(course, user, isUpdate=false, courseId=null) {
  const id=courseId || String(course.id || `course-${Date.now()}`);
  const title=String(course.title||'').trim();
  if(!title) { const e=new Error('Course title is required.'); e.status=400; throw e; }
  const baseSlug=String(course.slug || title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''));
  const slug=isUpdate ? baseSlug : `${baseSlug}-${String(course.id || Date.now()).slice(-6)}`;
  const instructorId=user.role==='instructor' ? user.id : (course.instructorId || null);
  const instructorName=String(course.instructor || user.name || 'Instructor not assigned');
  const objectives=JSON.stringify(Array.isArray(course.objectives)?course.objectives:[]);
  const conn=await pool.getConnection();
  try {
    await conn.beginTransaction();
    if (isUpdate) {
      await conn.execute(`UPDATE courses SET title=?,slug=?,category=?,level=?,duration=?,instructor_id=?,instructor_name=?,thumbnail=?,description=?,objectives=?,status='published' WHERE id=?`,
        [title,slug,course.category||'Other',course.level||'Beginner',course.duration||'Self-paced',instructorId,instructorName,course.thumbnail||null,course.description||'',objectives,id]);
    } else {
      await conn.execute(`INSERT INTO courses(id,title,slug,category,level,duration,instructor_id,instructor_name,thumbnail,description,objectives,status) VALUES(?,?,?,?,?,?,?,?,?,?,?,'published')`,
        [id,title,slug,course.category||'Other',course.level||'Beginner',course.duration||'Self-paced',instructorId,instructorName,course.thumbnail||null,course.description||'',objectives]);
    }
    const curriculum=Array.isArray(course.curriculum)?course.curriculum:[];
    for(let mi=0;mi<curriculum.length;mi++) {
      const mod=curriculum[mi], mid=String(mod.id||`${id}-module-${mi+1}`);
      await conn.execute(`INSERT INTO course_modules(id,course_id,title,position,is_active) VALUES(?,?,?,?,1) ON DUPLICATE KEY UPDATE title=VALUES(title),position=VALUES(position),is_active=1`,[mid,id,mod.title||`Module ${mi+1}`,mi]);
      const ls=Array.isArray(mod.lessons)?mod.lessons:[];
      for(let li=0;li<ls.length;li++) {
        const l=ls[li], lid=String(l.id||`${mid}-lesson-${li+1}`);
        await conn.execute(`INSERT INTO lessons(id,module_id,title,duration,minutes,video_url,summary,position,is_active) VALUES(?,?,?,?,?,?,?,?,1) ON DUPLICATE KEY UPDATE title=VALUES(title),duration=VALUES(duration),minutes=VALUES(minutes),video_url=VALUES(video_url),summary=VALUES(summary),position=VALUES(position),is_active=1`,
          [lid,mid,l.title||`Lesson ${li+1}`,l.duration||null,Number(l.minutes||0),l.videoUrl||null,l.summary||'',li]);
      }
    }
    await conn.commit();
  } catch(e) { await conn.rollback(); throw e; }
  finally { conn.release(); }
  const rows=await getCourseRows({includeDrafts:true,user});
  return rows.find(c=>c.id===id);
}

app.post('/api/courses', requireAuth, requireRole('admin','instructor'), asyncRoute(async(req,res)=> {
  const course=await writeCourse(req.body,req.user,false);
  res.status(201).json({course});
}));
app.put('/api/courses/:id', requireAuth, requireRole('admin','instructor'), asyncRoute(async(req,res)=> {
  const [rows]=await pool.execute('SELECT id,instructor_id FROM courses WHERE id=?',[req.params.id]);
  if(!rows.length) return res.status(404).json({error:'Course not found.'});
  if(req.user.role==='instructor' && rows[0].instructor_id!==req.user.id) return res.status(403).json({error:'You can edit only your own courses.'});
  const course=await writeCourse(req.body,req.user,true,req.params.id);
  res.json({course});
}));
app.delete('/api/courses/:id', requireAuth, requireRole('admin','instructor'), asyncRoute(async(req,res)=> {
  const [rows]=await pool.execute('SELECT id,instructor_id FROM courses WHERE id=?',[req.params.id]);
  if(!rows.length) return res.status(404).json({error:'Course not found.'});
  if(req.user.role==='instructor' && rows[0].instructor_id!==req.user.id) return res.status(403).json({error:'You can delete only your own courses.'});
  await pool.execute("UPDATE courses SET status='archived' WHERE id=?",[req.params.id]);
  res.json({success:true});
}));

app.post('/api/courses/:id/enroll', requireAuth, requireRole('student'), asyncRoute(async(req,res)=> {
  const [c]=await pool.execute("SELECT id FROM courses WHERE id=? AND status='published'",[req.params.id]);
  if(!c.length) return res.status(404).json({error:'Published course not found.'});
  await pool.execute('INSERT IGNORE INTO enrollments(student_id,course_id) VALUES(?,?)',[req.user.id,req.params.id]);
  res.json({success:true});
}));
app.get('/api/me/enrollments', requireAuth, requireRole('student'), asyncRoute(async(req,res)=> {
  const [rows]=await pool.execute('SELECT course_id,enrolled_at FROM enrollments WHERE student_id=? ORDER BY enrolled_at DESC',[req.user.id]);
  res.json({enrollments:rows});
}));
app.put('/api/me/progress/:lessonId', requireAuth, requireRole('student'), asyncRoute(async(req,res)=> {
  const completed=!!req.body.completed;
  await pool.execute(`INSERT INTO lesson_progress(student_id,lesson_id,completed,completed_at) VALUES(?,?,?,IF(?,NOW(),NULL)) ON DUPLICATE KEY UPDATE completed=VALUES(completed),completed_at=VALUES(completed_at)`,[req.user.id,req.params.lessonId,completed?1:0,completed?1:0]);
  res.json({success:true});
}));
app.get('/api/admin/users', requireAuth, requireRole('admin'), asyncRoute(async(_req,res)=> {
  const [users]=await pool.execute('SELECT id,name,email,role,status,created_at FROM users ORDER BY created_at DESC');
  res.json({users});
}));
app.post('/api/admin/users', requireAuth, requireRole('admin'), asyncRoute(async(req,res)=> {
  const name=String(req.body.name||'').trim(), email=String(req.body.email||'').trim().toLowerCase();
  const password=String(req.body.password||''), role=['student','instructor'].includes(req.body.role)?req.body.role:null;
  if(name.length<2 || !/^\S+@\S+\.\S+$/.test(email) || !role || password.length<10 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) return res.status(400).json({error:'Provide a valid name, email, role and password (10+ characters with upper/lowercase, number and symbol).'});
  const id=randomUUID(), hash=await bcrypt.hash(password,12), status='active';
  await pool.execute('INSERT INTO users(id,name,email,password_hash,role,status) VALUES(?,?,?,?,?,?)',[id,name,email,hash,role,status]);
  res.status(201).json({success:true,user:{id,name,email,role,status}});
}));
app.get('/api/support/issues', requireAuth, asyncRoute(async(req,res)=> {
  if(req.user.role==='admin') {
    const [issues]=await pool.execute(`SELECT id,user_id,user_name,user_email,user_role,subject,description,status,created_at,resolved_at,admin_response FROM support_issues ORDER BY created_at DESC`);
    return res.json({issues});
  }
  const [issues]=await pool.execute(`SELECT id,user_id,user_name,user_email,user_role,subject,description,status,created_at,resolved_at,admin_response FROM support_issues WHERE user_id=? ORDER BY created_at DESC`,[req.user.id]);
  res.json({issues});
}));
app.post('/api/support/issues', requireAuth, requireRole('student','instructor'), asyncRoute(async(req,res)=> {
  const subject=String(req.body.subject||'').trim(), description=String(req.body.description||'').trim();
  if(subject.length<3 || subject.length>100 || description.length<5 || description.length>2000) return res.status(400).json({error:'Issue title must be 3–100 characters and description 5–2000 characters.'});
  const id=randomUUID();
  await pool.execute('INSERT INTO support_issues(id,user_id,user_name,user_email,user_role,subject,description,status) VALUES(?,?,?,?,?,?,?,\'Open\')',[id,req.user.id,req.user.name,req.user.email,req.user.role,subject,description]);
  res.status(201).json({success:true,message:'Issue submitted to admin.',issue:{id,subject,description,status:'Open'}});
}));
app.patch('/api/support/issues/:id', requireAuth, requireRole('admin'), asyncRoute(async(req,res)=> {
  const status=['Open','In Progress','Resolved'].includes(req.body.status)?req.body.status:null;
  const response=String(req.body.adminResponse||'').trim().slice(0,2000);
  if(!status) return res.status(400).json({error:'Choose Open, In Progress or Resolved.'});
  const [result]=await pool.execute('UPDATE support_issues SET status=?,admin_response=?,resolved_at=IF(?=\'Resolved\',NOW(),NULL) WHERE id=?',[status,response,status,req.params.id]);
  if(!result.affectedRows) return res.status(404).json({error:'Issue not found.'});
  res.json({success:true});
}));
app.patch('/api/admin/users/:id/role', requireAuth, requireRole('admin'), asyncRoute(async(req,res)=> {
  const role=['admin','instructor','student'].includes(req.body.role)?req.body.role:null;
  const status=['active','pending','disabled'].includes(req.body.status)?req.body.status:null;
  if(!role && !status) return res.status(400).json({error:'Provide a valid role or status.'});
  if(role) await pool.execute('UPDATE users SET role=? WHERE id=?',[role,req.params.id]);
  if(status) await pool.execute('UPDATE users SET status=? WHERE id=?',[status,req.params.id]);
  res.json({success:true});
}));

app.use((err,_req,res,_next)=> {
  console.error('[LearnX API]',err);
  const status=err.status|| (err.code==='ER_DUP_ENTRY'?409:500);
  res.status(status).json({error: status===500 ? 'Server error. Check backend logs.' : err.message});
});

const port=Number(process.env.PORT||3000);
initDb().then(async()=>{
    // Instructor accounts are self-service and do not require manual approval.
    await pool.execute("UPDATE users SET status='active' WHERE role='instructor' AND status='pending'");
  }).then(seedCatalogIfEmpty).then(seed=>{ if(seed.seeded) console.log(`Seeded ${seed.count} starter courses.`); return app.listen(port,'0.0.0.0',()=>console.log(`LearnX API listening on ${port}`)); })
  .catch(err=>{console.error('Database initialization failed:',err);process.exit(1);});
