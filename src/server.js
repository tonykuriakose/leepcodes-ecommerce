import express from "express";
import { configDotenv } from "dotenv";
import cors from "cors";
import { connectDatabase } from "./config/database.js";
configDotenv({ quiet: true });

import authRouter from "./routes/auth.js"

const app = express();
connectDatabase();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

app.get("/health", (req, res) => {
  res.json({
    message: "Server is running",
  });
});

app.get("/api/test", (req, res) =>{
     res.json({
    message: "LeetCodes Backend API is working",
  })
})


app.use("/api/auth",authRouter);
 


const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
