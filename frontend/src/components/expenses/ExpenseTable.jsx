const ExpenseTable = ({ expenses, loading }) => {
  let content;
  if (loading) {
    content = (
      <tbody className="text-gray-500 dark:text-gray-400">
        <tr>
          <td className="px-6 py-4" colSpan={4}>
            Loading expenses...
          </td>
        </tr>
      </tbody>
    );
  } else if (expenses?.data?.total === 0) {
    content = (
      <tbody className="text-gray-600 dark:text-gray-400">
        <tr>
          <td className="px-6 py-4" colSpan={4}>
            No data present. Create expense.
          </td>
        </tr>
      </tbody>
    );
  } else {
    content = (
      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
        {expenses?.data?.expenseList.map((expense) => (
          <tr
            key={expense._id}
            className="hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <td className="px-6 py-4 whitespace-nowrap dark:text-white">
              {expense.title}
            </td>
            <td className="px-6 py-4 whitespace-nowrap dark:text-white">
              {expense.category}
            </td>
            <td className="px-6 py-4 whitespace-nowrap dark:text-white">
              ${expense.amount.toFixed(2)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap dark:text-white">
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-200 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Date
            </th>
          </tr>
        </thead>
        {content}
      </table>
    </div>
  );
};

export default ExpenseTable;
