import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { UpdateTaskSchema } from '@/schemas/task.schema'

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const json = await request.json()
    
    // Validate input
    const validatedData = UpdateTaskSchema.parse(json)
    
    const task = await db.tasks.update({
      where: {
        id: params.id,
        userId: session.user.id
      },
      data: {
        ...validatedData,
        updatedAt: new Date()
      }
    })

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' }, 
        { status: 404 }
      )
    }
    
    return NextResponse.json(task)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors }, 
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update task' }, 
      { status: 500 }
    )
  }
}
