import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../AuthProvider";
import { TokenContext } from "../../TokenContext";

export default function AddAnnouncement() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  // let token=localStorage.getItem("token")
  const { token } = useContext(TokenContext);
  const [announcment, setAnnouncment] = useState({
    content: "",
    title: "",
    file: null,
  });
  const handleRefChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setAnnouncment({ ...announcment, [name]: files[0] });
    } else {
      setAnnouncment({ ...announcment, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("ManagerId", user.id);
    formData.append("Content", announcment.content);
    formData.append("file", announcment.file);
    formData.append("title", announcment.title);

    try {
      const url =
        user.role == "CampManager"
          ? "https://camps.runasp.net/campannouncments"
          : "https://camps.runasp.net/organnouncments";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        Swal.fire({
          title: "نجاح",
          text: "تم إضافة الإعلان بنجاح!",
          icon: "success",
          confirmButtonText: "موافق",
        });
        navigate("..");
      } else {
        Swal.fire({
          title: "خطأ",
          text: "فشل إضافة الإعلان. حاول مرة أخرى.",
          icon: "error",
          confirmButtonText: "موافق",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "خطأ",
        text: "حدث خطأ أثناء إضافة الإعلان",
        icon: "error",
        confirmButtonText: "موافق",
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
          إضافة إعلان للمؤسسة
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          <div>
            <label
              htmlFor="content"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-white"
            >
              المحتوى
            </label>
            <textarea
              onChange={handleRefChange}
              value={announcment.content}
              name="content"
              id="content"
              rows="4"
              placeholder="ادخل محتوى الإعلان"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
            ></textarea>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              {" "}
              عنوان الإعلان
            </label>
            <input
              onChange={handleRefChange}
              type="text"
              name="title"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="ادخل عنوان الاعلان"
              required
            />
          </div>

          <div>
            <label
              htmlFor="file"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-white"
            >
              تحميل الملف
            </label>
            <input
              onChange={handleRefChange}
              type="file"
              name="file"
              id="file"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-[#DC7F56] hover:bg-[#c46b45] text-white font-semibold px-8 py-3 rounded-full shadow-md transition-all duration-300"
            >
              ➕ إضافة الإعلان
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
