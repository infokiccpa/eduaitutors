import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import LessonProgress from '@/models/LessonProgress';
import QuizResult from '@/models/QuizResult';

// Initialize Gemini AI
const genAI = process.env.GEMINI_API_KEY
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;

// Knowledge base for guests (FAQ)
const guestKnowledge = {
    courses: [
        { name: 'Foundation Builder', grades: '5-8', subjects: 'Math, Science, English', price: '₹4,999/month' },
        { name: 'Mastery Accelerator', grades: '9-10', subjects: 'All CBSE subjects', price: '₹6,999/month' },
        { name: 'Excellence Pro', grades: '11-12', subjects: 'PCM/PCB focus', price: '₹8,999/month' },
        { name: 'JEE Mastery', grades: '11-12 / Dropper', subjects: 'Physics, Chemistry, Math', price: '₹12,999/month' },
        { name: 'NEET Preparation', grades: '11-12 / Dropper', subjects: 'Physics, Chemistry, Biology', price: '₹12,999/month' },
    ],
    faqs: [
        { q: 'how does it work', a: 'We provide AI-powered personalized learning with live classes, video lessons, practice quizzes, and dedicated mentors.' },
        { q: 'live classes', a: 'Yes! We conduct live interactive classes daily. Schedule varies by package.' },
        { q: 'trial', a: 'Absolutely! We offer a 7-day free trial. No credit card required.' },
        { q: 'refund', a: 'We have a 30-day money-back guarantee if you\'re not satisfied.' },
        { q: 'mentor', a: 'Each student gets a dedicated mentor for doubt clearing and progress tracking.' },
    ]
};

export async function POST(req: Request) {
    try {
        const { message, conversationHistory = [] } = await req.json();
        const session = await getServerSession(authOptions);

        // Determine user type
        const userType = session ? (session.user as any).role || 'student' : 'guest';
        const user = session?.user as any;

        let response = '';

        // Use Gemini AI if configured, otherwise fallback to rule-based
        if (genAI) {
            response = await handleGeminiChat(message, userType, user, conversationHistory);
        } else {
            response = await handleRuleBasedChat(message, userType, user);
        }

        return NextResponse.json({
            text: response,
            sender: 'bot',
            timestamp: new Date(),
            userType
        });

    } catch (error: any) {
        console.error('Chat Error:', error);
        return NextResponse.json({
            text: "I'm having trouble right now. Please try again in a moment!",
            sender: 'bot',
            error: true
        }, { status: 500 });
    }
}

async function handleGeminiChat(message: string, userType: string, user: any, history: any[]) {
    try {
        const model = genAI!.getGenerativeModel({ model: 'gemini-pro' });

        // Build context-aware prompt
        let systemPrompt = '';

        if (userType === 'guest') {
            systemPrompt = `You are EduBot, a helpful AI assistant for EduAI Tutors - an online learning platform.
      
Available Packages:
${guestKnowledge.courses.map(c => `- ${c.name}: ${c.grades} | ${c.subjects} | ${c.price}`).join('\n')}

Key Features:
- AI-powered personalized learning
- Live interactive classes
- Video lessons & practice quizzes
- Dedicated mentors
- 7-day free trial
- 30-day money-back guarantee

Your role: Help visitors understand our offerings, answer questions, and guide them to sign up.
Be friendly, concise, and encouraging. If they seem interested, suggest trying the free trial.`;
        } else if (userType === 'student') {
            const userData = await getStudentData(user.id);
            systemPrompt = `You are EduBot, a personalized AI study assistant for ${user.name}.

Student Profile:
- Package: ${user.package || 'Not enrolled'}
- Current subjects: ${user.subjects?.join(', ') || 'None'}
- Progress: ${userData.completedLessons} lessons completed, ${userData.avgQuizScore}% average quiz score

Your role: Help ${user.name} study effectively by:
- Suggesting what to study based on their weak areas
- Explaining concepts clearly
- Recommending relevant lessons
- Motivating them to stay consistent
- Answering subject-specific questions

Be supportive, encouraging, and act like a friendly tutor.`;
        } else if (userType === 'parent') {
            const childData = await getChildData(user.id);
            systemPrompt = `You are EduBot, an AI assistant helping parents track their child's academic progress.

Parent: ${user.name}
Child's Progress:
- Enrolled: ${childData.enrolled ? 'Yes' : 'No'}
- Study time this week: ${childData.weeklyStudyTime} hours
- Latest quiz scores: ${childData.recentScores.join(', ')}%
- Areas needing attention: ${childData.weakSubjects.join(', ') || 'None'}

Your role: Provide insights, answer questions about child's performance, and suggest how parents can help.
Be professional, informative, and reassuring.`;
        } else {
            systemPrompt = `You are EduBot, a helpful AI assistant for the EduAI Tutors platform.
Help users with platform navigation, course information, and general queries.`;
        }

        // Build conversation history
        const chatHistory = history.map(h => `${h.sender === 'user' ? 'User' : 'Bot'}: ${h.text}`).join('\n');

        const prompt = `${systemPrompt}\n\nConversation so far:\n${chatHistory}\n\nUser: ${message}\n\nBot:`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        return response.text();

    } catch (error) {
        console.error('Gemini AI Error:', error);
        return handleRuleBasedChat(message, userType, user);
    }
}

