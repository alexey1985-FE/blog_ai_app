import { signIn } from "next-auth/react";

export const handleGoogleSignIn = async () => {
  try {
    await signIn("google", { callbackUrl: "/" });
  } catch (error) {
    console.log('Google sign-in failed. Please try again.');
  }
};
