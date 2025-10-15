import { FaUserCircle } from "react-icons/fa";
import truncate from "lodash/truncate";

export default function NotificationCard({
  notification,
  handleInviteResponse,
}) {
  return (
    <div className="flex items-start gap-3 w-full max-w-lg p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      {/* Avatar/Icon */}
      <div className="flex-shrink-0 pt-1">
        <FaUserCircle className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      {/* Notification Content */}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            {notification?.type === "notification"
              ? "Notification"
              : "Group Invite"}
          </h3>
          <h3>
            {notification?.tenant?.name && (
              <p className="text-xs font-medium text-gray-500 dark:text-white mt-1">
                Group:{" "}
                <span className="font-light dark:text-white">
                  {notification.tenant?.name}
                </span>
              </p>
            )}
          </h3>
          {!notification.read && (
            <span
              className="ml-2 inline-block w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400"
              title="Unread"
            ></span>
          )}
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          <span className="font-semibold dark:text-white">Sender Name: </span>
          <span>{notification?.user?.username || "User"}</span>
          <br />
          <span className="font-semibold dark:text-white">Group Name: </span>
          <span> {notification?.tenant?.name || "Tenant Group"}</span>
          <br />
          <span className="font-semibold dark:text-white"> Message: </span>
          {notification?.message &&
            truncate(notification.message, { length: 150 })}
        </p>

        {/* Status */}
        {notification.inviteResponse && (
          <p className="text-xs mt-1 dark:text-white">
            Status:{" "}
            <span
              className={`font-semibold ${
                notification.inviteResponse === "accepted"
                  ? "text-green-600 dark:text-green-400"
                  : notification.inviteResponse === "rejected"
                  ? "text-red-600 dark:text-red-400"
                  : "text-yellow-600 dark:text-yellow-400"
              }`}
            >
              {notification.inviteResponse}
            </span>
          </p>
        )}
        {/* Actions */}
        {notification.inviteResponse === "pending" && (
          <div className="flex gap-4 mt-3">
            <button
              onClick={() => handleInviteResponse(notification._id, "rejected")}
              className="text-red-600 py-2 dark:text-red-400 font-semibold hover:underline"
            >
              DECLINE
            </button>
            <button
              onClick={() => handleInviteResponse(notification._id, "accepted")}
              className="text-blue-600 py-2 dark:text-blue-400 font-semibold hover:underline"
            >
              ACCEPT
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
