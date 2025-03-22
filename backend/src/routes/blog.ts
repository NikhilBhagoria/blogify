import { createBlogInput, updateBlogInput } from '@nikhilbhagoria/medium-common';
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const blogRouter = new Hono<{
    Bindings: {
      DATABASE_URL: string;
      JWT_SECRET: string;
    },
    Variables:{
      userId:string;
    }
  }>();

  blogRouter.use("/*",async (c,next)=>{
    try{    
    const token = c.req.header("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return c.json({ message: "Unauthorized" }, 401)
    }
    const decoded = await verify(token, c.env.JWT_SECRET)
    if (!decoded) {
      return c.json({ message: "Unauthorized" }, 401)
    }
    c.set("userId", decoded.id)
    await next()
    }catch(error){
        return c.json({ message: "Unauthorized" }, 401)
    }
  })

  blogRouter.post("/", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate())
      try{
        const body = await c.req.json();
        const {success} = createBlogInput.safeParse(body);
        if(!success){
          return c.json({
            message:"Input not correct"
          },411)
        }
        const user = await prisma.user.findUnique({
            where:{id:c.get("userId")}
        })
        if(!user){
            return c.json({message:"User not found"},404)
        }
        const blog = await prisma.blog.create({
            data:{
              title:body.title,
              content:body.content,
              authorId:user.id
            }
        })
        return c.json(blog)
      }catch(error){
        console.log("err",error)
        return c.json({message:"Internal Server Error"},500)
      }
  })

  blogRouter.put("/", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate())
      try{
        const {id,title,content} = await c.req.json()
        const {success} = updateBlogInput.safeParse({id,title,content});
        if(!success){
          return c.json({
            message:"Input not correct"
          },411)
        }
        const blog = await prisma.blog.update({
            where:{
              id
            },
            data:{
              title,
              content
            }
        })
        return c.json(blog)
      }catch(error){
        return c.json({message:"Internal Server Error"},500)
      } 
  })

  blogRouter.get('/bulk',async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try {
      const blogs = await prisma.blog.findMany();
      if(!blogs)
        return c.json({message:"Internal Server Error"},500);
      
      return c.json({
        blogs
      })
    } catch (error) {
      return c.json({message:"Internal Server Error"},500);
    }
  })
  
  blogRouter.get('/:id', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate())
      try {
        const id = c.req.param("id");
        const blog = await prisma.blog.findUnique({
            where:{
                id
            }
            // it can response send only published data
            // select:{
            //   published: true,
            // }
        })
        return c.json({
            blog
        });
      } catch (error) {
        return c.json({message:"Internal Server Error"},500);
      }
  })
  