import sgMail from '@sendgrid/mail';

export class SendGridService {
  private static instance: SendGridService;
  private static SENDGRID_API_KEY = process.env.SENDGRID_API_KEY!;

  private constructor() {
    if (!SendGridService.SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY env varilable not set');
    }

    sgMail.setApiKey(SendGridService.SENDGRID_API_KEY);
  }

  public static getInstance(): SendGridService {
    if (!SendGridService.instance) {
      SendGridService.instance = new SendGridService();
    }
    return SendGridService.instance;
  }

  public async sendEmail(msg: sgMail.MailDataRequired) {
    try {
      await sgMail.send(msg);
      return 'Email sent successfully';
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
