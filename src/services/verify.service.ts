import { MailDataRequired } from '@sendgrid/mail';
import { JwtService } from './jwt.service';
import { SendGridService } from './sendgrid.service';

export class VerifyService {
  private static instance: VerifyService;
  private static jwtService = JwtService.getInstance();
  private static sendGridService = SendGridService.getInstance();

  private constructor() {}

  public static getInstance(): VerifyService {
    if (!VerifyService.instance) {
      VerifyService.instance = new VerifyService();
    }
    return VerifyService.instance;
  }

  async verifyEmail(email: string) {
    const TOKEN = VerifyService.jwtService.setJWT({ email });

    const message: MailDataRequired = {
      to: email,
      from: 'ianfrye3@ianfrye.dev',
      subject: 'Verify Email Address ianfrye.dev',
      text: 'Verify Email',
      html: `<p>Please click the link below to verify your email</p>
      <p><a href="http://localhost:3000/verify/verify-token?token=${TOKEN}">Verify Email</a></p>
      <p>Link not working? Copy and paste the link below into your browser</p>
      <p>http://localhost:3000/verify/verify-token?token=${TOKEN}</p>`,
    };
    try {
      await VerifyService.sendGridService.sendEmail(message);
      return { message: 'Email sent successfully' };
    } catch (error) {
      console.error(error);
      return { error: 'Email not sent' };
    }
  }

  async verifyToken(token: string) {
    try {
      if (!token) throw new Error('No token provided');
      const payload = VerifyService.jwtService.verifyJWT(token as string);

      if (!payload) throw new Error('Invalid token');

      // Perform email verification logic here
      // For this example, we'll just return a success message

      return { message: 'Email verified successfully' };
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        return { error: error.message };
      } else {
        return { error: 'Something went wrong. Please try again later.' };
      }
    }
  }
}
