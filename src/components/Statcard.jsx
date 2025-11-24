import React from "react";
import { motion } from "framer-motion";

export default function StatCard({
  heading,
  value,
  description,
  smallStats,
  bgColor,
  accentColor  ,
  badgeBg ,
  badgeText ,
  index = 0
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`${bgColor} rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
    >
      
      {/* Background accent */}
      <div
        className={`absolute right-0 bottom-0 h-60 w-60 rounded-full ${accentColor} opacity-30 translate-x-6 translate-y-6`}
      ></div>

      {/* Top-right small stats */}
      <div
        className={`absolute top-4 right-4 ${badgeBg} ${badgeText} text-xs font-semibold px-3 py-1 rounded-full shadow-sm z-10`}
      >
        {smallStats}
      </div>

      <h3 className="text-gray-600 text-sm font-medium">{heading}</h3>

      <p className="text-4xl font-semibold text-gray-900 mt-2">
        {value}
      </p>

      <p className="text-gray-500 text-sm mt-1">
        {description}
      </p>
      
    </motion.div>
  );
}
