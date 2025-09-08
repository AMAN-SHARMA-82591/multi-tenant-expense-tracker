import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import axiosInstance from "../utils/AxiosInstance";
import ExpenseTable from "../expenses/ExpenseTable";
import PaginationContainer from "../common/PaginationContainer";
import ExpenseSidebar from "./ExpenseSidebar";
import NewExpenseDialog from "./NewExpenseDialog";
import NewTenantGroup from "./NewTenantGroup";

const limit = 10;
function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [tenantGroup, setTenantGroupList] = useState([]);
  const [openTenantGroup, setOpenTenantGroup] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [activeTenantGroupId, setActiveTenantGroupId] = useState(null);
  const totalPages = Math.ceil(expenses?.data?.total / limit) || 1;

  const fetchExpenseList = useCallback(async (tenantId = null, page = 1) => {
    setLoading(true);
    try {
      const endpoint = tenantId ? `tenant/${tenantId}/expense` : "/expense";
      const response = await axiosInstance.get(
        `${endpoint}?page=${page}&limit=${limit}`
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

  const handleFetchTenantGroup = useCallback(async () => {
    const response = await axiosInstance.get("/tenant");
    if (response.data.success) {
      setTenantGroupList(response.data.data.group);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (activeTenantGroupId) {
      params.set("tenantId", activeTenantGroupId);
    }
    // setCurrentPage(currentPage + 1);
    params.set("page", currentPage.toString());
    params.set("limit", limit.toString());
    setSearchParams(params);
  }, [activeTenantGroupId, setSearchParams, currentPage]);

  useEffect(() => {
    fetchExpenseList(null, currentPage);
  }, [currentPage, fetchExpenseList]);

  useEffect(() => {
    handleFetchTenantGroup();
  }, [handleFetchTenantGroup]);

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
          tenantGroup={tenantGroup}
          fetchExpenseList={fetchExpenseList}
          activeTenantGroupId={activeTenantGroupId}
          handleCreateExpense={handleOpenCreateDialog}
          setActiveTenantGroupId={setActiveTenantGroupId}
          handleFetchTenantGroup={handleFetchTenantGroup}
          handleOpenTenantGroupDialog={handleOpenTenantGroupDialog}
        />
      </div>

      <div className="w-full min-h-screen transition-colors duration-200 mx-auto p-4 dark:bg-gray-800 dark:border-gray-700">
        {/* Expense List table */}
        <ExpenseTable expenses={expenses} loading={loading} />

        {/* <button
          className="text-white bg-amber-500 cursor-pointer"
          onClick={() => {
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.set("page", "2");
            setSearchParams(newParams);
          }}
        >
          increase
        </button> */}
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
