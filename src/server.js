import express from "express"
import {configDotenv} from "dotenv"
import cors from "cors"
configDotenv({quiet:true});




const app = express();


const PORT = process.env.PORT;

app.listen(PORT,()=>{
    console.log(`Server running at ${PORT}`);
    
})