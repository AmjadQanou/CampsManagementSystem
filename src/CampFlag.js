import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCampground } from 'react-icons/fa'; // Tent icon

export default function CampFlag({ campName = "Green Valley Camp" }) {
  const [isOpen, setIsOpen] = useState(false);

  // On component mount, check if there's a saved state in localStorage
  useEffect(() => {
    const storedState = localStorage.getItem('flagState');
    if (storedState !== null) {
      setIsOpen(JSON.parse(storedState)); // Set the flag's state based on localStorage
    }
  }, []);

  // Whenever the state changes, save it to localStorage
  useEffect(() => {
    localStorage.setItem('flagState', JSON.stringify(isOpen));
  }, [isOpen]);

  return (
    <motion.div
      onClick={() => setIsOpen(!isOpen)}
      initial={false}
      animate={{ x: isOpen ? -200 : -100 }} 
      transition={{ type: 'spring', stiffness: 100 }}
      className="fixed bottom-32 -left-5 z-50 cursor-pointer"
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
        className="relative w-40 h-14 bg-gradient-to-r from-[#A6B78D] to-[#DC7F56] text-white font-semibold text-lg rounded-lg shadow-lg flex items-center px-4 gap-2"
      >
        <div className="absolute -left-2 h-full w-1 bg-gray-900 rounded-l-full shadow-inner" />
        <FaCampground className="text-yellow-300 text-xl drop-shadow-md animate-pulse" />
        <span className="z-10 drop-shadow-sm">{campName}</span>
      </motion.div>
    </motion.div>
  );
}
