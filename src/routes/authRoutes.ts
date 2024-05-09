import express, { Request, Response } from 'express';
import { registerUser, loginUser, getUserInfo } from '../controllers/authController';
import { authenticateToken } from '../middlewares/authentication'; // Importa el middleware

const router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
  await registerUser(req, res);
});

router.post('/login', async (req: Request, res: Response) => {
  await loginUser(req, res);
});

router.get('/user', authenticateToken, getUserInfo); 

export default router;
