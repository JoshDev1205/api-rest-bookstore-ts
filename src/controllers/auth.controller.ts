import { Request, Response } from 'express'
import { Photon } from '../../@generated/photon'
import jwt from 'jsonwebtoken'
import { encrypPassword, validatePassword } from '../utils'
import config from '../../config'

const photon = new Photon()

export async function signup(req: Request, res: Response) {
  const encryptedPassword = await encrypPassword(req.body.password)

  const result = await photon.users.create({
    data: {
      email: req.body.email,
      password: encryptedPassword
    }
  })

  const token: string = jwt.sign({ _id: result.id }, config.secret || '', {
    expiresIn: 60 * 60 * 24
  })

  res.header('authorization', token).json(result)
}

export async function signin(req: Request, res: Response) {
  const { email } = req.body
  const user = await photon.users.findOne({
    where: {
      email
    }
  })

  const isValidPassword = await validatePassword(
    req.body.password,
    user.password
  )

  if (!isValidPassword) return res.status(400).json('Invalid Password')

  const token: string = jwt.sign({ _id: user.id }, config.secret || '')

  res.header('authorization', token).json(user)
}
