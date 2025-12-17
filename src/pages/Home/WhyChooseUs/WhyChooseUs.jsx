import { motion } from "framer-motion";
import { Shield, Rocket, ThumbsUp, BarChart } from "lucide-react";

const reasons = [
  {
    icon: <Shield size={40} />,
    title: "Secure & Reliable",
    desc: "Your reports and data are protected with industry-grade security.",
  },
  {
    icon: <Rocket size={40} />,
    title: "Fast & Efficient",
    desc: "Reports get processed quickly with automated workflows and smart assignment.",
  },
  {
    icon: <ThumbsUp size={40} />,
    title: "User-Friendly Experience",
    desc: "A clean, modern UI built to make reporting easier for everyone.",
  },
    {
    icon: <BarChart size={40} />,
    title: "Smart Insights",
    desc: "Admins get analytics for better decision making and planning.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 px-6 md:px-12 lg:px-20 bg-base-100">
      
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          Why Choose Our Platform?
        </h2>
        <p className="text-base-content/70 max-w-xl mx-auto">
          A powerful, secure, and intelligent solution for modern cities.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {reasons.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.06, rotateX: 5 }}
            className="p-8 bg-base-200 rounded-2xl shadow-xl hover:border-primary border border-transparent transition-all duration-300"
          >
            <div className="text-primary mb-5">{item.icon}</div>
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="opacity-80 text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
