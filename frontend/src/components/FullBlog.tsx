import { memo, useEffect, useRef, useState } from "react";
import { Blog } from "../hooks";
// import { Avatar } from "./Avatar";
import { useNavigate } from "react-router";
import { BACKEND_URL } from "../config";

const FullBlog = ({ blog }: { blog: Blog }) => {
  const currentUserId = JSON.parse(localStorage.getItem("user") || "{}").id;
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const deleteRef = useRef<HTMLDivElement>(null);
  const paragraphs: string[] = blog.content.split(".");
  const navigate = useNavigate();


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  // Click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (deleteRef.current && !deleteRef.current.contains(event.target as Node)) {
        setIsDeleting(false);
      }
    };

    // Only add the event listener when the modal is open
    if (isDeleting) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDeleting]);


  const handleDeleteBlog = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/blog/${blog.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log("res", response)
      if (response.ok) {
        navigate('/blogs'); // Redirect to blogs list
      } else {
        console.log("Failed to delete blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("An error occurred while deleting the blog");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="pt-8 md:pt-12">
        <div className="grid grid-cols-12 px-[8%] md:px-[12%] w-full max-w-screen-2xl">
          <div className="col-span-12">
            <div className="md:text-5xl text-3xl w-full font-extrabold wrap-break-word text-center">
              {blog.title}
            </div>
            {/* <div className="text-slate-500 pt-2">Posted on 2nd dec 2023 </div> */}
            <div className={`mt-4 md:mt-8 flex  border-b-2 border-gray-100 ${currentUserId && blog.author.id === currentUserId ? 'justify-between' : 'justify-center'}`}>
              <div className="flex items-center text-gray-700 pb-5 ">
                <div className="rounded-full bg-gray-400 text-white w-7 h-7 flex justify-center items-center text-sm mr-2">
                  {blog?.author.name?.[0] || "A"}
                </div>
                <div className="">{blog?.author.name || "Anonymous"}</div>
                <div className="text-sm pl-2">
                  <p className="flex flex-row items-center text-slate-600 dark:text-slate-400">
                    <svg className="mr-2 h-5 w-5 fill-current opacity-75" viewBox="0 0 576 512"><path d="M540.9 56.77c-45.95-16.66-90.23-24.09-129.1-24.75-60.7.94-102.7 17.45-123.8 27.72-21.1-10.27-64.1-26.8-123.2-27.74-40-.05-84.4 8.35-129.7 24.77C14.18 64.33 0 84.41 0 106.7v302.9c0 14.66 6.875 28.06 18.89 36.8 11.81 8.531 26.64 10.98 40.73 6.781 118.9-36.34 209.3 19.05 214.3 22.19C277.8 477.6 281.2 480 287.1 480c6.52 0 10.12-2.373 14.07-4.578 10.78-6.688 98.3-57.66 214.3-22.27 14.11 4.25 28.86 1.75 40.75-6.812C569.1 437.6 576 424.2 576 409.6V106.7c0-22.28-14.2-42.35-35.1-49.93zM272 438.1c-24.95-12.03-71.01-29.37-130.5-29.37-27.83 0-58.5 3.812-91.19 13.77-4.406 1.344-9 .594-12.69-2.047C34.02 417.8 32 413.1 32 409.6V106.7c0-8.859 5.562-16.83 13.86-19.83C87.66 71.7 127.9 63.95 164.5 64c51.8.81 89.7 15.26 107.5 23.66V438.1zm272-28.5c0 4.375-2.016 8.234-5.594 10.84-3.766 2.703-8.297 3.422-12.69 2.125C424.1 391.6 341.3 420.4 304 438.3V87.66c17.8-8.4 55.7-22.85 107.4-23.66 35.31-.063 76.34 7.484 118.8 22.88 8.2 3 13.8 10.96 13.8 19.82v302.9z"></path></svg>
                    {Math.ceil((blog?.content?.length || 0) / 700)} min
                    read
                  </p>
                </div>
              </div>
              {currentUserId && blog.author.id === currentUserId && <div className="cursor-pointer relative" ref={dropdownRef}>
                <svg onClick={() => setIsOpen(!isOpen)} fill="#000000" height="25px" width="25px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 32.055 32.055" xmlSpace="preserve" transform="rotate(90)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M3.968,12.061C1.775,12.061,0,13.835,0,16.027c0,2.192,1.773,3.967,3.968,3.967c2.189,0,3.966-1.772,3.966-3.967 C7.934,13.835,6.157,12.061,3.968,12.061z M16.233,12.061c-2.188,0-3.968,1.773-3.968,3.965c0,2.192,1.778,3.967,3.968,3.967 s3.97-1.772,3.97-3.967C20.201,13.835,18.423,12.061,16.233,12.061z M28.09,12.061c-2.192,0-3.969,1.774-3.969,3.967 c0,2.19,1.774,3.965,3.969,3.965c2.188,0,3.965-1.772,3.965-3.965S30.278,12.061,28.09,12.061z"></path> </g> </g></svg>
                {isOpen && (
                  <div className="absolute mt-2 bg-white rounded-md shadow-md py-1 z-50 right-0">
                    <ul className="flex flex-col gap-2">
                      <li className="cursor-pointer hover:bg-gray-100 px-4 py-2 rounded-md" onClick={() => navigate(`/edit/${blog.id}`)}>Edit</li>
                      <li className="cursor-pointer hover:bg-gray-100 px-4 py-2 rounded-md" onClick={() => setIsDeleting(true)}>Delete</li>
                    </ul>
                  </div>
                )}
              </div>}

            </div>
            {isDeleting && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-400/50 z-50">
                <div ref={deleteRef} className="bg-white rounded-md w-full max-w-md p-6 space-y-4">
                  <div className="text-xl font-bold">Are you sure you want to delete this blog?</div>
                  <div className="w-full">
                    <div className="flex gap-2">
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                        onClick={handleDeleteBlog}
                      >
                        Delete
                      </button>
                      <button
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                        onClick={() => setIsDeleting(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paragraphs.map((content: string, index: number) => (
              <div key={index} className="pt-2 md:pt-4 w-full">
                {content}
              </div>
            ))}
          </div>
          {/* <div className="col-span-12 md:col-span-4 mt-8 md:mt-0">
            <div className="text-slate-500 text-lg">Author</div>
            <div className="flex w-full flex-col md:flex-row">
              <div className="pr-2 flex flex-col justify-center">
                <Avatar size={"big"} name={blog.author.name || "Anonymous"} />
              </div>
              <div>
                <div className="text-xl font-bold">
                  {blog.author.name || "Anonymous"}
                </div>
                <div className="pt-2 text-slate-500">
                  {blog.author.bio}
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default memo(FullBlog);