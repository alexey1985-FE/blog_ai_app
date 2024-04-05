import { db, storage } from '@/firebase-config';
import {
	EmailAuthProvider,
	User,
	deleteUser,
	getAuth,
	reauthenticateWithCredential,
} from 'firebase/auth';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { Dispatch, SetStateAction } from 'react';

export const deleteAccount = async (
	uid: string,
	password: string,
	setError: Dispatch<SetStateAction<string>>,
): Promise<void> => {
  try {
		const auth = getAuth();
		const userRef = doc(collection(db, 'users'), uid);

		if (auth?.currentUser && auth?.currentUser?.uid === uid) {
			const credential = EmailAuthProvider.credential(
				auth.currentUser.email as string,
				password,
			);
			await reauthenticateWithCredential(auth.currentUser, credential);
			await deleteUser(auth.currentUser as User);
			await deleteDoc(userRef);

      const storageRef = ref(storage, `userLogos/${uid}`);
			await deleteObject(storageRef);
		}
	} catch (error) {
		console.error('Error deleting account:', error);
		setError(error as unknown as string);
		throw new Error('Error deleting account');
	}
};
