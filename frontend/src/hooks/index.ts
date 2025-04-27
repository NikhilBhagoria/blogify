import axios from "axios";
import { useEffect, useState } from "react"
import { BACKEND_URL } from "../config";

export interface Blog{
    "content":string,
    "title":string,
    "id":string,
    "author":{
        "name":string,
        "bio":string,
        "id":string
    },
    "createdAt":string
}

export const useBlog = ({id}: {id:string}) =>{
    const [loading,setLoading] = useState(true);
    const [blog,setBlog] = useState<Blog| null>(null);
    const [error,setError] = useState<string | null>(null);

    useEffect(()=>{
        const token = localStorage.getItem("token");
        if(!id){
            setError("Blog ID is required");
            setLoading(false);
            return;
        }
        axios.get(`${BACKEND_URL}/api/v1/blog/${id}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        .then(response =>{
            setBlog(response.data.blog);
            setLoading(false);
            setError(null);
        })
        .catch(error => {
            const statusCode = error.response?.status;
            if(statusCode === 404){
                setError("Blog not found");
            }else{
                setError("An error occurred while fetching the blog");
            }
            console.error("Error fetching blogs:", error);
            setLoading(false);
            setBlog(null);
        })
        .finally(()=>{
            setLoading(false);
        })
    },[id])
    return{ loading,blog,error};
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

export interface User{
    "name":string,
    "email":string,
    "bio":string
}
export const useUser = () =>{
    const [user,setUser] = useState<User>();
    useEffect(()=>{
        const token = localStorage.getItem("token");
        axios.get(`${BACKEND_URL}/api/v1/user/me`,{
            headers:{
                "Authorization":`Bearer ${token}`
            }
        })
        .then(response =>{
            setUser(response.data.user);
        })
        .catch(error => {
            console.error("Error fetching user:", error);
        });
    },[])
    return {user,setUser}
}
