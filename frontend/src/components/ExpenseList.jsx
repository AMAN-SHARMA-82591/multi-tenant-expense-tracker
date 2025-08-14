import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./utils/contextApi";
import axiosInstance from "./utils/AxiosInstance";
import ExpenseTable from "./expenses/ExpenseTable";
import ReportDropdown from "./common/ReportDropdown";
import NewExpenseDialog from "./common/NewExpenseDialog";
import PaginationContainer from "./common/PaginationContainer";

const limit = 10;
function ExpenseList() {
  const { user, logout } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const totalPages = Math.ceil(expenses?.data?.total / limit) || 1;

  const fetchExpenseList = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/expense?page=${page}&limit=${limit}`
      );
      if (!response.data) {
        alert("error fetching expense list.");
      }
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenseList(currentPage);
  }, [currentPage, fetchExpenseList]);

  const handleOpenCreateDialog = async () => {
    setOpenCreateDialog(!openCreateDialog);
  };

  const handleCreateExpense = async () => {
    handleOpenCreateDialog();
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Expense List</h2>
        <div className="flex items-center capitalize">
          <h1 className="mr-10">{user?.username}</h1>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex space-x-4 mb-4">
        <button
          onClick={handleCreateExpense}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
        >
          Create New Expense
        </button>
        <ReportDropdown />
      </div>
      {/* Expense List table */}
      <ExpenseTable expenses={expenses} loading={loading} />

      <PaginationContainer
        paginatefn={paginate}
        totalPages={totalPages}
        currentPage={currentPage}
      />

      {openCreateDialog && (
        <NewExpenseDialog
          paginate={paginate}
          openCreateDialog={openCreateDialog}
          fetchExpenseList={fetchExpenseList}
          handleOpenCreateDialog={handleOpenCreateDialog}
        />
      )}
    </div>
  );
}

export default ExpenseList;
