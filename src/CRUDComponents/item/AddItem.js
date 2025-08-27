import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../AuthProvider";
import { TokenContext } from "../../TokenContext";

export default function AddItems() {
  const { user } = useContext(AuthContext);
  // let token=localStorage.getItem("token")
  const { token } = useContext(TokenContext);

  const [item, setItem] = useState({
    unit: 0,
    name: "",
    category: "",
    organiztionId: 0,
  });
  const [org, setOrg] = useState([]);

  useEffect(() => {
    GetItems("https://camps.runasp.net/item");
    GetOrg("https://camps.runasp.net/organization");
  }, [0]);

  async function handleSubmit(e) {
    e.preventDefault();

    await PostItem("https://camps.runasp.net/item");
  }

  function handleChange(event) {
    const conc = event.target;
    setItem((prev) => ({ ...prev, [conc.name]: conc.value }));
  }

  async function PostItem(url) {
    if (user.role == "OrganizationManager") {
      item.organiztionId = org.id;
    }
    console.log(JSON.stringify(item));
    try {
      let resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(item),
      });

      if (resp.ok) {
        let data = await resp.json();
        console.log(data);

        Swal.fire({
          icon: "success",
          title: "تمت الإضافة بنجاح!",
          text: "تمت إضافة المساعدة بنجاح.",
          confirmButtonColor: "#DC7F56",
        });
      } else {
        let errorText = await resp.text();
        if (errorText.includes("category and unit")) {
          Swal.fire({
            icon: "warning",
            title: "تنبيه",
            text: "عنصر بهذا  الاسم او بهذا التصنيف والوحدة موجود مسبقًا.",
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
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "فشل الاتصال",
        text: "تعذر الاتصال بالخادم.",
        confirmButtonColor: "#DC7F56",
      });
    }
  }

  async function GetOrg(url) {
    try {
      let resp = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (resp.ok) {
        let data = await resp.json();
        setOrg(data);
        console.log(data);
      } else {
        throw new Error("Error: " + resp.status);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function GetItems(url) {
    try {
      let resp = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (resp.ok) {
        let data = await resp.json();
        setItem(data);
        console.log(data);
      } else {
        throw new Error("Error: " + resp.status);
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
          {user && user.role == "SystemManager" ? (
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
                المؤسسة{" "}
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
          ) : (
            ""
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
