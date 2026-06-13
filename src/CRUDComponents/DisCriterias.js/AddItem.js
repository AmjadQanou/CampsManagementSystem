import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../AuthProvider";
import { itemService, organizationService } from "../../services/apiService";

export default function AddItems() {
  const { user } = useContext(AuthContext);

  const [item, setItem] = useState({
    unit: 0,
    name: "",
    category: "",
    organiztionId: 0,
  });
  const [org, setOrg] = useState([]);

  useEffect(() => {
    GetOrg();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    await PostItem();
  }

  function handleChange(event) {
    const conc = event.target;
    setItem((prev) => ({ ...prev, [conc.name]: conc.value }));
  }

  async function PostItem() {
    if (user.role === "OrganizationManager") {
      item.organiztionId = org.id;
    }

    try {
      await itemService.create(item);

      Swal.fire({
        icon: "success",
        title: "تمت الإضافة بنجاح!",
        text: "تمت إضافة المساعدة بنجاح.",
        confirmButtonColor: "#DC7F56",
      });
    } catch (error) {
      const errorText = error?.response?.data || "";
      if (errorText.includes("category and unit")) {
        Swal.fire({
          icon: "warning",
          title: "تنبيه",
          text: "عنصر بهذا الاسم او بهذا التصنيف والوحدة موجود مسبقًا.",
          confirmButtonColor: "#DC7F56",
        });
      } else if (errorText.includes("name")) {
        Swal.fire({
          icon: "warning",
          title: "تنبيه",
          text: "عنصر بهذا الاسم موجود مسبقًا.",
          confirmButtonColor: "#DC7F56",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "خطأ",
          text: "حدث خطأ غير متوقع. حاول مرة أخرى.",
          confirmButtonColor: "#DC7F56",
        });
      }
    }
  }

  async function GetOrg() {
    try {
      const resp = await organizationService.getAll();
      setOrg(resp.data);
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
          إضافة مساعدة
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
              placeholder="ادخل الاسم"
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
              placeholder="ادخل التصنيف"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              الوحدة
            </label>
            <input
              onChange={handleChange}
              type="text"
              name="unit"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="ادخل الوحدة"
              required
            />
          </div>

          {user && user.role === "SystemManager" && (
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
                المؤسسة
              </label>
              <select
                id="organiztionId"
                name="organiztionId"
                value={item.organiztionId}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-700 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              >
                <option value="">اختر المؤسسة</option>
                {org.map((manager) => (
                  <option key={manager.id} value={manager.id}>
                    {manager.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-[#DC7F56] hover:bg-[#c46b45] text-white font-semibold px-8 py-3 rounded-full shadow-md transition-all duration-300"
            >
              ➕ إضافة مساعدة
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
