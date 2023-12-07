import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase-config';

export async function getUserNameAndLogo(uid: string) {
	try {
		const userRef = doc(db, 'users', uid);
		const userDoc = await getDoc(userRef);

		if (userDoc.exists()) {
			const userData = userDoc.data();
			const userName = userData?.userName || '';
			const userLogo = userData?.userLogo || ''; 
			return { userName, userLogo };
		}
		return { userName: '', userLogo: '' };
	} catch (error) {
		console.error('Error fetching user data:', error);
		return { userName: '', userLogo: '' };
	}
}
