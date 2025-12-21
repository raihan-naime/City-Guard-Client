import {
  FaTools,
  FaCity,
  FaChartLine,
  FaHeadset,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";

// Services Component
export const Services = () => {
  const services = [
    {
      icon: <FaCity className="text-4xl text-primary" />,
      title: "Issue Reporting",
      desc: "Citizens can easily report infrastructure problems with photos and location tracking.",
    },
    {
      icon: <FaTools className="text-4xl text-primary" />,
      title: "Issue Management",
      desc: "Admins and staff verify, assign, and resolve issues efficiently.",
    },
    {
      icon: <FaChartLine className="text-4xl text-primary" />,
      title: "Analytics & Insights",
      desc: "Visualize issue trends and city performance using advanced data analytics.",
    },
    {
      icon: <FaHeadset className="text-4xl text-primary" />,
      title: "Priority Support",
      desc: "Premium citizens receive faster response and dedicated support.",
    },
  ];

  return (
    <section className="py-16  my-10 bg-base-100">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          Our Services
        </motion.h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="card bg-base-200 shadow-xl rounded-2xl p-6 text-center"
            >
              <div className="flex justify-center mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-sm opacity-80">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
