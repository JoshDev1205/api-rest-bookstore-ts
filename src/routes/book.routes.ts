import { Router } from 'express'
import {
  createBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook
} from '../controllers/books.controller'

const router = Router()

router
  .route('/')
  .get(getBooks)
  .post(createBook)

router
  .route('/:id')
  .get(getBook)
  .put(updateBook)
  .delete(deleteBook)

export default router
