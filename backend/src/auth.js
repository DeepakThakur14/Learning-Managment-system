const jwt = require('jsonwebtoken');
const { pool } = require('./db');

function signToken(user) {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET must be set to a random value of at least 32 characters.');
  return jwt.sign({ sub: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d', issuer: 'learnx-lms' });
}

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    if (!token) return res.status(401).json({ error: 'Sign in required.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { issuer: 'learnx-lms' });
    const [rows] = await pool.execute('SELECT id,name,email,role,status FROM users WHERE id=? LIMIT 1', [decoded.sub]);
    if (!rows.length || rows[0].status !== 'active') return res.status(401).json({ error: 'Account is unavailable.' });
    req.user = rows[0];
    next();
  } catch (e) { return res.status(401).json({ error: 'Session expired. Please sign in again.' }); }
}

function requireRole(...roles) {
  return (req, res, next) => roles.includes(req.user?.role) ? next() : res.status(403).json({ error: 'You do not have permission to perform this action.' });
}

module.exports = { signToken, requireAuth, requireRole };
