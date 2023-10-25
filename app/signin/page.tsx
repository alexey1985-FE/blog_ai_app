"use client";

import { auth } from "@/firebase-config";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { checkIfFieldExists } from '@/utils/checkIfFieldExists'
import Link from 'next/link'

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const [userUid, setUserUid] = useState<string | null>(null);

  const router = useRouter();

  const handleCredentialsSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const userExists = await checkIfFieldExists('email', email);

    if (!userExists) {
      setError(`User with email '${email}' does not exist`);
      return
    }

    await signIn('credentials', {
      email,
      password,
      userUid,
      redirect: false,
      callbackUrl: '/',
    });
    router.push('/')
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const uid = user?.uid;
        setUserUid(uid as string);
      } else {
        setUserUid(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    await signIn("google", { redirect: false, callbackUrl: "/" });
    router.push('/')
  };

  return (
    <form className='flex h-100 flex-1 flex-col justify-center px-6 pb-8 lg:px-8'
      onSubmit={handleCredentialsSignIn}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email
            </label>
            <div className={`mt-2 ${error && 'border-2 border-rose-600 rounded-lg'}`}>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                onChange={e => setEmail(e.target.value)}
                required
                className="block w-full rounded-md border-2 border-indigo-200 focus:outline-none bg-white/5 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-white/10 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          {error && (
            <p className="text-red-500 text-sm -translate-y-4">{error}</p>
          )}

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <Link
                  href='/forgot-password'
                  className="cursor-pointer font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                onChange={e => setPassword(e.target.value)}
                required
                className="block w-full rounded-md border-2 border-indigo-200 focus:outline-none bg-white/5 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-white/10 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!email || !password}
              className="disabled:opacity-40 flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="mt-3 flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Sign in with Google
            </button>
          </div>
        </div>

        <p className="mt-3 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link href='/signup' className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300">Sign Up</Link>
        </p>
      </div>
    </form>

  );
}