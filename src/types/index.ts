export interface Task {
  id: string
  user_id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  completed: boolean
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}