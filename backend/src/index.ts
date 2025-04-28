  import { Hono } from 'hono'
import { userRouter } from './routes/user'
import { blogRouter } from './routes/blog'
import { cors } from 'hono/cors'
import { checkUserDeleted } from './checkUserDeleted/checkUserDeleted'

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
app.use('/*',checkUserDeleted);
app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);

// Error handling middleware
app.onError((err, c) => {
  console.error('Application error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

export default app
