import express from 'express';
import { VerifyController } from '../controllers/verify.controller';

const router = express.Router();

const verifyController = new VerifyController();

router.post('/verify-email', verifyController.verifyEmail);

router.get('/verify-token', verifyController.verifyToken);

export default router;
