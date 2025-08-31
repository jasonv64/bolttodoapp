import React, { useState } from 'react'
import { KanbanColumn } from '../components/Board/KanbanColumn'
import { TaskForm } from '../components/Tasks/TaskForm'
import { useTasks } from '../hooks/useTasks'
import { Task } from '../types'

export function BoardPage() {
  const { 
    notStartedTasks, 
    wipTasks, 
    completedTasks, 
    loading, 
    createTask, 
    updateTask, 
    deleteTask, 
    updateTaskStatus 
  } = useTasks()
  
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [newTaskStatus, setNewTaskStatus] = useState<'not_started' | 'wip' | 'completed'>('not_started')

  const handleCreateTask = async (taskData: {
    title: string
    description: string
    priority: 'low' | 'medium' | 'high'
    status?: 'not_started' | 'wip' | 'completed'
  }) => {
    await createTask({ ...taskData, status: newTaskStatus })
    setShowForm(false)
  }

  const handleUpdateTask = async (taskData: {
    title: string
    description: string
    priority: 'low' | 'medium' | 'high'
    status?: 'not_started' | 'wip' | 'completed'
  }) => {
    if (!editingTask) return
    
    await updateTask(editingTask.id, taskData)
    setEditingTask(null)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
  }

  const handleAddTask = (status: 'not_started' | 'wip' | 'completed') => {
    setNewTaskStatus(status)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingTask(null)
  }

  const totalTasks = notStartedTasks.length + wipTasks.length + completedTasks.length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Task Board</h2>
        <p className="text-gray-600">
          Manage your workflow with {totalTasks} total task{totalTasks !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        <KanbanColumn
          title="Not Started"
          status="not_started"
          tasks={notStartedTasks}
          onStatusChange={updateTaskStatus}
          onEdit={handleEditTask}
          onDelete={deleteTask}
          onAddTask={handleAddTask}
          loading={loading}
        />

        <KanbanColumn
          title="WIP"
          status="wip"
          tasks={wipTasks}
          onStatusChange={updateTaskStatus}
          onEdit={handleEditTask}
          onDelete={deleteTask}
          onAddTask={handleAddTask}
          loading={loading}
        />

        <KanbanColumn
          title="Completed"
          status="completed"
          tasks={completedTasks}
          onStatusChange={updateTaskStatus}
          onEdit={handleEditTask}
          onDelete={deleteTask}
          onAddTask={handleAddTask}
          loading={loading}
        />
      </div>

      <TaskForm
        task={editingTask}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        onCancel={handleCloseForm}
        isOpen={showForm || editingTask !== null}
        initialStatus={newTaskStatus}
      />
    </div>
  )
}