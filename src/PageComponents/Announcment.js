import React, { useContext, useState, useEffect } from "react";
import { ApiContext } from "../Context/ApiContext";
import { motion } from "framer-motion";

function Announcment() {
  const { news, loading, error } = useContext(ApiContext);
  const [positionIndexes, setPositionIndexes] = useState([]);

  useEffect(() => {
    // Initialize index positions
    if (news.length > 0) {
      setPositionIndexes(news.map((_, i) => i));
    }
  }, [news]);

  const handleNext = () => {
    setPositionIndexes((prevIndexes) =>
      prevIndexes.map((prevIndex) => (prevIndex + 1) % news.length)
    );
  };

  const positions = ["center", "left1", "left", "right", "right1"];

  const imageVariants = {
    center: { x: "0%", scale: 1, zIndex: 5 },
    left1: { x: "-50%", scale: 0.7, zIndex: 2 },
    left: { x: "-90%", scale: 0.5, zIndex: 1 },
    right: { x: "90%", scale: 0.5, zIndex: 1 },
    right1: { x: "50%", scale: 0.7, zIndex: 2 },
  };

  return (
    <div className="relative h-screen w-full bg-white overflow-hidden flex items-center justify-center">
      {news.length === 0 ? (
        <p className="text-red-500">لا توجد بيانات حالياً.</p>
      ) : (
        news.map((item, index) => (
          <motion.div
            key={index}
            className="rounded-xl overflow-hidden text-white shadow-lg text-right"
            initial="center"
            animate={positions[positionIndexes[index % positions.length]]}
            variants={imageVariants}
            transition={{ duration: 0.5 }}
            style={{
              width: "40%",
              height: "70%",
              position: "absolute",
              backgroundImage: `url(http://camps.runasp.net/Uploads/${item.file})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              color: "white",
            }}
          >
            <h2 className="text-xl font-bold bg-black/60 text-[#E26629] p-2 rounded">
              {item.title}
            </h2>
            <p className="text-sm mt-1 bg-black/50 p-1 rounded">{item.date}</p>
            <p className="text-base mt-2 bg-black/40 p-2 rounded">
              {item.content}
            </p>
          </motion.div>
        ))
      )}

      <button
        onClick={handleNext}
        className="absolute bottom-8 px-6 py-2 bg-[#A6B78D] text-white font-semibold rounded-full hover:bg-[#A6B78D]/80"
      >
        التالي
      </button>
    </div>
  );
}

export default Announcment;
