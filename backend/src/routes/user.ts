import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import { signinInput, signupInput, SignupInput } from '@nikhilbhagoria/medium-common';

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
    const {success} = signupInput.safeParse(body);
    console.log("err",success,body);
    if(!success){
      return c.json({message:"Input not correct"},411);
    }
  
    const { username, password, name } = body;
    const user = await prisma.user.findUnique({
      where: {
        email:username,
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
        email:username,
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
    const {success} = signinInput.safeParse(body);
    if(!success){
      return c.json({message:"Input not correct"},411);
    }
    const { username, password } = body;
    const user = await prisma.user.findUnique({
      where: {
        email:username,
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
      email: user.username,
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
