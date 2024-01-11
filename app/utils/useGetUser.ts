import { useEffect, useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { getUserNameAndLogo } from './getUserNameAndLogoByUid';

const useGetUser = () => {
  const { data } = useSession();
  const uid = data?.user?.uid;

  const [userName, setUserName] = useState('');
  const [userLogo, setUserLogo] = useState('');

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

  useEffect(() => {
    getUser();
  }, [uid]);

  const memoizedValues = useMemo(() => ({ userName, userLogo, setUserName, setUserLogo }), [
    userName,
    userLogo,
  ]);

  return memoizedValues;
};

export default useGetUser;


