import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { campManagerService } from "../../services/apiService";

export default function EditCampManager() {
  const navigate = useNavigate();
  const { id } = useParams();

  function formatDateForInput(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  }

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

  const [initialData, setInitialData] = useState({
    username: "",
    email: "",
  });

  useEffect(() => {
    GetCampManager();
  }, [id]);

  async function GetCampManager() {
    try {
      const resp = await campManagerService.getById(id);
      setCampManager(resp.data);
      setInitialData({
        username: resp.data.username,
        email: resp.data.email,
      });
    } catch (err) {
      console.error(err);
    }
  }

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
      const allManagersResponse = await campManagerService.getAll();
      const existingManagers = allManagersResponse.data;

      let usernameExists = false;
      let emailExists = false;

      if (campManager.username !== initialData.username) {
        usernameExists = existingManagers.some(
          (mgr) => mgr.username === campManager.username && mgr.id !== id,
        );
      }

      if (campManager.email !== initialData.email) {
        emailExists = existingManagers.some(
          (mgr) => mgr.email === campManager.email && mgr.id !== id,
        );
      }

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

      await campManagerService.update(id, campManager);

      Swal.fire({
        icon: "success",
        title: "تم التعديل!",
        text: "تم تعديل مدير المخيم بنجاح🎉",
        confirmButtonText: "رجوع",
      }).then(() => {
        navigate("..");
      });
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
          تعديل مدير مخيم
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
              value={campManager.username}
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
              value={campManager.password}
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
              value={campManager.email}
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
              value={campManager.fname}
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
              value={campManager.lname}
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
              value={formatDateForInput(campManager.dob)}
              placeholder="ادخل تاريخ الميلاد"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              معلومات التواصل
            </label>
            <textarea
              onChange={handleRefChange}
              name="contactInfo"
              rows="4"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              value={campManager.contactInfo}
              placeholder="ادخل معلومات التواصل"
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

          <div className="text-center">
            <button
              type="submit"
              className="px-8 py-3 bg-[#DC7F56] text-white rounded-xl shadow-lg focus:outline-none hover:bg-[#BC6E4B] transition duration-300"
            >
              حفظ التعديلات
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
