import express from 'express'
import { PrismaClient } from '@prisma/client'

const app = express()
const port = 4000
app.use(express.json())

const prisma = new PrismaClient()

app.get('/users', async (_, res) => {
  const users = await prisma.user.findMany()
  res.json(users)
})

app.listen(port, () => {
  console.log('Server running on port 4000')
})
