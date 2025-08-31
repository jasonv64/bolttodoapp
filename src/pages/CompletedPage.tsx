import React, { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { TaskList } from '../components/Tasks/TaskList'
import { TaskForm } from '../components/Tasks/TaskForm'
import { useTasks } from '../hooks/useTasks'
import { Task } from '../types'

export function CompletedPage() {
  const { completedTasks, loading, updateTask, deleteTask, updateTaskStatus } = useTasks()
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const handleUpdateTask = async (taskData: {
    title: string
    description: string
    priority: 'low' | 'medium' | 'high'
  }) => {
    if (!editingTask) return
    
    await updateTask(editingTask.id, taskData)
    setEditingTask(null)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
  }

  const handleCloseForm = () => {
    setEditingTask(null)
  }

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    const newStatus = completed ? 'completed' : 'not_started'
    await updateTaskStatus(taskId, newStatus)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Completed Tasks</h2>
        <p className="text-gray-600 mt-1">
          {completedTasks.length} task{completedTasks.length !== 1 ? 's' : ''} completed
        </p>
      </div>

      <TaskList
        tasks={completedTasks}
        loading={loading}
        onToggleComplete={handleToggleComplete}
        onEdit={handleEditTask}
        onDelete={deleteTask}
        emptyMessage="No completed tasks yet. Mark some tasks as complete!"
        emptyIcon={<CheckCircle className="w-16 h-16 text-gray-300" />}
      />

      <TaskForm
        task={editingTask}
        onSubmit={handleUpdateTask}
        onCancel={handleCloseForm}
        isOpen={editingTask !== null}
      />
    </div>
  )
}