// app/api/tasks/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { CreateTaskSchema } from '@/schemas/task.schema'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Replace with your database query
    const tasks = await db.tasks.findMany({
      where: { userId: session.user.id }
    })
    
    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tasks' }, 
      { status: 500 }
    )
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const json = await request.json()
    
    // Validate input
    const validatedData = CreateTaskSchema.parse(json)
    
    const task = await db.tasks.create({
      ...validatedData,
      userId: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    
    return NextResponse.json(task)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors }, 
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create task' }, 
      { status: 500 }
    )
  }
}