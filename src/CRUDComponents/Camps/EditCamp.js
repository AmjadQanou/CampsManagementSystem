import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../AuthProvider";
import { campService, campManagerService } from "../../services/apiService";

export default function EditCamp() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [capmManagers, setCapmManagers] = useState([]);
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");

  const [camp, setCamp] = useState(
    user && user.role === "SystemManager"
      ? {
          name: "",
          location: "",
          capacity: "",
          approved: true,
          campManagerId: "",
          numOfBaths: "",
          numOfWaterGallons: "",
        }
      : {
          name: "",
          location: "",
          capacity: "",
          approved: false,
          numOfBaths: "",
          numOfWaterGallons: "",
        },
  );

  useEffect(() => {
    GetCamp();
    GetCampsManagers();
  }, [id]);

  function handleRefChange(event) {
    const { name, value, type, checked } = event.target;

    if (
      (name === "capacity" ||
        name === "numOfFamilies" ||
        name === "numOfBaths" ||
        name === "numOfWaterGallons") &&
      Number(value) < 0
    ) {
      Swal.fire({
        icon: "error",
        title: "قيمة غير صالحة",
        text: "القيم الرقمية يجب أن تكون أكبر من أو تساوي صفر",
        confirmButtonColor: "#DC7F56",
      });
      return;
    }

    setCamp((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleImageChange(e) {
    setImage(e.target.files[0]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id", id);
    formData.append("Name", camp.name);
    formData.append("Location", camp.location);
    formData.append("Capacity", camp.capacity);
    formData.append("NumOfBaths", camp.numOfBaths);
    formData.append("NumOfWaterGallons", camp.numOfWaterGallons);
    formData.append("Approved", camp.approved);
    formData.append(
      "CampManagerId",
      user.role === "SystemManager" ? camp.campManagerId : user.id,
    );

    if (image) {
      formData.append("file", image);
    }

    try {
      await campService.update(id, formData);

      Swal.fire({
        icon: "success",
        title: "تم التعديل!",
        text: "تم تعديل بيانات المخيم بنجاح 🎉",
        confirmButtonColor: "#DC7F56",
      });
      navigate("..");
    } catch (error) {
      const errorText = error?.response?.data || "";
      if (errorText.includes("name already exists")) {
        Swal.fire({
          icon: "error",
          title: "خطأ في الاسم",
          text: "اسم المخيم موجود بالفعل!",
          confirmButtonColor: "#DC7F56",
        });
      } else if (errorText.includes("camp manager already has a camp")) {
        Swal.fire({
          icon: "error",
          title: "مدير مكرر",
          text: "مدير المخيم مرتبط بمخيم آخر!",
          confirmButtonColor: "#DC7F56",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "حدث خطأ!",
          text: "يرجى المحاولة لاحقًا",
          confirmButtonColor: "#DC7F56",
        });
      }
    }
  }

  async function GetCampsManagers() {
    try {
      const resp = await campManagerService.getAll();
      setCapmManagers(resp.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function GetCamp() {
    try {
      const resp = await campService.getById(id);
      setCamp(resp.data);
      setExistingImage(resp.data.imageUrl);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section
      className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center py-12 px-4"
      dir="rtl"
    >
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-3xl p-10 w-full max-w-3xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-[#DC7F56] mb-8">
          تعديل مخيم
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
              onChange={handleRefChange}
              value={camp.name}
              type="text"
              name="name"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="ادخل اسم المخيم"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              الموقع
            </label>
            <input
              onChange={handleRefChange}
              value={camp.location}
              type="text"
              name="location"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="ادخل موقع المخيم"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              السعة
            </label>
            <input
              onChange={handleRefChange}
              value={camp.capacity}
              type="number"
              min={0}
              name="capacity"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="ادخل السعة"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              عدد الحمامات
            </label>
            <input
              onChange={handleRefChange}
              value={camp.numOfBaths}
              type="number"
              min={0}
              name="numOfBaths"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="ادخل عدد الحمامات"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              عدد جالونات الماء
            </label>
            <input
              onChange={handleRefChange}
              value={camp.numOfWaterGallons}
              type="number"
              min={0}
              name="numOfWaterGallons"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="ادخل عدد جالونات الماء"
            />
          </div>

          {existingImage && (
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
                الصورة الحالية
              </label>
              <img
                src={`https://camps.runasp.net/uploads/${existingImage}`}
                alt="Camp"
                className="w-48 h-auto rounded-xl shadow-md mb-4"
              />
            </div>
          )}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              تغيير الصورة
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-gray-100 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {user && user.role === "SystemManager" && (
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
                مدير المخيم
              </label>
              <select
                name="campManagerId"
                value={camp.campManagerId}
                onChange={handleRefChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-700 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                <option value="">اختر مدير المخيم</option>
                {capmManagers.map((manager) => (
                  <option key={manager.id} value={manager.id}>
                    {manager.username}
                  </option>
                ))}
              </select>
            </div>
          )}

          {user && user.role === "SystemManager" && (
            <div className="flex items-center gap-3 mt-2">
              <input
                onChange={handleRefChange}
                type="checkbox"
                name="approved"
                checked={camp.approved}
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
          )}

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-[#DC7F56] hover:bg-[#c46b45] text-white font-semibold px-8 py-3 rounded-full shadow-md transition-all duration-300"
            >
              💾 تعديل المخيم
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
