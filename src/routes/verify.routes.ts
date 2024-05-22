import express from 'express';
import { VerifyController } from '../controllers/verify.controller';
import { VerifyService } from '../services/verify.service';

const router = express.Router();

const verifyService = VerifyService.getInstance();

// Create an instance of the VerifyController, passing in the verifyService instance.
const verifyController = new VerifyController(verifyService);

router.post('/verify-email', verifyController.verifyEmail);

router.get('/verify-token', verifyController.verifyToken);

export default router;
