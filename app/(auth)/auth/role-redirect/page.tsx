'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function RoleRedirectPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    const role = (session?.user as any)?.role
    if (role === 'GARAGE') router.replace('/garage')
    else if (role === 'CLIENT') router.replace('/client')
    else if (role === 'ADMIN') router.replace('/admin')
    else router.replace('/')
  }, [session, status, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: '#1D9E75', borderTopColor: 'transparent' }} />
    </div>
  )
}
