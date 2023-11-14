import { loadNotifications } from '@/serverApiCalls/notifications';
import NotificationCard from './(components)/NotificationCard';

export default async function page() {
  const { notifications, sessionData } = await loadNotifications();

  return (
    <div
      className="flex flex-col w-full overflow-y-auto"
      style={{ height: '-webkit-fill-available' }}
    >
      <div className="font-bold text-xl h-16 pl-2 border-b-2 w-full flex items-center">
        Notifications
      </div>
      <div className="flex flex-col max-w-md">
        {notifications.length != 0 ? (
          notifications.map((notification, index) => (
            <NotificationCard
              borderTop={index != 0}
              key={notification.id}
              notification={notification}
              sessionData={sessionData}
            />
          ))
        ) : (
          <div className="font-bold text-lg mt-4 ml-4">Currently no notifications!</div>
        )}
      </div>
    </div>
  );
}
