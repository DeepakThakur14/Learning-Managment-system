# LearnX LMS API (Node.js + Express + MySQL)

See `../DEPLOY_MYSQL_GUIDE.md` for Railway deployment and setup instructions.

Start locally:

```bash
cp .env.example .env
npm install
npm start
```

Create the first admin:

```bash
npm run admin:create
```

Health endpoint: `GET /api/health`
