import express from 'express'
import { PrismaClient } from '@prisma/client'

const app = express()
const port = 4000
app.use(express.json())

const prisma = new PrismaClient()

app.get('/user/:id', async (req, res) => {
  const { id } = req.params
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    include: { profile: true, posts: true },
  })
  res.json(user)
})

app.get('/users', async (_, res) => {
  const users = await prisma.user.findMany({
    where: {
      email: { endsWith: '@outlook.com' },
      posts: { some: {} },
    },
    include: { profile: true, posts: true },
  })

  // Only return users with more than 2 posts
  const filteredUsers = users.filter((user) => user.posts.length > 2)
  res.json(filteredUsers)
})

app.post('/user', async (req, res) => {
  const { name, email, bio } = req.body
  const user = await prisma.user.create({
    data: {
      name,
      email,
      profile: { create: { bio } },
    },
    include: { profile: true },
  })
  res.json(user)
})

app.post('/post', async (req, res) => {
  const { title, content, authorEmail } = req.body
  const post = await prisma.post.create({
    data: {
      title,
      content,
      author: { connect: { email: authorEmail } },
    },
    include: { author: true },
  })
  res.json(post)
})

app.put('/post/:id/publish', async (req, res) => {
  const { id } = req.params
  const post = await prisma.post.update({
    where: { id: Number(id) },
    data: { published: true },
  })
  res.json(post)
})

app.delete('/post/:id', async (req, res) => {
  const { id } = req.params
  const post = await prisma.post.delete({
    where: { id: Number(id) },
  })
  res.json(post)
})

app.listen(port, () => {
  console.log('Server running on port 4000')
})
