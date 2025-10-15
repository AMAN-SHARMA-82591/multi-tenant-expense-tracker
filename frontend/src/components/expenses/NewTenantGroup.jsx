import { useState } from "react";
import axiosInstance from "../utils/AxiosInstance";
import { createTenantGroupSchema } from "../utils/formValidate";
import SubmitButton from "../common/SubmitButton";

const inititalValues = {
  name: "",
  description: "",
};

const NewTenantGroup = ({
  openTenantGroup,
  handleFetchTenantGroup,
  handleOpenTenantGroupDialog,
}) => {
  const [formData, setFormData] = useState(inititalValues);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPending(true);
    try {
      await createTenantGroupSchema.validate(formData, { abortEarly: false });
      const response = await axiosInstance.post("/tenant", formData);
      if (response.data.success) {
        handleFetchTenantGroup();
        handleOpenTenantGroupDialog();
        setFormData(inititalValues);
      } else {
        alert("Failed to create new tenant group");
      }
    } catch (error) {
      if (error.inner) {
        const messages = error.inner.map((err) => err.message).join("\n");
        alert(messages);
      } else if (error.response) {
        const messages = error.response?.data?.message || error.message;
        alert(messages);
      } else {
        alert(error.message);
      }
    } finally {
      setPending(false);
    }
  };

  const handleCloseDialog = () => {
    handleOpenTenantGroupDialog();
    setFormData(inititalValues);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div
      style={!openTenantGroup ? { display: "none" } : {}}
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50"
    >
      <div className="relative bg-white p-8 rounded-lg shadow-xl w-11/12 max-w-lg">
        <h3 className="text-xl font-semibold mb-4">Create New Tenant Group</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              type="text"
              rows={4}
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            ></textarea>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCloseDialog}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <SubmitButton pending={pending} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTenantGroup;
