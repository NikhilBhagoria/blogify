import axios from "axios";
import { useEffect, useState } from "react"
import { BACKEND_URL } from "../config";

export interface Blog{
    "content":string,
    "title":string,
    "id":string,
    "author":{
        "name":string,
        "bio":string
    },
    "createdAt":string
}

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
            setBlog(response.data.blog);
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
    return {user}
}
