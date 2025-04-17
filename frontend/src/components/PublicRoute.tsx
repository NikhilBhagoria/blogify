import React from 'react'
import { Navigate } from 'react-router';

const PublicRoute = ({children}: {children: React.ReactNode}) => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/blogs" />;
  }
  return children;
}

export default PublicRoute