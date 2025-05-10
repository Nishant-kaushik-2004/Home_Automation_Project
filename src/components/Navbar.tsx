// components/layout/Navbar.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiChevronDown, FiUser, FiLogOut } from "react-icons/fi";
import sensorWatchIcon from "../sensorWatchIcon.png";

const Navbar = () => {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  // Animation variants
  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -5,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  const linkHoverAnimation = {
    rest: { width: 0 },
    hover: {
      width: "100%",
      transition: { duration: 0.3 },
    },
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex flex-shrink-0">
            <Link href="/" className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-2xl font-bold text-indigo-600"
              >
                <Image
                  src={sensorWatchIcon}
                  alt="Website Icon"
                  width={100}
                  height={100}
                />
              </motion.div>
            </Link>
            {/* Desktop navigation */}
            <div className="hidden md:block ">
              <div className="ml-16 flex items-baseline space-x-10">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <motion.div
                      className="relative inline-block font-medium text-gray-700"
                      initial="rest"
                      whileHover="hover"
                    >
                      {link.label}
                      <motion.div
                        className="absolute bottom-0 left-0 h-0.5 bg-indigo-600"
                        variants={linkHoverAnimation}
                      />
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Auth / User Profile */}
          <div className="flex items-center">
            {isLoading ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200"></div>
            ) : isAuthenticated && session?.user ? (
              <div className="relative" ref={profileDropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className="flex items-center space-x-3 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <div className="overflow-hidden rounded-full">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt="User profile"
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                        <FiUser className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="hidden items-center md:flex">
                    <FiChevronDown
                      className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${
                        isProfileDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </motion.button>

                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={dropdownVariants}
                      className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                      <div className="divide-y divide-gray-100 py-1">
                        <div className="px-4 py-3">
                          <p className="text-sm">Signed in as</p>
                          <p className="truncate text-sm font-medium text-gray-900">
                            {session.user.name || "User"}
                          </p>
                          <p className="truncate text-sm text-gray-500">
                            {session.user.email || ""}
                          </p>
                        </div>
                        <div className="py-1">
                          <Link href="/profile">
                            <div className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              <FiUser className="mr-3 h-4 w-4" />
                              Profile
                            </div>
                          </Link>
                          <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <FiLogOut className="mr-3 h-4 w-4" />
                            Sign out
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden space-x-3 md:flex">
                <Link
                  href="/auth/login"
                  className="rounded-md bg-white px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-gray-50"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="ml-2 inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <span className="sr-only">
                  {isMenuOpen ? "Close menu" : "Open menu"}
                </span>
                {isMenuOpen ? (
                  <FiX className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <FiMenu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="md:hidden"
          >
            <div className="space-y-1 divide-y divide-gray-200 px-2 pb-3 pt-2 shadow-inner">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-2 pl-3 pr-4 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                >
                  {link.label}
                </Link>
              ))}

              {!isAuthenticated && (
                <div className="flex flex-col space-y-2 px-3 py-3">
                  <Link
                    href="/auth/login"
                    className="rounded-md bg-white px-4 py-2 text-center text-sm font-medium text-indigo-600 hover:bg-gray-50"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="rounded-md bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    Sign up
                  </Link>
                </div>
              )}

              {isAuthenticated && session?.user && (
                <div className="px-3 py-3">
                  <div className="flex items-center space-x-3 pb-3">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt="User profile"
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                        <FiUser className="h-6 w-6" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {session.user.name || "User"}
                      </p>
                      <p className="truncate text-sm text-gray-500">
                        {session.user.email || ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 pt-2">
                    <Link
                      href="/profile"
                      className="rounded-md bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/auth/login" })}
                      className="rounded-md bg-red-50 px-4 py-2 text-center text-sm font-medium text-red-600 hover:bg-red-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
