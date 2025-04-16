import { Link } from "react-router"
import { Avatar } from "./Avatar"
import logo from "../assets/logo.jpg"
import { useState, useEffect, useRef } from "react";

export const Appbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/signin';
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return <div className="border-b flex justify-between px-10 py-4 bg-black">
        <Link to={'/blogs'} className="flex flex-row items-center justify-center cursor-pointer gap-2">
            <img src={logo} alt="logo" className="w-10 h-10" />
            <span className="text-white text-2xl font-bold">Blogify</span>
        </Link>
        <div className="flex flex-row items-center justify-center">
            <Link to="/publish">
                <button
                    type="button"
                    className="cursor-pointer mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center"
                >
                    Write
                </button>
            </Link>

            <div className="relative" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={toggleDropdown}
                    className="cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                >
                    <Avatar size="big" name={user.name} />
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Profile
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        </div>
    </div>
}