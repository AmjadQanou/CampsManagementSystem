import React, { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faList,
  faIdBadge,
  faUserTie,
  faPhone,
  faEnvelope,
  faHandHoldingHeart,
  faCampground,
} from "@fortawesome/free-solid-svg-icons";
import { ApiContext } from "../Context/ApiContext";
import { TokenContext } from "../TokenContext";
import axios from "axios";

export default function OrganizationDetails() {
  const location = useLocation();
  const { org } = location.state || {};
  const { id } = useParams();
  const { organizationManagers } = useContext(ApiContext);
  const [activeTab, setActiveTab] = useState("organization");
  const { token } = useContext(TokenContext);
  const [reliefs, setReliefs] = useState([]);
  let quan = 0;
  console.log(org);

  useEffect(() => {
    getReliefs(org.organizationManagerId);
  }, [0]);

  if (!org) {
    return (
      <div className="text-center text-red-600 mt-10">
        بيانات المنظمة غير متوفرة.
      </div>
    );
  }

  const getReliefs = async (id) => {
    try {
      const newsResponse = await axios.get(
        `https://camps.runasp.net/relief/byorgmanager/${id}`
      );
      setReliefs(newsResponse.data);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const manager = organizationManagers.find(
    (mgr) => mgr.id === org.organizationManagerId
  );

  // حساب عدد المساعدات وعدد المخيمات مع القيمة الافتراضية 0 إذا كانت null أو undefined
  const numberOfAssistance = org.reliefRequests?.length ?? 0; // إذا كانت reliefRequests null أو undefined، ستكون القيمة 0
  const numberOfCamps = org.reliefRegisters?.length ?? 0; // إذا كانت reliefRegisters null أو undefined، ستكون القيمة 0

  return (
    <motion.div
      className="max-w-6xl min-h-[70vh] mx-auto p-8 mt-24 mb-6 bg-white shadow-2xl rounded-2xl relative"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      style={{ direction: "rtl" }}
    >
      {/* التبويبات */}
      <div className="flex justify-center gap-2 mb-8 space-x-4">
        <button
          onClick={() => setActiveTab("organization")}
          className={`px-6 py-2 rounded-full font-semibold hover:shadow-lg duration-300 ${
            activeTab === "organization"
              ? "bg-[#E26629] text-white"
              : "bg-[#F5F5F5] text-gray-700"
          }`}
        >
          معلومات المؤسسة
        </button>
        <button
          onClick={() => setActiveTab("manager")}
          className={`px-6 py-2 rounded-full font-semibold hover:shadow-lg duration-300 ${
            activeTab === "manager"
              ? "bg-[#E26629] text-white"
              : "bg-[#F5F5F5] text-gray-700"
          }`}
        >
          بيانات المدير
        </button>
      </div>

      {/* محتوى تبويب بيانات المؤسسة */}
      {activeTab === "organization" && (
        <motion.div
          className="flex flex-col md:flex-row gap-10 text-right"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* صورة المؤسسة */}
          <motion.div
            className="w-full md:w-1/2 h-80 object-cover rounded-2xl shadow-md bg-cover bg-center"
            style={{ backgroundImage: `url(${org.file})` }}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
          />

          {/* تفاصيل المؤسسة */}
          <div
            className="flex-1 space-y-4 text-gray-700 text-lg"
            style={{ direction: "rtl" }}
          >
            <h1 className="text-4xl font-bold text-[#E26629] mb-4">
              {org.name}
            </h1>
            <p>
              <FontAwesomeIcon
                icon={faIdBadge}
                className="ml-2 text-[#E26629]"
              />{" "}
              رقم التعريف: {id}
            </p>
            <p>
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="ml-2 text-[#E26629]"
              />{" "}
              الموقع: {org.location}
            </p>
            <div className="flex flex-wrap md:flex-nowrap items-center ">
              <p>
                <FontAwesomeIcon
                  icon={faList}
                  className="ml-2 text-[#E26629]"
                />{" "}
                نوع المساعدة:
              </p>
              <div className="grid-cols-2 md:grid-cols-3 gap-2 mr-1">
                {org.category.split(",").map((category, index) => (
                  <div
                    key={index}
                    className="category-item bg-[#F5F5F5] p-2 rounded-md"
                  >
                    {category.trim()}
                  </div>
                ))}
              </div>
            </div>

            <p>
              <FontAwesomeIcon
                icon={faHandHoldingHeart}
                className="ml-2 text-[#E26629]"
              />{" "}
              عدد المساعدات: {reliefs.length}{" "}
            </p>

            <p>
              <FontAwesomeIcon
                icon={faCampground}
                className="ml-2 text-[#E26629]"
              />
              كمية المساعدات:{" "}
              {reliefs.reduce((sum, item) => sum + (item.quantity || 0), 0)}
            </p>
          </div>
        </motion.div>
      )}

      {/* محتوى تبويب بيانات المدير */}
      {activeTab === "manager" && manager && (
        <motion.div
          className="p-6 bg-gray-50 rounded-xl shadow-inner text-right space-y-4 text-gray-700 text-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold border-b border-white pb-2 w-full ">
            مدير المؤسسة
          </h2>
          <div className="w-full text-lg space-y-2">
            <p>
              <FontAwesomeIcon
                icon={faUserTie}
                className="ml-2 text-[#E26629]"
              />{" "}
              الاسم الكامل: {manager.fname} {manager.lname}
            </p>
            {token && (
              <>
                <p>
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="ml-2 text-[#E26629]"
                  />{" "}
                  الإيميل: {manager.email}
                </p>
                <p>
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="ml-2 text-[#E26629] "
                  />{" "}
                  رقم التواصل: {manager.contactInfo}
                </p>
              </>
            )}
          </div>
        </motion.div>
      )}

      {activeTab === "manager" && !manager && (
        <p className="text-red-600 mt-10">لا توجد بيانات لمدير المؤسسة.</p>
      )}
    </motion.div>
  );
}
