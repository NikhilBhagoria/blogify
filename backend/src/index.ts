import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string
    JWT_SECRET: string
  }
}>()

//c => context
app.post("/api/v1/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const body = await c.req.json();

  const { email, password, name } = body;
  const user = await prisma.user.findUnique({
    where: {
      email,
    }
  })
  if (user) {
    return c.json({
      message: "User already exists",
    }, 400)
  }
  const newUser = await prisma.user.create({
    data: {
      email,
      password,
      name,
    }
  })

  const token = await sign({
    id: newUser.id,
    email: newUser.email,
  }, c.env.JWT_SECRET)

  return c.json({
    token,
  })
})
app.post("/api/v1/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const body = await c.req.json();
  const { email, password } = body;
  const user = await prisma.user.findUnique({
    where: {
      email,
    }
  })
  if (!user) {
    return c.json({
      message: "User not found",
    }, 400)
  }
  if (user.password !== password) {
    return c.json({
      message: "Invalid password",
    }, 400)
  }
  const token = await sign({
    id: user.id,
    email: user.email,
  }, c.env.JWT_SECRET)
  return c.json({
    token,
  })
})
app.post("/api/v1/blog", (c) => {
  return c.text("post");
})
app.put("/api/v1/blog", (c) => {
  return c.text("post");
})

app.get('/api/v1/blog/:id', (c) => {
  return c.text('Hello Hono!')
})

export default app
