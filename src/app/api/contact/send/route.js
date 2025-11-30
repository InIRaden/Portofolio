import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const body = await request.json();
    const { firstname, lastname, email, phone, service, message } = body;

    // Validate required fields
    if (!firstname || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    const user = process.env.EMAIL_USER || 'iniradenmahesa8@gmail.com';
    const pass = process.env.EMAIL_PASSWORD;

    if (!pass) {
      return NextResponse.json(
        { success: false, error: 'EMAIL_PASSWORD (Gmail App Password) belum di-set di .env.local' },
        { status: 500 }
      );
    }

    // Create transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });

    // Email content
    const fullName = lastname ? `${firstname} ${lastname}` : firstname;
    const mailOptions = {
      from: user,
      to: user,
      subject: `New Contact Form Submission from ${fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #00ff99; border-bottom: 2px solid #00ff99; padding-bottom: 10px;">New Contact Form Submission</h2>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #333; margin-bottom: 10px;">Contact Information:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="background-color: #f9f9f9;">
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 30%;">Name:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${fullName}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
                <td style="padding: 10px; border: 1px solid #ddd;"><a href="mailto:${email}" style="color: #00ff99;">${email}</a></td>
              </tr>
              ${phone ? `
              <tr style="background-color: #f9f9f9;">
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Phone:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${phone}</td>
              </tr>
              ` : ''}
              ${service ? `
              <tr${!phone ? ' style="background-color: #f9f9f9;"' : ''}>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Service:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${service}</td>
              </tr>
              ` : ''}
            </table>
          </div>

          <div style="margin: 20px 0;">
            <h3 style="color: #333; margin-bottom: 10px;">Message:</h3>
            <div style="padding: 15px; background-color: #f9f9f9; border-left: 4px solid #00ff99; border-radius: 5px;">
              <p style="color: #555; line-height: 1.6; margin: 0;">${message.replace(/\n/g, '<br>')}</p>
            </div>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #999; font-size: 12px;">
            <p>This email was sent from your portfolio contact form</p>
            <p>Received at: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })}</p>
          </div>
        </div>
      `,
      // Plain text version
      text: `
New Contact Form Submission

Name: ${fullName}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}
${service ? `Service: ${service}` : ''}

Message:
${message}

---
Received at: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })}
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ 
      success: true, 
      message: 'Email sent successfully' 
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send email. Please try again later.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
