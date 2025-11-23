import nodemailer from "nodemailer";
import connectDB from "@/middleware/connectDb";

async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { data } = req.body;

    if (!data.name || !data.email || !data.message) return res.status(400).json({ error: "Either name or email or message is empty" });

    try {
        // 3. Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            auth: {
                user: process.env.NEXT_PUBLIC_SENDER_EMAIL_ID,
                pass: process.env.NEXT_PUBLIC_SENDER_EMAIL_PASSWORD
            },
        });

        // 4. Send email
        await transporter.sendMail({
            from: `"BetterPlanner" <${process.env.SMTP_USER}>`,
            to: process.env.NEXT_PUBLIC_TO_EMAIL_ID,
            subject: "Got a new message from BetterPlanner",
            html: `
        <p>Someone sent a new message from BetterPlanner:</p>
        <div style="font-size: 16px; letter-spacing: 1px;"><b>Name: </b>${data.name}</div>
        <div style="font-size: 16px; letter-spacing: 1px;"><b>Email: </b>${data.email}</div>
        <div style="font-size: 16px; letter-spacing: 1px;"><b>Message: </b>${data.message}</div>
      `,
        });

        return res.status(200).json({ message: "Message sent successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Failed to send message" });
    }
}

export default connectDB(handler);
