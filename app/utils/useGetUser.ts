import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getUserNameAndLogo } from './getUserNameAndLogoByUid';

const useGetUser = () => {
	const [userName, setUserName] = useState('');
	const [userLogo, setUserLogo] = useState('');

	const { data } = useSession();
	const uid = data?.user?.uid;

	useEffect(() => {
		const getUser = async () => {
			if (uid) {
				const { userName, userLogo } = await getUserNameAndLogo(uid);
				setUserName(userName);
				setUserLogo(userLogo);
			}
			if (data?.user?.name) {
				setUserName(data?.user?.name);
			}
			if (data?.user?.image) {
				setUserLogo(data?.user?.image);
			}
		};
		getUser();
	}, [uid, data?.user?.name, data?.user?.image]);

	return { userName, userLogo, setUserName, setUserLogo };
};

export default useGetUser;
