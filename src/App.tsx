import React, { useState, useEffect } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from './firebase'

import { SidebarProvider, SidebarInset } from "./components/ui/sidebar"

import { AppSidebar } from "./components/sidebar"
import { AppContent } from "./components/content"
import { LoginForm } from './components/auth' // Import LoginForm

export const App = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading authentication state...
      </div>
    )
  }

  return (
    <div className="App flex justify-center items-center min-h-screen bg-gray-100">
      {user ? (
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <AppContent />
          </SidebarInset>
        </SidebarProvider>
      ) : (
        <LoginForm />
      )}
    </div>
  )
}
