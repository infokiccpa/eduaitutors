import nodemailer from 'nodemailer';

// Email configuration - Optimized for Gmail and Production
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Verify connection configuration
if (process.env.NODE_ENV !== 'production') {
    transporter.verify(function (error, success) {
        if (error) {
            console.error('❌ SMTP Connection Error:', error);
        } else {
            console.log('✅ SMTP Server is ready');
        }
    });
}

// Welcome email template
const getWelcomeEmailHTML = (leadName: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding: 40px 20px; text-align: center; }
        .logo { font-size: 32px; font-weight: 900; color: white; margin: 0; }
        .content { padding: 40px 30px; }
        .title { font-size: 28px; font-weight: 900; color: #0f172a; margin: 0 0 16px 0; }
        .text { font-size: 16px; color: #475569; line-height: 1.6; margin: 0 0 20px 0; }
        .highlight { background: #f1f5f9; border-left: 4px solid #6366f1; padding: 20px; margin: 20px 0; border-radius: 4px; }
        .button { display: inline-block; background: #6366f1; color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 700; margin: 20px 0; }
        .footer { background: #0f172a; color: #94a3b8; padding: 30px 20px; text-align: center; font-size: 14px; }
        .feature { margin: 15px 0; }
        .feature-icon { color: #6366f1; font-weight: 900; margin-right: 8px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="logo">🎓 EduAI Tutors</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Smart Learning. Powered by AI.</p>
        </div>
        
        <div class="content">
            <h2 class="title">Welcome, ${leadName}! 🎉</h2>
            <p class="text">
                Thank you for your interest in <strong>EduAI Tutors</strong>! We're thrilled to help you achieve your academic goals.
            </p>
            
            <div class="highlight">
                <p class="text" style="margin: 0;">
                    <strong>📞 What's Next?</strong><br/>
                    Our expert counselor will contact you within <strong>24 hours</strong> to understand your learning needs and recommend the perfect program for you.
                </p>
            </div>
            
            <p class="text"><strong>Why Choose EduAI Tutors?</strong></p>
            <div class="feature">
                <span class="feature-icon">✨</span> AI-Powered Personalized Learning Paths
            </div>
            <div class="feature">
                <span class="feature-icon">🎯</span> Expert Live Classes (JEE, NEET, Boards)
            </div>
            <div class="feature">
                <span class="feature-icon">📊</span> Real-Time Progress Tracking
            </div>
            <div class="feature">
                <span class="feature-icon">🏆</span> 98% Student Satisfaction Rate
            </div>
            
            <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/courses" class="button">
                    Explore Our Courses 🚀
                </a>
            </div>
            
            <p class="text">
                <strong>Have questions?</strong> Reply to this email or call us at <a href="tel:+919876543210" style="color: #6366f1;">+91 98765 43210</a>
            </p>
        </div>
        
        <div class="footer">
            <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} EduAI Tutors. All rights reserved.</p>
            <p style="margin: 0; font-size: 12px;">
                Smart Learning Platform | AI-Powered Education
            </p>
        </div>
    </div>
</body>
</html>
`;

export async function sendWelcomeEmail(to: string, name: string) {
    try {
        // Check if SMTP is configured
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.warn('⚠️ SMTP not configured. Email would have been sent to:', to);
            console.log('📧 Configure SMTP_USER and SMTP_PASS in .env to enable emails');
            return { success: false, message: 'SMTP not configured' };
        }

        const mailOptions = {
            from: `"EduAI Tutors" <${process.env.SMTP_USER}>`,
            to,
            subject: `🎓 Welcome to EduAI Tutors, ${name}!`,
            html: getWelcomeEmailHTML(name),
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Email sending failed:', error);
        return { success: false, error };
    }
}

// Internal notification email for admins
export async function sendLeadNotificationToAdmin(leadData: any) {
    try {
        if (!process.env.SMTP_USER || !process.env.ADMIN_EMAIL) {
            console.warn('⚠️ Admin notification skipped - SMTP/ADMIN_EMAIL not configured');
            return;
        }

        const mailOptions = {
            from: `"EduAI System" <${process.env.SMTP_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: `🔔 New Lead: ${leadData.name} (${leadData.courseInterest || 'General'})`,
            html: `
                <h2>New Lead Received</h2>
                <p><strong>Name:</strong> ${leadData.name}</p>
                <p><strong>Email:</strong> ${leadData.email}</p>
                <p><strong>Phone:</strong> ${leadData.phone}</p>
                <p><strong>Grade:</strong> ${leadData.grade || 'Not specified'}</p>
                <p><strong>Interest:</strong> ${leadData.courseInterest || 'General Inquiry'}</p>
                <p><strong>Status:</strong> ${leadData.status}</p>
                <hr/>
                <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin">View in Admin Dashboard</a></p>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ Admin notification sent');
    } catch (error) {
        console.error('❌ Admin notification failed:', error);
    }
}

const getOTPEmailHTML = (otp: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header { background: #6366f1; padding: 40px 20px; text-align: center; }
        .content { padding: 40px 30px; text-align: center; }
        .otp-code { font-size: 48px; font-weight: 900; color: #6366f1; letter-spacing: 8px; margin: 30px 0; padding: 20px; background: #f1f5f9; border-radius: 12px; }
        .footer { background: #0f172a; color: #94a3b8; padding: 20px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="color: white; margin: 0;">EduAI Tutors</h1>
        </div>
        <div class="content">
            <h2 style="color: #0f172a;">Verify Your Email</h2>
            <p style="color: #475569;">Use the following code to complete your registration. This code will expire in 10 minutes.</p>
            <div class="otp-code">${otp}</div>
            <p style="color: #94a3b8; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>© ${new Date().getFullYear()} EduAI Tutors. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

export async function sendOTPEmail(to: string, otp: string) {
    try {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.warn('⚠️ SMTP not configured. OTP:', otp, 'for:', to);
            return { success: false, message: 'SMTP not configured' };
        }

        const mailOptions = {
            from: `"EduAI Verification" <${process.env.SMTP_USER}>`,
            to,
            subject: `${otp} is your verification code`,
            html: getOTPEmailHTML(otp),
        };

        const info = await transporter.sendMail(mailOptions);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ OTP Email failed:', error);
        return { success: false, error };
    }
}

// Live Class Access Email
const getLiveClassEmailHTML = (leadName: string, classLink: string, grade: string, subjects: string[]) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 40px 20px; text-align: center; }
        .logo { font-size: 32px; font-weight: 900; color: white; margin: 0; }
        .content { padding: 40px 30px; }
        .title { font-size: 28px; font-weight: 900; color: #0f172a; margin: 0 0 16px 0; }
        .text { font-size: 16px; color: #475569; line-height: 1.6; margin: 0 0 20px 0; }
        .highlight { background: #fff7ed; border-left: 4px solid #f97316; padding: 20px; margin: 20px 0; border-radius: 4px; }
        .button { display: inline-block; background: #f97316; color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 700; margin: 20px 0; text-align: center; width: 100%; box-sizing: border-box; }
        .footer { background: #0f172a; color: #94a3b8; padding: 30px 20px; text-align: center; font-size: 14px; }
        .subject-tag { display: inline-block; background: #f3f4f6; color: #374151; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: 600; margin-right: 8px; margin-bottom: 8px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="logo">🎓 EduAI Tutors</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Live Class Access</p>
        </div>
        
        <div class="content">
            <h2 class="title">You're In, ${leadName}! 🚀</h2>
            <p class="text">
                Your registration for the <strong>One-Shot Revision Series (${grade})</strong> is confirmed. Get ready to ace your exams with our expert educators!
            </p>
            
            <div class="highlight">
                <p class="text" style="margin: 0;">
                    <strong>📚 Registered Subjects:</strong><br/>
                    <div style="margin-top: 10px;">
                        ${subjects.map(s => `<span class="subject-tag">${s}</span>`).join('')}
                    </div>
                </p>
            </div>
            
            <p class="text">
                Click the button below to join the live classroom. We recommend joining 10 minutes early to check your audio and video.
            </p>
            
            <a href="${classLink}" class="button">
                Join Live Classroom 📹
            </a>
            
            <p class="text" style="font-size: 14px; color: #64748b; text-align: center;">
                or copy this link: <a href="${classLink}" style="color: #f97316;">${classLink}</a>
            </p>
            
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
            
            <p class="text">
                <strong>Need help?</strong> Reply to this email or contact our support team.
            </p>
        </div>
        
        <div class="footer">
            <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} EduAI Tutors. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

export async function sendLiveClassLinkEmail(to: string, name: string, grade: string, subjects: string[], accessCode: string) {
    try {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.warn('⚠️ SMTP not configured. Live Class link not sent to:', to);
            return { success: false, message: 'SMTP not configured' };
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const classLink = `${baseUrl}/live-classroom?grade=${encodeURIComponent(grade)}&subject=${encodeURIComponent(subjects[0])}&token=${accessCode}`;

        const mailOptions = {
            from: `"EduAI Live Classes" <${process.env.SMTP_USER}>`,
            to,
            subject: `🎥 Your Live Class Link - ${grade} Revision`,
            html: getLiveClassEmailHTML(name, classLink, grade, subjects),
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Live Class Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Live Class Email failed:', error);
        return { success: false, error };
    }
}
