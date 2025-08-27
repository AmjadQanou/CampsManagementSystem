import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { TokenContext } from "../../TokenContext";

export default function AddCampManager() {
  // let token = localStorage.getItem("token");
  const { token } = useContext(TokenContext);

  const navigate = useNavigate();

  const [campManager, setCampManager] = useState({
    username: "",
    password: "",
    email: "",
    role: "CampManager",
    fname: "",
    lname: "",
    dob: "",
    contactInfo: "",
    approved: false,
    gender: "",
  });

  function handleRefChange(event) {
    const { name, value, type, checked } = event.target;
    setCampManager((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (campManager.password.length < 6) {
      Swal.fire({
        icon: "error",
        title: "كلمة المرور قصيرة!",
        text: "كلمة المرور يجب أن تكون 6 حروف أو أكثر",
        confirmButtonText: "حسنًا",
      });
      return;
    }

    try {
      const allManagersResponse = await fetch(
        "http://camps.runasp.net/campmanagers",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!allManagersResponse.ok)
        throw new Error("Failed to fetch existing camp managers");

      const existingManagers = await allManagersResponse.json();

      const usernameExists = existingManagers.some(
        (mgr) => mgr.username === campManager.username
      );
      const emailExists = existingManagers.some(
        (mgr) => mgr.email === campManager.email
      );

      if (usernameExists || emailExists) {
        let errorMsg = "يرجى تغيير ";
        if (usernameExists) errorMsg += "اسم المستخدم ";
        if (usernameExists && emailExists) errorMsg += "و ";
        if (emailExists) errorMsg += "البريد الإلكتروني";

        Swal.fire({
          icon: "warning",
          title: "موجود مسبقًا!",
          text: errorMsg,
          confirmButtonText: "حسنًا",
        });
        return;
      }

      const response = await fetch("http://camps.runasp.net/campmanager", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(campManager),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "تمت الإضافة!",
          text: "تم إضافة مدير المخيم بنجاح 🎉",
          confirmButtonText: "رجوع",
        }).then(() => {
          setCampManager({
            username: "",
            password: "",
            email: "",
            role: "CampManager",
            fname: "",
            lname: "",
            dob: "",
            contactInfo: "",
            approved: false,
            gender: "",
          });
          navigate("..");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "حدث خطأ!",
          text: "يرجى المحاولة لاحقًا",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "خطأ في الشبكة!",
        text: "تعذر الاتصال بالخادم",
      });
    }
  }

  return (
    <section
      className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center py-12 px-4"
      dir="rtl"
    >
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-3xl p-10 w-full max-w-3xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-[#DC7F56] mb-8">
          إضافة مدير مخيم
        </h2>
        <motion.form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              اسم المستخدم
            </label>
            <input
              onChange={handleRefChange}
              type="text"
              name="username"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="ادخل اسم المستخدم"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              كلمة المرور
            </label>
            <input
              onChange={handleRefChange}
              type="password"
              name="password"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="ادخل كلمة المرور"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              البريد الإلكتروني
            </label>
            <input
              onChange={handleRefChange}
              type="email"
              name="email"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="ادخل البريد الإلكتروني"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              الاسم الشخصي
            </label>
            <input
              onChange={handleRefChange}
              type="text"
              name="fname"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="ادخل اسم الشخص"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              الاسم العائلي
            </label>
            <input
              onChange={handleRefChange}
              type="text"
              name="lname"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="ادخل اسم العائلة"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              تاريخ الميلاد
            </label>
            <input
              onChange={handleRefChange}
              type="date"
              name="dob"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="ادخل تاريخ الميلاد"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              معلومات للتواصل
            </label>
            <input
              onChange={handleRefChange}
              type="text"
              name="contactInfo"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="ادخل معلومات التواصل"
              required
            />
          </div>

          <div className="flex items-center gap-3 mt-4">
            <input
              onChange={handleRefChange}
              type="checkbox"
              name="approved"
              checked={campManager.approved}
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded mt-5"
            />
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              تفعيل
            </label>
          </div>

          <hr className="h-[1.7px] w-full bg-gray-300 text-gray-300 mt-10 mb-10" />

          <button
            type="submit"
            className="bg-[#DC7F56] hover:bg-[#c46b45] text-white font-semibold px-8 py-3 rounded-full shadow-md transition-all duration-300"
          >
            إضافة مدير المخيم
          </button>
        </motion.form>
      </div>
    </section>
  );
}
