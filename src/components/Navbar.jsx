import { Fragment, useContext } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import avatar from "../assets/icons/avatar.png";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Switch from "./Switch";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { logOut, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
    navigate("/login");
  };

  return (
    <>
      <Disclosure as="nav" className="bg-white dark:bg-gray-900 fixed top-0 z-20 w-full shadow-md">
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between items-center">
                {/* Logo / Brand */}
                <div className="flex-shrink-0">
                  <Link className="text-2xl font-bold text-red-500" to="/">
                    CollaborationApp
                  </Link>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-4">
                  {currentUser && (
                    <>
                      <Link
                        to="/dashboard"
                        className="text-gray-700 dark:text-gray-200 hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/projects"
                        className="text-gray-700 dark:text-gray-200 hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Projects
                      </Link>
                      <Link
                        to="/messages"
                        className="text-gray-700 dark:text-gray-200 hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Chat
                      </Link>
                    </>
                  )}
                  <Switch />
                </div>

                {/* Profile dropdown */}
                <div className="flex items-center ml-4">
                  {currentUser ? (
                    <Menu as="div" className="relative">
                      <div>
                        <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                          <span className="sr-only">Open user menu</span>
                          <img
                            className="h-8 w-8 rounded-full"
                            src={currentUser.photoURL || avatar}
                            alt="user"
                            referrerPolicy="no-referrer"
                          />
                        </Menu.Button>
                      </div>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="px-4 py-2 text-gray-700 dark:text-gray-200">
                            Hello, <span className="capitalize">{currentUser.displayName}</span>
                          </div>
                          <Menu.Item>
                            {({ active }) => (
                              <span
                                onClick={handleLogout}
                                className={classNames(
                                  active ? "bg-gray-100 dark:bg-gray-700" : "",
                                  "block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 cursor-pointer"
                                )}
                              >
                                Log out
                              </span>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  ) : (
                    <div className="flex space-x-2">
                      <Link
                        to="/login"
                        className="text-gray-700 dark:text-gray-200 hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="text-gray-700 dark:text-gray-200 hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </Disclosure>
      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>
    </>
  );
}
