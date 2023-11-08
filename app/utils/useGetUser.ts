import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getUserName } from './getUserNameByUid';

const useGetUser = () => {
	const [userName, setUserName] = useState('');
	const [userLogo, setUserLogo] = useState('');

	const { data } = useSession();
	const user = data?.user?.email;
	const uid = data?.user?.uid;

	useEffect(() => {
		const getUser = async () => {
			if (uid) {
				const userName = await getUserName(uid);
				setUserName(userName);
			}
			if (data?.user?.name) {
				setUserName(data?.user?.name);
			}
			if (data?.user?.image) {
				setUserLogo(data?.user?.image);
			}
		};
		getUser();
	}, [user]);

	return { userName, userLogo, setUserName, setUserLogo };
};

export default useGetUser;
