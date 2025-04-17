import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign, verify } from "hono/jwt";
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
      user: {
        name: newUser.name,
        email: newUser.email,
        bio: newUser.bio,
      },
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
        message: "The email address you entered isn't connected to an account.",
      }, 400)
    }
    if (user.password !== password) {
      return c.json({
        message: "The password that you've entered is incorrect.",
      }, 400)
    }
    const token = await sign({
      id: user.id,
      email: user.email,
    }, c.env.JWT_SECRET)
    return c.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        bio: user.bio,
      },
    })
    } catch (error) {
      return c.json({
        message: "Internal server error",
      }, 500)
    }
  })

userRouter.put("/profile", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  try{
    const token = c.req.header("Authorization")?.split(" ")[1];
    if(!token){
      return c.json({
        message: "Unauthorized",
      }, 401)
    }
    const decoded = await verify(token, c.env.JWT_SECRET)
    if(!decoded){
      return c.json({
        message: "Unauthorized",
      }, 401)
    }
    const {bio} = await c.req.json();
    const user = await prisma.user.update({
      where: {
        id: decoded.id,
      },
      data: {
        bio,
      },
    })
    return c.json({
      message: "Profile updated successfully",
    })
  } catch (error) {
    return c.json({
      message: "Internal server error",
    }, 500)
  }
})

userRouter.get("/me", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  try{
  const token = c.req.header("Authorization")?.split(" ")[1];
  if(!token){
    return c.json({
      message: "Unauthorized",
    }, 401)
  }
  const decoded = await verify(token, c.env.JWT_SECRET)
  if(!decoded){
    return c.json({
      message: "Unauthorized",
    }, 401)
  }
  const user = await prisma.user.findUnique({
    where: {
      id: decoded.id,
    },
    select: {
      name: true,
      email: true,
      bio: true,
    },
  })
  return c.json({
    user,
  })
} catch (error) {
  return c.json({
    message: "Internal server error",
  }, 500)
}
})
