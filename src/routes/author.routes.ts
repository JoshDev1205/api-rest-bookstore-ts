import { Router } from 'express'
import {
  createAuthor,
  getAllAuthors,
  getAuthor,
  updateAuthor
} from '../controllers/author.controller'
import { tokenValidation } from '../utils'

const router = Router()

router
  .use(tokenValidation)
  .route('/')
  .get(getAllAuthors)
  .post(createAuthor)

router
  .use(tokenValidation)
  .route('/:id')
  .get(getAuthor)
  .put(updateAuthor)

export default router
