"use client";
import Link from "next/link";
import React, { useEffect, useState, useRef, CSSProperties } from "react";
import Image from "next/image";
import SocialLinks from "./SocialLinks";
import Ad1 from "/public/assets/ad-1.jpg";
import { useSession, signOut } from "next-auth/react";
import { getUserName } from "@/utils/getUserNameByUid";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MenuBtn } from "./MenuBtn";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import useMedia from "use-media";

const Navbar = () => {
  const [userName, setUserName] = useState("");
  const [userLogo, setUserLogo] = useState("");
  const [scrollingDown, setScrollingDown] = useState(false);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [logoutOpen, setLogoutOpen] = useState(false);

  const headerRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useMedia('(max-width: 767px)');

  const { data, update } = useSession();
  const user = data?.user?.email;
  const uid = data?.user?.uid;
  const router = useRouter();

  const logOut = async () => {
    try {
      await signOut({ redirect: false, callbackUrl: '/' });
      setUserName('')
      setUserLogo('')

      update()
      router.push("/");
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  }

  const toggleLink = (link: string) => {
    setActiveLink(link)
  };


  useEffect(() => {
    const getUser = async () => {
      if (uid) {
        const userName = await getUserName(uid);
        setUserName(userName);
      }
      if (data?.user?.name) {
        setUserName(data?.user?.name);
      }
      if (data?.user?.image) {
        setUserLogo(data?.user?.image);
      }
    };
    getUser();
  }, [user]);

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

  return (
    <header className="mb-5 mt-20">
      <nav className="bg-gray-900" style={headerStyle} ref={headerRef}>
        <div className="mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <motion.div className="absolute inset-y-0 left-0 ml-3 flex items-center sm:hidden"
              animate={mobileMenuOpen ? "open" : "closed"}>
              <MenuBtn toggle={() => setMobileMenuOpen(!mobileMenuOpen)}
                menuOpen={mobileMenuOpen}
              />
            </motion.div>
            <div className="hidden sm:block">
              <SocialLinks />
            </div>
            <div className="flex flex-1 items-center justify-center">
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  <Link
                    className={`text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium ${activeLink === "home" && !isMobile ? "bg-gray-700 text-white" : ""
                      }`}
                    href="/"
                    onClick={() => toggleLink("home")}
                  >
                    Home
                  </Link>

                  <Link
                    className={`text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium ${activeLink === "popular" && !isMobile ? "bg-gray-700 text-white" : ""
                      }`}
                    href="/popular"
                    onClick={() => toggleLink("popular")}
                  >
                    Popular posts
                  </Link>

                  {data && (
                    <Link
                      className={`text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium ${activeLink === "create-post" && !isMobile ? "bg-gray-700 text-white" : ""
                        }`}
                      href="/create-post"
                      onClick={() => toggleLink("create-post")}
                    >
                      Create post
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <div className="flex gap-2 items-center">
                {userName && <p className="text-gray-300 font-medium">{userName}</p>}
                {userLogo ? (
                  <Image
                    alt="user-logo"
                    src={userLogo}
                    width={40}
                    height={40}
                    className="rounded-full hover:cursor-pointer"
                    onClick={handleLogOut}
                    tabIndex={0}
                    aria-labelledby="logout"
                    onKeyUp={(e) => {
                      if (e.key === "Enter") {
                        handleLogOut();
                      }
                    }}
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
                            <Link href="/" onClick={logOut} className="text-gray-700 block px-4 w-full py-2 text-sm hover:bg-gray-300" role="menuitem" tabIndex={-1} id="menu-item-0">
                              Log out
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
            </div>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="sm:hidden"
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="space-y-1 px-2 pb-3 pt-2 flex flex-col">
                <Link
                  className={`text-gray-300 rounded-md px-3 py-2 text-sm font-medium`}
                  href="/"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  Home
                </Link>

                <Link
                  className={`text-gray-300 rounded-md px-3 py-2 text-sm font-medium `}
                  href="/popular"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  Popular posts
                </Link>

                {data && (
                  <Link
                    className={`text-gray-300 rounded-md px-3 py-2 text-sm font-medium`}
                    href="/create-post"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  >
                    Create post
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>









      {/* <nav
        classNameName="flex justify-between items-center bg-wh-900 w-full text-wh-10 px-10 py-4"
        style={headerStyle}
        ref={headerRef}
      >
        <button
          classNameName="sm:hidden text-white"
          onClick={handleMobileNavToggle}
        >
          ☰
        </button>
        <div classNameName="hidden sm:block">
          <SocialLinks />
        </div>
        <div
          classNameName={`${mobileNavOpen ? "block" : "hidden"
            } sm:flex justify-between items-center gap-10`}
        >
          <Link href="/">Home</Link>
          <Link href="/popular">Popular posts</Link>
          {data && <Link href="/create-post">Create post</Link>}
        </div>
        <div classNameName="flex gap-2 items-center">
          {userName && <p>{userName}</p>}
          {userLogo && (
            <Image
              alt="user-logo"
              src={userLogo}
              width={40}
              height={40}
              classNameName="rounded-full"
            />
          )}
          {userName ? (
            <button classNameName="text-white" onClick={logOut}>
              Logout
            </button>
          ) : (
            <Link href="/signin">Log In</Link>
          )}
        </div>
      </nav> */}
      {/* <div style={mobileNavStyle}>
        <Link href="/">Home</Link>
        <Link href="/popular">Popular posts</Link>
        {data && <Link href="/create-post">Create post</Link>}
        {userName && <p>{userName}</p>}
        {userLogo && (
          <Image
            alt="user-logo"
            src={userLogo}
            width={40}
            height={40}
            classNameName="rounded-full"
          />
        )}
        {userName ? (
          <button classNameName="text-white" onClick={logOut}>
            Logout
          </button>
        ) : (
          <Link href="/signin">Log In</Link>
        )}
      </div> */}



      <div className="sm:flex justify-between gap-8 mt-5 mb-4 mx-10">
        <div className="basis-2/3 mb-3 sm:mb-0 md:mt-3">
          <h2 className="font-bold text-3xl md:text-5xl">BLOG OF THE FUTURE</h2>
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
          />
        </div>
      </div>
      <hr className="border-1 mx-10"></hr>
    </header>
  );
};

export default Navbar;
