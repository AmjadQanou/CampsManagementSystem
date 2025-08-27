import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, IdCard, KeyRound } from "lucide-react";

export default function DPsRegister() {
  let token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [register, setRegister] = useState({
    username: "",
    password: "",
    IdentityNo: "",
    IdenticationNo: "",
    campId: "",
    email: "",
    role: "",
  });

  const [camp, setCamp] = useState([]);
  const [dp, setDp] = useState();

  useEffect(() => {
    getCamp();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setRegister((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function getCamp() {
    const res = await fetch("http://camps.runasp.net/campsreg", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      await setCamp(data);
    }
  }

  async function GetDpByIdentityNo() {
    const res = await fetch(
      `http://camps.runasp.net/dps/byidentityreg/${register.IdentityNo}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    setDp(data);
  }

  async function PostRegister() {
    try {
      const response = await fetch("http://camps.runasp.net/registerDp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(register),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "تم التسجيل",
          text: "تم التسجيل بنجاح",
        });
        navigate("/login");
      } else {
        const errorText = await response.text();
        if (errorText.includes("UserName")) {
          Swal.fire({
            icon: "error",
            title: "اسم المستخدم موجود مسبقا",
            text: "لم يتم إضافة التسجيل. حاول مرة أخرى.",
          });
        } else if (errorText.includes("Dp")) {
          Swal.fire({
            icon: "warning",
            title: "الشخص غير مقبول",
            text: `رقم الهوية او الرقم التعريفي خطأ`,
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "حدث خطأ",
        text: "حدث خطأ أثناء إرسال البيانات. يرجى المحاولة مرة أخرى.",
      });
    }
  }

  async function hundleSubmit(e) {
    e.preventDefault();
    await GetDpByIdentityNo();
    console.log(dp);
    console.log(register.IdenticationNo);

    if (
      dp?.identificationnumber == register.IdenticationNo &&
      dp?.identityNo == register.IdentityNo &&
      dp?.campId == register.campId
    ) {
      await PostRegister();
    } else {
      Swal.fire({
        icon: "warning",
        title: "الشخص غير مقبول",
        text: `رقم الهوية او الرقم التعريفي خطأ`,
      });
    }
  }

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-[#f5f5f5] dark:bg-gray-800 p-6"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.form
        className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg space-y-6"
        onSubmit={hundleSubmit}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-center text-[#A6B78D]">
          تسجيل حساب جديد
        </h2>

        {[
          {
            name: "username",
            type: "text",
            icon: <UserPlus size={18} />,
            placeholder: "اسم المستخدم",
          },
          {
            name: "password",
            type: "password",
            icon: <Lock size={18} />,
            placeholder: "كلمة السر",
          },
          {
            name: "email",
            type: "email",
            icon: <Mail size={18} />,
            placeholder: "البريد الإلكتروني",
          },
          {
            name: "IdentityNo",
            type: "text",
            icon: <IdCard size={18} />,
            placeholder: "رقم الهوية",
          },
          {
            name: "IdenticationNo",
            type: "text",
            icon: <KeyRound size={18} />,
            placeholder: "الرقم التعريفي",
          },
        ].map(({ name, type, icon, placeholder }) => (
          <div className="relative" key={name}>
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#DC7F56]">
              {icon}
            </span>
            <input
              name={name}
              type={type}
              required
              placeholder={placeholder}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-800 dark:text-white"
            />
          </div>
        ))}

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
            اختر المخيم
          </label>
          <select
            name="campId"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white"
            required
            value={register.campId || ""}
          >
            <option value="">اختر المخيم</option>
            {camp.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-[#DC7F56] text-white py-3 rounded-xl font-semibold transition-colors hover:bg-[#c06d47]"
        >
          تسجيل
        </motion.button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-300">
          لديك حساب؟{" "}
          <Link to="/login" className="text-[#A6B78D] hover:underline">
            تسجيل الدخول
          </Link>
        </p>
      </motion.form>
    </motion.div>
  );
}
