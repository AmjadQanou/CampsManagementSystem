import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { TokenContext } from "../../TokenContext";
export default function EditReliefTracking() {
  const { id } = useParams();
  // let token=localStorage.getItem("token")
  const { token } = useContext(TokenContext);

  const navigate = useNavigate();

  const [tracking, setTracking] = useState({
    reliefID: 0,
    action: "out", // default action is 'out'
    description: "",
    notes: "",
  });
  const [reliefs, setReliefs] = useState([]);
  useEffect(() => {
    GetReliefs("https://camps.runasp.net/reliefregister");
    GetReliefTracking(`https://camps.runasp.net/relieftracking/${id}`);
  }, []);
  function handleChange(event) {
    const { name, value } = event.target;
    setTracking((prev) => ({ ...prev, [name]: value }));
  }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://camps.runasp.net/relieftracking/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(tracking),
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "تمت الإضافة!",
          text: "تم تعديل تتبع المساعدة بنجاح 🎉",
          confirmButtonText: "رجوع",
        }).then(() => {
          // إعادة تعيين القيم بعد النجاح
          navigate("..");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "حدث خطأ!",
          text: "يرجى المحاولة لاحقًا",
        });
      }
    } catch (error) {
      console.error("Error sending data:", error);
      Swal.fire({
        icon: "error",
        title: "حدث خطأ!",
        text: "يرجى المحاولة لاحقًا",
      });
    }
  }
  async function GetReliefs(url) {
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
        setReliefs(data);
      } else {
        throw new Error("Error fetching reliefs");
      }
    } catch (error) {
      console.error(error);
    }
  }
  async function GetReliefTracking(url) {
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
        setTracking(data);
      } else throw new Error("error" + resp.status);
    } catch (er) {
      console.error(er);
      return null;
    }
  }
  return (
    <section
      className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center py-12 px-4"
      dir="rtl"
    >
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-3xl p-10 w-full max-w-3xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-[#DC7F56] mb-8">
          تعديل سجل تتبع المساعدة
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white text-end">
              اختر المساعدة
            </label>
            <select
              onChange={handleChange}
              value={tracking.reliefID}
              name="reliefID"
              id="reliefID"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-700 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            >
              <option value="">اختر المساعدة</option>
              {reliefs.map((relief) => (
                <option key={relief.id} value={relief.id}>
                  {relief.id}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white text-end">
              الإجراء
            </label>
            <select
              onChange={handleChange}
              value={tracking.action}
              name="action"
              id="action"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-700 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            >
              <option value="out">خروج</option>
              <option value="in">دخول</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white text-end">
              الوصف
            </label>
            <input
              type="text"
              name="description"
              id="description"
              value={tracking.description}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="ادخل الوصف"
              required
            />
          </div>

          <div>
            <label className="block mb-2  text-sm font-medium text-gray-700 dark:text-white text-end">
              ملاحظات
            </label>
            <textarea
              name="notes"
              id="notes"
              value={tracking.notes}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="ادخل أي ملاحظات"
              required
            />
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-[#DC7F56] hover:bg-[#c46b45] text-white font-semibold px-8 py-3 rounded-full shadow-md transition-all duration-300"
            >
              💾 تعديل تتبع المساعدة
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
