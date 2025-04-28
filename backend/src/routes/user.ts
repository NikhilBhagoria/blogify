import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign, verify } from "hono/jwt";
import { signinInput, signupInput, SignupInput } from '@nikhilbhagoria/medium-common';
import { jwtMiddleware } from '../jwt-middleware/jwt-middleware';

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string
    JWT_SECRET: string
  }
}>()

userRouter.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();
    const { success } = signupInput.safeParse(body);
    if (!success) {
      return c.json({ message: "Input not correct" }, 411);
    }

    const { username, password, name } = body;
    const user = await prisma.user.findUnique({
      where: {
        email: username,
      }
    });

    // Check if user exists and is not deleted
    if (user && !user.isDeleted) {
      return c.json({
        message: "User already exists",
      }, 400);
    }

    // If user exists but is deleted, update the existing record
    if (user && user.isDeleted) {
      const updatedUser = await prisma.user.update({
        where: { email: username },
        data: {
          name,
          password, // Should hash password here
          isDeleted: false,
          bio: "No bio yet"
        }
      });

      const token = await sign({
        id: updatedUser.id,
        email: updatedUser.email,
      }, c.env.JWT_SECRET);

      return c.json({
        token,
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          bio: updatedUser.bio // Added bio to match the create flow
        }
      }, 200); // Changed to 200 to match the create flow
    }

    // Create new user if doesn't exist
    const newUser = await prisma.user.create({
      data: {
        email: username,
        password, // Should hash password here
        name,
        bio: "No bio yet" // Add default bio to match the update flow
      }
    });

    const token = await sign({
      id: newUser.id,
      email: newUser.email,
    }, c.env.JWT_SECRET);

    return c.json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        bio: newUser.bio,
      },
    }, 201); // Changed to 201 (Created) for new resource creation
  } catch (error) {
    console.error("Signup error:", error);
    return c.json({
      message: 'Failed to create user',
    }, 500);
  }
});


userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  try {
    const body = await c.req.json();
    const { success } = signinInput.safeParse(body);
    if (!success) {
      return c.json({ message: "Enter correct email and password" }, 411);
    }
    const { username, password } = body;
    const user = await prisma.user.findUnique({
      where: {
        email: username,
        isDeleted: false,
      }
    })
    if (!user) {
      return c.json({
        message: 'Invalid credentials',
      }, 400)
    }
    if (user.password !== password) {
      return c.json({
        message: 'Invalid credentials',
      }, 400)
    }
    const token = await sign({
      id: user.id,
      email: user.email,
    }, c.env.JWT_SECRET)
    return c.json({
      token,
      user: {
        id: user.id,
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


// Update user profile
userRouter.put("/profile", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  try {
    const token = c.req.header("Authorization")?.split(" ")[1];
    if (!token) {
      return c.json({
        message: "Unauthorized",
      }, 401)
    }
    const decoded = await verify(token, c.env.JWT_SECRET)
    if (!decoded) {
      return c.json({
        message: "Unauthorized",
      }, 401)
    }
    const { name, bio } = await c.req.json();
    const user = await prisma.user.update({
      where: {
        id: decoded.id,
      },
      data: {
        name,
        bio,
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
      },
    });
    return c.json({
      success: true,
      user
    })
  } catch (error) {
    return c.json({
      message: "Internal server error",
    }, 500)
  }
})

// Protected routes - require authentication
// Apply JWT middleware only to routes that need authentication
userRouter.use('/me', jwtMiddleware);
userRouter.use('/delete', jwtMiddleware);

// Get User Profile
userRouter.get("/me", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  try {
    const decoded = c.get('userId') as string;

    const user = await prisma.user.findUnique({
      where: {
        id: decoded as string,
        isDeleted: false
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
      },
    })

    if (!user) {
      return c.json({ message: "User not found" }, 404);
    }
    return c.json({
      success: true,
      user
    })
  } catch (error) {
    return c.json({
      success: false,
      message: "Internal server error",
    }, 500)
  }
})


// Delete User
userRouter.delete("/delete", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  const userId = c.get('userId') as string;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }
    if (user.isDeleted) {
      return c.json({ error: 'Account already deleted' }, 400);
    }
    // First soft delete all user's blogs
    await prisma.blog.updateMany({
      where: { authorId: userId },
      data: { isDeleted: true }
    });

    // Then soft delete the user
    await prisma.user.update({
      where: { id: userId },
      data: { isDeleted: true }
    });

    return c.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return c.json({
      success: false,
      error: 'Failed to delete account'
    }, 500);
  }
})