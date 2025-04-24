import { Link } from "react-router";
import { Avatar } from "./Avatar";
interface BlogCardProps {
    authorName: string;
    title: string;
    content: string;
    publishedDate: string;
    id: string;
}

export const BlogCard = ({
    id,
    authorName,
    title,
    content,
    publishedDate
}: BlogCardProps) => {
    return <Link to={`/blog/${id}`} className="w-full md:w-1/2 cursor-pointer mx-2 md:mx-0 px-3 md:px-0 mb-4 md:mb-0">
    <div className="flex items-center mb-1 md:mb-2 mt-4 md:mt-8">
        <Avatar name={authorName} />
      {/* <div className="text-white w-7 h-7 flex justify-center items-center text-sm mr-2">
      </div> */}
      <div className="font-semibold ml-2 pr-2">{authorName} </div>
      <div className="text-gray-700 text-sm">&#x2022; {formatDate(publishedDate)}</div>
    </div>
    <div className="font-extrabold text-2xl md:text-3xl mb-2 md:mb-3">{title}</div>
    <div className="font-medium font-serif pb-2 md:pb-4">
      {content.length > 190 ? content.slice(0, 190) + "..." : content}
    </div>
    <div className="pb-2 md:pb-4 border-b-2 border-gray-100">
      <div className="bg-gray-100 text-xs w-fit font-medium rounded-xl px-2 py-1">
        {Math.ceil(content.length / 700)} min read
      </div>
    </div>
  </Link>
}

export function Circle() {
    return <div className="h-1 w-1 rounded-full bg-slate-500">

    </div>
}

const formatDate = (isoString:string) => {
  if (!isoString) {
    return ""; 
  }
  
  try {
    const date = new Date(isoString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "";
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return ""; 
  }
}
