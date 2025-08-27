import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Users } from 'lucide-react';

export default function RegisterChoice() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] dark:bg-gray-800 p-6">
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-10 max-w-md w-full space-y-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-center text-[#DC7F56]">اختر نوع الحساب</h2>

        <motion.button
          onClick={() => navigate('/dpregister')}
          className="w-full flex items-center justify-center gap-3 bg-[#DC7F56] text-white py-3 rounded-xl text-lg font-semibold hover:bg-[#c06d47] transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Users size={20} /> تسجيل كنازح
        </motion.button>

        <motion.button
          onClick={() => navigate('/register')}
          className="w-full flex items-center justify-center gap-3 border-2 border-[#DC7F56] text-[#DC7F56] py-3 rounded-xl text-lg font-semibold hover:bg-[#DC7F56] hover:text-white transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <UserPlus size={20} /> تسجيل كمدير
        </motion.button>
      </motion.div>
    </div>
  );
}
