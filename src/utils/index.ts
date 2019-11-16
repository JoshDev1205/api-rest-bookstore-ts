import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from '../../config'

export async function encrypPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function validatePassword(
  bodyPassword: string,
  password: string
): Promise<boolean> {
  return await bcrypt.compare(bodyPassword, password)
}

export interface IPayload {
  _id: string
  iat: number
}

// Modificado en Package.json

export function tokenValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.header('authorization')
    if (!token) return res.status(401).json('Access Denied')
    const payload = jwt.verify(token, config.secret || '') as IPayload
    req.userId = payload._id
    next()
  } catch (error) {
    res.status(400).send('Invalid Token')
  }
}
