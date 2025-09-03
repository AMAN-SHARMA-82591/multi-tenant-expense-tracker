import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../utils/AxiosInstance";
import ExpenseTable from "../expenses/ExpenseTable";
import PaginationContainer from "../common/PaginationContainer";
import ExpenseSidebar from "./ExpenseSidebar";
import NewExpenseDialog from "./NewExpenseDialog";
import NewTenantGroup from "./NewTenantGroup";

const limit = 10;
function ExpenseList() {
  // const { user, logout } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openTenantGroup, setOpenTenantGroup] = useState(false);
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

  const handleOpenTenantGroupDialog = async () => {
    setOpenTenantGroup(!openTenantGroup);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="transition-all duration-300 w-80 -translate-x-full md:translate-x-0">
        <ExpenseSidebar
          handleCreateExpense={handleOpenCreateDialog}
          handleOpenTenantGroupDialog={handleOpenTenantGroupDialog}
        />
      </div>
      <div className="w-full min-h-screen transition-colors duration-200 mx-auto p-4 dark:bg-gray-800 dark:border-gray-700">
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
        {openTenantGroup && (
          <NewTenantGroup
            paginate={paginate}
            openTenantGroup={openTenantGroup}
            fetchExpenseList={fetchExpenseList}
            handleOpenTenantGroupDialog={handleOpenTenantGroupDialog}
          />
        )}
      </div>
    </div>
  );
}

export default ExpenseList;
