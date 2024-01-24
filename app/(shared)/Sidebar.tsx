"use client"
import Image from "next/image";
import React from "react";
import SocialLinks from "./SocialLinks";
import Subscribe from "./Subscribe";
import Ad2 from "/public/assets/ad-2.png";
import AboutProfile from "/public/assets/about-profile.jpg";
import { AnimatePresence, motion } from "framer-motion";


const Sidebar = () => {
  return (
    <section>
      <h4 className="bg-wh-900 dark:bg-slate-50 py-3 px-5 text-wh-50 dark:text-wh-900 text-xs font-bold text-center">
        Subscribe and Follow
      </h4>
      <div className="my-5 mx-5">
        <SocialLinks isDark />
      </div>
      <Subscribe />
      <AnimatePresence>
        <motion.div
          animate={{
            opacity: [0, 0, 1, 1, 1, 1, 0,],
          }}
          transition={{
            duration: 10, repeat: Infinity, repeatDelay: 2,
          }}
          className="hidden md:block"
        >
          <Image
            className="hidden md:block my-8 w-full"
            alt="advert-2"
            placeholder="blur"
            blurDataURL="/assets/blurred_loading.jpg"
            src={Ad2}
            width={500}
            height={1000}
          />
          <h4 className="bg-wh-900 py-3 px-5 text-wh-50 text-xs font-bold text-center">
            About the Blog
          </h4>
          <div className="flex justify-center my-3">
            <Image
              alt="about-profile"
              placeholder="blur"
              blurDataURL="/assets/blurred_loading.jpg"
              src={AboutProfile}
              style={{ width: "500px", height: "250px", objectFit: "cover" }}
            />
          </div>
          <h4 className="py-3 px-5 text-wh-500 font-bold text-center dark:text-wh-100">Geoffrey Epstein</h4>
          <p className="text-wh-500 text-center text-sm dark:text-wh-100">
            Sit diam vel lacus tortor molestie amet tincidunt. Amet amet arcu sed facilisi
          </p>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default Sidebar;
