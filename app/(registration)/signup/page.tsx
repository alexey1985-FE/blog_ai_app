'use client';
import { auth, db, storage } from '@/firebase-config';
import { signIn } from 'next-auth/react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ChangeEvent, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { checkIfFieldExists } from '@/utils/checkIfFieldExists';
import { useRouter } from "next/navigation";
import { motion } from 'framer-motion';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { UserDoc } from 'next-auth';
import { handleGoogleSignIn } from '@/utils/googleAuth';

export default function Signup() {
  const [userName, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userLogo, setUserLogo] = useState<File | null>(null);
  const [passwordAgain, setPasswordAgain] = useState('');
  const [mailError, setMailError] = useState('');
  const [userNameError, setUserNameError] = useState('');

  const router = useRouter();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const file = files[0];
      setUserLogo(file);
    }
  };

  const signup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const emailExists = await checkIfFieldExists('email', email);
    const usernameExists = await checkIfFieldExists('userName', userName);

    if (emailExists || usernameExists) {
      if (emailExists) {
        setMailError(`User with email "${email}" already exists`);
      } else {
        setMailError('');
      }
      if (usernameExists) {
        setUserNameError(`User with username "${userName}" already exists`);
      } else {
        setUserNameError('');
      }
      return
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const uid = user.uid;

        const userDoc: UserDoc = {
          userName,
          email: user.email,
          uid
        };

        if (userLogo) {
          const storageRef = ref(storage, `userLogos/${uid}`);
          await uploadBytes(storageRef, userLogo);
          const logoUrl = await getDownloadURL(storageRef);
          userDoc.userLogo = logoUrl;
        }

        await setDoc(doc(db, 'users', uid), userDoc);
        signIn('credentials', { email, password, redirect: false, callbackUrl: '/' });
        router.push('/')
      })
      .catch((error) => {
        console.error('Error creating user:', error);
      });
  };

  return (
    <form className="flex h-100 flex-1 flex-col justify-center px-6 pb-8 lg:px-8 -translate-y-8" onSubmit={signup}>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-wh-50">
          Sign up
        </h2>
      </div>

      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="space-y-4">

          <div>
            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900 dark:text-wh-50">
              Full name<span aria-hidden="true" className='text-rose-600'>*</span>
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                required
                className="block w-full rounded-md border-2 border-indigo-200 focus:outline-none bg-white/5 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-white/10 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          {userNameError && (
            <p className="text-red-500 text-sm -translate-y-4">{userNameError}</p>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-wh-50">
              Email<span aria-hidden="true" className='text-rose-600'>*</span>
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full rounded-md border-2 border-indigo-200 focus:outline-none bg-white/5 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-white/10 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          {mailError && (
            <p className="text-red-500 text-sm -translate-y-4">{mailError}</p>
          )}
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-wh-50">
                Password<span aria-hidden="true" className='text-rose-600'>*</span>
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full rounded-md border-2 border-indigo-200 focus:outline-none bg-white/5 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-white/10 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-wh-50">
                Confirm Password<span aria-hidden="true" className='text-rose-600'>*</span>
              </label>
            </div>
            <div className="mt-2">
              <input
                id="passwordAgain"
                name="passwordAgain"
                type="password"
                onChange={(e) => setPasswordAgain(e.target.value)}
                required
                className="block w-full rounded-md border-2 border-indigo-200 focus:outline-none bg-white/5 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-white/10 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label htmlFor="userLogo" className="block text-sm font-medium leading-6 text-gray-900 dark:text-wh-50">
              User photo
            </label>
            <div className="mt-2">
              <input
                id="userLogo"
                name="userLogo"
                type="file"
                onChange={handleFileChange}
                className="block w-full rounded-md border-2 border-indigo-200"
              />
            </div>
          </div>

          <div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={(!email || !password || !passwordAgain) || (password !== passwordAgain)}
              type="submit"
              className="disabled:opacity-40 flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:text-white"
            >
              Sign Up
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={handleGoogleSignIn}
              className="mt-3 flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Sign up with Google
            </motion.button>
          </div>
        </div>
      </div>
    </form>
  )
}
