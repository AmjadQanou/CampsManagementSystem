import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import {
  UserPlus,
  Mail,
  Lock,
  Calendar,
  UserCircle,
  BadgeCheck,
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [register, setRegister] = useState({
    username: "",
    password: "",
    email: "",
    fname: "",
    lname: "",
    dob: "",
    gender: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setRegister((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("https://camps.runasp.net/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(register),
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "تم التسجيل",
          text: "تم التسجيل بنجاح",
        });
        navigate("/login");
      } else {
        const errorText = await res.text();
        Swal.fire({
          icon: "error",
          title: "حدث خطأ",
          text: errorText.includes("UserName")
            ? "اسم المستخدم موجود مسبقا"
            : "لم يتم إضافة التسجيل. حاول مرة أخرى.",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "حدث خطأ أثناء إرسال البيانات. يرجى المحاولة مرة أخرى.",
      });
    }
  }

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-[#f5f5f5] dark:bg-gray-800 p-6"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg space-y-6"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-center text-[#A6B78D]">
          تسجيل حساب جديد
        </h2>

        {[
          {
            name: "username",
            type: "text",
            icon: <UserPlus size={18} />,
            placeholder: "اسم المستخدم",
          },
          {
            name: "password",
            type: "password",
            icon: <Lock size={18} />,
            placeholder: "كلمة السر",
          },
          {
            name: "email",
            type: "email",
            icon: <Mail size={18} />,
            placeholder: "البريد الإلكتروني",
          },
          {
            name: "fname",
            type: "text",
            icon: <UserCircle size={18} />,
            placeholder: "الاسم الأول",
          },
          {
            name: "lname",
            type: "text",
            icon: <UserCircle size={18} />,
            placeholder: "اسم العائلة",
          },
          {
            name: "dob",
            type: "date",
            icon: <Calendar size={18} />,
            placeholder: "",
          },
        ].map(({ name, type, icon, placeholder }) => (
          <div className="relative" key={name}>
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#DC7F56]">
              {icon}
            </span>
            <input
              name={name}
              type={type}
              placeholder={placeholder}
              required
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-800 dark:text-white"
            />
          </div>
        ))}

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
            الجنس
          </label>
          <select
            name="gender"
            onChange={handleChange}
            required
            value={register.gender}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] dark:bg-gray-700 dark:text-white"
          >
            <option value="">اختر الجنس</option>
            <option value="male">ذكر</option>
            <option value="female">أنثى</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
            نوع الحساب
          </label>
          <select
            name="role"
            onChange={handleChange}
            required
            value={register.role}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] dark:bg-gray-700 dark:text-white"
          >
            <option value="">اختر نوع الحساب</option>
            <option value="OrganizationManager">مدير مؤسسة</option>
            <option value="CampManager">مدير مخيم</option>
          </select>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-[#DC7F56] text-white py-3 rounded-xl font-semibold hover:bg-[#c06d47] transition-colors"
        >
          تسجيل
        </motion.button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-300">
          لديك حساب؟{" "}
          <Link to="/login" className="text-[#A6B78D] hover:underline">
            تسجيل الدخول
          </Link>
        </p>
      </motion.form>
    </motion.div>
  );
}
