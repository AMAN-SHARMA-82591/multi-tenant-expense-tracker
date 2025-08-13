import { useEffect, useState } from "react";
import { useAuth } from "./utils/contextApi";
import axiosInstance from "./utils/AxiosInstance";

const limit = 10;
function ExpenseList() {
  const { logout } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchExpenseList = async (page = 1) => {
    const response = await axiosInstance.get(
      `/expense?page=${page}&limit=${limit}`
    );
    if (!response.data) {
      alert("error fetching expense list.");
    }
    setExpenses(response.data);
  };

  useEffect(() => {
    fetchExpenseList();
  }, []);

  const handleCreateExpense = async () => {
    const response = await axiosInstance.post("/expense", {});
  };

  const totalPages = Math.ceil(expenses?.data?.total / limit);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

      <button
        onClick={handleCreateExpense}
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors mb-4"
      >
        Create New Expense
      </button>

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
          <tbody className="bg-white divide-y divide-gray-200">
            {expenses?.data?.expenseList.map((expense) => (
              <tr key={expense._id}>
                <td className="px-6 py-4 whitespace-nowrap">{expense.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {expense.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${expense.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{expense.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages && (
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
      )}
    </div>
  );
}

export default ExpenseList;
