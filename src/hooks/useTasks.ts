import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Task } from '../types'
import { useAuth } from '../contexts/AuthContext'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchTasks = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (taskData: {
    title: string
    description: string
    priority: 'low' | 'medium' | 'high'
    status?: 'not_started' | 'wip' | 'completed'
  }) => {
    if (!user || !user.id) {
      throw new Error('User not authenticated or user ID is missing')
    }

    try {
      const response = await fetch('/.netlify/functions/create-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...taskData,
          user_id: user.id,
          status: taskData.status || 'not_started'
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create task via Netlify Function')
      }

      const data: Task = await response.json()
      setTasks(prev => [data, ...prev])
      return data
    } catch (error) {
      console.error('Error creating task via Netlify Function:', error)
      throw error
    }
  }

  const updateTask = async (
    taskId: string,
    updates: Partial<Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
  ) => {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single()

    if (error) throw error
    setTasks(prev => prev.map(task => task.id === taskId ? data : task))
    return data
  }

  const deleteTask = async (taskId: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)

    if (error) throw error
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }

  const updateTaskStatus = async (taskId: string, status: 'not_started' | 'wip' | 'completed') => {
    return updateTask(taskId, { status })
  }

  useEffect(() => {
    fetchTasks()
  }, [user])

  const notStartedTasks = tasks.filter(task => task.status === 'not_started')
  const wipTasks = tasks.filter(task => task.status === 'wip')
  const completedTasks = tasks.filter(task => task.status === 'completed')

  return {
    tasks,
    notStartedTasks,
    wipTasks,
    completedTasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    refetch: fetchTasks
  }
}