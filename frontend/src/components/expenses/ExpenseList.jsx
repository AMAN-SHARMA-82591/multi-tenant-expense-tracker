import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../utils/AxiosInstance";
import ExpenseTable from "../expenses/ExpenseTable";
import PaginationContainer from "../common/PaginationContainer";
import ExpenseSidebar from "./ExpenseSidebar";
import NewExpenseDialog from "./NewExpenseDialog";
import NewTenantGroup from "./NewTenantGroup";
import { useQueryParams } from "../hooks/useQueryParams";
import ExpenseHeader from "./ExpenseHeader";
import { toastError } from "../common/ToastContainer";

const limit = 10;

function ExpenseList() {
  const { getParam, setParam } = useQueryParams();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tenantGroup, setTenantGroupList] = useState([]);
  const [openTenantGroup, setOpenTenantGroup] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [selectedTenantGroup, setSelectedTenantGroup] = useState(null);

  // Getting URL Params
  const currentPage = Number(getParam("page")) || 1;
  const activeTenantGroupId = getParam("tenantId") || null;
  const totalPages = Math.ceil(expenses?.data?.total / limit) || 1;

  const fetchExpenseList = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/expense?page=${currentPage}&limit=${limit}&tenantId=${activeTenantGroupId}`
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
  }, [activeTenantGroupId, currentPage]);

  const handleFetchTenantGroup = useCallback(async () => {
    const response = await axiosInstance.get("/tenant");
    try {
      if (response.data.success) {
        setTenantGroupList(response.data.data);
      }
    } catch (error) {
      console.error(error);
      toastError("Failed to fetch tenant groups.");
    }
  }, []);

  useEffect(() => {
    fetchExpenseList(activeTenantGroupId, currentPage);
  }, [activeTenantGroupId, currentPage, fetchExpenseList]);

  useEffect(() => {
    handleFetchTenantGroup();
  }, [handleFetchTenantGroup]);

  const handleOpenCreateDialog = () => setOpenCreateDialog(!openCreateDialog);
  const handleOpenTenantGroupDialog = () =>
    setOpenTenantGroup(!openTenantGroup);

  const paginate = (pageNumber) => {
    setParam({ page: pageNumber, limit });
  };

  const handleSetActiveTenantGroupId = (tenantId) => {
    setParam({ page: 1, limit, tenantId });
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="transition-all duration-300 w-80 -translate-x-full md:translate-x-0">
        <ExpenseSidebar
          tenantGroup={tenantGroup}
          fetchExpenseList={fetchExpenseList}
          activeTenantGroupId={activeTenantGroupId}
          handleFetchTenantGroup={handleFetchTenantGroup}
          setSelectedTenantGroup={setSelectedTenantGroup}
          handleOpenTenantGroupDialog={handleOpenTenantGroupDialog}
          handleSetActiveTenantGroupId={handleSetActiveTenantGroupId}
        />
      </div>

      <div className="w-full min-h-screen transition-colors duration-200 mx-auto p-4 dark:bg-gray-800 dark:border-gray-700">
        <ExpenseHeader
          onCreateExpense={handleOpenCreateDialog}
          onInviteUsers={() => {}}
          onSearch={() => {}}
          onSort={() => {}}
          onFilter={() => {}}
          sortOrder=""
          filterValue=""
          searchValue="Search Expense"
          selectedTenantGroup={selectedTenantGroup}
        />

        {/* Expense List table */}
        <ExpenseTable expenses={expenses} loading={loading} />

        <PaginationContainer
          paginatefn={paginate}
          totalPages={totalPages}
          currentPage={currentPage}
        />

        {openCreateDialog && (
          <NewExpenseDialog
            openCreateDialog={openCreateDialog}
            fetchExpenseList={fetchExpenseList}
            activeTenantGroupId={activeTenantGroupId}
            handleOpenCreateDialog={handleOpenCreateDialog}
          />
        )}
        {openTenantGroup && (
          <NewTenantGroup
            paginate={paginate}
            openTenantGroup={openTenantGroup}
            handleFetchTenantGroup={handleFetchTenantGroup}
            handleOpenTenantGroupDialog={handleOpenTenantGroupDialog}
          />
        )}
      </div>
    </div>
  );
}

export default ExpenseList;
