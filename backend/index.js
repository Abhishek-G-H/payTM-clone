const express = require("express");
const mainRouter = require("./routers");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors())
app.use("/api/v1",mainRouter);

app.listen(3000,()=>{
    console.log("server running on 3000");
});



