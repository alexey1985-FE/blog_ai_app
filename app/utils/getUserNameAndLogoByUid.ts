import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase-config';

export async function getUserNameAndLogo(uid: string) {
	try {
		const userRef = doc(db, 'users', uid);
		const userDoc = await getDoc(userRef);

		if (userDoc.exists()) {
			const userData = userDoc.data();
			const { userName = '', userLogo = '' } = userData || {};
			return { userName, userLogo };
		}
		return { error: 'User document does not exist' };
	} catch (error) {
		console.error('Error fetching user data:', error);
		return { error: 'Failed to fetch user data' };
	}
}
