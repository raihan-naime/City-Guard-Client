import { motion } from "framer-motion";
import { Crown, Zap, Clock, Star } from "lucide-react";

const benefits = [
  {
    icon: <Zap size={40} />,
    title: "Priority Issue Handling",
    desc: "Premium users get faster review and action on their reported issues.",
  },
  {
    icon: <Clock size={40} />,
    title: "Reduced Waiting Time",
    desc: "Skip the queue and get immediate attention from staff.",
  },
  {
    icon: <Star size={40} />,
    title: "Highlighted Reports",
    desc: "Your issues are marked as premium and visible at the top for admins.",
  },
  {
    icon: <Crown size={40} />,
    title: "Exclusive Support",
    desc: "Dedicated premium support ensures better and quicker resolution.",
  },
];

const PremiumBenefits = () => {
  return (
    <section className="py-20 px-6 md:px-12 lg:px-20 bg-base-200">
      
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          Premium Citizen Benefits
        </h2>
        <p className="text-base-content/70 max-w-xl mx-auto">
          Unlock exclusive advantages and enjoy a smoother reporting experience.
        </p>
      </motion.div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {benefits.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: i * 0.15 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.08, rotateY: 8 }}
            className="p-8 bg-base-100 rounded-2xl shadow-xl border border-primary/20 hover:border-primary hover:shadow-2xl transition-all duration-300"
          >
            <div className="text-primary mb-5">{item.icon}</div>
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="text-sm text-base-content/80">{item.desc}</p>
          </motion.div>
        ))}
      </div>

    </section>
  );
};

export default PremiumBenefits;
