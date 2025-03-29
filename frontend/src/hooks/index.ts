import axios from "axios";
import { useEffect, useState } from "react"
import { BACKEND_URL } from "../config";

export const useBlog = ({id}: {id:string}) =>{
    const [loading,setLoading] = useState(true);
    const [blog,setBlog] = useState<Blog>();

    useEffect(()=>{
        const token = localStorage.getItem("token");
        axios.get(`${BACKEND_URL}/api/v1/blog/${id}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        .then(response =>{
            setBlog(response.data);
            setLoading(false);
        })
        .catch(error => {
            console.error("Error fetching blogs:", error);
            setLoading(false);
        });
    },[id])
    return{ loading,blog};
}


export const useBlogs = () =>{
    const [loading,setLoading] = useState(true);
    const [blogs,setBlogs] =  useState([]);

    useEffect(()=>{
        const token = localStorage.getItem("token");
        axios.get(`${BACKEND_URL}/api/v1/blog/bulk`,{
            headers:{
                "Authorization":`Bearer ${token}`,
                "Content-Type": "application/json",
            }
        })
        .then(response =>{
            console.log("resppp",response.data);
            setBlogs(response.data.blogs);
            setLoading(false);
        })
        .catch(error => {
            console.error("Error fetching blogs:", error);
            setLoading(false);
        });

    },[])
    return { loading,blogs}
}
