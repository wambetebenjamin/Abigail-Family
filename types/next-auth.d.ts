import type { DefaultSession } from 'next-auth'

type ParentRole = 'Parent A' | 'Parent B'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      familyId?: string
      parentRole?: ParentRole
    } & DefaultSession['user']
  }

  interface User {
    familyId?: string
    parentRole?: ParentRole
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string
    familyId?: string
    parentRole?: ParentRole
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    userId?: string
    familyId?: string
    parentRole?: ParentRole
  }
}
