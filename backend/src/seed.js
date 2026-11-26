const fs = require('fs');
const path = require('path');
const { pool } = require('./db');

async function seedCatalogIfEmpty() {
  const [countRows] = await pool.query('SELECT COUNT(*) AS total FROM courses');
  if (Number(countRows[0].total) > 0) return { seeded:false, count:Number(countRows[0].total) };
  const courses = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'seed-courses.json'), 'utf8'));
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    for (const c of courses) {
      await conn.execute(`INSERT INTO courses(id,title,slug,category,level,duration,instructor_name,rating,reviews_count,enrolled_count,badge,thumbnail,description,objectives,status) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?, 'published')`,
        [c.id,c.title,c.slug,c.category,c.level,c.duration,c.instructor||'Instructor not assigned',Number(c.rating||0),Number(c.reviewsCount||0),Number(c.enrolledCount||0),c.badge||null,c.thumbnail||null,c.description||'',JSON.stringify(c.objectives||[])]);
      for (let mi=0; mi<(c.curriculum||[]).length; mi++) {
        const m=c.curriculum[mi], mid=String(m.id||`${c.id}-module-${mi+1}`);
        await conn.execute('INSERT INTO course_modules(id,course_id,title,position,is_active) VALUES(?,?,?,?,1)',[mid,c.id,m.title||`Module ${mi+1}`,mi]);
        for (let li=0; li<(m.lessons||[]).length; li++) {
          const l=m.lessons[li];
          await conn.execute('INSERT INTO lessons(id,module_id,title,duration,minutes,video_url,summary,position,is_active) VALUES(?,?,?,?,?,?,?,?,1)',
            [String(l.id||`${mid}-lesson-${li+1}`),mid,l.title||`Lesson ${li+1}`,l.duration||null,Number(l.minutes||0),l.videoUrl||null,l.summary||'',li]);
        }
      }
    }
    await conn.commit();
    return { seeded:true, count:courses.length };
  } catch(e) { await conn.rollback(); throw e; }
  finally { conn.release(); }
}
module.exports = { seedCatalogIfEmpty };
