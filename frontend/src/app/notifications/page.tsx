import { loadNotifications } from "@/serverApiCalls/notifications";
import NotificationCard from "./(components)/NotificationCard";

export default async function page() {
  const { notifications, token } = await loadNotifications();

  return (
    <div
      className="flex flex-col w-full pl-2 overflow-y-auto"
      style={{ height: "-webkit-fill-available" }}
    >
      <div className="font-bold text-xl py-4 border-b">Notifications</div>
      <div className="flex flex-col max-w-md">
        {notifications.length != 0 ? (
          notifications.map((notification, index) => (
            <NotificationCard
              borderTop={index != 0}
              key={notification.id}
              notification={notification}
              token={token}
            />
          ))
        ) : (
          <div className="font-bold text-lg mt-4 ml-4">
            Currently no notifications!
          </div>
        )}
      </div>
    </div>
  );
}
