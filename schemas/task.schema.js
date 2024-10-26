import { z } from 'zod'

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().optional(),
  completed: z.boolean().default(false),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const CreateTaskSchema = TaskSchema.omit({ 
  id: true, 
  userId: true, 
  createdAt: true, 
  updatedAt: true 
})

export const UpdateTaskSchema = CreateTaskSchema.partial()