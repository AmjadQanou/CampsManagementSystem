import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCampground } from 'react-icons/fa'; 

export default function OrgFlag({ orgName = "Green Valley Camp" }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      onClick={() => setIsOpen(!isOpen)}
      initial={false}
      animate={{ x: isOpen ? 0 : -120 }} 
      transition={{ type: 'spring', stiffness: 100 }}
      className="fixed top-20 left-0 z-50 cursor-pointer"
    >
      <motion.div
        animate={{
          rotate: [0, 1, -1, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: 'easeInOut',
        }}
        className="relative w-40 h-14 bg-gradient-to-r from-[#A6B78D] to-[#DC7F56] text-white font-semibold  rounded-lg shadow-lg flex items-center px-4 gap-2"
      >
        <div className="absolute -left-2 h-full w-1 bg-gray-900 rounded-l-full shadow-inner" />


        <span className="z-10 text-[17px] drop-shadow-sm">{orgName}</span>
      </motion.div>
    </motion.div>
  );
}
