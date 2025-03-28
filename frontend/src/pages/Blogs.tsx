import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard"
import { AllBlogSkeleton } from "../components/BlogSkeleton";
import { useBlogs } from "../hooks"

interface Blog{
        "content":string,
        "title":string,
        "id":string,
        "authorName":string,
        "publishedDate":string
}

export const Blogs = () => {
    const {blogs,loading} = useBlogs<Blog>();

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
            <div className="flex justify-center">
                <div>
                    {blogs?.map(blog => <BlogCard
                    id={blog.id}
                    authorName={blog.author.name || "Anonymous"}
                    title={blog.title}
                    content={blog.content}
                    publishedDate={"2nd Feb 2024"}
                />)}
                    {/* <BlogCard
                        id={1}
                        authorName="nk"
                        title="title of the blog title of the blog title of the blog title of the blog title of the blog title of the blog title of the blog title of the blog title of the blog title of the blog title of the blog title of the blog"
                        content="contect of the blog contect of the blogcontect of the blogcontect of the blogcontect of the blogcontect of the blogcontect of the blog"
                        publishedDate="2nd feb 2025"
                    /> */}
                </div>
            </div>
        </div>
    )
}