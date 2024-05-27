import express, { Request, Response } from 'express';
import { registerUser, loginUser, getUserInfo } from '../controllers/authController';
import { authenticateToken } from '../middlewares/authentication';
import { validateRegisterUser, validateLoginUser, handleValidationErrors } from '../middlewares/authValidation';

const router = express.Router();

router.post('/register', validateRegisterUser, handleValidationErrors, async (req: Request, res: Response) => {
  await registerUser(req, res);
});

router.post('/login', validateLoginUser, handleValidationErrors, async (req: Request, res: Response) => {
  await loginUser(req, res);
});

router.get('/user', authenticateToken, async (req: Request, res: Response) => {
  await getUserInfo(req, res);
});

export default router;