async function handleRuleBasedChat(message: string, userType: string, user: any) {
    const lowerMsg = message.toLowerCase();

    if (userType === 'guest') {
        // Guest queries
        if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('fee')) {
            return `Our packages range from ₹4,999 to ₹12,999 per month:\n\n${guestKnowledge.courses.map(c => `📚 ${c.name} (${c.grades}): ${c.price}`).join('\n')}\n\nWe also offer a 7-day FREE trial! Want to get started?`;
        }
        if (lowerMsg.includes('jee') || lowerMsg.includes('iit')) {
            return `Our JEE Mastery package is perfect for you! It includes:\n✅ Live classes by IIT alumni\n✅ 1000+ practice problems\n✅ Mock tests & analysis\n✅ Dedicated mentor\n\nPrice: ₹12,999/month\n\n🎁 Try 7 days FREE! Shall I help you sign up?`;
        }
        if (lowerMsg.includes('neet') || lowerMsg.includes('medical')) {
            return `NEET Preparation package details:\n✅ PCB focus with expert faculty\n✅ Previous year questions\n✅ Biology masterclasses\n✅ Weekly assessments\n\nPrice: ₹12,999/month\n\n🎁 Start with a FREE 7-day trial!`;
        }
        if (lowerMsg.includes('trial') || lowerMsg.includes('demo')) {
            return `Great! We offer a 7-day FREE trial with full access to:\n✅ All video lessons\n✅ Live classes\n✅ Practice quizzes\n✅ Mentor support\n\nNo credit card needed! Ready to start your learning journey?`;
        }
        if (lowerMsg.includes('course') || lowerMsg.includes('package') || lowerMsg.includes('offer')) {
            return `We offer 5 comprehensive packages:\n\n${guestKnowledge.courses.map((c, i) => `${i + 1}. ${c.name} (${c.grades})\n   ${c.subjects} - ${c.price}`).join('\n\n')}\n\nWhich grade are you in? I can recommend the best fit!`;
        }
        return `Hi! 👋 I'm EduBot, your AI assistant.\n\nI can help you:\n📚 Explore our courses\n💰 Check pricing\n🎓 Find the right package\n🎁 Start a FREE trial\n\nWhat would you like to know?`;
    } else if (userType === 'student') {
        // Student queries
        if (lowerMsg.includes('study') || lowerMsg.includes('what should i')) {
            const userData = await getStudentData(user.id);
            if (userData.weakSubjects.length > 0) {
                return `Based on your recent quiz scores, I recommend focusing on:\n\n${userData.weakSubjects.map((s: string) => `📌 ${s} - Your score: ${userData.subjectScores[s]}%`).join('\n')}\n\nShall I find relevant video lessons for you?`;
            }
            return `Great question! Let me suggest:\n1. Review yesterday's lesson\n2. Complete pending quizzes\n3. Watch today's new video\n\nWhere would you like to start?`;
        }
        if (lowerMsg.includes('progress') || lowerMsg.includes('how am i doing')) {
            const userData = await getStudentData(user.id);
            return `Your Progress Summary:\n\n📊 Lessons Completed: ${userData.completedLessons}\n⭐ Average Quiz Score: ${userData.avgQuizScore}%\n🔥 Current Streak: ${userData.streak} days\n🎯 Study Time This Week: ${userData.weeklyStudyTime}h\n\n${userData.avgQuizScore >= 80 ? 'Excellent work! Keep it up! 🎉' : 'You´re making progress! Let\'s aim for 80%+ this week! 💪'}`;
        }
        if (lowerMsg.includes('quiz') || lowerMsg.includes('test')) {
            return `Ready to test your knowledge? 📝\n\nI can create a quick quiz on:\n• Physics\n• Chemistry\n• Mathematics\n• Biology\n\nWhich subject would you like to be quizzed on?`;
        }
        if (lowerMsg.includes('help') || lowerMsg.includes('stuck')) {
            return `I'm here to help! 💡\n\nYou can:\n1. Ask me to explain a topic\n2. Request relevant video lessons\n3. Take a practice quiz\n4. Get study recommendations\n\nWhat do you need help with?`;
        }
        return `Hi ${user.name}! 👋\n\nI can help you with:\n📚 Study recommendations\n📊 Track your progress\n📝 Quick quizzes\n💡 Explain concepts\n\nWhat would you like to do today?`;
    } else if (userType === 'parent') {
        // Parent queries
        if (lowerMsg.includes('child') || lowerMsg.includes('progress') || lowerMsg.includes('doing')) {
            const childData = await getChildData(user.id);
            return `Your Child's Progress:\n\n📊 Study Time (This Week): ${childData.weeklyStudyTime} hours\n✅ Lessons Completed: ${childData.completedLessons}\n⭐ Recent Quiz Scores: ${childData.recentScores.join(', ')}%\n${childData.weakSubjects.length > 0 ? `\n⚠️ Needs Attention: ${childData.weakSubjects.join(', ')}` : '\n🎉 All subjects performing well!'}\n\nWould you like detailed insights?`;
        }
        if (lowerMsg.includes('mentor') || lowerMsg.includes('teacher')) {
            return `Your child's mentor is available for:\n\n✅ Doubt clearing sessions\n✅ Progress discussions\n✅ Study plan adjustments\n\nWould you like to send a message to the mentor?`;
        }
        if (lowerMsg.includes('weak') || lowerMsg.includes('improve')) {
            const childData = await getChildData(user.id);
            if (childData.weakSubjects.length > 0) {
                return `Areas needing attention:\n\n${childData.weakSubjects.map((s: string) => `📌 ${s}: Suggest 30min daily practice`).join('\n')}\n\nI recommend:\n1. Daily revision of weak topics\n2. More practice quizzes\n3. Schedule mentor session\n\nWould you like me to notify the mentor?`;
            }
            return `Great news! Your child is performing well across all subjects! 🎉\n\nKeep encouraging consistent study habits.`;
        }
        return `Hello! 👋\n\nI can help you:\n📊 Check your child's progress\n📚 See what they're studying\n💬 Connect with their mentor\n📈 Get performance insights\n\nWhat would you like to know?`;
    }

    return `Hi! 👋 How can I assist you today?`;
}

