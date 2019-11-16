import { Router } from 'express'
import {
  createBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook
} from '../controllers/books.controller'
import { tokenValidation } from '../utils'

const router = Router()

router
  .use(tokenValidation)
  .route('/')
  .get(getBooks)
  .post(createBook)

router
  .route('/:id')
  .get(getBook)
  .put(updateBook)
  .delete(deleteBook)

export default router
