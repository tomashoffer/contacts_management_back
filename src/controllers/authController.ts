import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/users.model';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('JWT secret key is not defined in environment variables');
}

export async function registerUser(req: Request, res: Response) {
    try {
      const { email, password, username } = req.body;
  
      // Check if the user is already registered
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'The user is already registered' });
      }
  
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create user
      const newUser = await User.create({ email, password: hashedPassword, username });
  
      // Generate token JWT
      const token = jwt.sign({ userId: newUser.id }, jwtSecret!, { expiresIn: '1h' });
  
      res.status(201).json({ token });
    } catch (error) {
      console.error('Error in registration:', error);
      res.status(500).json({ error: 'Error in user registration' });
    }
  }
  
export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Busca al usuario por su email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Verifica el password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Genera el token JWT
    const token = jwt.sign({ userId: user.id }, jwtSecret!, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login error' });
  }
}

export async function getUserInfo(req: Request, res: Response) {
    try {
      // Verify JWT token and extract user information
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Authentication token not provided' });
      }
      const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
      
      // Get the user of the model User
      const userId = decodedToken.userId;
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Send user information
      const userInfo = {
        id: user.id,
        username: user.username,
        email: user.email,
        token
      };
      res.status(200).json(userInfo);
    } catch (error) {
      console.error('Error obtaining user information:', error);
      res.status(500).json({ error: 'Error obtaining user information' });
    }
  }