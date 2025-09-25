import { Router } from "express";
import { NoteController } from "../controllers/note.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router()

router.use(authenticate)
router.post('/', NoteController.create)
router.put('/:id', NoteController.update)
router.get('/', NoteController.getAll)
router.get('/:id', NoteController.getById)
router.delete('/:id', NoteController.delete)

router.get('/admin/all', NoteController.getAllAdmin)

export default Router