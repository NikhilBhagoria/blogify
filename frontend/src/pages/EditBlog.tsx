import { ChangeEvent, useState, useCallback, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router'
import { BACKEND_URL } from '../config'
import { Appbar } from '../components/Appbar'

const EditBlog = () => {
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [fetchingBlog, setFetchingBlog] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch the blog post data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        
        setTitle(response.data.blog.title);
        setDescription(response.data.blog.content);
        setFetchingBlog(false);
      } catch (error) {
        console.error("Error fetching blog:", error);
        alert("Failed to fetch blog post");
        navigate('/blogs');
      }
    };

    fetchBlog();
  }, [id, navigate]);

  const updatePost = useCallback(async () => {
    if (title === "" || description === "") {
      return alert("Please fill all inputs");
    }
    
    setIsLoading(true);
    try {
      await axios.put(
        `${BACKEND_URL}/api/v1/blog/${id}`,
        {
          title,
          content: description,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      navigate(`/blog/${id}`);
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("Failed to update blog post");
    } finally {
      setIsLoading(false);
    }
  }, [title, description, id, navigate]);

  if (fetchingBlog) {
    return (
      <div>
        <Appbar />
        <div className="flex justify-center items-center h-screen">
          <p>Loading blog post...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Appbar />
      <div className="flex justify-center w-full pt-8">
        <div className="max-w-screen-lg w-full">
          <input 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            className="text-4xl leading-none font-bold bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:outline-none block w-full p-2.5"
            placeholder="Title..." 
          />

          <TextEditor 
            value={description}
            onChange={(e) => setDescription(e.target.value)} 
          />
          
          <div className="flex gap-3">
            <button 
              onClick={updatePost} 
              disabled={isLoading} 
              className={`mt-4 inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isLoading ? "Updating..." : "Update post"}
            </button>
            
            <button 
              onClick={() => navigate(`/blog/${id}`)} 
              className="mt-4 inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-gray-900 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Updated TextEditor component that accepts a value prop
function TextEditor({ onChange, value }: {
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void,
  value?: string
}) {
  return (
    <div className="mt-2">
      <div className="w-full mb-4 border border-gray-300 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="my-2 bg-white rounded-b-lg w-full">
            <label className="sr-only">Edit post</label>
            <textarea 
              value={value} 
              onChange={onChange} 
              id="editor" 
              rows={8} 
              className="focus:outline-none block w-full px-0 text-sm text-gray-800 bg-white border-0 pl-2" 
              placeholder="Write an article..." 
              required 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditBlog;