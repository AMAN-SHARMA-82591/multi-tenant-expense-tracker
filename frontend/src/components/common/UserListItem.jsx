import { FaUser } from "react-icons/fa";
import { DateFormat } from "../utils/constants";

const UserListItem = ({ user }) => {
  return (
    <div className="flex items-center gap-4 p-4 rounded-md shadow-sm bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
      <div className="text-blue-600 dark:text-blue-400">
        <FaUser className="text-xl" />
      </div>
      <div className="flex flex-col">
        <span className="font-semibold text-gray-900 dark:text-gray-100">
          {user.user.username}
        </span>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {user.user.email}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-500">
          Joined: {DateFormat(user.joinedAt)}
        </span>
      </div>
    </div>
  );
};

export default UserListItem;
