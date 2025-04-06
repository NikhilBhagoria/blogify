import { useParams } from 'react-router';
import { useBlog } from '../hooks'
import { Appbar } from '../components/Appbar';
import { BlogSkeleton } from '../components/BlogSkeleton';
import FullBlog from '../components/FullBlog';

const Blog = () => {
  const {id} = useParams<{id:string}>();
  const {loading,blog} = useBlog({
    id:id || ""
  });
  if (loading || !blog) {
    return (
      <div>
        <Appbar />
        <div className="flex justify-around items-center ">
          <BlogSkeleton />
          <BlogSkeleton />
        </div>
      </div>
    );
  }
  return (
    <div><FullBlog/></div>
  )
}

export default Blog