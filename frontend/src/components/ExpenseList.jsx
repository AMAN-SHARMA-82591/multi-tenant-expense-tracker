import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./utils/contextApi";
import axiosInstance from "./utils/AxiosInstance";
import NewExpenseDialog from "./common/NewExpenseDialog";
import { MONTH } from "./utils/constants";
import GenerateReport from "./common/GenerateReport";

const limit = 10;
function ExpenseList() {
  let content;
  const { logout } = useAuth();
  const [report, setReport] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [reportDialog, setOpenReportDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isReportDropdownOpen, setIsReportDropdownOpen] = useState(false);
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
    setOpenDialog(!openDialog);
  };

  const handleCreateExpense = async () => {
    handleOpenCreateDialog();
  };

  const getPastMonths = () => {
    const currentMonth = new Date().getMonth();
    return MONTH.slice(0, currentMonth + 1);
  };

  const handleGenerateReport = async (monthIndex, monthName) => {
    setIsReportDropdownOpen(false);
    try {
      const response = await axiosInstance.get(
        `/expense/generate-report?month=${monthIndex}`
      );
      setReport(response.data?.report);
      if (!response.data) {
        alert("Error generating report.");
      }
    } catch (error) {
      console.error("Error generating report.", error);
    } finally {
      setSelectedMonth(monthName);
      setOpenReportDialog(true);
    }
  };

  const handleSetReportDialog = () => {
    setSelectedMonth(null);
    setOpenReportDialog(false);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    content = (
      <tbody className="text-gray-500">
        <tr>
          <td className="px-6 py-4" colSpan={4}>
            Loading expenses...
          </td>
        </tr>
      </tbody>
    );
  } else if (expenses?.data?.total === 0) {
    content = (
      <tbody className="text-gray-600">
        <tr>
          <td className="px-6 py-4" colSpan={4}>
            No data present. Create expense.
          </td>
        </tr>
      </tbody>
    );
  } else {
    content = (
      <tbody className="bg-white divide-y divide-gray-200">
        {expenses?.data?.expenseList.map((expense) => (
          <tr key={expense._id}>
            <td className="px-6 py-4 whitespace-nowrap">{expense.title}</td>
            <td className="px-6 py-4 whitespace-nowrap">{expense.category}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              ${expense.amount.toFixed(2)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {new Date(expense.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </td>
          </tr>
        ))}
      </tbody>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Expense List</h2>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="flex space-x-4 mb-4">
        <button
          onClick={handleCreateExpense}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
        >
          Create New Expense
        </button>

        <div className="relative inline-block text-left">
          <button
            onClick={() => setIsReportDropdownOpen(!isReportDropdownOpen)}
            className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
          >
            Generate Report
            <svg
              className="-mr-1 ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {isReportDropdownOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                {getPastMonths().map((month, index) => (
                  <div
                    key={index}
                    onClick={() => handleGenerateReport(index + 1, month)}
                    className="block font-bold text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                    role="menuitem"
                  >
                    {month}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          {content}
        </table>
      </div>

      <nav className="flex justify-center mt-4">
        <ul className="inline-flex items-center -space-x-px">
          <li>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
            >
              Previous
            </button>
          </li>
          {[...Array(totalPages).keys()].map((number) => (
            <li key={number + 1}>
              <button
                onClick={() => paginate(number + 1)}
                className={`px-3 py-2 leading-tight ${
                  currentPage === number + 1
                    ? "text-blue-600 bg-blue-50 border-blue-300"
                    : "text-gray-500 bg-white border border-gray-300"
                } hover:bg-gray-100 hover:text-gray-700`}
              >
                {number + 1}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
      <GenerateReport
        report={report}
        reportDialog={reportDialog}
        selectedMonth={selectedMonth}
        handleSetReportDialog={handleSetReportDialog}
      />
      <NewExpenseDialog
        paginate={paginate}
        openDialog={openDialog}
        fetchExpenseList={fetchExpenseList}
        handleOpenCreateDialog={handleOpenCreateDialog}
      />
    </div>
  );
}

export default ExpenseList;
