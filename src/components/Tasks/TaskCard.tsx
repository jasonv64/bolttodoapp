import React, { useState } from 'react'
import { Edit2, Trash2, Clock, Play, CheckCircle } from 'lucide-react'
import { Task } from '../../types'

interface TaskCardProps {
  task: Task
  onStatusChange: (taskId: string, status: 'not_started' | 'wip' | 'completed') => Promise<void>
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => Promise<void>
}

export function TaskCard({ task, onStatusChange, onEdit, onDelete }: TaskCardProps) {
  const [loading, setLoading] = useState(false)

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          border: 'border-red-200',
          bg: 'bg-red-50',
          badge: 'bg-red-100 text-red-800',
          dot: 'bg-red-500'
        }
      case 'medium':
        return {
          border: 'border-amber-200',
          bg: 'bg-amber-50',
          badge: 'bg-amber-100 text-amber-800',
          dot: 'bg-amber-500'
        }
      case 'low':
        return {
          border: 'border-green-200',
          bg: 'bg-green-50',
          badge: 'bg-green-100 text-green-800',
          dot: 'bg-green-500'
        }
      default:
        return {
          border: 'border-gray-200',
          bg: 'bg-gray-50',
          badge: 'bg-gray-100 text-gray-800',
          dot: 'bg-gray-500'
        }
    }
  }

  const getStatusActions = () => {
    switch (task.status) {
      case 'not_started':
        return [
          { label: 'Start', status: 'wip' as const, icon: Play, color: 'text-blue-600 hover:text-blue-700' },
          { label: 'Complete', status: 'completed' as const, icon: CheckCircle, color: 'text-green-600 hover:text-green-700' }
        ]
      case 'wip':
        return [
          { label: 'Not Started', status: 'not_started' as const, icon: Clock, color: 'text-gray-600 hover:text-gray-700' },
          { label: 'Complete', status: 'completed' as const, icon: CheckCircle, color: 'text-green-600 hover:text-green-700' }
        ]
      case 'completed':
        return [
          { label: 'Reopen', status: 'not_started' as const, icon: Clock, color: 'text-gray-600 hover:text-gray-700' },
          { label: 'In Progress', status: 'wip' as const, icon: Play, color: 'text-blue-600 hover:text-blue-700' }
        ]
      default:
        return []
    }
  }

  const handleStatusChange = async (newStatus: 'not_started' | 'wip' | 'completed') => {
    setLoading(true)
    try {
      await onStatusChange(task.id, newStatus)
    } catch (error) {
      console.error('Error updating task status:', error)
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
  const statusActions = getStatusActions()

  return (
    <div className={`bg-white rounded-lg border-2 ${styles.border} shadow-sm hover:shadow-md transition-all duration-200 ${loading ? 'opacity-50' : ''}`}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${styles.dot}`}></div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles.badge}`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onEdit(task)}
              disabled={loading}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              title="Edit task"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {task.title}
        </h3>

        {task.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-3">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
          <span>Created {new Date(task.created_at).toLocaleDateString()}</span>
        </div>

        <div className="flex flex-wrap gap-1">
          {statusActions.map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.status}
                onClick={() => handleStatusChange(action.status)}
                disabled={loading}
                className={`flex items-center px-2 py-1 text-xs font-medium rounded transition-colors ${action.color} hover:bg-gray-50`}
                title={`Move to ${action.label}`}
              >
                <Icon className="w-3 h-3 mr-1" />
                {action.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}