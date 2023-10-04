import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase-config';

export const checkIfFieldExists = async (field: string, value: string): Promise<boolean> => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where(field, '==', value));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};
