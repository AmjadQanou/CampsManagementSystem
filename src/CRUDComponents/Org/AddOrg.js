import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../AuthProvider";

export default function AddOrg() {
  let token = localStorage.getItem("token");
  const nav = useNavigate();
  const [org, setOrg] = useState({
    name: "",
    location: "",
    category: "",
    organizationManagerId: 0,
    file: null, // هنا نضيف مكان لتخزين الصورة
  });
  const { user } = useContext(AuthContext);
  const [organizationManager, setOrgManager] = useState([]);

  useEffect(() => {
    GetorgManager("https://camps.runasp.net/organizationmanager");
  }, []);

  // دالة لحفظ الصورة عند اختيارها
  const handleFileChange = (e) => {
    setOrg({ ...org, file: e.target.files[0] });
  };

  // دالة لإرسال البيانات
  async function handleSubmit(e) {
    e.preventDefault();

    if (user.role !== "SystemManager") {
      org.organizationManagerId = user.id;
    }

    const formData = new FormData();
    // إضافة جميع البيانات إلى FormData
    formData.append("Name", org.name);
    formData.append("Location", org.location);
    formData.append("Category", org.category);
    formData.append("OrganizationManagerId", org.organizationManagerId);

    // إضافة الملف إلى FormData إذا كان موجودًا
    if (org.file) {
      formData.append("file", org.file);
    }

    // إرسال البيانات باستخدام fetch
    const response = await fetch("https://camps.runasp.net/organization", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "تمت الإضافة!",
        text: "تم إضافة المؤسسة بنجاح 🎉",
        confirmButtonText: "رجوع",
      }).then(() => {
        console.log(org);
        setOrg({
          name: "",
          location: "",
          category: "",
          organizationManagerId: 0,
          file: null,
        });
        nav("..");
      });
    } else {
      const text = await response.text();
      if (text.includes("manager")) {
        Swal.fire({
          icon: "error",
          title: "المدير لديه مؤسسة بالفعل",
          text: "يرجى المحاولة لاحقًا",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "حدث خطأ!",
          text: "يرجى المحاولة لاحقًا",
        });
      }
    }
  }

  // دالة لمعالجة التغيير في الحقول النصية
  function handleChange(event) {
    const { name, value } = event.target;
    setOrg((prev) => ({ ...prev, [name]: value }));
  }

  // دالة لجلب مديري المؤسسات
  async function GetorgManager(url) {
    try {
      const resp = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (resp.ok) {
        const data = await resp.json();
        setOrgManager(data);
      } else {
        throw new Error("Error fetching organization managers");
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <section
      className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center py-12 px-4"
      dir="rtl"
    >
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-3xl p-10 w-full max-w-3xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-[#DC7F56] mb-8">
          إضافة مؤسسة جديدة
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              الاسم
            </label>
            <input
              onChange={handleChange}
              type="text"
              name="name"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="ادخل اسم المؤسسة"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              الموقع
            </label>
            <input
              onChange={handleChange}
              type="text"
              name="location"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="ادخل موقع المؤسسة"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              التصنيف
            </label>
            <input
              onChange={handleChange}
              type="text"
              name="category"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="ادخل تصنيف المؤسسة"
              required
            />
          </div>

          {user?.role === "SystemManager" && (
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
                مدير المؤسسة
              </label>
              <select
                name="organizationManagerId"
                value={org.organizationManagerId}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-700 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              >
                <option value="">اختر مدير المؤسسة</option>
                {organizationManager.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.fname} {x.lname}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* هنا نضيف خيار لتحميل الملف */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              تحميل صورة للمؤسسة
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-[#DC7F56] hover:bg-[#c46b45] text-white font-semibold px-8 py-3 rounded-full shadow-md transition-all duration-300"
            >
              ➕ إضافة المؤسسة
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
