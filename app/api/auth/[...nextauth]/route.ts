import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please enter an email and password');
                }

                await dbConnect();

                const user = await User.findOne({ email: credentials.email }).select('+password');

                if (!user) {
                    throw new Error('No user found with this email');
                }

                const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                if (!isPasswordCorrect) {
                    throw new Error('Invalid password');
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    package: user.package,
                    role: user.role,
                    subjects: user.subjects,
                    grade: user.grade,
                    board: user.board,
                    price: user.price
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }: any) {
            if (user) {
                token.id = user.id;
                token.package = user.package;
                token.role = user.role;
                token.subjects = user.subjects;
                token.grade = user.grade;
                token.board = user.board;
                token.price = user.price;
            }
            if (trigger === "update" && session) {
                if (session.package) token.package = session.package;
                if (session.subjects) token.subjects = session.subjects;
                if (session.grade) token.grade = session.grade;
                if (session.board) token.board = session.board;
            }
            return token;
        },
        async session({ session, token }: any) {
            if (token) {
                session.user.id = token.id;
                session.user.package = token.package;
                session.user.role = token.role;
                session.user.subjects = token.subjects;
                session.user.grade = token.grade;
                session.user.board = token.board;
                session.user.price = token.price;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt' as const,
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
