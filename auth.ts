import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { getUserByEmail } from '@/lib/store'
import { verifyPassword } from '@/lib/password'
import { loginSchema } from '@/lib/validation'

const googleConfigured = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
)

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret:
    process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || 'abigail-family-local-preview-secret',
  trustHost: true,
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    ...(googleConfigured
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
          }),
        ]
      : []),
    Credentials({
      name: 'Email and password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw)
        if (!parsed.success) return null
        const user = await getUserByEmail(parsed.data.email)
        if (!user) return null
        if (!verifyPassword(parsed.data.password, user.passwordHash)) return null
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          familyId: user.familyId,
          parentRole: user.parentRole,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id
        token.familyId = user.familyId
        token.parentRole = user.parentRole
      }
      if (!token.familyId && token.email) {
        const stored = await getUserByEmail(token.email)
        if (stored) {
          token.userId = stored.id
          token.familyId = stored.familyId
          token.parentRole = stored.parentRole
        }
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId || ''
        session.user.familyId = token.familyId
        session.user.parentRole = token.parentRole
      }
      return session
    },
  },
})
