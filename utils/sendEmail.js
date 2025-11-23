import nodemailer from "nodemailer";

export default async function sendEmail(to, subject, text) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        auth: {
            user: process.env.NEXT_PUBLIC_SENDER_EMAIL_ID,
            pass: process.env.NEXT_PUBLIC_SENDER_EMAIL_PASSWORD
        },
    });

    await transporter.sendMail({
        from: `"BetterPlanner" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html: `<p>${text}</p>`,
    });
}
