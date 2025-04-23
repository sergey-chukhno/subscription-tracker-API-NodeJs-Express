import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env";
import User from "../models/user.model.js"

export const signup = async (req, res, next) => {
  // Implement signup logic here 
  const session = await mongoose.startSession(); 
  session.startTransaction();
  try {
    // Logic to create a new user
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('User already exists');
      error.statusCode = 409; 
      throw error;
    }

    // Hash password 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUsers = await User.create([{
      name, 
      email, 
      password: hashedPassword,
    }], { session });
    
    // Generate JWT token
    const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    // Send response
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        token, 
        user: newUsers[0],
      },
    });

   }
  catch (error) {
    await session.abortTransaction();
    next(error);
  }
   }


export const login = async (req, res, next) => {
  // Implement login logic here 
  try {
    const { email, password } = req.body; 

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404; 
      throw error;
    }
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error('Invalid password');
      error.statusCode = 401; 
      throw error;
    }
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    // Send response
    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      data: {
        token, 
        user,
      },
    });
   }
  catch (error) {
    next(error);
  }
}

export const logout = async (req, res, next) => {
  // Implement logout logic here 
}