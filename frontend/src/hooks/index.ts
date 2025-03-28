import axios from "axios";
import { useEffect, useState } from "react"
import { BACKEND_URL } from "../config";

export const useBlogs = () =>{
    const [loading,setLoading] = useState(true);
    const [blogs,setBlogs] =  useState([]);

    useEffect(()=>{
        const token = localStorage.getItem("token");
        axios.get(`${BACKEND_URL}/api/v1/blog/bluk`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        .then(response =>{
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
