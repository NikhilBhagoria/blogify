import { Link } from "react-router"
import { Avatar } from "./Avatar"
import logo from "../assets/logo.jpg"

export const Appbar = () => {

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/signin';
    };
    return <div className="border-b flex justify-between px-10 py-4 bg-black">
        <Link to={'/blogs'} className="flex flex-row items-center justify-center cursor-pointer gap-2">
            <img src={logo} alt="logo" className="w-10 h-10" />
            <span className="text-white text-2xl font-bold">Blogify</span>
        </Link>
        <div>
            <Link to={`/publish`}>
                <button type="button" className="cursor-pointer mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 ">New</button>
            </Link>
            <div className="relative group">
                <Avatar
                    size={"big"}
                    name="harkirat"
                />

                <ul className="absolute hidden group-hover:block right-0 z-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600">
                    <li>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
                        >
                            Logout
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
}