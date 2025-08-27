import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../AuthProvider";

export default function EditOrg() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const { user } = useContext(AuthContext);
  const nav = useNavigate();

  const [org, setOrg] = useState({
    name: "",
    location: "",
    category: "",
    organizationManagerId: 0,
    file: "", // لتحفظ اسم الملف
  });

  const [organizationManager, setOrgManager] = useState([]);
  const [image, setImage] = useState(null);

  useEffect(() => {
    GetorgManager("https://camps.runasp.net/organizationmanager");
    GetOrg(`https://camps.runasp.net/organization/${id}`);
  }, [id]);

  // إرسال البيانات وتحديث المؤسسة
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("id", id);
    formData.append("Name", org.name);
    formData.append("Location", org.location);
    formData.append("Category", org.category);
    formData.append("OrganizationManagerId", org.organizationManagerId);

    // إضافة الملف الجديد إذا تم تحديده
    if (image) {
      formData.append("File", image);
    }

    const response = await fetch(
      `https://camps.runasp.net/organization/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "تم التعديل!",
        text: "تم تعديل المؤسسة بنجاح 🎉",
        confirmButtonText: "رجوع",
      }).then(() => {
        nav("..");
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "حدث خطأ!",
        text: "يرجى المحاولة لاحقًا",
      });
    }
  };

  const hundleChange = (event) => {
    const conc = event.target;
    setOrg((prev) => ({ ...prev, [conc.name]: conc.value }));
  };

  // التعامل مع تغيير الملف
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };
  const GetorgManager = async (url) => {
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
        setOrgManager(data);
      } else throw new Error("error" + resp.status);
    } catch (er) {
      console.error(er);
    }
  };

  const GetOrg = async (url) => {
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
      } else throw new Error("error" + resp.status);
    } catch (er) {
      console.error(er);
    }
  };

  return (
    <section
      className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center py-12 px-4"
      dir="rtl"
    >
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-3xl p-10 w-full max-w-3xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-[#DC7F56] mb-8">
          تعديل المؤسسة
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="md:col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              الاسم
            </label>
            <input
              type="text"
              name="name"
              value={org.name}
              onChange={hundleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="اكتب اسم المؤسسة"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              الموقع
            </label>
            <input
              type="text"
              name="location"
              value={org.location}
              onChange={hundleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="اكتب موقع المؤسسة"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              التصنيف
            </label>
            <input
              type="text"
              name="category"
              value={org.category}
              onChange={hundleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="اكتب تصنيف المؤسسة"
              required
            />
          </div>

          {user.role === "SystemManager" && (
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
                مدير المؤسسة
              </label>
              <select
                name="organizationManagerId"
                value={org.organizationManagerId}
                onChange={hundleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-700 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
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

          <div className="md:col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              صورة المؤسسة
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
            {org.file && (
              <div className="mt-4">
                <img
                  src={`https://camps.runasp.net/uploads/${org.file}`}
                  alt="Organization"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          <div className="md:col-span-2 flex justify-center mt-6">
            <button
              type="submit"
              className="bg-[#DC7F56] hover:bg-[#c46b45] text-white font-semibold px-8 py-3 rounded-full shadow-md transition-all duration-300"
            >
              ✅ تعديل المؤسسة
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
