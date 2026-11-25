/* LearnX role-based admin records, account provisioning and support desk */
document.addEventListener("DOMContentLoaded", () => {
  const user = LMSStorage.getCurrentUser();
  if (!user || user.role !== "admin") return;
  const main = document.querySelector(".lms-main-content");
  if (!main) return;
  const section = document.createElement("section");
  section.className = "lms-card mt-4";
  section.innerHTML = `
    <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
      <div><h2 class="h4 mb-1">User Records & Support Desk</h2><p class="text-muted mb-0">Inspect individual student/instructor activity and reported issues.</p></div>
      <button class="btn btn-primary" id="adminCreateAccount">+ Create Student / Instructor Account</button>
    </div>
    <div class="row g-3 mb-3">
      <div class="col-md-6"><label class="form-label">Filter records</label><input class="form-control" id="adminRecordSearch" placeholder="Search name, email or role"></div>
      <div class="col-md-6"><label class="form-label">Role</label><select class="form-select" id="adminRoleFilter"><option value="all">All users</option><option value="student">Students</option><option value="instructor">Instructors</option><option value="admin">Admins</option></select></div>
    </div>
    <div class="table-responsive"><table class="table table-hover align-middle"><thead><tr><th>User</th><th>Role</th><th>Enrollments / Courses</th><th>Submissions</th><th>Quiz Attempts</th><th>Recent Activity</th><th>Details</th></tr></thead><tbody id="adminIndividualRecords"></tbody></table></div>
    <hr class="my-4">
    <div class="d-flex justify-content-between align-items-center flex-wrap gap-2"><h3 class="h5 mb-0">Reported Issues</h3><span class="badge bg-warning text-dark" id="adminIssueCount">0 open</span></div>
    <div class="table-responsive mt-2"><table class="table table-hover"><thead><tr><th>Reported By</th><th>Issue</th><th>Date</th><th>Status</th><th>Action</th></tr></thead><tbody id="adminIssuesTable"></tbody></table></div>`;
  main.appendChild(section);

  const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const get = key => AppStorage.get(key, []);
  function renderRecords() {
    const q=(document.getElementById("adminRecordSearch").value||"").toLowerCase();
    const role=document.getElementById("adminRoleFilter").value;
    const users=LMSStorage.getAllUsers().filter(u=>(role==="all"||u.role===role)&&(`${u.name} ${u.email} ${u.role}`).toLowerCase().includes(q));
    const enroll=get(StorageKeys.ENROLLMENTS), subs=get(StorageKeys.SUBMISSIONS), attempts=get(StorageKeys.QUIZ_ATTEMPTS), logs=get(StorageKeys.ACTIVITY_LOGS), courses=LMSStorage.getCourses();
    document.getElementById("adminIndividualRecords").innerHTML=users.map(u=>{
      const ownCourses=courses.filter(c=>c.instructorId===u.id || c.instructor===u.name);
      const ownEnroll=enroll.filter(e=>e.studentId===u.id);
      const ownSubs=subs.filter(s=>s.studentId===u.id);
      const ownAttempts=attempts.filter(a=>a.studentId===u.id);
      const recent=logs.find(l=>l.userId===u.id);
      const activity=recent?`${recent.action} · ${new Date(recent.timestamp).toLocaleString()}`:"No activity yet";
      return `<tr><td><strong>${esc(u.name)}</strong><br><small>${esc(u.email)}</small></td><td><span class="badge bg-secondary">${esc(u.role)}</span></td><td>${u.role==="student"?ownEnroll.length+" enrollments":u.role==="instructor"?ownCourses.length+" courses":"—"}</td><td>${ownSubs.length}</td><td>${ownAttempts.length}</td><td><small>${esc(activity)}</small></td><td><button class="btn btn-sm btn-outline-primary" data-user-detail="${esc(u.id)}">View</button></td></tr>`;
    }).join("") || '<tr><td colspan="7" class="text-center text-muted">No matching accounts.</td></tr>';
    document.querySelectorAll("[data-user-detail]").forEach(button => button.addEventListener("click", () => {
      const id=button.dataset.userDetail, target=LMSStorage.getAllUsers().find(item=>item.id===id);
      if(!target)return;
      const enroll=get(StorageKeys.ENROLLMENTS).filter(x=>x.studentId===id);
      const submissions=get(StorageKeys.SUBMISSIONS).filter(x=>x.studentId===id);
      const attempts=get(StorageKeys.QUIZ_ATTEMPTS).filter(x=>x.studentId===id);
      const userCourses=courses.filter(c=>c.instructorId===id || c.instructor===target.name);
      const courseNames=target.role==="student" ? enroll.map(x=>courses.find(c=>c.id===x.courseId)?.title||x.courseId) : userCourses.map(c=>c.title);
      const detail=`<div class="p-3 bg-light rounded"><strong>${esc(target.name)} — ${esc(target.role)}</strong><br><b>Courses / Enrollments:</b> ${esc(courseNames.join(", ")||"None")}<br><b>Assignment submissions:</b> ${esc(submissions.map(x=>(x.assignmentId||"Assignment")+": "+(x.status||"Submitted")+" "+(x.grade??"")).join(" | ")||"None")}<br><b>Quiz attempts:</b> ${esc(attempts.map(x=>(x.quizTitle||x.quizId)+": "+x.percentage+"%").join(" | ")||"None")}<br><b>Account created:</b> ${esc(target.createdAt||"Unknown")}</div>`;
      const existing=document.getElementById("user-detail-"+id);
      if(existing){existing.remove();button.textContent="View";return;}
      document.querySelectorAll(".admin-user-detail-row").forEach(row=>row.remove());
      const row=document.createElement("tr");row.id="user-detail-"+id;row.className="admin-user-detail-row";
      const cell=document.createElement("td");cell.colSpan=7;cell.innerHTML=detail;row.appendChild(cell);
      button.closest("tr").after(row);button.textContent="Hide";
    }));
  }
  function renderIssues() {
    const issues=get("learnx_support_issues");
    document.getElementById("adminIssueCount").textContent=issues.filter(i=>i.status!=="Resolved").length+" open";
    document.getElementById("adminIssuesTable").innerHTML=issues.map(i=>`<tr><td>${esc(i.name)}<br><small>${esc(i.email)} · ${esc(i.role)}</small></td><td><strong>${esc(i.subject)}</strong><br>${esc(i.description)}</td><td>${new Date(i.createdAt).toLocaleString()}</td><td><span class="badge ${i.status==="Resolved"?"bg-success":"bg-warning text-dark"}">${esc(i.status)}</span></td><td>${i.status==="Resolved"?"—":`<button class="btn btn-sm btn-success" data-resolve="${esc(i.id)}">Resolve</button>`}</td></tr>`).join("") || '<tr><td colspan="5" class="text-center text-muted">No issues reported.</td></tr>';
    document.querySelectorAll("[data-resolve]").forEach(b=>b.onclick=()=>{const all=get("learnx_support_issues");const item=all.find(i=>i.id===b.dataset.resolve);if(item){item.status="Resolved";item.resolvedAt=new Date().toISOString();AppStorage.set("learnx_support_issues",all);renderIssues();}});
  }
  document.getElementById("adminRecordSearch").addEventListener("input",renderRecords);
  document.getElementById("adminRoleFilter").addEventListener("change",renderRecords);
  document.getElementById("adminCreateAccount").onclick=async()=>{
    const name=prompt("Full name:"); if(!name)return;
    const email=prompt("Email address:"); if(!email)return;
    const role=prompt("Account role: type student or instructor","instructor"); if(!role)return;
    const password=prompt("Temporary password (10+ chars, uppercase, lowercase, number and symbol):"); if(!password)return;
    const result=await AuthService.provisionAccount({name,email,password,role:role.toLowerCase()});
    alert(result.success?"Account created. Share the temporary password securely; user must log in.":result.message);
    renderRecords();
  };
  renderRecords(); renderIssues();
});
