import http from 'http'
import path from 'path'
import { Server as SocketIO } from 'socket.io'
import {spawn} from 'child_process'
import express from 'express'
import { resolve } from 'path'

const app = express()

const server = http.createServer(app)  

const io = new SocketIO(server)

const options = [
    '-i',
    '-',
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-tune', 'zerolatency',
    '-r', `${25}`,
    '-g', `${25 * 2}`,
    '-keyint_min', 25,
    '-crf', '25',
    '-pix_fmt', 'yuv420p',
    '-sc_threshold', '0',
    '-profile:v', 'main',
    '-level', '3.1',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-ar', 128000 / 4,
    '-f', 'flv',
    `rtmp://a.rtmp.youtube.com/live2/1cwj-fv29-sg75-yhj3-f08x`,
];

const ffmpegProcess = spawn('ffmpeg', options)

ffmpegProcess.stdout.on('data', (data) => {
    console.log("ffmpeg stdout",data)

})

ffmpegProcess.stderr.on('data', (data) => {
    console.error("ffmpeg stderr",data)

})

ffmpegProcess.on('close', (code) => {
    console.log("ffmpeg closed",code)

})






app.use(express.static(path.resolve("./public")))

io.on('connection', socket => {
    console.log("socket connected",socket.id)
    socket.on('binaryStream', (stream) => {
        console.log("Binary stream incoming...")
        ffmpegProcess.stdin.write(stream,(err)=>{
            console.log("ERROR",err)

        })
    })

  
})
server.listen(3000,()=>console.log(`Http server listening on 3000`))

