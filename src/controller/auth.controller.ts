import { User } from "../models";
import AppError from "../utils/appError";
import asyncHandler from "../utils/asyncHandler";
import bcrypt from "bcrypt";
import { Request, Response } from "express";


const registerUserController = asyncHandler(async (req: Request, res: Response) => {
    const { email, name, password, phone, address,role } = req.body;
    

    if (!name || !email || !password || !role) {
      throw new AppError('All fields are required', 400);
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError('User already exists', 409);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: 'User registered successfully',
      userId: newUser.id,
      email: newUser.email,
    });
})


export {
    registerUserController
}