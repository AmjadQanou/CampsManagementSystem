import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../AuthProvider";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar, Doughnut, Pie } from "react-chartjs-2";
import Swal from "sweetalert2";
import { Link, useParams } from "react-router-dom";
import { TokenContext } from "../TokenContext";
import CampFlag from "../CampFlag";
import { motion } from "framer-motion";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  ChartDataLabels
);

export default function Mycamp() {
  const { id } = useParams();
  const [camp, setCamp] = useState([]);
  const [campInfo, setcampInfo] = useState([]);
  const [orgNames, setOrgNames] = useState({});
  const [dps, setDps] = useState([]);
  const [campManager, setCampManager] = useState({});
  const { user } = useContext(AuthContext);
  const { token } = useContext(TokenContext);
  const [reliefs, setReliefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    if (id) {
      fetchCampByid();
    } else {
      fetchCamp();
      fetchCampManager();
    }
  }, []);

  useEffect(() => {
    console.log(camp);

    if (id) {
      setcampInfo(camp);
    } else {
      setcampInfo(camp.length > 0 ? camp[0] : null);
    }
  }, [camp]);

  useEffect(() => {
    if (campInfo?.id) {
      fetchReliefs(campInfo.id);
    }
  }, [campInfo]);

  useEffect(() => {
    if (reliefs.length > 0) {
      const fetchAllOrgs = async () => {
        const names = {};
        for (const relief of reliefs) {
          if (relief.orgManagerId && !names[relief.orgManagerId]) {
            try {
              const res = await fetch(
                `https://camps.runasp.net/organization/bymanager/${relief.orgManagerId}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              const data = await res.json();
              names[relief.orgManagerId] = data.name;
            } catch (err) {
              console.error(err);
              names[relief.orgManagerId] = "غير محدد";
            }
          }
        }
        setOrgNames(names);
        setLoading(false);
      };
      fetchAllOrgs();
    } else {
      setLoading(false);
    }
  }, [reliefs]);

  useEffect(() => {
    if (campInfo?.id) {
      fetchReliefs(campInfo.id);
      if (campInfo.location) {
        fetchWeatherData(campInfo.location);
      }
    }
  }, [campInfo]);

  const fetchWeatherData = async (location) => {
    try {
      // This is a placeholder - you would need to use a real weather API
      // For example: const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=YOUR_API_KEY&q=${location}`);
      // const data = await response.json();
      // setWeatherData(data);

      // Mock data for demonstration
      setWeatherData({
        temp: 25,
        condition: "Sunny",
        icon: "☀️",
      });
    } catch (err) {
      console.error("Error fetching weather data:", err);
    }
  };

  const fetchReliefs = async (campId) => {
    try {
      const res = await fetch(
        `https://camps.runasp.net/relief/bycamp/${campId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setReliefs(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCamp = async () => {
    try {
      const res = await fetch("https://camps.runasp.net/camp", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCamp(data);
      if (data.length > 0) {
        fetchDPs(data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCampByid = async () => {
    try {
      const res = await fetch(`https://camps.runasp.net/camp/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCamp(data);
      fetchDPsC(data.id);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDPsC = async (id) => {
    try {
      const res = await fetch(`https://camps.runasp.net/dps/byCamp/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDps(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCampManager = async () => {
    console.log(user);

    try {
      const res = await fetch(
        `https://camps.runasp.net/campmanager/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setCampManager(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDPs = async () => {
    try {
      const res = await fetch("https://camps.runasp.net/dps", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDps(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClick = () => {
    console.log(campManager);

    if (campManager.approved) {
      window.location.href = "/dashboard/Camps/add";
    } else {
      Swal.fire({
        icon: "warning",
        title: "غير مصرح",
        text: "انت غير مصرح بعد لانشاء مخيم",
        confirmButtonText: "رجوع",
      });
    }
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const childrenCount = {
    under1Y: dps.reduce((sum, dp) => sum + dp.childrenyoungrethan1Y, 0),
    under3Y: dps.reduce((sum, dp) => sum + dp.childrenyoungrethan3Y, 0),
    under9Y: dps.reduce((sum, dp) => sum + dp.childrenyoungrethan9Y, 0),
  };

  const tentStatusLabels = ["جيدة", "متوسطة", "سيئة"];
  const tentStatusCount = tentStatusLabels.reduce((acc, label) => {
    acc[label] = dps.filter((dp) => dp.tentStatus === label).length;
    return acc;
  }, {});

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        color: "#fff",
        font: { weight: "bold", size: 10 },
        formatter: (value) => (value === 0 ? "" : value),
      },
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { display: false }, display: false },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A6B78D]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      {campInfo ? (
        <div className="space-y-6">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <CampFlag campName={campInfo.name} />
            <div className="bg-white rounded-xl shadow-sm p-6 mt-4 border-l-4 border-[#DC7F56] flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-[#DC7F56] mb-2">
                  {campInfo.name}
                </h1>
                <div className="flex items-center text-gray-600 gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p>{campInfo.location || "موقع المخيم"}</p>
                </div>
              </div>

              {weatherData && (
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                  <span className="text-xl">{weatherData.icon}</span>
                  <div>
                    <p className="text-sm text-gray-600">
                      {weatherData.condition}
                    </p>
                    <p className="font-bold">{weatherData.temp}°C</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Stats Grid with Improved Design */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatCard
                title="الطاقة الاستيعابية"
                value={campInfo.capacity}
                icon={<CapacityIcon />}
                color="from-[#A6B78D] to-[#8a9c72]"
                unit="شخص"
              />
              <StatCard
                title="عدد العائلات"
                value={campInfo.numOfFamilies}
                icon={<FamilyIcon />}
                color="from-[#DC7F56] to-[#c46b45]"
                unit="عائلة"
              />
              <StatCard
                title="عدد الحمامات"
                value={campInfo.numOfBaths}
                icon={<BathIcon />}
                color="from-[#A6B78D] to-[#8a9c72]"
                unit="حمام"
              />
              <StatCard
                title="جالونات المياه"
                value={campInfo.numOfWaterGallons}
                icon={<WaterIcon />}
                color="from-[#DC7F56] to-[#c46b45]"
                unit="جالون"
              />
            </div>
            {/* Left Column: Map Section */}
            {campInfo.location && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-[#DC7F56]">
                    موقع المخيم على الخريطة
                  </h2>
                  <button
                    className="text-sm text-[#A6B78D] hover:text-[#8a9c72] flex items-center gap-1"
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps?q=${encodeURIComponent(
                          campInfo.location
                        )}`,
                        "_blank"
                      )
                    }
                  >
                    <span>فتح في خرائط جوجل</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </button>
                </div>
                <div className="h-80 w-full relative">
                  <iframe
                    width="100%"
                    height="100%"
                    className="absolute inset-0"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      campInfo.location
                    )}&output=embed&zoom=14`}
                  ></iframe>
                </div>
              </div>
            )}

            {/* Right Column: Stats Cards */}
          </div>

          {/* Charts Section with Improved Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="معلومات المخيم"
              description="مقارنة بين الطاقة الاستيعابية وعدد العائلات والمرافق"
            >
              <Bar
                data={{
                  labels: ["الطاقة", "العائلات", "الحمامات", "المياه"],
                  datasets: [
                    {
                      data: [
                        campInfo.capacity,
                        campInfo.numOfFamilies,
                        campInfo.numOfBaths,
                        campInfo.numOfWaterGallons,
                      ],
                      backgroundColor: [
                        "#A6B78D",
                        "#DC7F56",
                        "#A6B78D80",
                        "#DC7F5680",
                      ],
                      borderRadius: 8,
                    },
                  ],
                }}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          let label = context.dataset.label || "";
                          if (label) label += ": ";
                          if (context.parsed.y !== null) {
                            label += context.parsed.y;
                          }
                          return label;
                        },
                      },
                    },
                  },
                }}
              />
            </ChartCard>

            <ChartCard
              title="توزيع النازحين حسب الجنس"
              description="نسبة الذكور والإناث في المخيم"
            >
              <div className="relative h-full">
                <Doughnut
                  data={{
                    labels: ["ذكور", "إناث"],
                    datasets: [
                      {
                        data: [
                          dps.reduce((sum, dp) => sum + dp.numOfMales, 0),
                          dps.reduce((sum, dp) => sum + dp.numOfFemales, 0),
                        ],
                        backgroundColor: ["#A6B78D", "#DC7F56"],
                        borderWidth: 0,
                      },
                    ],
                  }}
                  options={{
                    ...chartOptions,
                    cutout: "70%",
                    plugins: {
                      ...chartOptions.plugins,
                      legend: {
                        position: "right",
                        labels: {
                          usePointStyle: true,
                          padding: 20,
                          font: {
                            size: 12,
                          },
                        },
                      },
                    },
                  }}
                />
                <div className="absolute top-20 right-15 left-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-700">
                      {dps.reduce(
                        (sum, dp) => sum + dp.numOfMales + dp.numOfFemales,
                        0
                      )}
                    </p>
                    <p className="text-sm text-gray-500">إجمالي النازحين</p>
                  </div>
                </div>
              </div>
            </ChartCard>
            {dps ? (
              <ChartCard
                title="الأطفال حسب العمر"
                description="توزيع الأطفال حسب الفئات العمرية"
              >
                <Bar
                  data={{
                    labels: ["أقل من سنة", "أقل من 3 سنوات", "أقل من 9 سنوات"],
                    datasets: [
                      {
                        label: "عدد الأطفال",
                        data: [
                          childrenCount.under1Y,
                          childrenCount.under3Y,
                          childrenCount.under9Y,
                        ],
                        backgroundColor: ["#A6B78D", "#A6B78D80", "#A6B78D40"],
                        borderRadius: 8,
                      },
                    ],
                  }}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const total =
                              childrenCount.under1Y +
                              childrenCount.under3Y +
                              childrenCount.under9Y;
                            const percentage =
                              total > 0
                                ? Math.round((context.parsed.y / total) * 100)
                                : 0;
                            return `${context.parsed.y} طفل (${percentage}%)`;
                          },
                        },
                      },
                    },
                  }}
                />
              </ChartCard>
            ) : (
              ""
            )}
            <ChartCard title="حالة الخيام" description="نسبة الخيام حسب حالتها">
              <div className="flex flex-col lg:flex-row h-full">
                <div className="lg:w-2/3 h-48 lg:h-full">
                  <Pie
                    data={{
                      labels: tentStatusLabels,
                      datasets: [
                        {
                          data: tentStatusLabels.map(
                            (label) => tentStatusCount[label]
                          ),
                          backgroundColor: ["#A6B78D", "#DC7F56", "#A6B78D80"],
                          borderWidth: 0,
                        },
                      ],
                    }}
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        legend: {
                          position: "right",
                          labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                              size: 12,
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
                <div className="lg:w-1/3 flex flex-col justify-center pl-4">
                  {tentStatusLabels.map((label, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{
                          backgroundColor:
                            index === 0
                              ? "#A6B78D"
                              : index === 1
                              ? "#DC7F56"
                              : "#A6B78D80",
                        }}
                      ></div>
                      <span className="mr-10 text-sm font-medium">
                        {tentStatusCount[label] || 0}
                      </span>
                      <span className="text-sm  text-gray-600">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ChartCard>
          </div>

          {/* Reliefs Table with Improved Design */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#DC7F56]">
                المساعدات المستلمة
              </h2>
              <span className="text-sm text-gray-500">
                {reliefs.length} مساعدة مسجلة
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      اسم المادة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الكمية
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المنظمة المانحة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      تاريخ الاستلام
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reliefs.length > 0 ? (
                    reliefs.map((relief) => (
                      <tr
                        key={relief.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <svg
                                className="h-6 w-6 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                />
                              </svg>
                            </div>
                            <div className="mr-4">
                              <div className="text-sm font-medium text-gray-900">
                                {relief.name || "غير محدد"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {relief.category || "غير محدد"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {relief.quantity} {relief.unit || ""}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          <div className="flex items-center justify-end">
                            <span>
                              {orgNames[relief.orgManagerId] || "غير محدد"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {new Date(relief.date).toLocaleDateString("ar-EG")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            مستلمة
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center justify-center py-8">
                          <svg
                            className="w-12 h-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <p className="mt-2 text-sm text-gray-500">
                            لا توجد مساعدات مسجلة
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <div className="bg-white p-8 rounded-xl shadow-sm max-w-md mx-auto">
              <svg
                className="w-16 h-16 mx-auto text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <h1 className="text-2xl font-semibold text-gray-800 mt-4 mb-2">
                ليس لديك مخيم حتى الآن
              </h1>
              <p className="text-gray-600 mb-6">
                يمكنك إضافة مخيم جديد بعد الحصول على الموافقة من المدير
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClick}
                className="bg-[#DC7F56] hover:bg-[#c46b45] text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                <PlusIcon />
                إضافة مخيم جديد
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

const StatCard = ({ title, value, icon, color, unit }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`bg-gradient-to-r ${color} text-white rounded-xl shadow-md overflow-hidden`}
  >
    <div className="p-5 flex justify-between items-center">
      <div>
        <p className="text-sm font-medium opacity-90">{title}</p>
        <div className="flex items-center gap-1">
          {unit && <span className="text-sm opacity-80">{unit}</span>}
          <p className="text-2xl font-bold mt-1">{value || 0}</p>
        </div>
      </div>
      <div className="p-3 rounded-lg  bg-opacity-20">{icon}</div>
    </div>
  </motion.div>
);

const ChartCard = ({ title, description, children }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-[#DC7F56] text-right">
        {title}
      </h2>
      {description && (
        <p className="text-sm text-gray-500 text-right mt-1">{description}</p>
      )}
    </div>
    <div className="h-64 w-full">{children}</div>
  </div>
);

const CapacityIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

const FamilyIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const BathIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
);

const WaterIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
    />
  </svg>
);

const PlusIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
    />
  </svg>
);
