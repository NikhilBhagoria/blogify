import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context, Next } from "hono";
import { verify } from "hono/jwt";

export async function jwtMiddleware (c: Context, next: Next){
    try {
      const authHeader = c.req.header("Authorization")
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return c.json({ message: "Missing or invalid Authorization header" }, 401);
      }
      const token = authHeader.replace("Bearer ", "");
      if (!token) {
        return c.json({ message: "Unauthorized" }, 401)
      }
      const decoded = await verify(token, c.env.JWT_SECRET);
      if (!decoded) {
        return c.json({ message: "Unauthorized" }, 401)
      }

      const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.id as string } 
      });
      
      if (!user || user.isDeleted) {
        return c.json({ message: "User not found or deactivated" }, 401);
      }
  

      c.set("userId", decoded.id as string)
      await next()
    } catch (error) {
      console.log("erro------------",error);
      return c.json({ message: "Unauthorized" }, 401)
    }
  }