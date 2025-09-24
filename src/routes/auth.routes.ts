import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
const router = Router()

router.post('/register', AuthController.register )
router.post('/login', AuthController.login)
router.post('/post', AuthController.refreshToken)
router.post('/logout', authenticate, AuthController.logout)
router.get('/me', authenticate, AuthController.me)


export default router