import NextAuth from "next-auth";
import type { AuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase-config";

type ExtendedUserType = User & { uid?: string };

export const authOptions: AuthOptions = {
	// Configure one or more authentication providers
	pages: {
		signIn: "/signin",
	},
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {},
			async authorize(credentials): Promise<any | null> {
				return await signInWithEmailAndPassword(
					auth,
					(credentials as any).email || "",
					(credentials as any).password || ""
				)
					.then(userCredential => {
						if (userCredential.user) {
							const user = userCredential.user;
							const firebaseUser: any = {
								id: user.uid,
								email: user.email,
							};
							return firebaseUser;
						}
						return null;
					})
					.catch(error => console.log(error))
					.catch(error => {
						const errorCode = error.code;
						const errorMessage = error.message;
						console.log(error);
					});
			},
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID ?? '',
			clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
		}),
	],
	callbacks: {
		async session({ session, token }) {
			(session.user as unknown as ExtendedUserType).uid = token.sub;
			return session;
		},
	},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
