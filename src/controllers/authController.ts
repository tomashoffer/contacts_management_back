import { Request, Response } from 'express';
import * as authService from '../services/authService';

export async function registerUser(req: Request, res: Response) {
  try {
    const { email, password, username } = req.body;
    const token = await authService.registerUser(email, password, username);
    res.status(201).json({ token });
  } catch (error) {
    console.error('Error in registration:', error);
    res.status(500).json({ error: 'Error in user registration' });
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const { token, userData } = await authService.loginUser(email, password);
    res.status(200).json({ token, userData });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login error' });
  }
}

export async function getUserInfo(req: Request, res: Response) {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentication token not provided' });
    }
    const userInfo = await authService.getUserInfo(token);
    res.status(200).json(userInfo);
  } catch (error) {
    console.error('Error obtaining user information:', error);
    res.status(500).json({ error: 'Error obtaining user information' });
  }
}
