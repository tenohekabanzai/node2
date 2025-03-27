const express = require('express')
const fs = require('fs')
const zlib = require('zlib')
const status = require('express-status-monitor')
const app = express()
app.use(status())

// load file content in RAM and then send it to client(Very memory intensive)
app.get('/normal',(req,res)=>{
    fs.readFile('./sample.txt',(err,data)=>{
        if(err)
        {
            res.status(500).send("Error reading File")
            return;
        }
        res.end(data)
    })
})

// 1st approach -> stream the large file in chunks
app.get('/stream',(req,res)=>{
    const stream = fs.createReadStream('./sample.txt',"utf-8");
    stream.on('data',(chunk)=>res.write(chunk))
    stream.on("end",()=>res.end());
})

// 2nd approach , convert large file to zip 
// (here file does not persist in RAM, it is read in chunks and zipped in chunks to sample.zlib)
fs.createReadStream("./sample.txt").pipe(
    zlib.createGzip().pipe(fs.createWriteStream("./sample.zip"))
)

app.listen(8080,()=>{
    console.log("Server running at PORT 8080")
})