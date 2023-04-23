import Routerr from 'express';
import chatController from '../controlers/chat.contoller.js' 
const routerr = new Routerr();
import authMiddlewar from '../middleware/auth.middleware.js'


routerr.get('/chat/get/chatData/:id', authMiddlewar, chatController.getChatData)
routerr.get('/chat/get/user/', authMiddlewar, chatController.getUserId)
routerr.get('/chat/get/chatMembers/:id', authMiddlewar, chatController.getChatMembers)
routerr.post('/chat/create', authMiddlewar, chatController.createChat)
routerr.post('/chat/send/message', authMiddlewar, chatController.sendMessage)
routerr.get('/chat/get/message/:id', authMiddlewar, chatController.getMessages)
routerr.delete('/chat/delete/user/:id', authMiddlewar, chatController.deleteChatFromList)
routerr.delete('/user/delete/chat/', authMiddlewar, chatController.deleteUserFromChat)
routerr.post('/globalSearch/', authMiddlewar, chatController.globalSearch)
export default routerr;