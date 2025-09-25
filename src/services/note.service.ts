import { Types } from "mongoose";
import { INote, Note } from "../models/note.model";
import { AuthorizationError, NotFoundError, ValidationError } from "../utils/errors";

export interface CreateNoteData {
    title: string,
    content: string,
    userId: string
}

export interface UpdateNoteData {
    title?: string
    content?: string
}

export class NoteService {
    static async create(data: CreateNoteData ) : Promise<INote> {
        const { title, content, userId} = data

        const note = await Note.create({
            title,
            content,
            userId
        })

        return note
    }

    static async getAll(userId: string, page=1, limit=10){
        const skip = (page -1) * limit
        const [notes, total] = await Promise.all([
            Note.find({ user: userId})
                .sort({ createAt: -1})
                .skip(skip)
                .limit(limit)
                .populate('user', 'name email'),
            Note.countDocuments({ user: userId})
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

    
}