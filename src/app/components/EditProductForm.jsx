import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import LoadingIcons from "react-loading-icons";

const EditProductForm = ({ product, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({ ...product });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.patch(
        `/api/editItem`,
        formData
      );
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      toast.success("Product updated successfully!");

      onUpdate(response.data);
      onClose();
    } catch (err) {
      toast.error("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <ToastContainer/>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Edit Item
        </h2>
        <form onSubmit={handleSubmit}>
          {["name", "description", "price", "category", "image"].map(
            (field) => (
              <div className="mb-6" key={field}>
                <label
                  htmlFor={field}
                  className="block text-gray-700 text-sm font-bold mb-2 capitalize"
                >
                  {field}
                </label>
                <input
                  type="text"
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
            )
          )}

          <div className="flex flex-col items-center justify-center space-y-4">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {loading ? (
                <LoadingIcons.BallTriangle
                  stroke="#fff"
                  strokeWidth={2}
                  className="w-6 h-6 animate-spin"
                />
              ) : (
                "Update Item"
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductForm;
