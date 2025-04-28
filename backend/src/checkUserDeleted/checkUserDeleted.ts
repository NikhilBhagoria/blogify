import { Context, Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from "@prisma/extension-accelerate";

export async function checkUserDeleted(c: Context, next: Function) {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate())

        const token = c.req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return await next();
        }

        const user = await prisma.user.findUnique({
            where: { id: c.get("userId") as string },
        });
        console.log("user ", user);
        if (!user) {
            return c.json({ message: 'User not found' }, 404);
        }

        if (user.isDeleted) {
            return c.json({ message: 'User is deleted' }, 410); // 410 Gone
        }

        // If not deleted, set user in context for future use
        c.set('user', user);

        await next();
    } catch (e) {
        console.log("err", e);
        return c.json({ message: "Internal server error" }, 500);
    }
}