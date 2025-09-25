import { NextFunction, Response } from "express";
import { AuthRequest } from "./auth.controller.js";
import { AuthorizationError, ValidationError } from "../utils/errors.js";
import { NoteService } from "../services/note.service.js"



export class NoteController {
    static async create(req: AuthRequest, res: Response, next: NextFunction){
        try {
            const { title, content} = req.body
            if(!title || !content) {
                throw new ValidationError("All the fields are required")
            }

            const note = await NoteService.create({
                title,
                content,
                user: req.user!._id
            })


            res.status(201).json({
                success: true,
                data: { note},
                message: 'Note created successfully'
            })
        } catch (error) {
            next(error)
        }
    }

    static async getAll(req: AuthRequest, res: Response, next: NextFunction){
        try {
            const page = parseInt(req.query.page as string) || 1
            const limit = parseInt(req.query.limit as string) || 10

            const result = await NoteService.getAll(
                req.user!._id,
                page,
                limit
            )
            res.json({
                success: true,
                data: result,
                message: 'Notes retrieved successfully'
            })
        } catch (error) {
            next(error)
        }
    }

    static async getById(req: AuthRequest, res: Response, next:NextFunction){
        try {
            const { id} = req.params
            const note = await NoteService.getById(
                id,
                req.user!._id.toString()
            )

            res.json({
                success: true,
                data: {note},
                message: "Note retrieved successfully"
            })
        } catch (error) {
            next(error)
        }
    }

    static async update(req: AuthRequest, res: Response, next: NextFunction){
        try {
            const { id }= req.params
            const { title, content} = req.body

            const note = await NoteService.update(
                id,
                req.user!._id,
                { title, content}
            )

            res.json({
                success: true,
                data: { note},
                message: 'note updated successfully'
            })
        } catch (error) {
            next(error)
        }
    }

    static async delete(req: AuthRequest, res: Response, next: NextFunction){
        try {
            const { id } = req.params
            await NoteService.delete(
                id,
                req.user!._id.toString()
            )

            res.json({
                success: true,
                message: 'Note deleted successfully'
            })
        } catch (error) {
            next(error)
        }
    }
    static async getAllAdmin(req: AuthRequest, res: Response, next: NextFunction){
        try {
            if(req.user!.role !== 'admin') {
                throw new AuthorizationError('admin access required')
            }
    
            const page = parseInt(req.query.page as string) || 1
            const limit = parseInt(req.query.limit as string) || 20
    
            const result = await NoteService.getAllAdmin(page,limit)
    
            res.json({
                success: true,
                data: result,
                message: 'All notes retrieved successfullly'
            })
        } catch (error) {
            next(error)
        }
    } 
}