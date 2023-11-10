'use client'
import { SendEmail } from "@/utils/sendEmail";
import useGetUser from "@/utils/useGetUser";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import React, { useRef } from "react";
import toast from "react-hot-toast";

const Subscribe = () => {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const { userName } = useGetUser()
  const { data } = useSession();

  return (
    <div className="text-center bg-wh-10 px-5 py-10">
      <h4 className="font-semibold text-base">Subscribe to our Newsletter</h4>
      {data ?
        <>
          <p className="text-wh-500 my-3 w-5/6 mx-auto">
            Enter email address to get top news and great deals
          </p>
          <form action={async (formData) => {
            if (emailInputRef.current) {
              emailInputRef.current.value = '';
            }
            const res = await SendEmail(formData, userName);
            if (res.success) {
              toast.success(`Hey ${userName}, your message was sent successfully!`)
            } else {
              toast.error('Email could not be sent. Please try again later.')
            }
          }}>
            <input
              ref={emailInputRef}
              name="senderMail"
              type="email"
              required
              className="text-center w-5/6 min-w-[100px] px-5 py-2 border-2"
              placeholder="Enter Email Address" />
            <motion.button whileTap={{ scale: 0.97 }} type="submit" className="bg-accent-red text-wh-10 font-semibold w-5/6 min-w-[100px] py-2 px-5 mt-3">
              SUBSCRIBE
            </motion.button>
          </form></>
        : <p className="mt-3 text-base">
          Need to log in to make a subscription
        </p>}
    </div>
  );
};

export default Subscribe;
