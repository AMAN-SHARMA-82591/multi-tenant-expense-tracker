import { useCallback, useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import {
  FaPlus,
  FaUserPlus,
  FaSearch,
  FaUsers,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import SubmitButton from "../common/SubmitButton";
import { toastError, toastSuccess } from "../common/ToastContainer";
import axiosInstance from "../utils/AxiosInstance";
import { tenantGroupInviteSchema } from "../utils/formValidate";
import Badge from "@mui/material/Badge";
import Popover from "@mui/material/Popover";
import UserListItem from "../common/UserListItem";

const initialValues = {
  email: "",
  message: "",
};

export default function ExpenseHeader({
  onCreateExpense,
  onSearch,
  onSort,
  onFilter,
  sortOrder = "asc",
  filterValue = "",
  searchValue = "",
  selectedTenantGroup,
}) {
  const [pending, setPending] = useState(false);
  const [search, setSearch] = useState(searchValue);
  const [filter, setFilter] = useState(filterValue);
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [formData, setFormData] = useState(initialValues);
  const [tenantGroupUsers, setTenantGroupUsers] = useState([]);
  const [toggleUsersPopover, setToggleUsersPopover] = useState(false);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    if (onFilter) onFilter(e.target.value);
  };

  const handleSortClick = () => {
    if (onSort) onSort(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleFetchTenantGroupUsers = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        `/tenant/${selectedTenantGroup?.tenant?._id}/users`
      );
      if (response.data.success) {
        setTenantGroupUsers(response.data);
      }
    } catch (error) {
      console.error(error);
      toastError("Failed to fetch list of tenant group users.");
    }
  }, [selectedTenantGroup?.tenant?._id]);

  useEffect(() => {
    if (selectedTenantGroup?.tenant?._id) {
      handleFetchTenantGroupUsers();
    }
  }, [selectedTenantGroup?.tenant?._id, handleFetchTenantGroupUsers]);

  const handleSubmitInvite = async (event) => {
    event.preventDefault();
    setPending(true);
    try {
      await tenantGroupInviteSchema.validate(formData, { abortEarly: false });
      const response = await axiosInstance.post(
        `/tenant/${selectedTenantGroup?.tenant?._id}/invite`,
        formData
      );
      if (response.data.success) {
        setOpenDialog(false);
        setFormData(initialValues);
        toastSuccess("Invitation email sent successfully.");
      }
    } catch (error) {
      console.error(error);
      toastError("Failed to send invitation email.");
    } finally {
      setPending(false);
    }
  };

  const handleCloseInviteDialog = () => {
    setOpenDialog(false);
    setFormData(initialValues);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div className="flex gap-2">
        <button
          onClick={onCreateExpense}
          className="flex items-center gap-2 px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition"
        >
          <FaPlus /> Create New Expense
        </button>
        {selectedTenantGroup?.tenant?._id &&
          selectedTenantGroup?.role === "owner" && (
            <button
              onClick={() => setOpenDialog(true)}
              className="flex items-center gap-2 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              <FaUserPlus /> Invite Users
            </button>
          )}
        {selectedTenantGroup?.tenant?._id && (
          <button
            title="Joined Users"
            onClick={(event) => {
              event.preventDefault();
              setAnchorEl(event.currentTarget);
              setToggleUsersPopover(true);
            }}
            disabled={tenantGroupUsers?.total === 0}
            className="py-2 px-4 cursor-pointer rounded-lg transition-colors dark:hover:bg-gray-700 text-gray-600 hover:bg-gray-200 dark:text-gray-300 disabled:opacity-50 disabled:cursor-default"
          >
            <Badge badgeContent={tenantGroupUsers?.total || 0} color="primary">
              <FaUsers className="text-gray-600 dark:text-gray-300 w-7 h-7" />
            </Badge>
          </button>
        )}
        <Popover
          open={toggleUsersPopover}
          anchorEl={anchorEl}
          onClose={() => {
            setToggleUsersPopover(false);
            setAnchorEl(null);
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          {tenantGroupUsers?.total > 0 &&
            tenantGroupUsers?.data.map((user) => (
              <UserListItem key={user._id} user={user} />
            ))}
        </Popover>
      </div>
      <div className="flex gap-2 items-center">
        {/* Search */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search || "search expense"}
            onChange={handleSearchChange}
            placeholder="Search expenses..."
            className="pl-10 pr-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Filter */}
        <select
          value={filter}
          onChange={handleFilterChange}
          className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none"
        >
          <option value="">All Categories</option>
          <option value="Food">Food</option>
          <option value="Shopping">Shopping</option>
          <option value="Health">Health</option>
          <option value="Transportation">Transportation</option>
          {/* Add more categories as needed */}
        </select>
        {/* Sort */}
        <button
          onClick={handleSortClick}
          className="flex items-center gap-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          title="Sort by Amount"
        >
          {sortOrder === "asc" ? <FaSortAmountDown /> : <FaSortAmountUp />}
          Sort
        </button>
      </div>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <div className="px-10 py-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-lg shadow-lg w-full max-w-md mx-auto">
          <h1 className="text-lg font-semibold mb-4">
            Send an Invitation Email
          </h1>

          <form onSubmit={handleSubmitInvite}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              autoComplete="email"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email address"
            />
            <textarea
              rows={4}
              name="message"
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              placeholder="Enter your message"
              className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={handleCloseInviteDialog}
                className="px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-md transition"
              >
                Close
              </button>
              <SubmitButton pending={pending} />
            </div>
          </form>
        </div>
      </Dialog>
    </div>
  );
}
