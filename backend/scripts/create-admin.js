require('dotenv').config();
const readline=require('readline'); const bcrypt=require('bcryptjs'); const {randomUUID}=require('crypto'); const {pool,initDb}=require('../src/db');
const rl=readline.createInterface({input:process.stdin,output:process.stdout});
const ask=q=>new Promise(resolve=>rl.question(q,resolve));
(async()=>{
 await initDb();
 const name=(await ask('Admin full name: ')).trim();
 const email=(await ask('Admin email: ')).trim().toLowerCase();
 const password=await ask('Admin password (input visible; use a strong unique password): ');
 if(name.length<2||!/^\S+@\S+\.\S+$/.test(email)||password.length<10) throw new Error('Invalid name/email or password too short (minimum 10 characters).');
 const hash=await bcrypt.hash(password,12);
 await pool.execute("INSERT INTO users(id,name,email,password_hash,role,status) VALUES(?,?,?,?,'admin','active')",[randomUUID(),name,email,hash]);
 console.log('Admin account created. Sign in using this email and password.');
})().catch(e=>{console.error(e.message);process.exitCode=1;}).finally(async()=>{rl.close();await pool.end();});
