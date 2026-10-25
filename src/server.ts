// src/server.ts
import app from "./app";
import { env } from "./config/env";
import { prisma } from "./config/db";

async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected");

    app.listen(env.port, () => {
      console.log(`🚀 Server running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();