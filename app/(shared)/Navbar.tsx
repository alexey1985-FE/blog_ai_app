"use client";
import Link from "next/link";
import React, { useEffect, useState, useRef, CSSProperties } from "react";
import Image from "next/image";
import SocialLinks from "./SocialLinks";
import Ad1 from "/public/assets/ad-1.jpg";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { MenuBtn } from "./MenuBtn";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import useMedia from "use-media";
import useGetUser from "@/utils/useGetUser";
import { useTheme } from "next-themes";
import { FiMoon } from "react-icons/fi";
import { BsSun } from "react-icons/bs";
import DeleteModal from "./DeleteModal";
import { deleteAccount } from "@/utils/deleteAuthUser";

interface MotionLinkProps {
  href: string;
  text: string;
  delay: number;
}

const Navbar = () => {
  const [scrollingDown, setScrollingDown] = useState(false);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, setActiveLink] = useState("");
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [themeChanged, setThemeChanged] = useState(false);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(false);
  const [verificationPassword, setVerificationPassword] = useState('');
  const [error, setError] = useState('');

  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  const headerRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useMedia('(max-width: 767px)');
  const pathname = usePathname()

  const { data, update } = useSession();
  const { userName, userLogo, setUserName, setUserLogo } = useGetUser()
  const router = useRouter();
  const userUid = data?.user.uid
  const googleUser = /^\d+$/.test(userUid as string)
  const deleteMessageText = confirmDeleteUser && !googleUser ? 'Please enter your password for verification' : 'Are you sure you want to delete your account?'

  const links = [
    { href: "/", text: "Home", delay: 0.1 },
    { href: "/popular", text: "Popular posts", delay: 0.2 },
    { href: "/create-post", text: "Create post", delay: 0.3 },
  ];
  const controls = useAnimation();

  const logOut = async () => {
    try {
      await signOut({ redirect: false, callbackUrl: '/signin' });
      setUserName('')
      setUserLogo('')

      update()
      router.push("/signin");
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  }

  const deleteUser = async () => {
    try {
      setError('')
      await deleteAccount(userUid as string, verificationPassword as string, setError);
      await signOut({ callbackUrl: '/signup' });

      if (googleUser || !error) {
        await signOut({ callbackUrl: '/signup' });
      }
      if (error) {
        setShowDeleteConfirmation(true)
      } else {
        setShowDeleteConfirmation(false)
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const toggleLink = (link: string) => {
    setActiveLink(link)
  };

  const headerStyle: CSSProperties = {
    top: scrollingDown ? `-${headerRef?.current?.clientHeight || 0}px` : "0",
    position: "fixed",
    width: "100%",
    transition: "top 0.3s",
    zIndex: 5,
  };

  const handleLogOut = () => {
    setLogoutOpen(!logoutOpen)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const currentScrollY = window.scrollY;

        if (currentScrollY > prevScrollY) {
          setScrollingDown(true);
        } else {
          setScrollingDown(false);
        }

        setPrevScrollY(currentScrollY);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollY]);

  useEffect(() => {
    const handleDocumentClick = () => {
      setLogoutOpen(false);
    };
    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [logoutOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      controls.start({ opacity: 1, y: 0, maxHeight: data ? 200 : 80 });
    } else {
      controls.start({ opacity: 0, y: -10, maxHeight: 0 });
    }
  }, [mobileMenuOpen, controls]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setThemeChanged(true);
  };

  const MotionLink = ({ href, text, delay }: MotionLinkProps) => (
    <motion.div
      className={`text-gray-300 rounded-md px-3 py-2 text-sm font-medium`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0, transition: themeChanged ? { duration: 0 } : { delay }, }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay }}
    >
      <Link href={href} onClick={() => setMobileMenuOpen(false)}>{text}</Link>
    </motion.div>
  );

  return (
    <header className="mb-5 mt-20">
      <nav className="bg-gray-900" style={headerStyle} ref={headerRef}>
        <div className="mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <motion.div className="absolute inset-y-0 left-0 ml-3 flex items-center sm:hidden"
              animate={mobileMenuOpen ? "open" : "closed"}
            >
              <MenuBtn toggle={() => {
                setMobileMenuOpen(!mobileMenuOpen)
                setThemeChanged(false)
              }}
                menuOpen={mobileMenuOpen}
              />
            </motion.div>
            <div className="hidden sm:block">
              <SocialLinks />
            </div>
            <div className="flex flex-1 items-center justify-center">
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {links.map((link, index) => {
                    const isActive = pathname.endsWith(link.href) && !isMobile;
                    if (link.href === "/create-post" && !data) {
                      return null;
                    }
                    return (
                      <Link
                        key={index}
                        className={`text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium ${isActive ? "bg-gray-700 text-white" : ""
                          }`}
                        href={link.href}
                        onClick={() => toggleLink(link.text.toLowerCase())}
                      >
                        {link.text}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="mr-4 sm:mr-0">
                {theme === "dark" ? (
                  <BsSun size={23} color='orange' cursor="pointer" onClick={toggleTheme} />
                ) : (
                  <FiMoon style={{ color: 'white' }} size={23} cursor="pointer" onClick={toggleTheme} />
                )}
              </div>
              <div className="inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <div className="flex gap-2 items-center user-logo" >
                  {userName && <p className="text-gray-300 font-medium">{userName}</p>}
                  {userLogo ? (
                    <Image
                      alt="user-logo"
                      src={userLogo}
                      width={40}
                      height={40}
                      priority={true}
                      className="rounded-full hover:cursor-pointer"
                      onClick={handleLogOut}
                      tabIndex={0}
                      aria-labelledby="logout"
                      onKeyUp={(e) => {
                        if (e.key === "Enter") {
                          handleLogOut();
                        }
                      }}
                      placeholder="blur"
                      blurDataURL="/assets/blurred_loading.jpg"
                    />
                  ) : !userLogo && userName ? <UserCircleIcon className="w-10 h-10 text-gray-300 hover:cursor-pointer" onClick={handleLogOut} /> : null}
                  {userName ? (
                    <div className="relative">
                      <AnimatePresence>
                        {logoutOpen && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.1, type: "tween" }}
                            className="absolute top-2 right-3 z-10 w-40 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="logout"
                            tabIndex={0}
                          >
                            <div className="py-1" role="none">
                              <Link href="" onClick={logOut} className="text-gray-700 block px-4 w-full py-2 text-sm hover:bg-gray-300" role="menuitem" tabIndex={-1} id="menu-item-0">
                                Log out
                              </Link>
                              <Link href="" onClick={() => setShowDeleteConfirmation(true)} className="text-gray-700 block px-4 w-full py-2 text-sm hover:bg-gray-300" role="menuitem" tabIndex={-1} id="menu-item-0">
                                Delete account
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  ) : (
                    <Link className="text-gray-300 font-medium hover:bg-gray-700 hover:text-white" href="/signin">Log In</Link>
                  )}
                </div>
                {showDeleteConfirmation && (
                  <DeleteModal
                    googleUser={googleUser}
                    deleteUser={deleteUser}
                    setError={setError}
                    setConfirmDeleteUser={setConfirmDeleteUser}
                    deleteMessage={deleteMessageText}
                    setShowDeleteConfirmation={setShowDeleteConfirmation}
                    setVerificationPassword={setVerificationPassword}
                    confirmDeleteUser={confirmDeleteUser}
                    error={error}
                    handleDelete={function(): void | Promise<void> { }}
                    showDeleteConfirmation={false}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="sm:hidden space-y-1 px-2 flex flex-col items-center"
              id="mobile-menu"
              initial={{ opacity: 0, y: -50, maxHeight: 0, paddingBottom: '1rem' }}
              animate={controls}
              exit={{ opacity: 0, y: -50, maxHeight: 0, paddingBottom: 0 }}
              transition={{ maxHeight: { duration: 0.2 } }}
            >
              {links.map((link, index) => (
                link.href === "/create-post" && !data ? null : (
                  <MotionLink key={index} href={link.href} text={link.text} delay={link.delay} />
                )
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <div className="sm:flex justify-between gap-8 mt-5 mb-4 mx-10">
        <div className="basis-2/3 mb-3 sm:mb-0 md:mt-3">
          <h2 className="font-bold text-3xl md:text-5xl dark:text-indigo-400">BLOG OF THE FUTURE</h2>
          <p className="text-sm mt-3">
            Blog dedicated towards AI and generation and job automation
          </p>
        </div>
        <div className="basis-full relative w-auto h-32 bg-wh-500">
          <Image
            fill
            alt="advert-1"
            src={Ad1}
            sizes="(max-width: 480px) 100vw,
                (max-width: 768px) 75vw,
                (max-width: 1060px) 50vw,
                33vw"
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      </div>
    </header >
  );
};

export default Navbar;
