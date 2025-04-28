import { useParams, Link } from 'react-router';
import { useBlog } from '../hooks'
import { Appbar } from '../components/Appbar';
import { BlogSkeleton } from '../components/BlogSkeleton';
import FullBlog from '../components/FullBlog';

const Blog = () => {
  const {id} = useParams<{id:string}>();
  const {loading,blog,error} = useBlog({
    id:id || ""
  });
  return (
    <div>
      <Appbar />
      {loading ? (
        <div className="flex justify-around items-center">
          <BlogSkeleton />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Blog Not Found</h2>
          <p className="text-gray-600 mb-6">The blog you're looking for doesn't exist or has been removed.</p>
          <Link to="/blogs" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Browse Other Blogs
          </Link>
        </div>
      ) : blog ? (
        <FullBlog blog={blog} />
      ) : null}
    </div>
  );
};

export default Blog