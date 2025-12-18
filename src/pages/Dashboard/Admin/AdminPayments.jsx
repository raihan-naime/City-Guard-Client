import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { motion } from "framer-motion";
import {
  FaDollarSign,
  FaUser,
  FaClipboardList,
  FaCalendarAlt,
  FaFilePdf,
} from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AdminPayments = () => {
  const axiosSecure = useAxiosSecure();

  const { data: payments = [] } = useQuery({
    queryKey: ["admin-payments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payments");
      return res.data;
    },
  });

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("All Payments Report", 20, 10);
    
    const tableColumn = ["User", "Email", "Amount", "Purpose", "Transaction ID", "Date"];
    const tableRows = [];

    payments.forEach(pay => {
        const paymentData = [
            pay.user?.name || "Unknown",
            pay.user?.email || "N/A",
            `$${pay.amount}`,
            pay.purpose,
            pay.transactionId,
            new Date(pay.date).toLocaleDateString()
        ];
        tableRows.push(paymentData);
    });

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20
    });

    doc.save("payments_report.pdf");
  };

  return (
    <motion.div
      className="p-6 bg-gradient-to-r from-purple-50 via-pink-50 to-yellow-50 rounded-2xl shadow-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <motion.h2
        className="text-3xl font-bold mb-6 flex items-center gap-3 text-purple-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05, color: "#d53f8c" }}
        transition={{ duration: 0.5 }}
      >
        <FaClipboardList className="text-pink-500" /> All Payments
      </motion.h2>

      <div className="flex justify-end mb-4">
          <button onClick={handleDownloadPDF} className="btn bg-red-500 hover:bg-red-600 text-white flex items-center gap-2">
              <FaFilePdf /> Download PDF
          </button>
      </div>

      <div className="overflow-x-auto rounded-lg">
        <motion.table
          className="table w-full text-left rounded-lg overflow-hidden shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <thead className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white">
            <tr>
              <th className="p-3">
                <div className="flex items-center gap-2">
                  <FaUser /> User
                </div>
              </th>
              <th className="p-3">
                <div className="flex items-center gap-2">
                  <FaDollarSign /> Amount
                </div>
              </th>
              <th className="p-3">
                <div className="flex items-center gap-2">Purpose</div>
              </th>
              <th className="p-3">
                <div className="flex items-center gap-2">Transaction ID</div>
              </th>
              <th className="p-3">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt /> Date
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            {payments.map((pay) => (
              <motion.tr
                key={pay._id}
                className="even:bg-pink-50 odd:bg-purple-50 hover:bg-yellow-100 cursor-pointer transition-all duration-300 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
                }}
              >
                <td className="p-3">
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <div className="font-bold text-purple-700">
                      {pay.user?.name || "Unknown"}
                    </div>
                    <div className="text-xs opacity-60 text-gray-600">
                      {pay.user?.email}
                    </div>
                  </motion.div>
                </td>
                <td className="p-3">
                  <motion.div
                    className={`inline-block px-3 py-1 rounded-full font-semibold text-white ${
                      pay.amount > 100 ? "bg-pink-500" : "bg-purple-500"
                    }`}
                    whileHover={{ scale: 1.1, rotate: 1 }}
                  >
                    ${pay.amount}
                  </motion.div>
                </td>
                <td className="p-3">
                  <motion.div whileHover={{ scale: 1.05, color: "#d53f8c" }}>
                    {pay.purpose}
                  </motion.div>
                </td>
                <td className="p-3 font-mono text-gray-700 hover:text-pink-600 transition-colors">
                  {pay.transactionId}
                </td>
                <td className="p-3">
                  <motion.div whileHover={{ scale: 1.05, color: "#805ad5" }}>
                    {new Date(pay.date).toLocaleDateString()}
                  </motion.div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      </div>
    </motion.div>
  );
};

export default AdminPayments;
