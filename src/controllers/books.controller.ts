import { Request, Response } from 'express'
import { Photon } from '../../@generated/photon'

const photon = new Photon()

export async function createBook(req: Request, res: Response) {
  const { title, description, quantity, authorId, price } = req.body

  const result = await photon.books.create({
    data: {
      title,
      description,
      quantity,
      price,
      author: { connect: { id: authorId } }
    }
  })

  res.json(result)
}

export async function getBooks(req: Request, res: Response) {
  const result = await photon.books.findMany({
    include: { author: true }
  })

  res.json(result)
}

export async function getBook(req: Request, res: Response) {
  const { id } = req.params

  const result = await photon.books.findOne({
    where: { id },
    include: { author: true }
  })

  res.json(result)
}

export async function updateBook(req: Request, res: Response) {
  const { id } = req.params
  const { title, description, quantity, authorId, price } = req.body

  const result = await photon.books.update({
    data: {
      title,
      description,
      quantity,
      price,
      author: { connect: { id: authorId } }
    },
    where: { id }
  })

  res.json(result)
}

export async function deleteBook(req: Request, res: Response) {
  const { id } = req.params

  const result = await photon.books.delete({
    where: {
      id
    }
  })

  res.json(result)
}
