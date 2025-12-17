import { motion } from "framer-motion";
import { ShieldCheck, Clock, BarChart3, Zap, Users, MapPin } from "lucide-react";

const features = [
  {
    icon: <ShieldCheck size={40} />,
    title: "Transparent Issue Tracking",
    desc: "Track your reported issues in real-time from Pending → In-Progress → Resolved → Closed.",
  },
  {
    icon: <Clock size={40} />,
    title: "Faster Response Time",
    desc: "Smart admin dashboard ensures quicker staff assignment and faster problem resolution.",
  },
  {
    icon: <Zap size={40} />,
    title: "Priority for Premium Citizens",
    desc: "Premium users get lightning-fast support and boosted visibility on their issues.",
  },
  {
    icon: <Users size={40} />,
    title: "Citizen–Admin Collaboration",
    desc: "Citizens, admins, and staff work together seamlessly to fix public problems.",
  },
  {
    icon: <MapPin size={40} />,
    title: "Location-Based Reporting",
    desc: "Submit issues with precise location, photos, and details for better verification.",
  },
  {
    icon: <BarChart3 size={40} />,
    title: "Data-Driven Insights",
    desc: "The system generates analytics to help municipalities improve infrastructure planning.",
  },
];

const FeatureSection = () => {
  return (
    <div className="bg-base-100 py-20 px-6 md:px-12 lg:px-20">
      
      {/* Top Heading */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          Powerful Features for a Smarter City
        </h2>
        <p className="text-lg text-base-content/70 mx-auto max-w-2xl">
          A digital platform designed to make public service reporting fast, transparent, and efficient.
        </p>
      </motion.div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, rotateX: 5, rotateY: -5 }}
            className="p-8 rounded-2xl bg-base-200  shadow-xl border border-primary/20 hover:shadow-2xl hover:border-primary transition-all duration-300"
          >
            <div className="text-primary mb-4">{f.icon}</div>
            <h3 className="text-xl font-bold mb-2">{f.title}</h3>
            <p className="text-sm opacity-80">{f.desc}</p>
          </motion.div>
        ))}
      </div>

    </div>
  );
};

export default FeatureSection;
