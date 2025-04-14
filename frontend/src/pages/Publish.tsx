import { ChangeEvent, useState, useCallback } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { BACKEND_URL } from '../config'

const Publish = () => {
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const publishPost = useCallback(async () => {
    if (title == "" || description == "") {
      return toast.error("Please fill all inputs");
    }
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/blog`,
      {
        title,
        content: description,
      },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    refresh();
    navigate(`/blog/${response.data.id}`);
  }, [title, description]);
  
  return (
    <div>
      <TextEditor
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
    </div>
  )
}

function TextEditor({
  onChange,
  value,
}: {
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  value: string;
}) {
  return (
    <>
      <div>
        <div className="w-full mb-4 border border-gray-300 rounded-xl ml-2.5">
          <div className="flex items-center justify-between  border-gray-600">
            {/* <div className="flex flex-wrap items-center sm:divide-x sm:rtl:divide-x-reverse  divide-gray-600"></div> */}
          </div>

          <div className="p-2 rounded-b-lg">
            <label htmlFor="editor" className="sr-only">
              Publish post
            </label>
            <textarea
              value={value}
              onChange={onChange}
              id="editor"
              rows={8}
              className="block w-full px-0 text-sm focus:outline-none text-gray-800 bg-white  placeholder-gray-400"
              placeholder="Write an article..."
              required
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Publish