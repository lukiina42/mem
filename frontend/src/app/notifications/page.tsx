import { loadNotifications } from "@/serverApiCalls/notifications";
import NotificationCard from "./(components)/NotificationCard";

export default async function page() {
  const { notifications, token } = await loadNotifications();

  return (
    <div className="flex flex-col w-full pl-2">
      <div className="font-bold text-xl py-4 border-b">Notifications</div>
      <div className="flex flex-col max-w-md">
        {notifications.map((notification, index) => (
          <NotificationCard
            borderTop={index != 0}
            key={notification.id}
            notification={notification}
            token={token}
          />
        ))}
      </div>
    </div>
  );
}
