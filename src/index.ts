import express from 'express';
import 'dotenv/config';
import sgMail, { MailDataRequired } from '@sendgrid/mail';
import cors from 'cors';
import jwt, { JwtPayload } from 'jsonwebtoken';

const PORT = process.env.PORT || 3000;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY!;
const JWT_SECRET = process.env.JWT_SECRET || 'MYSECRET'; // would only get from env in production
sgMail.setApiKey(SENDGRID_API_KEY);
const app = express();
app.use(cors());
app.use(express.json());

app.get('/verify-email', async (req, res) => {
  const EMAIL = 'ianfrye3@gmail.com'; // would get email from req in production
  const TOKEN = setJWT({ EMAIL });

  const message: MailDataRequired = {
    to: EMAIL,
    from: 'ianfrye3@ianfrye.dev',
    subject: 'Verify Email Address ianfrye.dev',
    text: 'Verify Email',
    html: `<p>Please click the link below to verify your email</p>
    <p><a href="http://localhost:3000/verify-token?token=${TOKEN}">Verify Email</a></p>
    <p>Link not working? Copy and paste the link below into your browser</p>
    <p>http://localhost:3000/verify-token?token=${TOKEN}</p>`,
  };
  try {
    await sgMail.send(message);
    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error((error as unknown as any).response.body.errors);
  }
});

app.get('/verify-token', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) return res.sendStatus(401);
    const result = verifyJWT(token as string);

    if (!result) return res.sendStatus(401);

    if (result.exp * 1000 < Date.now())
      return res
        .status(403)
        .json({ message: 'Token has expired' })
        .redirect('/refresh-email-token');

    //search database for user with that email - see if the email exists - switch their status to verified
    //if no email exists throw 404 error
    // res.redirect('/dashboard') - redirec user to homepage or dashbaord

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

function verifyJWT(token: string) {
  try {
    const decodedToken = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return {
      email: decodedToken.EMAIL,
      exp: decodedToken.exp!,
      iat: decodedToken.iat!,
    };
  } catch (error) {
    console.error('JWT verification failed: ', error);
    return null;
  }
}

function setJWT(payload: any) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '10m' });
}
