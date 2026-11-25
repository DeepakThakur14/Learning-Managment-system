const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 5000;
const BASE_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
    let reqUrl = decodeURI(req.url.split('?')[0]);
    if (reqUrl === '/' || reqUrl === '') {
        reqUrl = '/Index.html';
    }

    let filePath = path.join(BASE_DIR, reqUrl);

    // Normalize path to prevent directory traversal
    if (!filePath.startsWith(BASE_DIR)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // Check if it's a directory with Index.html
            if (stats && stats.isDirectory()) {
                filePath = path.join(filePath, 'Index.html');
            } else {
                // Fallback: check inside Front-page folder
                const frontPagePath = path.join(BASE_DIR, 'Front-page', reqUrl);
                if (fs.existsSync(frontPagePath) && fs.statSync(frontPagePath).isFile()) {
                    filePath = frontPagePath;
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('404 Not Found');
                    return;
                }
            }
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        fs.readFile(filePath, (readErr, data) => {
            if (readErr) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Internal Server Error');
                return;
            }
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    });
});

server.listen(PORT, '127.0.0.1', () => {
    const url = `http://localhost:${PORT}/`;
    console.log(`LearnX LMS Server running at ${url}`);
    console.log(`Press Ctrl+C to stop.`);

    // Automatically open in default browser on Windows
    exec(`start ${url}`);
});
