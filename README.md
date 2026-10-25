# Project Review Dashboard

A role-based project submission and review platform built as a task assessment.

## 🔗 Live Links

- **Live Site:** https://dashboard-backend-repo.vercel.app/
- **Backend Repo:** https://github.com/Anneparvin/dashboard-backendRepo

> The backend runs on a free plan and may take 30-60 seconds to wake up on the first request.

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| Mentor/Admin | admin@example.com | Admin@1234 |
| Student | Sign up from the Sign up page | — |

## ✨ Features

- JWT-based role-based access control (Student / Mentor / Admin)
- Student: submit projects with validation, duplicate prevention and rate limiting
- Mentor: paginated review table, server-side Approved/Rejected filter, approve/reject actions, aggregated stats

## 🛠 Tech Stack

TypeScript, Next.js, TailwindCSS, ShadCN UI, TanStack Query, React Hook Form, Zod, Express.js, PostgreSQL (Neon), Prisma ORM

## ▶️ Run Locally

\`\`\`bash
npm install
# .env.local → NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm run dev
\`\`\`# dashboard-backendRepo
