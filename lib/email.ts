import nodemailer from 'nodemailer';

// Email configuration - Use environment variables in production
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER, // Your email
        pass: process.env.SMTP_PASS, // App password (not regular password)
    },
});

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
