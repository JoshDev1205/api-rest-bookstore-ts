import bodyParser from 'body-parser'
import cors from 'cors'
import express, { Application } from 'express'
import AuthorRoutes from './routes/author.routes'
import BookRoutes from './routes/book.routes'
import AuthRoutes from './routes/auth.routes'

const app: Application = express()

app.use(bodyParser.json())
app.use(cors())

//Routes
app.get('/', (req, res) => {
  res.send({ message: 'Api del curso de Vuejs desde Cero' })
})
app.use('/', AuthRoutes)
app.use('/author', AuthorRoutes)
app.use('/book', BookRoutes)

export default app
