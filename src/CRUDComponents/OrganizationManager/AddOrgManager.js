import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { TokenContext } from "../../TokenContext";
export default function AddOrgManager() {
  const [orgManager, setOrgManager] = useState({
    username: "",
    password: "",
    email: "",
    role: "OrganizationManager",
    fname: "",
    lname: "",
    dob: "",
    contactInfo: "",
    approved: false,
    gender: "",
  });
  // let token=localStorage.getItem("token")
  const { token } = useContext(TokenContext);

  const navigate = useNavigate();
  function handleRefChange(event) {
    const { name, value, type, checked } = event.target;
    setOrgManager((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (type == "checkbox") console.log(checked);
    console.log(orgManager);
  }
  async function handleSubmit(e) {
    e.preventDefault();

    if (orgManager.password.length < 6) {
      Swal.fire({
        icon: "error",
        title: "كلمة المرور قصيرة!",
        text: "كلمة المرور يجب أن تكون 6 حروف أو أكثر",
        confirmButtonText: "حسنًا",
      });
      return;
    }

    try {
      const allOrgMResponse = await fetch(
        "http://camps.runasp.net/organizationmanager",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!allOrgMResponse.ok)
        throw new Error("Failed to fetch existing org managers");

      const existingManagers = await allOrgMResponse.json();

      const usernameExists = existingManagers.some(
        (mgr) => mgr.username === orgManager.username
      );
      const emailExists = existingManagers.some(
        (mgr) => mgr.email === orgManager.email
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
      console.log(orgManager);

      const response = await fetch(
        "http://camps.runasp.net/organizationmanager",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orgManager),
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "تمت الإضافة!",
          text: "تم إضافة مدير المؤسسة بنجاح 🎉",
          confirmButtonText: "رجوع",
        }).then(() => {
          setOrgManager({
            username: "",
            password: "",
            email: "",
            role: "OrganizationManager",
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
          إضافة مدير المؤسسة
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              اسم المستخدم
            </label>
            <input
              onChange={handleRefChange}
              type="text"
              name="username"
              id="username"
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
              id="password"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="ادخل كلمة المرور"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              البريد الالكتروني
            </label>
            <input
              onChange={handleRefChange}
              type="text"
              name="email"
              id="email"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="ادخل البريد الالكتروني"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              اسم الشخص
            </label>
            <input
              onChange={handleRefChange}
              type="text"
              name="fname"
              id="fname"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="ادخل اسم الشخص"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              اسم العائلة
            </label>
            <input
              onChange={handleRefChange}
              type="text"
              name="lname"
              id="lname"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="ادخل اسم العائلة"
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
              id="dob"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
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
              id="contactInfo"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="ادخل معلومات التواصل"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              الجنس
            </label>
            <select
              name="gender"
              id="gender"
              value={orgManager.gender}
              onChange={handleRefChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-700 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            >
              <option value="" disabled>
                اختر الجنس
              </option>
              <option value="male">ذكر</option>
              <option value="female">أنثى</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              onChange={handleRefChange}
              type="checkbox"
              name="approved"
              checked={orgManager.approved}
              id="approved"
              className="w-5 h-5 text-[#DC7F56] bg-gray-100 border-gray-300 rounded"
            />
            <label
              htmlFor="approved"
              className="text-sm font-medium text-gray-900 dark:text-white"
            >
              تفعيل
            </label>
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-[#DC7F56] hover:bg-[#c46b45] text-white font-semibold px-8 py-3 rounded-full shadow-md transition-all duration-300"
            >
              ➕ إضافة مدير المؤسسة
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
