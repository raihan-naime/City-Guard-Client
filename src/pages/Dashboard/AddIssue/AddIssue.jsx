import { useForm } from "react-hook-form";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSend, FiMapPin, FiTag, FiImage, FiFileText } from "react-icons/fi";

const AddIssue = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const issueData = {
      title: data.title,
      description: data.description,
      category: data.category,
      location: data.location,
      image: data.image, // URL
    };

    try {
      const res = await axiosSecure.post("/issues", issueData);
      if (res.data._id) {
        reset();
        Swal.fire("Success", "Issue reported successfully", "success");
        navigate("/dashboard/my-issues");
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl  font-extrabold mb-6 tracking-wide text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500">
        Report a New Issue
      </h2>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-200"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <motion.div whileHover={{ scale: 1.01 }} className="form-control">
            <label className="label flex items-center gap-2">
              <FiFileText className="text-purple-500" />
              <span className="label-text font-semibold">Issue Title</span>
            </label>
            <input
              type="text"
              {...register("title", { required: "Issue title is required" })}
              placeholder="e.g. Broken Streetlight"
              className="input input-bordered w-full shadow-md focus:shadow-lg transition-all"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </motion.div>

          {/* Category + Location */}
          <div className="flex gap-4">
            <motion.div whileHover={{ scale: 1.01 }} className="form-control w-1/2">
              <label className="label flex items-center gap-2">
                <FiTag className="text-pink-500" />
                <span className="label-text font-semibold">Category</span>
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className="select select-bordered shadow-md focus:shadow-lg transition-all"
              >
                <option value="Roads">Roads</option>
                <option value="Water">Water</option>
                <option value="Electricity">Electricity</option>
                <option value="Garbage">Garbage</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
              )}
            </motion.div>

            <motion.div whileHover={{ scale: 1.01 }} className="form-control w-1/2">
              <label className="label flex items-center gap-2">
                <FiMapPin className="text-green-500" />
                <span className="label-text font-semibold">Location</span>
              </label>
              <input
                type="text"
                {...register("location", { required: "Location is required" })}
                placeholder="e.g. 12th Street, Uttara"
                className="input input-bordered w-full shadow-md focus:shadow-lg transition-all"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
              )}
            </motion.div>
          </div>

          {/* Image URL */}
          <motion.div whileHover={{ scale: 1.01 }} className="form-control">
            <label className="label flex items-center gap-2">
              <FiImage className="text-blue-500" />
              <span className="label-text font-semibold">Image URL</span>
            </label>
            <input
              type="text"
              {...register("image", { required: "Image URL is required" })}
              placeholder="https://..."
              className="input input-bordered w-full shadow-md focus:shadow-lg transition-all"
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
            )}
          </motion.div>

          {/* Description */}
          <motion.div whileHover={{ scale: 1.01 }} className="form-control">
            <label className="label flex items-center gap-2">
              <FiFileText className="text-indigo-500" />
              <span className="label-text font-semibold">Description</span>
            </label>
            <textarea
              {...register("description", { required: "Description is required" })}
              className="textarea textarea-bordered w-full h-28 shadow-md focus:shadow-lg transition-all"
              placeholder="Describe the issue in detail..."
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.03, backgroundColor: "#805ad5" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="btn btn-gradient w-full flex items-center gap-2 text-lg shadow-md hover:shadow-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          >
            Submit Issue <FiSend size={20} />
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddIssue;
