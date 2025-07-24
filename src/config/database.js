import { DataSource } from "typeorm";

export const connectDatabase = async () => {
  try {
    const connection = new DataSource({
      type: "postgres",
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || "leepcode_db",
      username: process.env.DB_USERNAME || "postgres",
      password: process.env.DB_PASSWORD,
      synchronize: false,
      logging: process.env.NODE_ENV === "development",
    });

    console.log("DB connected successfully");
    return connection;
  } catch (error) {
    console.error("DB connection failed:", error.message);
    process.exit(1);
  }
};
