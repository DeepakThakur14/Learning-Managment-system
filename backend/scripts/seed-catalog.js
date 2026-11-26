require('dotenv').config();
const fs=require('fs'); const path=require('path');
const {pool,initDb}=require('../src/db');
(async()=>{
 await initDb();
 const courses=JSON.parse(fs.readFileSync(path.join(__dirname,'..','seed-courses.json'),'utf8'));
 const conn=await pool.getConnection();
 try {
  await conn.beginTransaction();
  for(const c of courses){
   await conn.execute(`INSERT INTO courses(id,title,slug,category,level,duration,instructor_name,rating,reviews_count,enrolled_count,badge,thumbnail,description,objectives,status) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?, 'published') ON DUPLICATE KEY UPDATE title=VALUES(title),slug=VALUES(slug),category=VALUES(category),level=VALUES(level),duration=VALUES(duration),thumbnail=VALUES(thumbnail),description=VALUES(description),objectives=VALUES(objectives)`,[c.id,c.title,c.slug,c.category,c.level,c.duration,c.instructor||'Instructor not assigned',Number(c.rating||0),Number(c.reviewsCount||0),Number(c.enrolledCount||0),c.badge||null,c.thumbnail||null,c.description||'',JSON.stringify(c.objectives||[])]);
   for(let mi=0;mi<(c.curriculum||[]).length;mi++){
    const m=c.curriculum[mi]; const mid=String(m.id||`${c.id}-module-${mi+1}`);
    await conn.execute(`INSERT INTO course_modules(id,course_id,title,position,is_active) VALUES(?,?,?,?,1) ON DUPLICATE KEY UPDATE title=VALUES(title),position=VALUES(position),is_active=1`,[mid,c.id,m.title||`Module ${mi+1}`,mi]);
    for(let li=0;li<(m.lessons||[]).length;li++){
     const l=m.lessons[li];
     await conn.execute(`INSERT INTO lessons(id,module_id,title,duration,minutes,video_url,summary,position,is_active) VALUES(?,?,?,?,?,?,?,?,1) ON DUPLICATE KEY UPDATE title=VALUES(title),duration=VALUES(duration),minutes=VALUES(minutes),video_url=VALUES(video_url),summary=VALUES(summary),position=VALUES(position),is_active=1`,[String(l.id||`${mid}-lesson-${li+1}`),mid,l.title||`Lesson ${li+1}`,l.duration||null,Number(l.minutes||0),l.videoUrl||null,l.summary||'',li]);
    }
   }
  }
  await conn.commit(); console.log(`Seeded ${courses.length} courses, ${courses.reduce((n,c)=>n+(c.curriculum||[]).length,0)} modules.`);
 }catch(e){await conn.rollback();throw e;}finally{conn.release();await pool.end();}
})().catch(e=>{console.error(e);process.exit(1);});
