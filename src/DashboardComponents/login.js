import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { User, Lock } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [userdata, setdata] = useState({
    username: "",
    password: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setdata((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const resp = await fetch("http://camps.runasp.net/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userdata),
      });

      if (resp.ok) {
        const data = await resp.json();
        localStorage.setItem("token", data);
        navigate("/", { replace: true });
        window.location.reload();
      } else {
        throw new Error("Unauthorized");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "فشل تسجيل الدخول",
        text: "اسم المستخدم أو كلمة السر غير صحيحة!",
        confirmButtonColor: "#DC7F56",
      });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] dark:bg-gray-800 px-4">
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-center text-[#A6B78D]">
          تسجيل الدخول
        </h2>

        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#DC7F56]">
            <User size={18} />
          </span>
          <input
            name="username"
            onChange={handleChange}
            placeholder="اسم المستخدم"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-800 dark:text-white"
            required
          />
        </div>

        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#DC7F56]">
            <Lock size={18} />
          </span>
          <input
            name="password"
            type="password"
            onChange={handleChange}
            placeholder="كلمة السر"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-800 dark:text-white"
            required
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-[#DC7F56] text-white py-3 rounded-xl font-semibold transition-colors hover:bg-[#c06d47]"
        >
          تسجيل الدخول
        </motion.button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-300">
          ليس لديك حساب؟{" "}
          <Link to="/registerchoice" className="text-[#A6B78D] hover:underline">
            تسجيل جديد
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
