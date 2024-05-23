import { Request, Response } from 'express';
import { VerifyService } from '../services/verify.service';

const verifyService = VerifyService.getInstance();

export class VerifyController {
  constructor() {}

  async verifyEmail(req: Request, res: Response) {
    const email = req.body.email || 'ianfrye3@gmail.com';
    if (!email) res.status(400).send({ message: 'Email is required' });
    try {
      const response = await verifyService.verifyEmail(email);

      res.status(200).send(response);
    } catch (error) {
      console.error('Error verifying email: ', error);
      res.status(500).json({ message: 'Failed to verify email' });
    }
  }

  async verifyToken(req: Request, res: Response) {
    const token = req.query.token as string;
    if (!token) res.status(400).json({ message: 'Token is required' });
    try {
      const response = await verifyService.verifyToken(token as string);
      if (response.message === 'Email verified successfully') {
        res.status(200).json(response);
      } else {
        return res.status(400).json(response);
      }
    } catch (error) {
      console.error('Error verifying token: ', error);
      res.status(500).send({ message: 'Verification Failed' });
    }
  }
}
