import { ChangeEvent, useState, useCallback } from 'react'
import axios from 'axios'
// import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'
import { BACKEND_URL } from '../config'
import { Appbar } from '../components/Appbar'

const Publish = () => {
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const publishPost = useCallback(async () => {
    if (title == "" || description == "") {
      // return toast.error("Please fill all inputs");
      return alert("Please fill all inputs");
    }
    setIsLoading(true);
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/blog`,
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
    // refresh();
    navigate(`/blog/${response.data.id}`);
    setIsLoading(false);
  }, [title, description]);


  return <div>
    <Appbar />
    <div className="flex justify-center w-full pt-8">
      <div className="max-w-screen-lg w-full">
        <input onChange={(e) => {
          setTitle(e.target.value)
        }} type="text" className="text-4xl leading-none font-bold bg-gray-50 border border-gray-300 text-gray-900  rounded-lg focus:outline-none block w-full p-2.5" placeholder="Title..." />

        <TextEditor onChange={(e) => {
          setDescription(e.target.value)
        }} />
        <button onClick={publishPost} disabled={isLoading} type="submit" className={`mt-4 inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}>
          {isLoading ? "Publishing..." : "Publish post"}
        </button>
      </div>
    </div>
  </div>
}

function TextEditor({ onChange }: {onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void}) {
  return <div className="mt-2">
      <div className="w-full mb-4 border border-gray-300 rounded-xl">
          <div className="flex items-center justify-between">
          <div className="my-2 bg-white rounded-b-lg w-full">
              <label className="sr-only">Publish posts</label>
              <textarea onChange={onChange} id="editor" rows={8} className="focus:outline-none block w-full px-0 text-sm text-gray-800 bg-white border-0 pl-2" placeholder="Write an article..." required />
          </div>
      </div>
     </div>
  </div>
  
}

export default Publish