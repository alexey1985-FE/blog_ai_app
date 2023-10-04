import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/firebase-config';

export async function getUserName(uid: string) {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const userName = userData?.userName || '';
      return userName;
    }
    return '';
  } catch (error) {
    console.error('Error fetching user data:', error);
    return '';
  }
}
