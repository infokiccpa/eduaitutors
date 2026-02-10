import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
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
                // @ts-ignore
                session.user.id = token.id;
                // @ts-ignore
                session.user.package = token.package;
                // @ts-ignore
                session.user.role = token.role;
                // @ts-ignore
                session.user.subjects = token.subjects;
                // @ts-ignore
                session.user.grade = token.grade;
                // @ts-ignore
                session.user.board = token.board;
                // @ts-ignore
                session.user.price = token.price;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
};
