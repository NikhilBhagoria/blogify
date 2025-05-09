import { createBlogInput, updateBlogInput } from '@nikhilbhagoria/medium-common';
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { jwtMiddleware } from '../jwt-middleware/jwt-middleware';

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  },
  Variables: {
    userId: string;
  }
}>();

blogRouter.use("/*", jwtMiddleware);
// Create a Prisma client function to avoid repeating the same code
const getPrismaClient = (databaseUrl:any) => {
  return new PrismaClient({
    datasourceUrl: databaseUrl,
  }).$extends(withAccelerate());
};

blogRouter.post("/", async (c) => {
    const prisma = getPrismaClient(c.env.DATABASE_URL);

  try {
    const body = await c.req.json();
    const { success } = createBlogInput.safeParse(body);
    if (!success) {
      return c.json({
        message: "Input not correct"
      }, 411)
    }
    const user = await prisma.user.findUnique({
      where: { id: c.get("userId") as string }
    })
    if (!user) {
      return c.json({ message: "User not found" }, 404)
    }
    const blog = await prisma.blog.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: user.id
      }
    })
    return c.json(blog)
  } catch (error) {
    return c.json({ message: "Internal Server Error" }, 500)
  }
})

// update blog
blogRouter.put("/:id", async (c) => {
    const prisma = getPrismaClient(c.env.DATABASE_URL);

  try {
    const { title, content } = await c.req.json()
    const id = c.req.param("id")
    
    const { success } = updateBlogInput.safeParse({ id, title, content });
    if (!success) {
      return c.json({
        message: "Input not correct"
      }, 411)
    }

    const existingBlog = await prisma.blog.findUnique({
      where: { id: id as string , isDeleted:false}
    })
    if (!existingBlog) {
      return c.json({ message: "Blog not found" }, 404)
    }
    if(existingBlog.authorId !== c.get("userId")){
      return c.json({ message: "Unauthorized" }, 403)
    }

    const blog = await prisma.blog.update({
      where: {
        id
      },
      data: {
        title,
        content
      },
      include:{
        author:{
          select:{
            id:true,
            name:true,
            bio:true
          }
        }
      }
    })
    return c.json({blog})
  } catch (error) {
    console.log("error",error)
    return c.json({ message: "Internal Server Error" }, 500)
  }
})

// get all blogs
blogRouter.get('/bulk', async (c) => {
  console.log("enter bulk")
    const prisma = getPrismaClient(c.env.DATABASE_URL);

  try {
    const blogs = await prisma.blog.findMany({
      where:{
        isDeleted: false,
        author:{
          isDeleted:false
        }
      },
      select: {
        content: true,
        title: true,
        id: true,
        author: {
          select: {
            id: true,
            name: true,
            bio: true
          }
        },
        createdAt:true
      },
      orderBy:{
        createdAt: "desc"
      },
    });
    if (!blogs)
      return c.json({ message: "Internal Server Error" }, 500);
    return c.json({
      blogs:blogs
    },200)
  } catch (error) {
    return c.json({ message: "Internal Server Error" }, 500);
  }
})

blogRouter.get('/:id', async (c) => {
    const prisma = getPrismaClient(c.env.DATABASE_URL);

  try {
    const id = c.req.param("id");
    const blog = await prisma.blog.findUnique({
      where: {
        id,
        isDeleted: false,
        author:{
          isDeleted:false
        }
      },
      select:{
        id:true,
        title:true,
        content:true,
        author:{
          select:{
            id:true,
            name:true,
            bio:true
          }
        },
        createdAt:true
      }
      // it can response send only published data
      // select:{
      //   published: true,
      // }
    })
    if (!blog) {
      return c.json({ error: 'Blog not found' }, 404);
    }

    return c.json({
      blog
    });
  } catch (error) {
    return c.json({ message: "Internal Server Error" }, 500);
  }
})


// DELETE /:id - Delete a blog (soft delete)
blogRouter.delete('/:id', async (c) => {
    const prisma = getPrismaClient(c.env.DATABASE_URL);
  const id = c.req.param('id');
  const userId = c.get('userId') as string;
  try {
    // First find the blog to verify ownership
    const blog = await prisma.blog.findUnique({
      where: { id: id as string, isDeleted:false }
    });
    if (!blog) {
      return c.json({ error: 'Blog not found' }, 404);
    }
    
    // Check if user is the author
    if (blog.authorId !== userId) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    // Soft delete the blog (set isDeleted to true)
    await prisma.blog.update({
      where: { id: id as string },
      data: { isDeleted: true }
    });
    
    return c.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return c.json({ error: 'Failed to delete blog' }, 500);
  }
});