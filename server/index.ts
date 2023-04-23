import cors from 'cors'
import express from 'express'
import authRouter from './routes/auth.routes.js'
import chatRouter from './routes/chat.routes.js'
import { Server } from "socket.io";
import { createServer } from 'http'
import {uploadFile, uploadIconProfile, uploadIconChat} from './utils/upload.js'
import { getFilePath, getIconPathProfile, getIconPathChat } from './utils/file.js'
import onConnection from './onConnection.js'
import { CLIENT_PORT, SERVER_PORT } from './config.js'

const app = express()
const PORT = process.env.PORT || CLIENT_PORT

const corsOptions ={
  origin: SERVER_PORT, 
  credentials:true,           
  optionSuccessStatus:200,
}

app.use(cors(corsOptions))

app.use(express.json())
app.use('/upload/file', uploadFile.single('file'), (req: any, res: any) => {
  if (!req.file) return res.sendStatus(400)

  const relativeFilePath = req.file.path
    .replace(/\\/g, '/')
    .split('server/files')[1]

  res.status(201).json(relativeFilePath)
})

app.use('/files', (req, res) => {
  const filePath = getFilePath(req.url)

  res.status(200).sendFile(filePath)
})

app.use('/upload/icon/profile', uploadIconProfile.single('file'), (req: any, res: any) => {
  if (!req.file) return res.sendStatus(400)

  const relativeIconPath = req.file.path
    .replace(/\\/g, '/')
    .split('server/icons')[1]

  res.status(201).json(relativeIconPath)
})

app.use('/icons/profile', (req, res) => {
  const iconPathProfile = getIconPathProfile(req.url)

  res.status(200).sendFile(iconPathProfile)
})

app.use('/upload/icon/chat', uploadIconChat.single('file'), (req: any, res: any) => {
  if (!req.file) return res.sendStatus(400)

  const relativeIconPath = req.file.path
    .replace(/\\/g, '/')
    .split('server/icons')[1]

  res.status(201).json(relativeIconPath)
})

app.use('/icons/chat', (req, res) => {
  const iconPathChat = getIconPathChat(req.url)

  res.status(200).sendFile(iconPathChat)
})

app.use('/api', authRouter)
app.use('/api', chatRouter)
app.get('/', function(req: any, res: any) {
  res.sendfile('index.html');
});





const start = async () =>{
  try{
    const server = createServer(app)
    const io = new Server(server, {
      cors: {
        origin: SERVER_PORT,
      },
      serveClient: false
    })

    io.on('connect', (socket: any) => {
      onConnection(io, socket)
    })  
     
       
    server.listen(PORT, ()=>{
        console.log('Server started on port: ', PORT)
    });
  } catch(e){
  }
}

start()

