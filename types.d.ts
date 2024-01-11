import NextAuth from 'next-auth';

declare module 'next-auth' {
	interface Session {
		user: {
      type: string;
      id: any;
			uid: string;
			email: string;
			image: string;
			name: string;
			userName: string;
      userLogo: string
		};
	}

	interface UserDoc {
		userName: string;
		email: string | null;
		uid: string;
		userLogo?: string;
	}
}
