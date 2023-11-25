import { Notification } from '@/types/notification';
import { retrieveCookiesSession } from './retrieveCookiesSession';
import { JWT } from 'next-auth/jwt';

export const loadNotifications = async () => {
  const sessionData = (await retrieveCookiesSession()) as JWT;

  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/notification`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${sessionData?.token}`,
    },
    next: { revalidate: 0 },
  });
  if (response.status !== 200) {
    throw new Error(`The fetch wasn't successful ${response.status}`);
  }

  const notifications: Notification[] = await response.json();

  return { notifications: notifications, sessionData };
};
