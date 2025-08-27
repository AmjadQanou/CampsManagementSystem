import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { TokenContext } from "../../TokenContext";

export default function EditAnnouncement() {
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  // let token=localStorage.getItem("token")
  const { token } = useContext(TokenContext);

  const navigate = useNavigate();
  useEffect(() => {
    // استدعاء API لجلب الإعلان حسب الـ ID
    fetch(`http://camps.runasp.net/announcments/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAnnouncement(data);
        setContent(data.content);
        setTitle(data.title);

        setPreview(`http://camps.runasp.net/uploads/${data.file}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      })
      .catch((err) => {
        console.error(err);
        Swal.fire("خطأ", "تعذر تحميل الإعلان", "error");
      });
  }, [id]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id", id);
    formData.append("Content", content);
    formData.append("title", title);

    if (file) formData.append("file", file);

    try {
      const response = await fetch(
        `http://camps.runasp.net/announcments/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        Swal.fire("نجاح", "تم تعديل الإعلان بنجاح", "success");
        navigate("..");
      } else {
        Swal.fire("خطأ", "فشل تعديل الإعلان", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("خطأ", "تعذر الاتصال بالسيرفر", "error");
    }
  };

  if (!announcement) return <div>جاري التحميل...</div>;

  return (
    <section
      className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center py-12 px-4"
      dir="rtl"
    >
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-3xl p-10 w-full max-w-3xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-[#DC7F56] mb-8">
          تعديل الإعلان
        </h2>

        <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-6">
          <div>
            <label
              htmlFor="content"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-white"
            >
              محتوى الإعلان
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="اكتب محتوى الإعلان"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              {" "}
              عنوان الإعلان
            </label>
            <input
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              name="title"
              value={title}
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
              تغيير الملف (اختياري)
            </label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          {preview && (
            <div className="flex justify-center mt-4">
              <img
                src={preview}
                alt="صورة الإعلان"
                className="max-w-xs rounded border border-gray-300 shadow-md"
              />
            </div>
          )}

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-[#DC7F56] hover:bg-[#c46b45] text-white font-semibold px-8 py-3 rounded-full shadow-md transition-all duration-300"
            >
              💾 حفظ التعديلات
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
