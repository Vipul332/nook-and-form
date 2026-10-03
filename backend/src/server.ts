import app from "./app";
import env from "./config/env";
import { connectDatabase } from "./config/db";

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    app.listen(env.port, () => {
      console.log(
        `Server running at http://localhost:${env.port}`
      );

      console.log(
        `Health check: http://localhost:${env.port}/api/health`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();