import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../AuthProvider";
import { useNavigate } from "react-router-dom";

export default function AddCamp() {
  const [campManagers, setCampManagers] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [camp, setCamp] = useState({
    name: "",
    location: "",
    capacity: "",
    approved: user?.role === "SystemManager",
    campManagerId: "",
    numOfBaths: "",
    numOfWaterGallons: "",
  });

  const [image, setImage] = useState(null);

  useEffect(() => {
    if (user?.role === "SystemManager") {
      fetchCampManagers("https://camps.runasp.net/campmanagers");
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCamp((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("Name", camp.name);
    formData.append("Location", camp.location);
    formData.append("Capacity", parseInt(camp.capacity || 0));
    formData.append("NumOfFamilies", parseInt(camp.numOfFamilies || 0));
    formData.append("NumOfBaths", parseInt(camp.numOfBaths || 0));
    formData.append("NumOfWaterGallons", parseInt(camp.numOfWaterGallons || 0));
    formData.append("Approved", camp.approved ? "true" : "false");

    if (user.role === "SystemManager") {
      formData.append("CampManagerId", camp.campManagerId);
    } else {
      formData.append("CampManagerId", user.id);
    }

    if (image) {
      formData.append("file", image);
    }

    try {
      const response = await fetch("https://camps.runasp.net/camp", {
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
          text: "تم إضافة المخيم بنجاح 🎉",
          confirmButtonColor: "#DC7F56",
        }).then(() => {
          navigate("..");
        });
      } else {
        const err = await response.text();
        if (err.includes("name arleady exists")) {
          Swal.fire({
            icon: "error",
            title: "خطأ",
            text: "اسم المخيم موجود بالفعل",
          });
        } else if (err.includes("campManager already has an camp")) {
          Swal.fire({
            icon: "error",
            title: "خطأ",
            text: "هذا المدير مرتبط بمخيم آخر",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "حدث خطأ",
            text: "يرجى المحاولة لاحقًا",
          });
        }
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "فشل الاتصال",
        text: "تعذر الاتصال بالخادم",
      });
    }
  };

  const fetchCampManagers = async (url) => {
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setCampManagers(data);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "فشل تحميل مدراء المخيمات",
      });
    }
  };

  return (
    <section
      className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center py-12 px-4"
      dir="rtl"
    >
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-3xl p-10 w-full max-w-3xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-[#DC7F56] mb-8">
          إضافة مخيم
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6"
          encType="multipart/form-data"
        >
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              الاسم
            </label>
            <input
              type="text"
              name="name"
              value={camp.name}
              onChange={handleChange}
              required
              placeholder="ادخل اسم المخيم"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              الموقع
            </label>
            <input
              type="text"
              name="location"
              value={camp.location}
              onChange={handleChange}
              required
              placeholder="ادخل موقع المخيم"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              السعة
            </label>
            <input
              type="number"
              name="capacity"
              value={camp.capacity}
              onChange={handleChange}
              required
              min={0}
              placeholder="ادخل السعة"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              عدد الحمامات
            </label>
            <input
              type="number"
              name="numOfBaths"
              value={camp.numOfBaths}
              onChange={handleChange}
              required
              minLength={0}
              min={0}
              placeholder="ادخل عدد الحمامات"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              عدد جالونات الماء
            </label>
            <input
              type="number"
              name="numOfWaterGallons"
              value={camp.numOfWaterGallons}
              min={0}
              minLength={0}
              onChange={handleChange}
              required
              placeholder="ادخل عدد جالونات الماء"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              صورة المخيم
            </label>
            <input
              type="file"
              name="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          {user.role === "SystemManager" && (
            <>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
                  مدير المخيم
                </label>
                <select
                  name="campManagerId"
                  value={camp.campManagerId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                >
                  <option value="">اختر مدير المخيم</option>
                  {campManagers.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.username}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 mt-2">
                <input
                  type="checkbox"
                  name="approved"
                  checked={camp.approved}
                  onChange={handleChange}
                  className="w-5 h-5 text-[#DC7F56] bg-gray-100 border-gray-300 rounded"
                />
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  تفعيل
                </label>
              </div>
            </>
          )}

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-[#DC7F56] hover:bg-[#c46b45] text-white font-semibold px-8 py-3 rounded-full shadow-md transition-all duration-300"
            >
              ➕ إضافة مخيم
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
