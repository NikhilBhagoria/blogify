import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";

export const userRouter = new Hono<{
    Bindings: {
      DATABASE_URL: string
      JWT_SECRET: string
    }
  }>()

userRouter.post("/signup", async (c) => {
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
    try {
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
    } catch (error) {
      return c.json({
        message: "User already exists",
      }, 400)
    }
  })
  userRouter.post("/signin", async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
  
    try {
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
    } catch (error) {
      return c.json({
        message: "Internal server error",
      }, 500)
    }
  })
