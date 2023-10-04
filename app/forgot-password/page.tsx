"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase-config";
import Link from 'next/link'

export default function ForgotPassword() {
	const [email, setEmail] = useState("");
	const [resetEmailSent, setResetEmailSent] = useState(false);

	const resetEmail = async () => {
		try {
			const actionCodeSettings = {
				url: "http://localhost:3000/signin",
			};

			await sendPasswordResetEmail(auth, email, actionCodeSettings);
			setResetEmailSent(true);
		} catch (error) {
			console.error("Error sending reset email:", error);
		}
	};

	return (
		<>
			<div className="flex h-100 flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
						Forgot Password
					</h2>
				</div>

				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<div className="space-y-6">
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium leading-6 text-gray-900"
							>
								Email address
							</label>
							<div className="mt-2">
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

						<div>
							{resetEmailSent ? (
								<>
								  <p className="text-center text-gray-900">
  									Instructions to reset your password have been sent to your email.
  								</p>
                  <Link
									href='/signin'
									className="mt-3 text-white disabled:opacity-40 flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
								>
									Back to Sign In
								</Link>
								</>
							) : (
								<button
									onClick={() => resetEmail()}
									disabled={!email}
									className="disabled:opacity-40 flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
								>
									Send Forgot Password Email
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
