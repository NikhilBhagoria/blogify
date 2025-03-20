  import { Hono, Context, Next } from 'hono'
import { verify } from 'hono/jwt'
import { userRouter } from './routes/user'
import { blogRouter } from './routes/blog'
import { cors } from 'hono/cors'
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string
    JWT_SECRET: string
  }
}>()

// const authMiddleware = async (c: Context, next: Next) => {
//   const token = c.req.header("Authorization")?.replace("Bearer ", "")
//   if (!token) {
//     return c.json({ message: "Unauthorized" }, 401)
//   }
//   const decoded = await verify(token, c.env.JWT_SECRET)
//   if (!decoded) {
//     return c.json({ message: "Unauthorized" }, 401)
//   }
//   c.set("user", decoded.id)
//   await next()
// }

//c => context
app.use('/*', cors())
app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);

export default app
