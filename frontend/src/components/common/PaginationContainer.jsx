export default function PaginationContainer({
  paginatefn,
  totalPages,
  currentPage,
}) {
  return (
    <nav className="flex justify-center mt-4">
      <ul className="inline-flex items-center -space-x-px">
        <li>
          <button
            onClick={() => paginatefn(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
          >
            Previous
          </button>
        </li>
        {[...Array(totalPages).keys()].map((number) => (
          <li key={number + 1}>
            <button
              onClick={() => paginatefn(number + 1)}
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
            onClick={() => paginatefn(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}
