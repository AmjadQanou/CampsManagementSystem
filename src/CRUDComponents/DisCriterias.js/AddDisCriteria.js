import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../AuthProvider";
import { useNavigate } from "react-router-dom";
import {
  distributionCriteriaService,
  organizationService,
  healthIssuesService,
} from "../../services/apiService";

export default function AddDisCriteria() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [org, setOrg] = useState([]);
  const [healthIssues, setHealth] = useState([]);

  const [criteria, setCriteria] = useState(
    user.role === "SystemManager"
      ? {
          date: new Date().toISOString().split("T")[0],
          description: "",
          minimumFamilySize: "",
          numOfChildrenYoungerthan3: 0,
          numOfOldMen: 0,
          vulnerabilityLevel: "",
          isItdivorceds: false,
          isItwidows: false,
          otherConditions: "",
          orgId: "",
          gender: "",
          healthIssues: "",
        }
      : {
          date: new Date().toISOString().split("T")[0],
          description: "",
          minimumFamilySize: "",
          vulnerabilityLevel: "",
          numOfChildrenYoungerthan3: 0,
          numOfOldMen: 0,
          otherConditions: "",
          isItdivorceds: false,
          isItwidows: false,
          gender: "",
          healthIssues: 0,
        },
  );

  useEffect(() => {
    GetOrganizations();
    GetHealthIssues();
  }, []);

  function handleRefChange(event) {
    const { name, type, value, checked } = event.target;

    if (type === "checkbox") {
      setCriteria((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "minimumFamilySize" && Number(value) <= 0) {
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

    if (user.role === "OrganizationManager") {
      criteria.orgId = org?.id;
    }

    try {
      await distributionCriteriaService.create(criteria);

      Swal.fire({
        icon: "success",
        title: "تمت الإضافة!",
        text: "تم إضافة الشرط بنجاح 🎉",
        confirmButtonText: "رجوع",
      }).then(() => {
        setCriteria({
          description: "",
          minimumFamilySize: "",
          vulnerabilityLevel: "",
          numOfChildrenYoungerthan3: 0,
          numOfOldMen: 0,
          otherConditions: "",
          gender: "",
          healthIssues: "",
          orgId: "",
        });
        navigate("..");
      });
    } catch (error) {
      const status = error?.response?.status;
      const errorMessage = error?.response?.data || "";

      if (status === 400) {
        if (errorMessage.includes("name")) {
          Swal.fire({
            icon: "warning",
            title: "تنبيه!",
            text: "اسم المعيار مكرر أو غير صالح!",
            confirmButtonText: "فهمت",
          });
        } else if (errorMessage.includes("cer")) {
          Swal.fire({
            icon: "warning",
            title: "تنبيه!",
            text: "بيانات المعيار مكررة!",
            confirmButtonText: "فهمت",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "حدث خطأ!",
          text: "يرجى المحاولة لاحقًا",
        });
      }
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

  return (
    <section
      className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center py-12 px-4"
      dir="rtl"
    >
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-3xl p-10 w-full max-w-3xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-[#DC7F56] mb-8">
          إضافة معيار توزيع
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              الوصف
            </label>
            <input
              onChange={handleRefChange}
              type="text"
              name="description"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="ادخل الوصف"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              الحد الأدنى لعدد العائلة
            </label>
            <input
              onChange={handleRefChange}
              type="number"
              min={0}
              name="minimumFamilySize"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="ادخل العدد"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              مستوى الضعف
            </label>
            <input
              onChange={handleRefChange}
              type="text"
              name="vulnerabilityLevel"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="ادخل مستوى الضعف"
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
              value={criteria.gender}
              onChange={handleRefChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="">اختر الجنس</option>
              <option value="male">ذكر</option>
              <option value="female">أنثى</option>
              <option value="both">الاثنين معا</option>
            </select>
          </div>

          {criteria.gender === "female" && (
            <>
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  name="isItdivorceds"
                  onChange={handleRefChange}
                  className="w-5 h-5 text-[#DC7F56] border-gray-300 rounded focus:ring-[#DC7F56] dark:bg-gray-700 dark:border-gray-600"
                />
                <label className="text-sm font-medium text-gray-700 dark:text-white">
                  هل رب الأسرة مطلق
                </label>
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  name="isItwidows"
                  onChange={handleRefChange}
                  className="w-5 h-5 text-[#DC7F56] border-gray-300 rounded focus:ring-[#DC7F56] dark:bg-gray-700 dark:border-gray-600"
                />
                <label className="text-sm font-medium text-gray-700 dark:text-white">
                  هل رب الأسرة أرمل
                </label>
              </div>
            </>
          )}

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
              type="text"
              name="otherConditions"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="ادخل الشروط الأخرى"
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
              ➕ إضافة الشرط
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
