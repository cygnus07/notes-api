import authRoutes from './auth.routes.js'
import { Router } from 'express'
import noteRoutes from './note.routes.js'
import { NoteController } from '../controllers/note.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/admin/notes', authenticate, NoteController.getAllAdmin)
router.use('/notes', noteRoutes)

export default router