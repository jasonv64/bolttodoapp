import React from 'react'
import { Plus } from 'lucide-react'
import { TaskCard } from '../Tasks/TaskCard'
import { Task } from '../../types'

interface KanbanColumnProps {
  title: string
  status: 'not_started' | 'wip' | 'completed'
  tasks: Task[]
  onStatusChange: (taskId: string, status: 'not_started' | 'wip' | 'completed') => Promise<void>
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => Promise<void>
  onAddTask: (status: 'not_started' | 'wip' | 'completed') => void
  loading: boolean
}

export function KanbanColumn({
  title,
  status,
  tasks,
  onStatusChange,
  onEdit,
  onDelete,
  onAddTask,
  loading
}: KanbanColumnProps) {
  const getColumnStyles = () => {
    switch (status) {
      case 'not_started':
        return {
          header: 'bg-gray-100 border-gray-300',
          headerText: 'text-gray-700',
          count: 'bg-gray-200 text-gray-700'
        }
      case 'wip':
        return {
          header: 'bg-blue-100 border-blue-300',
          headerText: 'text-blue-700',
          count: 'bg-blue-200 text-blue-700'
        }
      case 'completed':
        return {
          header: 'bg-green-100 border-green-300',
          headerText: 'text-green-700',
          count: 'bg-green-200 text-green-700'
        }
      default:
        return {
          header: 'bg-gray-100 border-gray-300',
          headerText: 'text-gray-700',
          count: 'bg-gray-200 text-gray-700'
        }
    }
  }

  const styles = getColumnStyles()

  return (
    <div className="flex flex-col h-full">
      <div className={`p-4 border-2 ${styles.header} rounded-t-lg`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className={`font-semibold ${styles.headerText}`}>{title}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles.count}`}>
              {tasks.length}
            </span>
          </div>
          <button
            onClick={() => onAddTask(status)}
            className={`p-1 ${styles.headerText} hover:bg-white hover:bg-opacity-50 rounded transition-colors`}
            title={`Add task to ${title}`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-gray-50 border-l-2 border-r-2 border-b-2 border-gray-200 rounded-b-lg p-4 min-h-96">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={onStatusChange}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
            {tasks.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">No tasks in this column</p>
                <button
                  onClick={() => onAddTask(status)}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Add your first task
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}