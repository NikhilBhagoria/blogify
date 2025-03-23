import { BlogCard } from "../components/BlogCard"

export const Blogs = () => {
    return (
        <div>
            <div className="flex justify-center">
                <div>
                    {/* {blogs.map(blog => <BlogCard
                    id={blog.id}
                    authorName={blog.author.name || "Anonymous"}
                    title={blog.title}
                    content={blog.content}
                    publishedDate={"2nd Feb 2024"}
                />)} */}
                    <BlogCard
                        id={1}
                        authorName="nk"
                        title="title of the blog title of the blog title of the blog title of the blog title of the blog title of the blog title of the blog title of the blog title of the blog title of the blog title of the blog title of the blog"
                        content="contect of the blog contect of the blogcontect of the blogcontect of the blogcontect of the blogcontect of the blogcontect of the blog"
                        publishedDate="2nd feb 2025"
                    />
                </div>
            </div>
        </div>
    )
}