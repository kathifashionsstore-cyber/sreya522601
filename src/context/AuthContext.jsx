import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth'
import { auth } from '../lib/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  // Sync auth state with Firebase in real-time
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Force refresh token to ensure custom claims are fresh
          const tokenResult = await firebaseUser.getIdTokenResult(true)
          const userRole = firebaseUser.email === 'sreya@gmail.com' ? 'admin' : (tokenResult.claims.role || null)
          
          setUser(firebaseUser)
          setRole(userRole)
          setIsAdmin(userRole === 'admin')
        } catch (error) {
          console.error('Error fetching token claims:', error)
          const fallbackRole = firebaseUser.email === 'sreya@gmail.com' ? 'admin' : null
          setUser(firebaseUser)
          setRole(fallbackRole)
          setIsAdmin(fallbackRole === 'admin')
        }
      } else {
        setUser(null)
        setRole(null)
        setIsAdmin(false)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  async function login(email, password) {
    setLoading(true)
    try {
      // 1. Real Firebase login
      const credential = await signInWithEmailAndPassword(auth, email, password)
      const tokenResult = await credential.user.getIdTokenResult(true)
      const userRole = credential.user.email === 'sreya@gmail.com' ? 'admin' : (tokenResult.claims.role || null)
      
      setUser(credential.user)
      setRole(userRole)
      setIsAdmin(userRole === 'admin')
      
      return { 
        user: credential.user, 
        isAdmin: userRole === 'admin', 
        role: userRole 
      }
    } catch (error) {
      // 2. Check local mock fallback if real login fails (for offline testing)
      if (email === 'sreya@gmail.com' && password === 'admin123') {
        console.warn('Firebase auth failed, falling back to local mock admin session.')
        const mockUser = { uid: 'mock-admin', email }
        setUser(mockUser)
        setIsAdmin(true)
        setRole('admin')
        setLoading(false)
        return { user: mockUser, isAdmin: true, role: 'admin' }
      }
      setLoading(false)
      throw error
    }
  }

  async function logout() {
    setLoading(true)
    try {
      await signOut(auth)
      setUser(null)
      setIsAdmin(false)
      setRole(null)
    } finally {
      setLoading(false)
    }
  }

  const value = useMemo(
    () => ({ 
      user, 
      isAdmin, 
      role, 
      isStaff: Boolean(role), 
      loading, 
      login, 
      logout 
    }),
    [user, isAdmin, role, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
