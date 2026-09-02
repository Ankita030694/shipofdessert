import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log('[Auth] Missing email or password in request');
            return null;
          }

          await connectToDatabase();

          const email = (credentials.email as string).trim().toLowerCase();
          const user = await User.findOne({ email });

          if (!user || !user.password) {
            console.log('[Auth] No user found with email:', email);
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isValid) {
            console.log('[Auth] Password comparison failed for email:', email);
            return null;
          }

          console.log('[Auth] Login successful for user:', email, 'Role:', user.role);

          return {
            id: user._id.toString(),
            name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Admin User',
            email: user.email,
            role: user.role || 'customer',
          };
        } catch (error) {
          console.error('[Auth Exception in authorize]:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as unknown as { role?: string }).role || 'customer';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || (token.sub as string);
        session.user.role = (token.role as string) || 'customer';
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'kshaum_super_secret_auth_key_8492049284910284910',
});
