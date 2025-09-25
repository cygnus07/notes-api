import { model, Schema, Types, Document } from 'mongoose'

export interface INote extends Document {
  _id: Types.ObjectId
  title: string
  content: string
  user: Types.ObjectId
}

const noteSchema = new Schema<INote> ({
    title: {
        type: String,
        required: [true, 'title is required'],
        trim: true,
        maxLength: [200, "Title cannot exceed 200 characters"]
    },
    content: {
        type: String,
        required: [true, 'content is required'],
        maxLength: [5000, 'content cannot exceed 5000 characters']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        index: true
    }
}, {
    timestamps: true
})

noteSchema.methods.toJSON =function(){
    const obj = this.toObject()
    delete obj._v 
    return obj
}

export const Note = model<INote>('Note', noteSchema)