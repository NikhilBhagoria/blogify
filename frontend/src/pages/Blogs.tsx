import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard"
import { AllBlogSkeleton } from "../components/BlogSkeleton";
import { Blog, useBlogs } from "../hooks"

export const Blogs = () => {
    const {blogs,loading} = useBlogs();
    if(loading){
        return (
            <div>
              <Appbar />{" "}
              <div className="flex justify-center items-center m-5 flex-col lg:ml-[100px] gap-5">
                <AllBlogSkeleton />
                <AllBlogSkeleton />
                <AllBlogSkeleton />
                <AllBlogSkeleton />
              </div>
            </div>
          );
    }
    return (
        <div>
            <Appbar/>
            <div className="flex flex-col items-center h-screen mt-5 md:mt-10">
                    {blogs?.map((blog:Blog) => <BlogCard
                    key={blog.id}
                    id={blog.id}
                    authorName={blog.author.name || "Anonymous"}
                    title={blog.title}
                    content={blog.content}
                    publishedDate={blog.createdAt}
                />)}
            </div>
        </div>
    )
}