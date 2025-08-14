import { useRef, useState } from "react";
import { MONTH } from "../utils/constants";
import GenerateReport from "./GenerateReport";
import axiosInstance from "../utils/AxiosInstance";

const ReportDropdown = () => {
  const [report, setReport] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [reportDialog, setOpenReportDialog] = useState(false);
  const [isReportDropdownOpen, setIsReportDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

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

  return (
    <>
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
          <div
            ref={dropdownRef}
            className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          >
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
        {reportDialog && (
          <GenerateReport
            report={report}
            reportDialog={reportDialog}
            selectedMonth={selectedMonth}
            handleSetReportDialog={handleSetReportDialog}
          />
        )}
      </div>
    </>
  );
};

export default ReportDropdown;
