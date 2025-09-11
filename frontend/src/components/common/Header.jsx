import { useCallback, useEffect, useState } from "react";
import { HiUserCircle, HiAtSymbol, HiBell } from "react-icons/hi";
import { Link, useLocation } from "react-router";
import Popover from "@mui/material/Popover";
import { useAuth } from "../utils/contextApi";
import DarkModeToggle from "./DarkModeToggle";
import Badge from "@mui/material/Badge";
import NotificationCard from "./NotificationCard";
import axiosInstance from "../utils/AxiosInstance";
import { toastError, toastSuccess } from "./ToastContainer";

export default function Header() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [notificationList, setNotificationList] = useState([]);
  const [openNotification, setOpenNotification] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const isActive = (path) => location.pathname === path;

  const handleFetchNotifications = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/notification");
      if (response.data.success) {
        setNotificationList(response.data);
      }
    } catch (error) {
      console.error(error);
      toastError("Failed to fetch notifications.");
    }
  }, []);

  useEffect(() => {
    handleFetchNotifications();
  }, [handleFetchNotifications]);

  const handleToggleNotification = (event) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    setOpenNotification(true);
  };

  const handleCloseNotification = () => {
    setAnchorEl(null);
    setOpenNotification(false);
  };

  const handleOpenPopover = (event) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleInviteResponse = async (inviteId, responseType) => {
    try {
      const response = await axiosInstance.patch(`/tenant/invite/${inviteId}/response`, {
        responseType,
      });
      if (response.data.success) {
        setNotificationList((prev) => ({
          ...prev,
          notifications: prev.notifications.map((notification) =>
            notification._id === inviteId
              ? { ...notification, inviteResponse: responseType, read: true }
              : notification
          ),
        }));
        toastSuccess(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toastError("Failed to accept invite.");
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b dark:bg-gray-800 dark:border-gray-700 bg-white border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`font-medium transition-colors duration-200 ${
                isActive("/")
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              Home
            </Link>
            <Link
              to="/chat"
              className={`font-medium transition-colors duration-200 ${
                isActive("/chat")
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              Chat
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggleNotification}
            className="p-2 rounded-lg transition-colors dark:hover:bg-gray-700 text-gray-600 hover:bg-gray-200 dark:text-gray-300"
          >
            <Badge badgeContent={notificationList.total || 0} color="primary">
              <HiBell className="text-gray-600 dark:text-gray-300 w-5 h-5" />
            </Badge>
          </button>
          <Popover
            open={openNotification}
            anchorEl={anchorEl}
            onClose={handleCloseNotification}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              // vertical: "top",
              horizontal: "center",
            }}
          >
            <div className="overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900 rounded-md shadow-md">
              {notificationList.total === 0 ? (
                <p className="p-4 text-gray-500 dark:text-gray-400">
                  No notifications found.
                </p>
              ) : (
                notificationList.total &&
                notificationList.notifications.map((notification) => (
                  <NotificationCard
                    notification={notification}
                    key={notification._id}
                    handleInviteResponse={handleInviteResponse}
                  />
                ))
              )}
            </div>
          </Popover>
          {/* Dark Mode Toggle */}
          <DarkModeToggle />
          <button
            onClick={handleOpenPopover}
            className="flex cursor-pointer items-center space-x-2"
          >
            <h2 className="font-medium text-gray-800 dark:text-gray-200">
              {user.username}
            </h2>
            <HiUserCircle className="text-gray-600 dark:text-gray-300 w-5 h-5" />
          </button>
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClosePopover}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            // transformOrigin={{
            //   vertical: "top",
            //   horizontal: "left",
            // }}
          >
            <div className="text-center w-full px-4 py-2 dark:bg-gray-800 bg-gray-100">
              <div className="flex cursor-pointer items-center space-x-2">
                <HiAtSymbol className="text-gray-600 dark:text-gray-300 w-5 h-5" />
                <h2 className="font-medium text-gray-800 dark:text-gray-200">
                  {user.email}
                </h2>
              </div>
              <button
                onClick={logout}
                className="bg-red-500 text-white my-5 px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </Popover>
        </div>
      </div>
    </header>
  );
}
