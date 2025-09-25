import { Router } from "express";
import { NoteController } from "../controllers/note.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router()

router.use(authenticate)
// router.get('/admin/all', NoteController.getAllAdmin)
router.post('/',  NoteController.create)

router.get('/', NoteController.getAll)

router.put('/:id', NoteController.update)
router.get('/:id', NoteController.getById)
router.delete('/:id', NoteController.delete)


export default router