async function getStudentData(userId: string) {
    try {
        await dbConnect();
        const progress = await LessonProgress.find({ userId });
        const quizResults = await QuizResult.find({ userId }).limit(10).sort({ createdAt: -1 });

        const completedLessons = progress.filter(p => p.isCompleted).length;
        const totalWatchTime = progress.reduce((sum, p) => sum + (p.watchTime || 0), 0);
        const avgQuizScore = quizResults.length > 0
            ? Math.round(quizResults.reduce((sum, q) => sum + (q.score / q.totalQuestions * 100), 0) / quizResults.length)
            : 0;

        // Calculate subject-wise scores
        const subjectScores: any = {};
        const weakSubjects: string[] = [];

        // Simple mock for demonstration (enhance with real logic)
        const subjects = ['Physics', 'Chemistry', 'Mathematics'];
        subjects.forEach(subject => {
            const subjectQuizzes = quizResults.filter((q: any) => q.quizId?.subject === subject);
            if (subjectQuizzes.length > 0) {
                const avgScore = Math.round(
                    subjectQuizzes.reduce((sum: number, q: any) => sum + (q.score / q.totalQuestions * 100), 0) / subjectQuizzes.length
                );
                subjectScores[subject] = avgScore;
                if (avgScore < 70) weakSubjects.push(subject);
            }
        });

        return {
            completedLessons,
            avgQuizScore,
            weeklyStudyTime: Math.round(totalWatchTime / 3600), // Convert to hours
            streak: 5, // Mock - implement real streak logic
            weakSubjects,
            subjectScores
        };
    } catch (error) {
        return {
            completedLessons: 0,
            avgQuizScore: 0,
            weeklyStudyTime: 0,
            streak: 0,
            weakSubjects: [],
            subjectScores: {}
        };
    }
}

async function getChildData(parentId: string) {
    // Mock implementation - in production, fetch actual child data linked to parent
    return {
        enrolled: true,
        weeklyStudyTime: 12,
        completedLessons: 45,
        recentScores: [85, 78, 92, 88, 76],
        weakSubjects: ['Chemistry'],
    };
}
