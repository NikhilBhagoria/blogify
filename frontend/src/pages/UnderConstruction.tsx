import { Link } from 'react-router'

const UnderConstruction = ({ pageName = "Page" }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-gray-50">
      <div className="w-24 h-24 mb-6">
        {/* Construction icon */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
          <path d="M2 18h20M2 6h20M12 2v20M7 8l10 8M17 8L7 16" />
        </svg>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Under Construction</h1>
      <p className="text-lg text-gray-600 mb-8">
        Our {pageName} is currently being built. We're working hard to make it awesome!
      </p>
      
      <div className="w-full max-w-md h-4 bg-gray-200 rounded-full mb-8">
        <div className="h-full bg-yellow-500 rounded-full w-2/3"></div>
      </div>
      
      <Link 
        to="/blogs" 
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Return to Blogs
      </Link>
    </div>
  )
}

export default UnderConstruction