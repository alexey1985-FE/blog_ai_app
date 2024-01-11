"use client"
import { useState, useEffect } from 'react'
import { ThemeProvider } from 'next-themes'

type Props = {
  children: React.ReactNode;
}

const Provider = ({ children }: Props) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <ThemeProvider attribute='class'>
      {children}
    </ThemeProvider>
  )
}

export default Provider
