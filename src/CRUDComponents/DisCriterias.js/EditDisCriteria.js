import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../AuthProvider";
import {
  distributionCriteriaService,
  organizationService,
  healthIssuesService,
} from "../../services/apiService";

export default function EditDisCriteria() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [org, setOrg] = useState([]);
  const [healthIssues, setHealth] = useState([]);
  const navigate = useNavigate();

  const [criteria, setCriteria] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    minimumFamilySize: "",
    vulnerabilityLevel: "",
    numOfChildrenYoungerthan3: 0,
    numOfOldMen: 0,
    numOfdivorceds: false,
    numOfwidows: false,
    otherConditions: "",
    orgId: "",
    gender: "",
    healthIssues: "",
  });

  useEffect(() => {
    GetCriteria();
    GetOrganizations();
    GetHealthIssues();
  }, []);

  async function GetCriteria() {
    try {
      const resp = await distributionCriteriaService.getById(id);
      setCriteria(resp.data);
    } catch (er) {
      console.error(er);
    }
  }

  async function GetOrganizations() {
    try {
      const resp = await organizationService.getAll();
      setOrg(resp.data);
    } catch (er) {
      console.error(er);
    }
  }

  async function GetHealthIssues() {
    try {
      const resp = await healthIssuesService.getAll();
      setHealth(resp.data);
    } catch (er) {
      console.error(er);
    }
  }

  function handleRefChange(event) {
    const { name, value } = event.target;
    if (name === "minimumFamilySize" && Number(value) <= 0) {
      event.target.value = "";
      event.target.placeholder = "الرقم يجب أن يكون أكبر من صفر";
      setCriteria((prev) => ({ ...prev, [name]: "" }));
    } else {
      event.target.placeholder = "";
      setCriteria((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (user.role === "OrganizationManager" && org.length > 0) {
      criteria.orgId = org[0].id;
    }

    try {
      await distributionCriteriaService.update(id, criteria);

      Swal.fire({
        icon: "success",
        title: "تم التعديل!",
        text: "تم تعديل الشرط بنجاح 🎉",
        confirmButtonText: "رجوع",
      });
      navigate("..");
    } catch (error) {
      const errorMessage = error?.response?.data || "";
      if (errorMessage.includes("cer")) {
        Swal.fire({
          icon: "warning",
          title: "تنبيه!",
          text: "بيانات المعيار مكررة!",
          confirmButtonText: "فهمت",
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

  return (
    <section
      className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center py-12 px-4"
      dir="rtl"
    >
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-3xl p-10 w-full max-w-3xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-[#DC7F56] mb-8">
          تعديل معيار التوزيع
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              الوصف
            </label>
            <input
              onChange={handleRefChange}
              value={criteria.description}
              name="description"
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              الحد الأدنى لعدد العائلة
            </label>
            <input
              onChange={handleRefChange}
              value={criteria.minimumFamilySize}
              name="minimumFamilySize"
              type="number"
              min={0}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              مستوى الضعف
            </label>
            <input
              onChange={handleRefChange}
              value={criteria.vulnerabilityLevel}
              name="vulnerabilityLevel"
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              عدد الاطفال اقل من 3 سنوات
            </label>
            <input
              onChange={handleRefChange}
              type="number"
              min={0}
              name="numOfChildrenYoungerthan3"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="عدد الاطفال اقل من 3 سنوات"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              عدد كبار السن
            </label>
            <input
              onChange={handleRefChange}
              type="number"
              min={0}
              name="numOfOldMen"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="عدد كبار السن"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              الجنس
            </label>
            <select
              name="gender"
              required
              value={criteria.gender}
              onChange={handleRefChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="">اختر الجنس</option>
              <option value="male">ذكر</option>
              <option value="female">أنثى</option>
              <option value="both">الاثنين معا</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              مشاكل صحية
            </label>
            <select
              name="healthIssues"
              value={criteria.healthIssues}
              onChange={handleRefChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="">اختر</option>
              {healthIssues.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              شروط أخرى
            </label>
            <input
              onChange={handleRefChange}
              value={criteria.otherConditions}
              name="otherConditions"
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          {user.role === "SystemManager" && (
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
                المؤسسة
              </label>
              <select
                name="orgId"
                value={criteria.orgId}
                onChange={handleRefChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-700 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              >
                <option value="">اختر مؤسسة</option>
                {org.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name}
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
              💾 تعديل الشرط
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
