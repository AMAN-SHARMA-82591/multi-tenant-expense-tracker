import { useLocation } from "react-router";
import { FaPlus, FaUser, FaPen, FaUserFriends, FaTrash } from "react-icons/fa";
import axiosInstance from "../utils/AxiosInstance";
import ReportDropdown from "../common/ReportDropdown";

export default function ExpenseSidebar({
  tenantGroup,
  handleCreateExpense,
  activeTenantGroupId,
  handleFetchTenantGroup,
  handleOpenTenantGroupDialog,
  handleSetActiveTenantGroupId,
}) {
  const location = useLocation();

  const handleDeleteTenantGroup = async (tenantId) => {
    const response = await axiosInstance.delete(`/tenant/${tenantId}`);
    if (response.data.success) {
      handleSetActiveTenantGroupId(null);
      handleFetchTenantGroup();
    }
  };

  if (location.pathname === "/") {
    return (
      <aside className="h-screen w-[319px] flex flex-col py-6 px-4 shadow-lg dark:bg-gray-800 dark:text-white dark:border-r-1 dark:border-gray-700  bg-white border-r-1 border-gray-200 text-gray-900 transition-colors duration-200">
        <div className="flex flex-col gap-2 mb-6">
          <button
            onClick={handleCreateExpense}
            className="flex items-center gap-2 px-3 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition"
          >
            <FaPen /> Create New Expense
          </button>
          <button
            onClick={handleOpenTenantGroupDialog}
            className="flex items-center gap-2 px-3 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            <FaPlus /> Create New Group
          </button>
          <ReportDropdown />
          <button
            onClick={() => handleSetActiveTenantGroupId(null)}
            className={`flex items-center gap-2 px-3 py-2 rounded ${
              activeTenantGroupId === null
                ? "bg-blue-100 dark:bg-blue-900 font-bold"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }  transition`}
          >
            <FaUser /> Personal Details
          </button>
        </div>

        {/* Groups List */}
        <div className="flex-1 overflow-y-auto">
          <h3 className="flex items-center gap-2 font-semibold mb-2 text-sm uppercase tracking-wide">
            <FaUserFriends />
            Groups
          </h3>
          {tenantGroup.length === 0 ? (
            <div className="text-gray-400 text-sm">No groups joined yet.</div>
          ) : (
            <ul className="space-y-1">
              {tenantGroup.map((group) => (
                <li key={group._id}>
                  <div
                    onClick={() => handleSetActiveTenantGroupId(group._id)}
                    className={`w-full text-left px-3 py-2 flex justify-between items-center rounded ${
                      activeTenantGroupId === group._id
                        ? "bg-blue-100 dark:bg-blue-900 font-bold"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    } transition`}
                  >
                    <span>{group.name}</span>
                    <button
                      onClick={() => handleDeleteTenantGroup(group._id)}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    );
  }
  return <></>;
}
