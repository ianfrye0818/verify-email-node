import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import VerifyRoutes from './routes/verify.routes';

const PORT = process.env.PORT || 3000;

// would only get from env in production

const app = express();
app.use(cors());
app.use(express.json());

app.use('/verify', VerifyRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
