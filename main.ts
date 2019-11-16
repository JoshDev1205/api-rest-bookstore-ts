import app from './src/app'

function main() {
  const PORT = process.env.PORT || 3000
  app.listen(PORT)
  console.log(`🚀 Server ready at: http://localhost:${PORT}`)
}

main()
