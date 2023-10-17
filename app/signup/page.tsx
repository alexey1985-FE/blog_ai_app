'use client';

import { auth, db } from '@/firebase-config';
import { signIn } from 'next-auth/react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { checkIfFieldExists } from '@/utils/checkIfFieldExists';
import { useRouter } from "next/navigation";

export default function Signup() {
  const [userName, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  const signup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const emailExists = await checkIfFieldExists('email', email);
    const usernameExists = await checkIfFieldExists('userName', userName);

    if (emailExists || usernameExists) {
      if (emailExists) {
        setError(`User with email "${email}" already exists`);
      }
      if (usernameExists) {
        setError(`User with username "${userName}" already exists`);
      }
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const uid = user.uid;

        const userDoc = {
          userName,
          email: user.email,
          uid,
        };

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
        <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign up
        </h2>
      </div>

      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="space-y-4">

          <div>
            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
              Full name
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

          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email
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

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
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
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Confirm Password
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
            <button
              disabled={(!email || !password || !passwordAgain) || (password !== passwordAgain)}
              type="submit"
              className="disabled:opacity-40 flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Sign Up
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-sm -translate-y-3">{error}</p>
          )}
        </div>
      </div>
    </form>
  )
}
