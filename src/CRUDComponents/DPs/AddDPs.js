import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../AuthProvider";
import { campService, dpService } from "../../services/apiService";

export default function AddDPs() {
  const { user } = useContext(AuthContext);
  const naviagte = useNavigate();
  const [DPs, setDPs] = useState({
    Identificationnumber: "",
    gender: "",
    dob: "",
    contactinfo: "",
    RelationToFamilyHead: "",
    Fname: "",
    Lname: "",
    fatherName: "",
    grandFatherName: "",
    IdentityNo: "",
    ParentId: "0",
    NumOfFemales: 0,
    NumOfMales: 0,
    VulnerabilityLevel: "",
    TentStatus: "",
    PregnantNo: 0,
    isItdivorceds: false,
    isItwidows: false,
    Childrenyoungrethan3Y: 0,
    OlderThan60: 0,
    Childrenyoungrethan1Y: 0,
    Childrenyoungrethan9Y: 0,
    approved: false,
    CampId: 0,
  });

  const role = user.role;
  const id = user.id;
  const [existingDP, setExistingDP] = useState(null);
  const [showRestOfFields, setShowRestOfFields] = useState(false);
  const [Camp, setCamp] = useState([]);
  const [disa, setDisa] = useState(false);
  const [showIde, setShowID] = useState({ HeadIdentityNo: "" });
  const [dp, setDp] = useState();
  const { Identificationnumber, RelationToFamilyHead, IdentityNo } = DPs;

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setDPs((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleHeadChange(e) {
    const { name, value } = e.target;
    setShowID((prev) => ({ ...prev, [name]: value }));
  }

  useEffect(() => {
    if (role === "DPs") {
      getDp();
    } else {
      getCamp();
    }
  }, []);

  async function getDp() {
    try {
      const response = await dpService.getAll();
      setDPs(response.data);
    } catch (error) {
      console.log("error", error);
    }
  }

  async function getCamp() {
    try {
      const res = await campService.getAll();
      setCamp(res.data);
    } catch (error) {
      console.log("camperror", error);
    }
  }

  async function hundleSubmit(e) {
    if (e) e.preventDefault();

    if ((role !== "SystemManager" || role !== "CampManager") && dp) {
      DPs.ParentId = id;
      DPs.Identificationnumber = dp.Identificationnumber;
      DPs.CampId = dp.CampId;
    } else if (role === "CampManager") {
      DPs.CampId = Camp[0].id;
    }

    try {
      await dpService.create(DPs);

      Swal.fire({
        icon: "success",
        title: "تم إضافة النازح بنجاح",
        text: "تم إضافة النازح إلى قاعدة البيانات.",
      });
      naviagte("..");
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "حدث خطأ",
        text: "لم يتم إضافة النازح. حاول مرة أخرى.",
      });
    }
  }

  async function handleNext() {
    if (!RelationToFamilyHead) {
      Swal.fire({
        icon: "warning",
        title: "يرجى تعبئة جميع الحقول المطلوبة أولاً",
      });
      return;
    }

    try {
      let isFound = false;
      let existingDPData = null;

      try {
        const response =
          await dpService.getByIdentification(Identificationnumber);
        isFound = true;
        existingDPData = response.data;
        setExistingDP(existingDPData);
      } catch {
        isFound = false;
      }

      let found = false;
      try {
        await dpService.getByIdentity(IdentityNo);
        found = true;
      } catch (err) {
        if (err?.response?.status === 400) {
          Swal.fire({
            icon: "warning",
            title: "رقم الهوية موجود مسبقاً",
            text: "رقم الهوية الذي أدخلته موجود بالفعل في النظام.",
          });
          return;
        }
        found = false;
      }

      if (isFound) {
        if (existingDPData && RelationToFamilyHead !== "هو نفسه") {
          if (!found) {
            Swal.fire({
              icon: "info",
              title: "رقم الهوية مسجل مسبقا",
              text: `مسجل ${IdentityNo} النازح صاحب رقم الهوية`,
            });
          } else {
            if (
              showIde.HeadIdentityNo.toString().trim() ===
                existingDPData.identityNo.toString().trim() &&
              Identificationnumber.toString().trim() ===
                existingDPData.identificationnumber.toString().trim()
            ) {
              DPs.ParentId = existingDPData.id;
              DPs.CampId = existingDPData.campId;

              Swal.fire({
                icon: "info",
                title: "الأسرة مرتبطة بهذا الشخص",
                text: `${existingDPData.fname} ${existingDPData.lname} هذه الأسرة ترتبط بالشخص`,
                confirmButtonText: "إضافة نازح",
              }).then(async (result) => {
                if (result.isConfirmed) {
                  setDisa(false);
                  try {
                    await dpService.create(DPs);
                    Swal.fire({
                      icon: "success",
                      title: "تم إضافة النازح بنجاح",
                      text: "تم إضافة النازح إلى قاعدة البيانات.",
                    });
                    naviagte("..");
                  } catch (error) {
                    Swal.fire({
                      icon: "error",
                      title: "حدث خطأ",
                      text: "لم يتم إضافة النازح. حاول مرة أخرى.",
                    });
                  }
                }
              });
            } else {
              Swal.fire({
                icon: "info",
                title: "رقم هوية خاطئ او رقم تعريف خاطئ",
                text: "لا يمكن ربط العلاقة بشخص ليس رب الأسرة.",
              });
            }
          }
        }
      } else {
        if (RelationToFamilyHead === "هو نفسه") {
          if (!found) {
            setDisa(false);
            Swal.fire({
              icon: "info",
              title: "رب الاسرة مسجل مسبقا",
              text: "رقم التعريف موجود",
            });
          } else {
            setShowRestOfFields(true);
            setDisa(true);
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "رقم التعريف غير موجود",
            text: `لا يوجد شخص برقم التعريف ${Identificationnumber}.`,
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "حدث خطأ",
        text: "حدث خطأ أثناء معالجة البيانات. يرجى المحاولة مرة أخرى.",
      });
    }
  }

  return (
    <section
      className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center py-12 px-4"
      dir="rtl"
    >
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-3xl p-10 w-full max-w-4xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-[#DC7F56] mb-8">
          إضافة نازح جديد
        </h2>
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            required
            name="Fname"
            label="الاسم الأول"
            value={DPs.Fname || ""}
            onChange={handleChange}
          />
          <Input
            required
            name="Lname"
            label="الاسم الأخير"
            value={DPs.Lname || ""}
            onChange={handleChange}
          />
          <Input
            required
            name="fatherName"
            label="اسم الأب"
            value={DPs.fatherName || ""}
            onChange={handleChange}
          />
          <Input
            required
            name="grandFatherName"
            label="اسم الجد"
            value={DPs.grandFatherName || ""}
            onChange={handleChange}
          />
          <Input
            name="dob"
            label="تاريخ الميلاد"
            value={DPs.dob || ""}
            type="date"
            required
            onChange={handleChange}
          />
          <Input
            name="contactinfo"
            label="رقم الجوال"
            type="phoneNumber"
            value={DPs.contactinfo || ""}
            onChange={handleChange}
          />

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              الجنس
            </label>
            <select
              name="gender"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
              value={DPs.gender || ""}
            >
              <option value="">اختر الجنس</option>
              <option value="male">ذكر</option>
              <option value="female">انثى</option>
            </select>
          </div>

          {DPs.gender === "female" && (
            <>
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  name="isItdivorceds"
                  onChange={handleChange}
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
                  onChange={handleChange}
                  className="w-5 h-5 text-[#DC7F56] border-gray-300 rounded focus:ring-[#DC7F56] dark:bg-gray-700 dark:border-gray-600"
                />
                <label className="text-sm font-medium text-gray-700 dark:text-white">
                  هل رب الأسرة أرمل
                </label>
              </div>
            </>
          )}

          <Input
            name="IdentityNo"
            required
            label="رقم الهوية"
            type="text"
            value={DPs.IdentityNo || ""}
            onChange={handleChange}
          />

          {(role === "SystemManager" || role === "CampManager") && (
            <Input
              name="Identificationnumber"
              disabled={DPs.RelationToFamilyHead === "هو نفسه"}
              label="رقم التعريف"
              value={DPs.Identificationnumber || ""}
              onChange={handleChange}
            />
          )}

          {(role === "SystemManager" || role === "CampManager") && (
            <Input
              name="HeadIdentityNo"
              disabled={DPs.RelationToFamilyHead === "هو نفسه"}
              label="رقم هوية رب الاسرة"
              value={showIde.HeadIdentityNo || ""}
              onChange={handleHeadChange}
            />
          )}

          {role === "SystemManager" && (
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
                المخيم
              </label>
              <select
                name="CampId"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
                disabled={disa}
                value={DPs.CampId || ""}
              >
                <option value="">اختر المخيم</option>
                {Camp.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              العلاقة برئيس الأسرة
            </label>
            <select
              name="RelationToFamilyHead"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
              disabled={disa}
              value={DPs.RelationToFamilyHead || ""}
            >
              <option value="">اختر العلاقة</option>
              <option value="هو نفسه">هو نفسه</option>
              <option value="ابن">ابن</option>
              <option value="بنت">بنت</option>
              <option value="زوجة">زوجة</option>
            </select>
          </div>

          <Input
            name="ParentId"
            label="رقم رب الأسرة"
            type="number"
            value={DPs.ParentId || 0}
            onChange={handleChange}
            disabled
          />

          <div className="sm:col-span-2 flex justify-center mt-6">
            <div className="block">
              <button
                type="button"
                onClick={() => {
                  if (role === "SystemManager" || role === "CampManager") {
                    handleNext();
                  } else {
                    hundleSubmit();
                  }
                }}
                className="bg-[#DC7F56] block hover:bg-[#c46b45] text-white font-semibold px-10 py-3 rounded-full shadow-md transition-all duration-300"
              >
                {role === "SystemManager" || role === "CampManager"
                  ? "التالي"
                  : "تسجيل"}
              </button>
            </div>

            {showRestOfFields && (
              <div className="mt-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                  <Input
                    name="VulnerabilityLevel"
                    label="مستوى الضعف"
                    value={DPs.VulnerabilityLevel}
                    onChange={handleChange}
                  />
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
                      حالة الخيمة
                    </label>
                    <select
                      name="TentStatus"
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      required
                      value={DPs.TentStatus || ""}
                    >
                      <option value="">اختر العلاقة</option>
                      <option value="جيدة">جيدة</option>
                      <option value="سيئة">سيئة</option>
                      <option value="متوسطة">متوسطة</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <input
                      onChange={handleChange}
                      type="checkbox"
                      name="approved"
                      checked={DPs.approved}
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded mt-5"
                    />
                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                      تفعيل
                    </label>
                  </div>
                </div>
                <button
                  onClick={hundleSubmit}
                  className="bg-[#DC7F56] hover:bg-[#c46b45] text-white font-semibold px-8 py-3 rounded-full shadow-md transition-all duration-300"
                >
                  ➕ إضافة نازح
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

function Input({
  name,
  label,
  type = "text",
  value,
  onChange,
  disabled = false,
}) {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        min={0}
        minLength={0}
        onChange={onChange}
        disabled={disabled}
        className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600 disabled:opacity-50"
        required
      />
    </div>
  );
}
