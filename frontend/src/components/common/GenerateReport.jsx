const GenerateReport = ({
  report,
  selectedMonth,
  reportDialog,
  handleSetReportDialog,
}) => {
  return (
    <div
      style={!reportDialog ? { display: "none" } : {}}
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50"
    >
      <div className="relative bg-white p-8 rounded-lg shadow-xl w-11/12 max-w-lg">
        <h3 className="text-xl font-semibold mb-4">Generated Report</h3>
        <p>
          You spend {report?.totalSpend} in {selectedMonth}, mostly on{" "}
          {report?.topCategory} ({report?.topCategorySpend})
        </p>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleSetReportDialog}
            className="bg-gray-300 text-gray-800 mt-2 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateReport;
