import { Notification } from "@/types/notification";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import ViewMemButtonWrapper from "./ViewMemButtonWrapper";

export default function NotificationCard({
  notification,
  borderTop,
  token,
}: {
  notification: Notification;
  borderTop: boolean;
  token: string;
}) {
  console.log(notification);
  return (
    <div className={`flex w-full mt-2 ${borderTop && "border-t"}`}>
      <Link
        href={`/${notification.trigerredBy.id}`}
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
          <Link href={`/${notification.trigerredBy.id}`}>
            <div className="font-bold text-lg hover:underline">
              {notification.trigerredBy.username}
            </div>
          </Link>
          <div className="flex gap-2 items-center">
            <div className="text-sm">{notification.formattedCreatedDate}</div>
            {/* {isOwnedByCurrentUser && (
              <BsFillTrashFill
                size={30}
                className="text-red-500 p-1 rounded-full hover:bg-gray-200 duration-150 transition-all hover:cursor-pointer"
                onClick={() => handleDeleteMemClick(mem.id)}
              />
            )} */}
          </div>
        </div>
        <div className="mt-1">{notification.content}</div>
        {notification.relatesToMemId && (
          <ViewMemButtonWrapper notification={notification} token={token} />
        )}
      </div>
    </div>
  );
}
