import { useState } from "react";
import axiosInstance from "../utils/AxiosInstance";
import { createExpenseSchema } from "../utils/formValidate";

const inititalValues = {
  title: "",
  category: "",
  amount: 0,
  date: "",
};

const NewExpenseDialog = ({
  paginate,
  openDialog,
  fetchExpenseList,
  handleOpenCreateDialog,
}) => {
  const [formData, setFormData] = useState(inititalValues);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPending(true);
    try {
      await createExpenseSchema.validate(formData, { abortEarly: false });
      const response = await axiosInstance.post("/expense", {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString(),
      });
      if (response.data.success) {
        paginate(1);
        fetchExpenseList();
        handleOpenCreateDialog();
        setFormData(inititalValues);
      } else {
        alert("Failed to create new expense");
      }
    } catch (error) {
      if (error.inner) {
        const messages = error.inner.map((err) => err.message).join("\n");
        alert(messages);
      } else {
        alert(error.message);
      }
    } finally {
      setPending(false);
    }
  };

  const handleCloseDialog = () => {
    handleOpenCreateDialog();
    setFormData(inititalValues);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  function SubmitButton() {
    return (
      <button
        type="submit"
        disabled={pending}
        className={
          pending
            ? "bg-blue-300 text-white px-4 py-2 rounded-mdtransition-colors"
            : "bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        }
      >
        {pending ? "Submitting..." : "Submit"}
      </button>
    );
  }

  return (
    <div
      style={!openDialog ? { display: "none" } : {}}
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50"
    >
      <div className="relative bg-white p-8 rounded-lg shadow-xl w-11/12 max-w-lg">
        <h3 className="text-xl font-semibold mb-4">Add New Expense</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Category
            </label>
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Amount ($)
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCloseDialog}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewExpenseDialog;
