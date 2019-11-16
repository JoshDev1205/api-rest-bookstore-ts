import { Request, Response } from 'express'
import { Photon } from '../../@generated/photon'

const photon = new Photon()

export async function createAuthor(req: Request, res: Response) {
  const newAuthor = req.body

  const result = await photon.authors.create({
    data: {
      ...req.body
    }
  })

  res.json(result)
}

export async function getAllAuthors(req: Request, res: Response) {
  const result = await photon.authors.findMany()
  res.json(result)
}

export async function getAuthor(req: Request, res: Response) {
  const { id } = req.params

  const result = await photon.authors.findOne({
    where: {
      id
    },
    include: { books: true }
  })

  res.json(result)
}

export async function updateAuthor(req: Request, res: Response) {
  const { id } = req.params

  const updatedAuthor = req.body

  const result = await photon.authors.update({
    data: { ...updatedAuthor },
    where: { id }
  })

  res.json(result)
}
