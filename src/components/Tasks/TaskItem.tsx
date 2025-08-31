import React, { useState } from 'react'
import { Edit2, Trash2, Circle, CheckCircle } from 'lucide-react'
import { Task } from '../../types'

interface TaskItemProps {
  task: Task
  onToggleComplete: (taskId: string, completed: boolean) => Promise<void>
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => Promise<void>
}

export function TaskItem({ task, onToggleComplete, onEdit, onDelete }: TaskItemProps) {
  const [loading, setLoading] = useState(false)

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          border: 'border-red-200',
          bg: 'bg-red-50',
          badge: 'bg-red-100 text-red-800',
          icon: 'text-red-600'
        }
      case 'medium':
        return {
          border: 'border-amber-200',
          bg: 'bg-amber-50',
          badge: 'bg-amber-100 text-amber-800',
          icon: 'text-amber-600'
        }
      case 'low':
        return {
          border: 'border-green-200',
          bg: 'bg-green-50',
          badge: 'bg-green-100 text-green-800',
          icon: 'text-green-600'
        }
      default:
        return {
          border: 'border-gray-200',
          bg: 'bg-gray-50',
          badge: 'bg-gray-100 text-gray-800',
          icon: 'text-gray-600'
        }
    }
  }

  const handleToggleComplete = async () => {
    setLoading(true)
    try {
      await onToggleComplete(task.id, !task.completed)
    } catch (error) {
      console.error('Error toggling task completion:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setLoading(true)
      try {
        await onDelete(task.id)
      } catch (error) {
        console.error('Error deleting task:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  const styles = getPriorityStyles(task.priority)
  const isCompleted = task.completed

  return (
    <div className={`p-4 rounded-lg border-2 ${styles.border} ${styles.bg} transition-all hover:shadow-md ${isCompleted ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={handleToggleComplete}
            disabled={loading}
            className="mt-1 text-gray-400 hover:text-blue-600 transition-colors"
          >
            {isCompleted ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className={`font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {task.title}
              </h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles.badge}`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
            </div>

            {task.description && (
              <p className={`text-sm ${isCompleted ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                {task.description}
              </p>
            )}

            <p className="text-xs text-gray-400 mt-2">
              Created {new Date(task.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onEdit(task)}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}