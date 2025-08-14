const ExpenseTable = ({ expenses, loading }) => {
  let content;
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
  );
};

export default ExpenseTable;
