"use client";

import Link from "next/link";
import React, { useEffect, useState, useRef, CSSProperties } from "react";
import Image from "next/image";
import SocialLinks from "./SocialLinks";
import Ad1 from "/public/assets/ad-1.jpg";
import { useSession, signOut } from "next-auth/react";
import { getUserName } from "@/utils/getUserNameByUid";


const Navbar = () => {
  const [userName, setUserName] = useState("");
  const [userLogo, setUserLogo] = useState("");

  const [scrollingDown, setScrollingDown] = useState(false);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const headerRef = useRef<HTMLDivElement | null>(null);

  const { data } = useSession();
  const user = data?.user?.email;
  const uid = data?.user?.uid;

  // console.log('Navbar.tsx data', data);

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

  const headerStyle: CSSProperties = {
    top: scrollingDown ? `-${headerRef?.current?.clientHeight || 0}px` : "0",
    position: "fixed",
    width: "100%",
    transition: "top 0.3s",
    backgroundColor: "black",
    zIndex: 1,
  };

  return (
    <header className="mb-5 mt-20">
      <nav className="flex justify-between items-center bg-wh-900 w-full text-wh-10 px-10 py-4" 
           style={headerStyle} 
           ref={headerRef}
      >
        <div className="hidden sm:block">
          <SocialLinks />
        </div>
        <div className="flex justify-between items-center gap-10">
          <Link href="/">Home</Link>
          <Link href="/">Trending</Link>
          {data && <Link href="/create-post">Create post</Link>}
        </div>
        <div className="flex gap-2 items-center">
          {userName && <p>{userName}</p>}
          {userLogo && (
            <Image
              alt="user-logo"
              src={userLogo}
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
          {userName ? (
            <button className="text-white" onClick={() => signOut()}>
              Log out
            </button>
          ) : (
            <Link href="/signin">Log In</Link>
          )}
        </div>
      </nav>
      <div className="flex justify-between gap-8 mt-5 mb-4 mx-10">
        <div className="basis-2/3 md:mt-3">
          <h2 className="font-bold text-3xl md:text-5xl">BLOG OF THE FUTURE</h2>
          <p className="text-sm mt-3">
            Blog dedicated towards AI and generation and job automation
          </p>
        </div>
        <div className="basis-full relative w-auto h-32 bg-wh-500">
          <Image
            fill
            alt="advert-1"
            // placeholder="blur"
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
