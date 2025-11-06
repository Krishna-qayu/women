const express=require("express")
const cors = require("cors");
const app=express()
const dotenv=require("dotenv").config()
const connectDb=require("./config/connectionDb")
const { connect } = require("mongoose")

const PORT=process.env.PORT || 3000
const path = require('path');
connectDb()
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/women",require("./routes/women"))
app.use("/api/events", require("./routes/events"));
app.use("/api/admin", require("./routes/admin"));
app.listen(PORT,(err)=>{
    console.log(`app is listing on port ${PORT}`)
})