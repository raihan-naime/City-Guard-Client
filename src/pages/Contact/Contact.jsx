import { motion } from "framer-motion";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <section className="py-20 my-20 bg-base-200">
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold">Contact Us</h2>
          <p className="mt-3 text-base-content/70">
            Have a question or need support? We’re here to help.
          </p>
        </motion.div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="card bg-base-100 shadow-xl rounded-2xl p-8"
          >
            <h3 className="text-2xl font-semibold mb-6">Get in Touch</h3>

            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <FaEnvelope className="text-primary text-xl" />
                <span>support@cityguard.com</span>
              </div>
              <div className="flex items-center gap-4">
                <FaPhoneAlt className="text-primary text-xl" />
                <span>+880 1234 567 890</span>
              </div>
              <div className="flex items-center gap-4">
                <FaMapMarkerAlt className="text-primary text-xl" />
                <span>Dhaka City Corporation, Bangladesh</span>
              </div>
            </div>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="card bg-base-100 shadow-xl rounded-2xl p-8"
          >
            <form className="space-y-5">
              <input
                type="text"
                placeholder="Your Name"
                className="input input-bordered w-full"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="input input-bordered w-full"
              />
              <textarea
                rows="4"
                placeholder="Your Message"
                className="textarea textarea-bordered w-full"
              ></textarea>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary w-full"
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
