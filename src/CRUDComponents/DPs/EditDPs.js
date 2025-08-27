import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { TokenContext } from "../../TokenContext";

export default function EditDPs() {
  const { id } = useParams();
  const naviagte = useNavigate();
  const [DPs, setDPs] = useState({
    identificationnumber: "",
    gender: "",
    dob: "",
    contactinfo: "",
    relationToFamilyHead: "",
    fname: "",
    lname: "",
    fatherName: "",
    grandFatherName: "",
    identityNo: "",
    parentId: "0",
    numOfFemales: 0,
    numOfMales: 0,
    vulnerabilityLevel: "",
    isItdivorceds: false,
    isItwidows: false,
    tentStatus: "",
    pregnantNo: 0,
    childrenyoungrethan3Y: 0,
    olderThan60: 0,
    childrenyoungrethan1Y: 0,
    childrenyoungrethan9Y: 0,
    approved: false,
    campId: 0,
  });
  const [showAllFields, setShowAllFields] = useState(false);
  // let token= localStorage.getItem("token")
  const { token } = useContext(TokenContext);

  console.log(DPs);

  useEffect(() => {
    async function fetchDP() {
      try {
        const response = await fetch(`https://camps.runasp.net/dps/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setDPs(data);
          if (data.RelationToFamilyHead === "هو نفسه") setShowAllFields(true);
        }
      } catch (error) {
        console.error("Error fetching DP:", error);
      }
    }
    fetchDP();
  }, [0]);
  console.log(DPs);

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;

    // Update state
    setDPs((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "RelationToFamilyHead") {
      if (value === "هو نفسه") {
        setShowAllFields(true);
        setDPs((prev) => ({
          ...prev,
          ParentId: prev.Identificationnumber,
        }));
      } else {
        setShowAllFields(false);

        if (DPs.Identificationnumber) {
          try {
            const res = await fetch(
              `https://camps.runasp.net/dps/check/${DPs.Identificationnumber}`
            );
            const data = await res.json();

            if (data.exists) {
              setDPs((prev) => ({
                ...prev,
                Fname: data.dp.fname,
                Lname: data.dp.lname,
                ParentId: data.dp.identificationnumber,
              }));
              Swal.fire({
                icon: "info",
                title: "تم العثور على رئيس الأسرة",
                text: "تم تعبئة بعض الحقول تلقائياً.",
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "لم يتم العثور على رئيس الأسرة",
                text: "تأكد من رقم التعريف المستخدم لرئيس الأسرة.",
              });
            }
          } catch (error) {
            console.error("Check failed:", error);
            Swal.fire({
              icon: "error",
              title: "خطأ في التحقق",
              text: "تعذر التحقق من رئيس الأسرة.",
            });
          }
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(DPs);

    try {
      const response = await fetch(`https://camps.runasp.net/dps/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(DPs),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "تم التحديث",
          text: "تم تحديث بيانات النازح بنجاح.",
        });
        naviagte("..");
      } else {
        Swal.fire({
          icon: "error",
          title: "فشل التحديث",
          text: "حدث خطأ أثناء التحديث.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "خطأ في الإرسال",
        text: "تعذر إرسال البيانات إلى الخادم.",
      });
    }
  };

  return (
    <section
      className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center py-12 px-4"
      dir="rtl"
    >
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-3xl p-10 w-full max-w-4xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-[#DC7F56] mb-8">
          تعديل بيانات النازح
        </h2>
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            name="fname"
            label="الاسم الأول"
            value={DPs.fname}
            onChange={handleChange}
            disabled={showAllFields}
          />
          <Input
            name="lname"
            label="الاسم الأخير"
            value={DPs.lname}
            onChange={handleChange}
            disabled={showAllFields}
          />
          <Input
            name="identificationnumber"
            label="رقم التعريف"
            value={DPs.identificationnumber}
            onChange={handleChange}
            disabled
          />
          <Input
            name="gender"
            label="الجنس"
            value={DPs.gender}
            onChange={handleChange}
          />
          <Input
            name="dOB"
            label="تاريخ الميلاد"
            type="date"
            value={DPs.dOB}
            onChange={handleChange}
          />

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
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              العلاقة برئيس الأسرة
            </label>
            <select
              name="relationToFamilyHead"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
              disabled
              value={DPs.relationToFamilyHead}
            >
              <option value="">اختر العلاقة</option>
              <option value="هو نفسه">هو نفسه</option>
              <option value="ابن">ابن</option>
              <option value="بنت">بنت</option>
              <option value="زوجة">زوجة</option>
            </select>
          </div>

          {DPs.parentId == 0 && (
            <>
              <Input
                name="fatherName"
                label="اسم الأب"
                value={DPs.fatherName}
                onChange={handleChange}
              />
              <Input
                name="grandFatherName"
                label="اسم الجد"
                value={DPs.grandFatherName}
                onChange={handleChange}
              />
              <Input
                name="identityNo"
                label="رقم الهوية"
                value={DPs.identityNo}
                onChange={handleChange}
                disabled
              />
              <Input
                name="parentId"
                label="رقم رب الأسرة"
                value={DPs.parentId}
                onChange={handleChange}
                disabled
              />
              <Input
                name="vulnerabilityLevel"
                label="مستوى الضعف"
                value={DPs.vulnerabilityLevel}
                onChange={handleChange}
              />
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
                  حالة الخيمة
                </label>
                <select
                  name="tentStatus"
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  required
                  value={DPs.tentStatus || ""}
                >
                  <option value="">اختر العلاقة</option>
                  <option value="جيدة">جيدة</option>
                  <option value="سيئة">سيئة</option>
                  <option value="متوسطة">متوسطة</option>
                </select>
              </div>
              <Input
                name="pregnantNo"
                label="عدد الحوامل"
                type="number"
                value={DPs.pregnantNo}
                onChange={handleChange}
              />
            </>
          )}
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

          <div className="sm:col-span-2 flex justify-center mt-6">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-[#DC7F56] hover:bg-[#c46b45] text-white font-semibold px-10 py-3 rounded-full shadow-md transition-all duration-300"
            >
              تحديث نازح
            </button>
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
        min={type == "number" ? 0 : ""}
        minLength={type == "number" ? 0 : ""}
        onChange={onChange}
        disabled={disabled}
        className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
      />
    </div>
  );
}
