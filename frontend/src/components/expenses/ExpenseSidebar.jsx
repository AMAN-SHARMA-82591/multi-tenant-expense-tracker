import { FaPlus, FaUser, FaPen } from "react-icons/fa";
import { useLocation } from "react-router";
import ReportDropdown from "../common/ReportDropdown";

export default function ExpenseSidebar({
  activeGroupId,
  onSelectGroup,
  tenantGroups = [],
  handleCreateExpense,
  onShowPersonalDetails,
  handleOpenTenantGroupDialog,
}) {
  const location = useLocation();
  if (location.pathname === "/") {
    return (
      <aside className="h-screen w-[319px] flex flex-col py-6 px-4 shadow-lg dark:bg-gray-800 dark:text-white dark:border-r-1 dark:border-gray-700  bg-white border-r-1 border-gray-200 text-gray-900 transition-colors duration-200">
        {/* <div className="flex items-center justify-between mb-6">
          <span className="font-bold text-lg">Expense Tracker</span>
        </div> */}

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
            onClick={onShowPersonalDetails}
            className="flex items-center gap-2 px-3 py-2 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          >
            <FaUser /> Personal Details
          </button>
        </div>

        {/* Groups List */}
        <div className="flex-1 overflow-y-auto">
          <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide">
            Joined Groups
          </h3>
          {tenantGroups.length === 0 ? (
            <div className="text-gray-400 text-sm">No groups joined yet.</div>
          ) : (
            <ul className="space-y-1">
              {tenantGroups.map((group) => (
                <li key={group.id}>
                  <button
                    onClick={() => onSelectGroup(group.id)}
                    className={`w-full text-left px-3 py-2 rounded ${
                      activeGroupId === group.id
                        ? "bg-blue-100 dark:bg-blue-900 font-bold"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    } transition`}
                  >
                    {group.name}
                  </button>
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
