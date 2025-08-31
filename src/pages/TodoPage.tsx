import React, { useState } from 'react'
import { Plus, ListTodo } from 'lucide-react'
import { TaskList } from '../components/Tasks/TaskList'
import { TaskForm } from '../components/Tasks/TaskForm'
import { useTasks } from '../hooks/useTasks'
import { Task } from '../types'

export function TodoPage() {
  const { notStartedTasks, wipTasks, loading, createTask, updateTask, deleteTask, updateTaskStatus } = useTasks()
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const activeTasks = [...notStartedTasks, ...wipTasks]

  const handleCreateTask = async (taskData: {
    title: string
    description: string
    priority: 'low' | 'medium' | 'high'
  }) => {
    await createTask(taskData)
    setShowForm(false)
  }

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
    setShowForm(false)
    setEditingTask(null)
  }

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    const newStatus = completed ? 'completed' : 'not_started'
    await updateTaskStatus(taskId, newStatus)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Active Tasks</h2>
          <p className="text-gray-600 mt-1">
            {activeTasks.length} task{activeTasks.length !== 1 ? 's' : ''} remaining
          </p>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </button>
      </div>

      <TaskList
        tasks={activeTasks}
        loading={loading}
        onToggleComplete={handleToggleComplete}
        onEdit={handleEditTask}
        onDelete={deleteTask}
        emptyMessage="No active tasks. Create one to get started!"
        emptyIcon={<ListTodo className="w-16 h-16 text-gray-300" />}
      />

      <TaskForm
        task={editingTask}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        onCancel={handleCloseForm}
        isOpen={showForm || editingTask !== null}
      />
    </div>
  )
}