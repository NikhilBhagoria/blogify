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

    return <div className="border-b flex justify-between px-3 py-2 md:px-4 md:py-3 bg-white mx-auto">
        <Link to={'/blogs'} className="flex flex-row items-center justify-center cursor-pointer gap-1 md:gap-2">
            <img src={logo} alt="logo" className="w-8 h-8 md:w-10 md:h-10 invert" />
            <span className="text-xl md:text-2xl font-bold">Blogify</span>
        </Link>
        <div className="ml-auto flex items-center gap-2 md:gap-4">
            <Link to="/publish">
                <button
                    type="button"
                    className="border border-gray-300 rounded-full px-4 py-1 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300"
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
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        </div>
    </div>
}