/* LearnX LMS shared MySQL API bridge. The browser talks only to Express; DB credentials stay server-side. */
"use strict";
(function () {
  const API = (window.LEARNX_API_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
  const TOKEN_KEY = 'learnx_api_token_v1';
  const getToken = () => localStorage.getItem(TOKEN_KEY) || '';
  const setToken = token => token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY);

  async function request(path, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (getToken()) headers.Authorization = `Bearer ${getToken()}`;
    let response;
    try { response = await fetch(`${API}${path}`, { ...options, headers }); }
    catch (e) { throw new Error(`Cannot reach LearnX API at ${API}. Start the backend locally or set the deployed Railway API URL. (${e.message})`); }
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 401) { setToken(''); AuthService.setCurrentUser(null); }
      throw new Error(body.error || `Request failed (${response.status}).`);
    }
    return body;
  }

  const Bridge = {
    readyPromise: null,
    async restoreSession() {
      if (!getToken()) { AuthService.setCurrentUser(null); return null; }
      try {
        const result = await request('/api/auth/me');
        AuthService.setCurrentUser(result.user);
        return result.user;
      } catch (e) { setToken(''); AuthService.setCurrentUser(null); return null; }
    },
    async loadCourses() {
      const result = await request('/api/courses');
      const courses = result.courses || [];
      AppStorage.set(StorageKeys.COURSES, courses, true);
      return courses;
    },
    async ready() {
      if (!this.readyPromise) this.readyPromise = (async () => {
        await this.restoreSession();
        try { await this.loadCourses(); }
        catch (e) { console.warn('[LearnX API] Course sync failed:', e.message); }
      })();
      return this.readyPromise;
    },
    async saveCourse(course, isUpdate = false) {
      const path = isUpdate ? `/api/courses/${encodeURIComponent(course.id)}` : '/api/courses';
      const result = await request(path, { method: isUpdate ? 'PUT' : 'POST', body: JSON.stringify(course) });
      await this.loadCourses();
      return result.course;
    },
    async removeCourse(courseId) {
      await request(`/api/courses/${encodeURIComponent(courseId)}`, { method: 'DELETE' });
      await this.loadCourses();
      return true;
    },
    async enroll(courseId) { return request(`/api/courses/${encodeURIComponent(courseId)}/enroll`, { method: 'POST', body: '{}' }); },
    async markLesson(lessonId, completed = true) { return request(`/api/me/progress/${encodeURIComponent(lessonId)}`, { method: 'PUT', body: JSON.stringify({ completed }) }); },
    async listUsers() { const result = await request('/api/admin/users'); return result.users || []; },
    async listSupportIssues() { const result = await request('/api/support/issues'); return result.issues || []; },
    async createSupportIssue(data) { return request('/api/support/issues', { method: 'POST', body: JSON.stringify(data) }); },
    async updateSupportIssue(id, data) { return request(`/api/support/issues/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(data) }); }
  };
  window.LearnXCloud = Bridge; // Keep existing page hooks working while replacing Supabase implementation.

  AuthService.login = async function (email, password, role) {
    try {
      const result = await request('/api/auth/login', { method:'POST', body:JSON.stringify({ email, password, role }) });
      setToken(result.token);
      this.setCurrentUser(result.user);
      return { success:true, user:result.user };
    } catch (e) { return { success:false, message:e.message }; }
  };
  AuthService.register = async function (data) {
    try {
      const result = await request('/api/auth/register', { method:'POST', body:JSON.stringify(data) });
      return { success:true, message:result.message };
    } catch (e) { return { success:false, message:e.message }; }
  };
  AuthService.provisionAccount = async function(data) { try { const result=await request('/api/admin/users',{method:'POST',body:JSON.stringify(data)}); return {success:true,user:result.user}; } catch(e) { return {success:false,message:e.message}; } };
  AuthService.logout = function () {
    setToken('');
    this.setCurrentUser(null);
  };

  const baseAdd = LMSStorage.addCourse.bind(LMSStorage);
  const baseUpdate = LMSStorage.updateCourse.bind(LMSStorage);
  const baseDelete = LMSStorage.deleteCourse.bind(LMSStorage);
  LMSStorage.addCourse = async function (courseData, instructorId) {
    const current = AuthService.getCurrentUser();
    if (!current || !['admin','instructor'].includes(current.role)) throw new Error('Only an admin or approved instructor can add courses.');
    const before = AppDB.findAll(StorageKeys.COURSES).slice();
    const created = baseAdd(courseData, instructorId || current.id);
    if (!created) return null;
    if (current.role === 'instructor') { created.instructorId=current.id; created.instructor=current.name; }
    try { return await Bridge.saveCourse(created, false); }
    catch(e) { AppStorage.set(StorageKeys.COURSES,before,true); throw e; }
  };
  LMSStorage.updateCourse = async function (courseId, fields) {
    const before = AppDB.findAll(StorageKeys.COURSES).slice();
    const updated = baseUpdate(courseId, fields);
    if (!updated) return null;
    try { return await Bridge.saveCourse(updated, true); }
    catch(e) { AppStorage.set(StorageKeys.COURSES,before,true); throw e; }
  };
  LMSStorage.deleteCourse = async function (courseId) {
    const before = AppDB.findAll(StorageKeys.COURSES).slice();
    const deleted = baseDelete(courseId);
    if (!deleted) return false;
    try { await Bridge.removeCourse(courseId); return true; }
    catch(e) { AppStorage.set(StorageKeys.COURSES,before,true); throw e; }
  };

  window.LearnXApi = { request, getToken, setToken, baseUrl:API };
})();
