import { Notification } from '@/types/notification';
import Link from 'next/link';
import { CgProfile } from 'react-icons/cg';
import { JWT } from 'next-auth/jwt';
import ViewMemButton from "@/app/notifications/(components)/ViewMemButton";

export default function NotificationCard({
  notification,
  borderTop,
  sessionData,
}: {
  notification: Notification;
  borderTop: boolean;
  sessionData: JWT;
}) {
  return (
    <div className={`flex w-full mt-2 ${borderTop && 'border-t'}`}>
      <Link
        href={`/user/${notification.trigerredBy.id}`}
        className="min-w-[4rem] flex justify-center mt-2"
      >
        {notification.trigerredBy.avatarImageUrl ? (
          <img // eslint-disable-line @next/next/no-img-element
            className="w-[3rem] h-[3rem] rounded-full object-cover"
            alt="submitted picture"
            src={notification.trigerredBy.avatarImageUrl}
          />
        ) : (
          <CgProfile className="rounded-full w-[3rem] h-[3rem] bg-gray-400 p-1 text-gray-300" />
        )}
      </Link>
      <div className="flex flex-col grow">
        <div className="flex justify-between mt-1">
          <Link href={`/user/${notification.trigerredBy.id}`}>
            <div className="font-bold text-lg hover:underline">
              {notification.trigerredBy.username}
            </div>
          </Link>
          <div className="flex flex-col gap-2 items-end justify-between h-8">
            <div className="text-sm">{notification.formattedCreatedDate}</div>
            {!notification.seen && <div className="w-1 h-1 bg-red-500 rounded-full"></div>}
          </div>
        </div>
        <div className="mt-1">{notification.content}</div>
        {notification.relatesToMemId && (
          <ViewMemButton notification={notification} sessionData={sessionData} />
        )}
      </div>
    </div>
  );
}
