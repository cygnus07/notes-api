import { Types } from "mongoose";
import { INote, Note } from "../models/note.model.js";
import { AuthorizationError, NotFoundError, ValidationError } from "../utils/errors.js";

export interface CreateNoteData {
    title: string,
    content: string,
    user: Types.ObjectId
}

export interface UpdateNoteData {
    title?: string
    content?: string
}

export class NoteService {
    static async create(data: CreateNoteData ) : Promise<INote> {
        const { title, content, user} = data
        console.log(data)
        const note = await Note.create({
            title,
            content,
            user
        })

        return note
    }

    static async getAll(user: Types.ObjectId, page=1, limit=10){
        const skip = (page -1) * limit
        const [notes, total] = await Promise.all([
            Note.find({ user})
                .sort({ createAt: -1})
                .skip(skip)
                .limit(limit)
                .populate('user', 'name email'),
            Note.countDocuments({ user})
        ])
        return {
            notes,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total/limit)
            }
        }
    }

    static async getById(noteId: string, userId: string) : Promise<INote> {
        if(!Types.ObjectId.isValid(noteId)){
            throw new ValidationError('Invalid note id')
        }

        const note = await Note.findById(noteId). populate('user', 'name email')
        if(!note) {
            throw new NotFoundError("Note not found")
        }

        if(note.user._id.toString() !== userId){
            throw new AuthorizationError("You dont have access to this note")
        }

        return note
    }

    static async update(
        noteId: string,
        user: Types.ObjectId,
        data: UpdateNoteData
    ) : Promise<INote> {
        if(!Types.ObjectId.isValid(noteId)){
            throw new ValidationError('Invalid note id')
        }
        const note = await Note.findById( noteId )
        if(!note){
            throw new NotFoundError('Note not found')
        }

        if(note.user.toString() !== user._id.toString()){
            throw new AuthorizationError('you can only update your notes')
        }

        if(data.title !== undefined) note.title = data.title
        if(data.content !== undefined) note.content = data.content

        await note.save()
        await note.populate('user', 'name email')
        return note
    }

    static async delete(noteId: string, userId: string) : Promise<void> {
        if(!Types.ObjectId.isValid(noteId)){
            throw new ValidationError('Invalid note Id')
        }

        const note = await Note.findById(noteId)
        if(!note){
            throw new NotFoundError("Note not foundd")
        }

        if(note.user.toString() !== userId){
            throw new AuthorizationError('You can only delete you own notes')
        }

        await note.deleteOne()
    }

    static async getAllAdmin(page = 1, limit = 20) {
        const skip = (page -1) *limit

        const [notes, total] = await Promise.all([
            Note.find({})
                .populate('user', 'name email')
                .sort({ createdAt: -1})
                .skip(skip)
                .limit(limit),
            Note.countDocuments({})
        ])

        return {
            notes,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total/limit)
            }
        }
    }


}