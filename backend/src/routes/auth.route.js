const router=require('express')
const authRouter=router();
const {registerUserController,loginUserController,logoutUserController,getMeController}=require('../controller/auth.controller');
const authMiddleware=require('../middleware/auth.middleware');

authRouter.post('/register',registerUserController);
authRouter.post('/login',loginUserController);
authRouter.post('/logout',logoutUserController);
authRouter.get('/get-me',authMiddleware,getMeController);

module.exports=authRouter;