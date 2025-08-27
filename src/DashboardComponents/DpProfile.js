import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../AuthProvider";
import { TokenContext } from "../TokenContext";
import Swal from "sweetalert2";
import {
  FaEdit,
  FaIdCard,
  FaTrash,
  FaUserCircle,
  FaPlus,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { GiFamilyHouse, GiSpinningBlades } from "react-icons/gi";
import {
  MdEmergency,
  MdFoodBank,
  MdDateRange,
  MdOutlineColorLens,
} from "react-icons/md";
import { IoIosPeople, IoMdPlanet } from "react-icons/io";
import { RiHomeHeartLine, RiShieldUserFill } from "react-icons/ri";
import { FiRefreshCw } from "react-icons/fi";

const DPProfile = () => {
  const { user } = useContext(AuthContext);
  const { token } = useContext(TokenContext);
  const [dp, setDp] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [reliefItems, setReliefItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showEditMemberModal, setShowEditMemberModal] = useState(false);
  const [editMemberData, setEditMemberData] = useState({});
  const [activeTab, setActiveTab] = useState("profile");
  const [colorTheme, setColorTheme] = useState("#DC7F56");
  const [isHolographicActive, setIsHolographicActive] = useState(false);
  const [userData, setUserData] = useState();

  const [newMemberData, setNewMemberData] = useState({
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
    Childrenyoungrethan3Y: 0,
    OlderThan60: 0,
    Childrenyoungrethan1Y: 0,
    Childrenyoungrethan9Y: 0,
    approved: false,

    CampId: 0,
  });

  // Color themes
  const themes = [
    { name: "Sunset", color: "#DC7F56" },
    { name: "Ocean", color: "#22B8CF" },
    { name: "Emerald", color: "#A6B78D" },
    { name: "Lavender", color: "#9B59B6" },
    { name: "Cyber", color: "#00FF9D" },
  ];

  useEffect(() => {
    const fetchDPData = async () => {
      try {
        const dpRes = await fetch(`http://camps.runasp.net/dps`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!dpRes.ok) throw new Error("Failed to fetch DP data");

        const dpData = await dpRes.json();
        console.log(dpData);

        //  const Userres = await fetch(`http://camps.runasp.net/user/${dpData.joinId}`, {
        //   method: "GET",
        //   headers: {
        //     "Content-Type": "application/json",
        //     Authorization: `Bearer ${token}`,
        //   },
        // });
        // if (!Userres.ok) throw new Error("Failed to fetch User data");
        // const userData = await Userres.json();
        // setUserData(userData);

        setNewMemberData((prev) => ({
          ...prev,
          CampId: dpData.campId,
          ParentId: dpData.id,
          Identificationnumber: dpData.identificationnumber,
        }));
        console.log(dpData);

        setDp(dpData);
        setFormData(dpData);

        const familyRes = await fetch(
          `http://camps.runasp.net/dps/by-identification/${dpData.identificationnumber}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (familyRes.ok) {
          const familyData = await familyRes.json();
          const family = Array.isArray(familyData)
            ? familyData.filter((f) => f.parentId !== 0)
            : [];
          setFamilyMembers(family);
        }

        const reliefRes = await fetch(`http://camps.runasp.net/dpsreleif`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (reliefRes.ok) {
          const reliefData = await reliefRes.json();
          setReliefItems(reliefData);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDPData();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`http://camps.runasp.net/dps/${dp.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update profile.");

      const updatedDP = await res.json();
      setDp(updatedDP);
      setShowModal(false);
      Swal.fire({
        title: "تم التحديث!",
        text: "تم تحديث البيانات بنجاح.",
        icon: "success",
        background: "#1E293B",
        color: "#fff",
        confirmButtonColor: colorTheme,
      }).then((result) => {
        if (result.isConfirmed) window.location.reload();
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        title: "خطأ",
        text: "حدث خطأ أثناء تحديث البيانات",
        icon: "error",
        background: "#1E293B",
        color: "#fff",
        confirmButtonColor: colorTheme,
      });
    }
  };

  const handleAddMemberChange = (e) => {
    setNewMemberData({ ...newMemberData, [e.target.name]: e.target.value });
  };

  const handleAddMemberSave = async () => {
    const response = await fetch("http://camps.runasp.net/dps", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newMemberData),
    });

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "تم إضافة النازح بنجاح",
        text: "تم إضافة النازح إلى قاعدة البيانات.",
        confirmButtonText: "حسنا",
        background: "#1E293B",
        color: "#fff",
        confirmButtonColor: colorTheme,
      }).then((res) => {
        if (res.isConfirmed) {
          window.location.reload();
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "حدث خطأ",
        text: "لم يتم إضافة النازح. حاول مرة أخرى.",
        background: "#1E293B",
        color: "#fff",
        confirmButtonColor: colorTheme,
      });
    }
  };

  const handleDeleteMember = async (id) => {
    const response = await fetch(`http://camps.runasp.net/dps/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      await Swal.fire({
        icon: "success",
        title: "تم الحذف",
        text: "تم حذف الحالة بنجاح.",
        confirmButtonText: "حسنًا",
        background: "#1E293B",
        color: "#fff",
        confirmButtonColor: colorTheme,
      }).then((res) => {
        if (res.isConfirmed) {
          window.location.reload();
        }
      });
    }
  };

  const handleEditMember = async (id) => {
    const dpRes = await fetch(`http://camps.runasp.net/dps/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (dpRes.ok) {
      const data = await dpRes.json();
      setEditMemberData(data);
      setShowEditMemberModal(true);
    }
  };

  const handleEditMemberChange = (e) => {
    setEditMemberData({ ...editMemberData, [e.target.name]: e.target.value });
  };

  const handleEditMemberSave = async (id) => {
    const response = await fetch(`http://camps.runasp.net/dps/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editMemberData),
    });

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "تم التحديث",
        text: "تم تحديث بيانات النازح بنجاح.",
        confirmButtonText: "حسنا",
        background: "#1E293B",
        color: "#fff",
        confirmButtonColor: colorTheme,
      }).then((res) => {
        if (res.isConfirmed) {
          window.location.reload();
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "فشل التحديث",
        text: "حدث خطأ أثناء التحديث.",
        background: "#1E293B",
        color: "#fff",
        confirmButtonColor: colorTheme,
      });
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <motion.div
          className="relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <IoMdPlanet className="text-6xl text-indigo-400" />
          <motion.div
            className="absolute -top-2 -left-2"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            <GiSpinningBlades className="text-3xl text-cyan-300" />
          </motion.div>
        </motion.div>
      </div>
    );

  if (!dp)
    return (
      <div className="text-center p-10 text-red-500 text-xl bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 max-w-md">
          <RiShieldUserFill className="text-6xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            لم يتم العثور على الشخص النازح
          </h2>
          <p className="text-gray-300">
            تعذر تحميل بيانات النازح. يرجى التحقق من الاتصال أو إعادة المحاولة
            لاحقًا.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 rounded-full text-white font-bold flex items-center gap-2 mx-auto hover:shadow-lg hover:shadow-red-500/30 transition-all"
          >
            <FiRefreshCw /> إعادة تحميل
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white text-[#DC7F56] pb-20">
      <div className="fixed bottom-6 right-6 z-50">
        <motion.div className="relative" whileHover={{ scale: 1.1 }}>
          <button
            onClick={() => setIsHolographicActive(!isHolographicActive)}
            className={`p-3 rounded-full shadow-xl ${
              isHolographicActive
                ? "bg-gradient-to-br from-cyan-400 to-blue-500"
                : "bg-gray-700"
            }`}
          >
            <MdOutlineColorLens className="text-2xl text-white" />
          </button>
          <AnimatePresence>
            {isHolographicActive && (
              <motion.div
                className="absolute -top-60 right-0 bg-white p-4 rounded-2xl shadow-2xl border border-gray-700 w-64"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <MdOutlineColorLens /> اختر سمة اللون
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {themes.map((theme, idx) => (
                    <motion.button
                      key={idx}
                      className={`w-8 h-8 rounded-full ${
                        colorTheme === theme.color ? "ring-2 ring-white" : ""
                      }`}
                      style={{ backgroundColor: theme.color }}
                      onClick={() => setColorTheme(theme.color)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    />
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-xs text-gray-400">
                    اختر لونًا ليتناسب مع ذوقك
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <motion.div
        className="pt-10 px-4 max-w-7xl mx-auto space-y-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="relative overflow-hidden rounded-3xl"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.8 + 0.2,
                }}
                animate={{
                  y: [0, Math.random() * 100 - 50],
                  x: [0, Math.random() * 100 - 50],
                }}
                transition={{
                  duration: Math.random() * 20 + 10,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            ))}
          </div>

          <div className="relative bg-[#DC7F56] text-white p-8 rounded-3xl border border-gray-700 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <motion.div className="relative" whileHover={{ scale: 1.05 }}>
                <div
                  className={`w-40 h-40 rounded-full border-4 border-[${colorTheme}] bg-gray-500 p-1 shadow-lg relative overflow-hidden`}
                >
                  {dp?.photoUrl ? (
                    <img
                      src={dp.photoUrl}
                      className="w-full h-full rounded-full object-cover"
                      alt="Profile"
                    />
                  ) : (
                    <FaUserCircle className="w-full h-full text-gray-600" />
                  )}
                  {/* Holographic effect */}
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <div className="absolute inset-0 bg-white opacity-30 animate-holographic"></div>
                  </div>
                </div>
                <motion.div
                  className="absolute -bottom-3 -right-3 w-12 h-12 rounded-full bg-gradient-to-br from-[#00FF9D] to-[#00B8BA] border-2 border-gray-800 flex items-center justify-center text-white text-sm font-bold shadow-lg"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {familyMembers.length + 1}
                </motion.div>
              </motion.div>

              {/* Profile Info */}
              <div className="flex-1 text-right space-y-4">
                <motion.h1
                  className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {`${dp.fname} ${dp.lname}`}
                </motion.h1>
                <motion.p
                  className="text-lg text-gray-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {dp.relationToFamilyHead || "رئيس العائلة"}
                </motion.p>

                {/* Action Buttons */}
                <motion.div
                  className="flex flex-wrap gap-4 mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <button
                    onClick={() => setShowModal(true)}
                    className={`px-6 py-2 rounded-full bg-gradient-to-r from-${colorTheme.replace(
                      "#",
                      ""
                    )} to-${colorTheme.replace(
                      "#",
                      ""
                    )} text-white font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-${colorTheme.replace(
                      "#",
                      ""
                    )}/30 transition-all`}
                    style={{
                      background: `linear-gradient(to right, ${colorTheme}, ${colorTheme}90)`,
                    }}
                  >
                    <FaEdit /> تحديث الملف
                  </button>
                  <button className="px-6 py-2 rounded-full bg-gradient-to-r from-gray-300 to-gray-400 text-white font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-gray-700/30 transition-all">
                    <FaIdCard /> بطاقة النازح
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          className="flex border-b border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-6 py-3 font-bold relative ${
              activeTab === "profile"
                ? "text-[#DC7F56]"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            الملف الشخصي
            {activeTab === "profile" && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[${colorTheme}] to-transparent"
                style={{
                  background: `linear-gradient(to right, transparent, ${colorTheme}, transparent)`,
                }}
                layoutId="tabIndicator"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("family")}
            className={`px-6 py-3 font-bold relative ${
              activeTab === "family"
                ? "text-[#DC7F56]"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            العائلة
            {activeTab === "family" && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[${colorTheme}] to-transparent"
                style={{
                  background: `linear-gradient(to right, transparent, ${colorTheme}, transparent)`,
                }}
                layoutId="tabIndicator"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("relief")}
            className={`px-6 py-3 font-bold relative ${
              activeTab === "relief"
                ? "text-[#DC7F56]"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            المساعدات
            {activeTab === "relief" && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[${colorTheme}] to-transparent"
                style={{
                  background: `linear-gradient(to right, transparent, ${colorTheme}, transparent)`,
                }}
                layoutId="tabIndicator"
              />
            )}
          </button>
        </motion.div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="المخيم"
                value={dp.campId}
                color={colorTheme}
                icon={<RiHomeHeartLine />}
                delay={0.1}
              />
              <StatCard
                title="حالة الخيمة"
                value={dp.tentStatus || "غير معروف"}
                color={colorTheme}
                icon={<GiFamilyHouse />}
                delay={0.2}
              />
              <StatCard
                title="الأونروا"
                value={dp.unrwaNo || "غير مسجل"}
                color={colorTheme}
                icon={<FaIdCard />}
                delay={0.3}
              />
              <StatCard
                title="التعريف"
                value={dp.identificationnumber}
                color={colorTheme}
                icon={<RiShieldUserFill />}
                delay={0.4}
              />
            </div>

            {/* Detailed Information */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Info Card */}
              <motion.div
                className="bg-white rounded-2xl p-6 border border-gray-700 shadow-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-xl font-bold text-[#DC7F56] mb-6 pb-2 border-b border-gray-700 flex items-center gap-2">
                  <FaUserCircle
                    className="text-[${colorTheme}]"
                    style={{ color: colorTheme }}
                  />
                  المعلومات الشخصية
                </h3>
                <div className="space-y-4">
                  <InfoRow label="اسم الأب" value={dp.fatherName} />
                  <InfoRow label="اسم الجد" value={dp.grandFatherName} />
                  <InfoRow label="رقم الهوية" value={dp.identityNo} />
                  <InfoRow
                    label="الجنس"
                    value={dp.gender === "male" ? "ذكر" : "أنثى"}
                  />
                  <InfoRow
                    label="تاريخ الميلاد"
                    value={
                      dp.dob
                        ? new Date(dp.dob).toLocaleDateString("ar-EG")
                        : "غير معروف"
                    }
                  />
                </div>
              </motion.div>

              {/* Family Info Card */}
              <motion.div
                className="bg-white rounded-2xl p-6 border border-gray-700 shadow-lg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-xl font-bold text-[#DC7F56] mb-6 pb-2 border-b border-gray-700 flex items-center gap-2">
                  <IoIosPeople style={{ color: colorTheme }} />
                  معلومات العائلة
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <InfoBox
                    label="عدد الذكور"
                    value={dp.numOfMales}
                    color={colorTheme}
                  />
                  <InfoBox
                    label="عدد الإناث"
                    value={dp.numOfFemales}
                    color={colorTheme}
                  />
                  <InfoBox
                    label="أطفال <3 سنوات"
                    value={dp.childrenyoungrethan3Y}
                    color={colorTheme}
                  />
                  <InfoBox
                    label="أطفال <1 سنة"
                    value={dp.childrenyoungrethan1Y}
                    color={colorTheme}
                  />
                  <InfoBox
                    label="أطفال <9 سنوات"
                    value={dp.childrenyoungrethan9Y}
                    color={colorTheme}
                  />
                  <InfoBox
                    label="الحوامل"
                    value={dp.pregnantNo}
                    color={colorTheme}
                  />
                  <InfoBox
                    label="كبار >60 سنة"
                    value={dp.olderThan60}
                    color={colorTheme}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Family Tab */}
        {activeTab === "family" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-2xl overflow-hidden border border-gray-700 shadow-2xl"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
            >
              <div className="p-6 flex justify-between items-center bg-white">
                <h3 className="text-xl font-bold text-[#DC7F56] flex items-center gap-2">
                  <GiFamilyHouse style={{ color: colorTheme }} />
                  أفراد العائلة
                </h3>
                <motion.button
                  onClick={() => setShowAddMemberModal(true)}
                  className={`px-4 py-2 rounded-full bg-gradient-to-r from-${colorTheme.replace(
                    "#",
                    ""
                  )} to-${colorTheme.replace(
                    "#",
                    ""
                  )} text-white font-bold hover:shadow-lg hover:shadow-${colorTheme.replace(
                    "#",
                    ""
                  )}/30 transition-all flex items-center gap-2`}
                  style={{
                    background: `linear-gradient(to right, ${colorTheme}, ${colorTheme}90)`,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaPlus /> إضافة فرد
                </motion.button>
              </div>

              <div className="bg- white text-[#DC7F56] divide-y divide-gray-700">
                {familyMembers.length > 0 ? (
                  familyMembers.map((member, idx) => (
                    <motion.div
                      key={idx}
                      className="p-6 hover:bg-gray-750 transition-all"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-14 h-14 rounded-full bg-gradient-to-br from-${colorTheme.replace(
                              "#",
                              ""
                            )} to-${colorTheme.replace(
                              "#",
                              ""
                            )}/20 flex items-center justify-center relative overflow-hidden`}
                            style={{
                              background: `linear-gradient(to bottom right, ${colorTheme}20, ${colorTheme}40)`,
                            }}
                          >
                            {member.gender === "female" ? (
                              <div className="text-2xl">👩</div>
                            ) : (
                              <div className="text-2xl">👨</div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-30 animate-holographic"></div>
                          </div>
                          <div className="text-right">
                            <h4 className="font-bold text-[#DC7F56]">{`${member.fname} ${member.lname}`}</h4>
                            <p className="text-sm text-gray-300">
                              {member.relationToFamilyHead}
                            </p>
                            <p className="text-xs text-gray-500">
                              {member.identityNo}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <motion.button
                            onClick={() => handleEditMember(member.id)}
                            className="p-2 rounded-full  hover:bg-gray-600 text-gray-300 hover:text-white"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            style={{
                              background: `linear-gradient(to bottom right, ${colorTheme}20, ${colorTheme}40)`,
                            }}
                          >
                            <FaEdit size={16} color="white" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleDeleteMember(member.id)}
                            className="p-2 rounded-full  hover:bg-red-500/20 text-gray-300 hover:text-red-400"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            style={{
                              background: `linear-gradient(to bottom right, ${colorTheme}20, ${colorTheme}40)`,
                            }}
                          >
                            <FaTrash size={16} color="white" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    className="p-8 text-center text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    لا يوجد أفراد مسجلين في العائلة
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Relief Tab */}
        {activeTab === "relief" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-2xl overflow-hidden border border-gray-700 shadow-2xl"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
            >
              <div className="p-6 bg-white">
                <h3 className="text-xl font-bold text-[#DC7F56] flex items-center gap-2">
                  <MdFoodBank style={{ color: colorTheme }} />
                  المساعدات المستلمة
                </h3>
              </div>

              <div className="bg-white p-6">
                {reliefItems.length > 0 ? (
                  <div className="relative">
                    {/* Timeline */}
                    <div className="absolute left-1/2 h-full w-0.5 bg-gradient-to-b from-transparent via-gray-600 to-transparent transform -translate-x-1/2"></div>

                    {reliefItems.map((item, idx) => (
                      <motion.div
                        key={idx}
                        className="relative mb-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 * idx }}
                      >
                        <div
                          className={`flex ${
                            idx % 2 === 0 ? "flex-row" : "flex-row-reverse"
                          } items-start`}
                        >
                          {/* Dot */}
                          <div
                            className={`w-5 h-5 rounded-full ${
                              idx % 2 === 0 ? "ml-6" : "mr-6"
                            }`}
                            style={{ backgroundColor: colorTheme }}
                          ></div>

                          {/* Card */}
                          <motion.div
                            className={`flex-1 p-5 rounded-xl ${
                              idx % 2 === 0 ? "text-left" : "text-right"
                            } bg-gray-750 border border-gray-700 shadow-lg`}
                            whileHover={{ y: -5 }}
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-gray-500 text-lg">
                                {item.reliefName}
                              </h4>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  idx % 2 === 0
                                    ? "bg-cyan-500/20 text-cyan-400"
                                    : "bg-purple-500/20 text-purple-400"
                                }`}
                              >
                                {item.timesReceived} مرات
                              </span>
                            </div>
                            <p className="text-gray-400 mt-2">الكمية: 1</p>
                            <p className="text-sm text-gray-500 mt-3 flex items-center gap-1">
                              <MdDateRange />{" "}
                              {new Date(
                                item.lastReceivedDate
                              ).toLocaleDateString("ar-EG")}
                            </p>
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    لا توجد مساعدات مسجلة
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl space-y-4 relative border border-gray-700"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-[#DC7F56] text-center">
                تحديث البيانات
              </h2>
              <button
                className="absolute top-4 left-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="الاسم"
                  name="fname"
                  value={formData.fname}
                  onChange={handleChange}
                  theme={colorTheme}
                />
                <InputField
                  label="اسم الأب"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  theme={colorTheme}
                />
                <InputField
                  label="اسم الجد"
                  name="grandFatherName"
                  value={formData.grandFatherName}
                  onChange={handleChange}
                  theme={colorTheme}
                />
                <InputField
                  label="الكنية"
                  name="lname"
                  value={formData.lname}
                  onChange={handleChange}
                  theme={colorTheme}
                />
                <Dropdown
                  label="حالة الخيمة"
                  name="tentStatus"
                  value={formData.tentStatus}
                  onChange={handleChange}
                  options={["جيدة", "متوسطة", "سيئة"]}
                  theme={colorTheme}
                />
                <Dropdown
                  label="مستوى الفقر"
                  name="vulnerabilityLevel"
                  value={formData.vulnerabilityLevel}
                  onChange={handleChange}
                  options={["مرتفع", "متوسط", "متدني"]}
                  theme={colorTheme}
                />
              </div>
              <div className="text-center pt-6">
                <motion.button
                  className={`px-8 py-3 rounded-full bg-gradient-to-r from-${colorTheme.replace(
                    "#",
                    ""
                  )} to-${colorTheme.replace(
                    "#",
                    ""
                  )} text-white font-bold hover:shadow-lg transition-all`}
                  style={{
                    background: `linear-gradient(to right, ${colorTheme}, ${colorTheme}90)`,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                >
                  حفظ التغييرات
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Family Member Modal */}
      <AnimatePresence>
        {showAddMemberModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddMemberModal(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl space-y-4 relative border border-gray-700"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-[#DC7F56] text-center">
                إضافة فرد جديد
              </h2>
              <button
                className="absolute top-4 left-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700"
                onClick={() => setShowAddMemberModal(false)}
              >
                ✕
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="الاسم"
                  name="Fname"
                  value={newMemberData.Fname}
                  onChange={handleAddMemberChange}
                  theme={colorTheme}
                />
                <InputField
                  label="الكنية"
                  name="Lname"
                  value={newMemberData.Lname}
                  onChange={handleAddMemberChange}
                  theme={colorTheme}
                />
                <InputField
                  label="رقم الهوية"
                  name="IdentityNo"
                  value={newMemberData.IdentityNo}
                  onChange={handleAddMemberChange}
                  theme={colorTheme}
                />
                <Dropdown
                  label="الجنس"
                  name="gender"
                  value={newMemberData.gender}
                  onChange={handleAddMemberChange}
                  options={["male", "female"]}
                  theme={colorTheme}
                  displayValues={["ذكر", "أنثى"]}
                />
                <Dropdown
                  label="العلاقة برئيس الأسرة"
                  name="RelationToFamilyHead"
                  value={newMemberData.RelationToFamilyHead}
                  onChange={handleAddMemberChange}
                  options={["ابن", "بنت", "زوجة"]}
                  theme={colorTheme}
                />
                <InputField
                  label="تاريخ الميلاد"
                  name="dob"
                  type="date"
                  value={newMemberData.dob}
                  onChange={handleAddMemberChange}
                  theme={colorTheme}
                />
              </div>
              <div className="text-center pt-6">
                <motion.button
                  className={`px-8 py-3 rounded-full bg-gradient-to-r from-${colorTheme.replace(
                    "#",
                    ""
                  )} to-${colorTheme.replace(
                    "#",
                    ""
                  )} text-white font-bold hover:shadow-lg transition-all`}
                  style={{
                    background: `linear-gradient(to right, ${colorTheme}, ${colorTheme}90)`,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddMemberSave}
                >
                  إضافة الفرد
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Family Member Modal */}
      <AnimatePresence>
        {showEditMemberModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEditMemberModal(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl space-y-4 relative border border-gray-700"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-[#DC7F56] text-center">
                تعديل فرد
              </h2>
              <button
                className="absolute top-4 left-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700"
                onClick={() => setShowEditMemberModal(false)}
              >
                ✕
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="الاسم"
                  name="fname"
                  value={editMemberData.fname}
                  onChange={handleEditMemberChange}
                  theme={colorTheme}
                />
                <InputField
                  label="الكنية"
                  name="lname"
                  value={editMemberData.lname}
                  onChange={handleEditMemberChange}
                  theme={colorTheme}
                />
                <InputField
                  label="رقم الهوية"
                  name="identityNo"
                  value={editMemberData.identityNo}
                  onChange={handleEditMemberChange}
                  theme={colorTheme}
                />
                <Dropdown
                  label="الجنس"
                  name="gender"
                  value={editMemberData.gender}
                  onChange={handleEditMemberChange}
                  options={["male", "female"]}
                  theme={colorTheme}
                  displayValues={["ذكر", "أنثى"]}
                />
                <Dropdown
                  label="العلاقة برئيس الأسرة"
                  name="relationToFamilyHead"
                  value={editMemberData.relationToFamilyHead}
                  onChange={handleEditMemberChange}
                  options={["ابن", "بنت", "زوجة"]}
                  theme={colorTheme}
                />
                <InputField
                  label="تاريخ الميلاد"
                  name="dob"
                  type="date"
                  value={editMemberData.dob}
                  onChange={handleEditMemberChange}
                  theme={colorTheme}
                />
              </div>
              <div className="text-center pt-6">
                <motion.button
                  className={`px-8 py-3 rounded-full bg-gradient-to-r from-${colorTheme.replace(
                    "#",
                    ""
                  )} to-${colorTheme.replace(
                    "#",
                    ""
                  )} text-white font-bold hover:shadow-lg transition-all`}
                  style={{
                    background: `linear-gradient(to right, ${colorTheme}, ${colorTheme}90)`,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEditMemberSave(editMemberData.id)}
                >
                  حفظ التغييرات
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes holographic {
          0% {
            transform: translateX(-100%) rotate(-45deg);
          }
          100% {
            transform: translateX(100%) rotate(-45deg);
          }
        }
        .animate-holographic {
          animation: holographic 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

// Custom Components
const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-400">{label}</span>
    <span className="text-[#DC7F56] font-medium">{value || "غير متوفر"}</span>
  </div>
);

const InfoBox = ({ label, value, color }) => (
  <motion.div
    className="bg-gray-750 rounded-lg p-3 text-center border border-gray-700"
    whileHover={{ scale: 1.03 }}
  >
    <p className="text-sm text-gray-400">{label}</p>
    <p className="text-xl text-[#DC7F56] font-bold mt-1" style={{ color }}>
      {value || 0}
    </p>
  </motion.div>
);

const StatCard = ({ title, value, color, icon, delay = 0 }) => (
  <motion.div
    className={`rounded-xl p-5 text-white shadow-lg border border-gray-700 relative overflow-hidden`}
    style={{ background: `linear-gradient(135deg, ${color}20, ${color}40)` }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -5 }}
  >
    {/* Animated background elements */}
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${Math.random() * 40 + 20}px`,
            height: `${Math.random() * 40 + 20}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: `${color}10`,
          }}
        />
      ))}
    </div>

    <div className="relative z-10">
      <div className="flex justify-center text-3xl mb-2" style={{ color }}>
        {icon}
      </div>
      <h4 className="text-sm font-semibold text-gray-300">{title}</h4>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  </motion.div>
);

const InputField = ({ label, name, value, onChange, type, theme }) => (
  <div className="space-y-2 text-end">
    <label className="block text-sm font-medium text-black">{label}</label>
    <div className="relative">
      <input
        type={type || "text"}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-gray-750 border border-gray-700 rounded-lg px-4 py-2 text-[#DC7F56] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800"
        style={{ focusRingColor: theme }}
      />
      <div className="absolute inset-0 rounded-lg pointer-events-none border border-transparent group-focus:border-[${theme}]"></div>
    </div>
  </div>
);

const Dropdown = ({
  label,
  name,
  value,
  onChange,
  options,
  theme,
  displayValues,
}) => (
  <div className="space-y-2 text-end">
    <label className="block text-sm font-medium text-black">{label}</label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-gray-750 border border-gray-700 rounded-lg px-4 py-2 text-[#DC7F56] appearance-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 pr-10"
        style={{ focusRingColor: theme }}
      >
        <option value="">اختر {label}</option>
        {options.map((option, idx) => (
          <option key={idx} value={option}>
            {displayValues ? displayValues[idx] : option}
          </option>
        ))}
      </select>
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <FaChevronDown className="text-gray-500" />
      </div>
    </div>
  </div>
);

export default DPProfile;
