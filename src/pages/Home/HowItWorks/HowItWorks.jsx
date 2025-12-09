import { motion } from "framer-motion";
import { Camera, UserCheck, Wrench, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: <Camera size={40} />,
    title: "1. Citizens Report Issues",
    desc: "Submit issue details with photos, location, and category using the platform.",
  },
  {
    icon: <UserCheck size={40} />,
    title: "2. Admin Reviews & Assigns",
    desc: "Admin verifies the report and assigns it to the appropriate staff.",
  },
  {
    icon: <Wrench size={40} />,
    title: "3. Staff Works on the Issue",
    desc: "Assigned staff verifies, updates progress, and takes action to fix the issue.",
  },
  {
    icon: <CheckCircle size={40} />,
    title: "4. Issue Resolved & Closed",
    desc: "The system updates the status to Resolved → Closed and citizens get notifications.",
  }
];

const HowItWorks = () => {
  return (
    <section className="bg-base-200 py-20 px-6 md:px-12 lg:px-20">
      
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          How the System Works
        </h2>
        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
          A simple and transparent 4-step workflow that makes reporting and resolving city issues fast and efficient.
        </p>
      </motion.div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: i * 0.15 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, rotateX: 6 }}
            className="p-8 rounded-2xl bg-base-100 shadow-xl border border-primary/30 hover:border-primary hover:shadow-2xl transition-all duration-300"
          >
            <motion.div
              initial={{ rotate: -10, opacity: 0 }}
              whileInView={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-primary mb-5"
            >
              {step.icon}
            </motion.div>

            <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
            <p className="text-sm text-base-content/80 leading-relaxed">
              {step.desc}
            </p>
          </motion.div>
        ))}

      </div>

      {/* Animated Line or Progress Bar */}
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: "100%" }}
        transition={{ duration: 1.5, delay: 0.5 }}
        viewport={{ once: true }}
        className="h-1 bg-primary mt-20 rounded-full"
      />

    </section>
  );
};

export default HowItWorks;
