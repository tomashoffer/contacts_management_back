// src/services/authService.ts

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/users.model';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('JWT secret key is not defined in environment variables');
}

export async function registerUser(email: string, password: string, username: string) {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('The user is already registered');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({ email, password: hashedPassword, username });

  const token = jwt.sign({ userId: newUser.id }, jwtSecret!, { expiresIn: '1h' });

  return token;
}

export async function loginUser(email: string, password: string) {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ userId: user.id }, jwtSecret!, { expiresIn: '3h' });
  const userData = {
    id: user.id,
    email: user.email,
    username: user.username,
  };
  return { token, userData };
}

export async function getUserInfo(token: string) {
  const decodedToken: any = jwt.verify(token, jwtSecret!);
  const userId = decodedToken.userId;
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const userInfo = {
    id: user.id,
    username: user.username,
    email: user.email,
    token
  };
  return userInfo;
}
