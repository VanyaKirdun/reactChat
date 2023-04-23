import Router from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import userController from '../controlers/user.controller.js';
const authRouter = new Router();


authRouter.post('/auth/registration', userController.createUser)
authRouter.post('/auth/login', userController.logIn)
authRouter.get('/auth/auth', authMiddleware, userController.auth)
authRouter.post('/auth/login/change', authMiddleware, userController.loginChange)
authRouter.post('/auth/password/change', authMiddleware, userController.passwordChange)

export default authRouter;