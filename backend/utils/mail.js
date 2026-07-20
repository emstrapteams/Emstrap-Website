const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: (process.env.SMTP_USER || "").trim(),
        pass: (process.env.SMTP_PASS || "").trim()
    },
    tls: {
        rejectUnauthorized: false
    }
});

const senderEmail = (process.env.MAIL_FROM || process.env.SMTP_USER || "").trim();
const senderName = (process.env.MAIL_FROM_NAME || "EMSTRAP Contact Form").trim();
const recipientEmail = (process.env.MAIL_TO || process.env.SMTP_USER || "").trim();

// Verify SMTP connection when the server starts
transporter.verify()
    .then(() => {
        console.log("✅ SMTP Server Connected successfully! (Zoho Mail)");
    })
    .catch((error) => {
        console.log("==================================================");
        console.log("⚠️ SMTP Verification Failed!");
        console.log("Error details:", error.message);
        console.log("\nIf you are using ZOHO MAIL, please verify:");
        console.log("1. SMTP Client Submission is ENABLED in your Zoho Mail console.");
        console.log("2. If 2-Factor Authentication (2FA) is enabled, you MUST use an App Password instead of your regular password.");
        console.log("3. Your SMTP_PORT and SMTP_SECURE match: port 465 (secure: true) or port 587 (secure: false).");
        console.log("==================================================");
    });

const sendMail = async (data) => {
    const { fullName, organization, email, phone, message } = data;
    const safeFullName = (fullName || "Visitor").trim();
    const safeOrganization = (organization || "Not provided").trim();
    const safeEmail = (email || "").trim();
    const safePhone = (phone || "Not provided").trim();
    const safeMessage = (message || "").trim();

    const replyAddress = safeEmail || senderEmail;
    const replyName = safeFullName || senderName;

    const mailOptions = {
        from: {
            name: `${safeFullName} (${safeEmail})`,
            address: senderEmail
        },
        to: recipientEmail,
        replyTo: {
            name: replyName,
            address: replyAddress
        },
        returnPath: senderEmail,
        envelope: {
            from: senderEmail,
            to: recipientEmail
        },
        subject: `New Enquiry from ${safeFullName} (${safeOrganization})`,
        text: `New contact enquiry from ${safeFullName} (${safeEmail})\nOrganization: ${safeOrganization}\nPhone: ${safePhone}\n\nMessage:\n${safeMessage}`,
        html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6fc; padding: 40px 20px; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(0, 82, 255, 0.08); border: 1px solid #eef2f6;">
                
                <!-- Brand Header -->
                <div style="background: linear-gradient(135deg, #050B14 0%, #0a192f 100%); color: #ffffff; padding: 30px; text-align: center; border-bottom: 3px solid #0052FF;">
                    <h2 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 1px; color: #ffffff;">EMSTRAP</h2>
                    <p style="margin: 5px 0 0 0; font-size: 14px; color: #94a3b8; font-weight: 500; uppercase; letter-spacing: 0.5px;">New Contact Enquiry</p>
                </div>
                
                <div style="padding: 30px 40px;">
                    <!-- Message Summary -->
                    <p style="font-size: 15px; line-height: 1.6; color: #475569; margin-top: 0;">
                        A visitor has submitted a new inquiry through the EMSTRAP corporate contact form. Below are their details:
                    </p>
                    
                    <!-- Information Grid -->
                    <table style="width: 100%; border-collapse: collapse; margin: 25px 0;">
                        <tr style="border-bottom: 1px solid #f1f5f9;">
                            <td style="padding: 12px 0; font-size: 14px; font-weight: 600; color: #64748b; width: 35%;">Full Name</td>
                            <td style="padding: 12px 0; font-size: 14px; font-weight: 700; color: #0f172a;">${safeFullName}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #f1f5f9;">
                            <td style="padding: 12px 0; font-size: 14px; font-weight: 600; color: #64748b;">Organization</td>
                            <td style="padding: 12px 0; font-size: 14px; color: #334155;">${safeOrganization}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #f1f5f9;">
                            <td style="padding: 12px 0; font-size: 14px; font-weight: 600; color: #64748b;">Email Address</td>
                            <td style="padding: 12px 0; font-size: 14px; font-weight: 600; color: #0052FF;"><a href="mailto:${safeEmail}" style="color: #0052FF; text-decoration: none;">${safeEmail}</a></td>
                        </tr>
                        <tr style="border-bottom: 1px solid #f1f5f9;">
                            <td style="padding: 12px 0; font-size: 14px; font-weight: 600; color: #64748b;">Phone Number</td>
                            <td style="padding: 12px 0; font-size: 14px; color: #334155;">${safePhone}</td>
                        </tr>
                    </table>
                    
                    <!-- Message Body -->
                    <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 25px 0 10px 0; border-left: 4px solid #0052FF; padding-left: 10px;">Message</h3>
                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap; font-style: italic;">
                        "${safeMessage}"
                    </div>
                    
                    <!-- Action Button -->
                    <div style="text-align: center; margin: 35px 0 15px 0;">
                        <a href="mailto:${safeEmail}?subject=Re: EMSTRAP Contact Enquiry - ${safeFullName}" style="background-color: #0052FF; color: #ffffff; text-decoration: none; padding: 14px 30px; font-size: 14px; font-weight: 700; border-radius: 8px; display: inline-block; box-shadow: 0 4px 12px rgba(0, 82, 255, 0.2); transition: background-color 0.2s;">
                            ✉️ Reply directly to ${safeFullName}
                        </a>
                    </div>
                    
                </div>
                
                <!-- Footer -->
                <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
                    This enquiry was generated automatically from the EMSTRAP corporate website.
                </div>
            </div>
        </div>
        `
    };

    try {
        return await transporter.sendMail(mailOptions);
    } catch (error) {
        console.warn("⚠️ SMTP Send Failed.");
        console.warn("Error Details:", error.message);
        throw error;
    }
};

module.exports = sendMail;