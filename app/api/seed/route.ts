import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import Quiz from '@/models/Quiz';
import Schedule from '@/models/Schedule';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

const initialCourses = [
    // ... (keeping same)
    {
        title: 'Mathematics Fundamentals',
        subject: 'Mathematics',
        packageName: 'Foundation Builder',
        duration: '20 Hours',
        lessons: 12,
        image: '/course_math_thumbnail.png',
        instructor: 'Prof. Alan Turing',
        description: 'Master the basics of mathematics with clear explanations and practical examples.',
        learningObjectives: [
            'Understand fundamental arithmetic operations',
            'Master fractions, decimals, and percentages',
            'Apply basic mathematical logic to real-world problems'
        ],
        chapters: [
            { time: '0:00', title: 'Introduction to Numbers' },
            { time: '10:00', title: 'Basic Operations' }
        ],
        resources: [
            { name: 'Math_Basics_Guide.pdf', size: '1.2 MB', type: 'PDF' }
        ],
        questions: [
            { type: 'mcq', question: 'What is 5 + 7?', options: ['10', '11', '12', '13'], answer: '12' }
        ]
    },
    {
        title: 'Introduction to Mechanics',
        subject: 'Physics',
        packageName: 'JEE Mastery',
        duration: '45 Hours',
        lessons: 25,
        image: '/course_physics_thumbnail.png',
        instructor: 'Dr. Sarah Johnson',
        description: 'A comprehensive guide to classical mechanics, specifically designed for competitive exams like JEE.',
        elite: true,
        learningObjectives: [
            'Understand kinematics and laws of motion',
            'Master work-energy theorem and power',
            'Analyze rotational dynamics and gravitation'
        ],
        chapters: [
            { time: '0:00', title: 'Kinematics in One Dimension' },
            { time: '15:20', title: 'Newton\'s Laws of Motion' }
        ],
        resources: [
            { name: 'Mechanics_Formulae.pdf', size: '2.5 MB', type: 'PDF' }
        ],
        questions: [
            { type: 'mcq', question: 'Unit of force?', options: ['Watt', 'Joule', 'Newton', 'Pascal'], answer: 'Newton' }
        ]
    }
];

const initialQuizzes = [
    {
        title: "Newton's Laws of Motion",
        subject: "Physics",
        description: "Test your understanding of the three fundamental laws that govern motion.",
        questionsCount: 15,
        duration: "20 mins",
        difficulty: "Medium",
        questions: [
            { question: "Which law is the Law of Inertia?", options: ["1st", "2nd", "3rd"], answer: "1st" }
        ]
    }
];

const initialSchedules = [
    {
        title: 'Quantum Physics Deep Dive',
        instructor: 'Dr. Sarah Wilson',
        subject: 'Physics',
        startTime: new Date(Date.now() + 86400000), // Tomorrow
        duration: '1.5 Hours',
        meetingLink: 'https://zoom.us/j/123456789',
        description: 'Advanced concepts in quantum mechanics.'
    },
    {
        title: 'Calculus Basics',
        instructor: 'Prof. Alan Turing',
        subject: 'Mathematics',
        startTime: new Date(Date.now() + 172800000), // Day after tomorrow
        duration: '1 Hour',
        meetingLink: 'https://zoom.us/j/987654321',
        description: 'Introduction to derivatives and integration.'
    }
];

export async function POST() {
    try {
        await dbConnect();

        // Clear existing content
        await Course.deleteMany({});
        await Quiz.deleteMany({});
        await Schedule.deleteMany({});
        await User.deleteMany({});

        await Course.insertMany(initialCourses);
        await Quiz.insertMany(initialQuizzes);
        await Schedule.insertMany(initialSchedules);

        // Seed multi-role accounts
        const roles = [
            { email: 'super@eduaitutors.com', name: 'Super Admin', role: 'superadmin' },
            { email: 'admin@eduaitutors.com', name: 'Regional Admin', role: 'admin' },
            { email: 'mentor@eduaitutors.com', name: 'Dr. Sarah (Mentor)', role: 'mentor' },
            { email: 'parent@eduaitutors.com', name: 'Mr. Sharma (Parent)', role: 'parent' },
            { email: 'student@eduaitutors.com', name: 'Rahul (Student)', role: 'student', package: 'JEE Mastery', grade: '12', board: 'CBSE', subjects: ['Physics', 'Chemistry', 'Mathematics'] }
        ];

        const hashedPassword = await bcrypt.hash('admin123', 12);

        for (const u of roles) {
            console.log('Seeding user:', u.email);
            const exists = await User.findOne({ email: u.email });
            if (!exists) {
                await User.create({ ...u, password: hashedPassword });
                console.log('Created user:', u.email);
            } else {
                console.log('User already exists:', u.email);
            }
        }

        return NextResponse.json({ message: 'Database fully seeded for all roles!' });
    } catch (error: any) {
        console.error('Seed Error:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
