import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('=== NEXTAUTH AUTHORIZE CALLED ===');
        console.log('Credentials received:', credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials');
          return null;
        }

        console.log('Looking for user:', credentials.email);
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        console.log('User found:', !!user);

        if (!user) {
          console.log('User not found');
          return null;
        }

        // For mock database, compare plain text passwords
        console.log('Comparing passwords (plain text for mock)');
        const isPasswordValid = credentials.password === user.password;
        console.log('Password valid:', isPasswordValid);

        if (!isPasswordValid) {
          console.log('Invalid password');
          return null;
        }

        console.log('Login successful for:', user.email);
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
