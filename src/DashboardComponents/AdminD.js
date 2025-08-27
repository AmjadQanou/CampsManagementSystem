import React, { useContext, useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { motion } from "framer-motion";
import { AuthContext } from "../AuthProvider";
import { TokenContext } from "../TokenContext";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
);

const Card = ({ children, className = "" }) => (
  <motion.div
    className={`bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 ${className}`}
    whileHover={{ y: -2 }}
  >
    {children}
  </motion.div>
);

const StatCard = ({ title, value, icon, color }) => (
  <Card className={`border-t-4 ${color}`}>
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold mt-1 text-gray-800">{value}</p>
      </div>
      <div
        className={`p-3 rounded-lg bg-opacity-10 ${color.replace(
          "border",
          "bg"
        )}`}
      >
        {icon}
      </div>
    </div>
  </Card>
);

const AdminDashboard = () => {
  const [campStats, setCampStats] = useState({ total: 0, families: 0 });
  const [dpStats, setDpStats] = useState({ total: 0, males: 0, females: 0 });
  const [orgCount, setOrgCount] = useState(0);
  const [campDistribution, setCampDistribution] = useState([]);
  const { token } = useContext(TokenContext);
  const [reliefStats, setReliefStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [campsRes, dpsRes, orgsRes, reliefRes] = await Promise.all([
          fetch("http://camps.runasp.net/DisCamps", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch("http://camps.runasp.net/dps", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch("http://camps.runasp.net/organization", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch("http://camps.runasp.net/reliefscharts", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const [campsData, dpsData, orgsData, reliefData] = await Promise.all([
          campsRes.json(),
          dpsRes.json(),
          orgsRes.json(),
          reliefRes.json(),
        ]);

        setCampStats({
          total: campsData.length,
          families: campsData.reduce(
            (acc, camp) => acc + (camp.numOfFamilies || 0),
            0
          ),
        });
        setCampDistribution(
          campsData.map((c) => ({ name: c.name, value: c.capacity }))
        );

        const males = dpsData.reduce((acc, dp) => acc + dp.numOfMales, 0);
        const females = dpsData.reduce((acc, dp) => acc + dp.numOfFemales, 0);
        setDpStats({ total: dpsData.length, males, females });

        setOrgCount(Array.isArray(orgsData) ? orgsData.length : 1);

        const stats = reliefData.map((org) => ({
          name: org.organizationName,
          count: org.reliefCount,
          totalQuantity: org.reliefDetails.reduce(
            (sum, r) => sum + r.quantity,
            0
          ),
        }));
        setReliefStats(stats);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const dpBarData = {
    labels: ["ذكور", "إناث"],
    datasets: [
      {
        label: "الاشخاص النازحين",
        data: [dpStats.males, dpStats.females],
        backgroundColor: ["#A6B78D", "#DC7F56"],
        borderRadius: 10,
      },
    ],
  };

  const campPieData = {
    labels: campDistribution.map((c) => c.name),
    datasets: [
      {
        data: campDistribution.map((c) => c.value),
        backgroundColor: [
          "#A6B78D",
          "#DC7F56",
          "#A6B78D80",
          "#DC7F5680",
          "#A6B78D40",
          "#DC7F5640",
          "#A6B78D20",
          "#DC7F5620",
        ],
        borderWidth: 0,
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A6B78D]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 pt-0">
      {/* Header */}
      <div className="mb-8 text-right">
        <h1 className="text-3xl font-bold text-[#DC7F56]">لوحة تحكم المدير</h1>
        <p className="text-gray-500 mt-2">نظرة عامة على النظام والإحصائيات</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="عدد المخيمات"
          value={campStats.total}
          icon={<CampIcon />}
          color="border-t-[#A6B78D]"
        />
        <StatCard
          title="عدد النازحين"
          value={dpStats.total}
          icon={<PeopleIcon />}
          color="border-t-[#DC7F56]"
        />
        <StatCard
          title="عدد العائلات"
          value={campStats.families}
          icon={<FamilyIcon />}
          color="border-t-[#A6B78D]"
        />
        <StatCard
          title="عدد المنظمات"
          value={orgCount}
          icon={<OrgIcon />}
          color="border-t-[#DC7F56]"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Displaced Persons Chart */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#DC7F56]">
                توزيع النازحين حسب الجنس
              </h2>
              <div className="flex space-x-2">
                <span className="flex items-center">
                  <span className="w-3 h-3 bg-[#A6B78D] rounded-full mr-1"></span>
                  <span className="text-xs">ذكور</span>
                </span>
                <span className="flex items-center">
                  <span className="w-3 h-3 bg-[#DC7F56] rounded-full mr-1"></span>
                  <span className="text-xs">إناث</span>
                </span>
              </div>
            </div>
            <div className="h-64">
              <Bar
                data={dpBarData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: "#1F2937",
                      titleFont: { size: 14 },
                      bodyFont: { size: 12 },
                      padding: 10,
                      displayColors: false,
                    },
                  },
                  scales: {
                    y: {
                      grid: { drawBorder: false },
                      ticks: { font: { size: 10 } },
                    },
                    x: {
                      grid: { display: false },
                      ticks: { font: { size: 10 } },
                    },
                  },
                }}
              />
            </div>
          </Card>

          {/* Camps Distribution Chart */}
          <Card>
            <h2 className="text-lg font-semibold text-[#DC7F56] mb-4">
              توزيع السعة المخيمات
            </h2>
            <div className="h-64">
              <Pie
                data={campPieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "right",
                      labels: {
                        font: { size: 10 },
                        padding: 10,
                        usePointStyle: true,
                      },
                    },
                    tooltip: {
                      backgroundColor: "#1F2937",
                      titleFont: { size: 14 },
                      bodyFont: { size: 12 },
                      padding: 10,
                    },
                  },
                  cutout: "60%",
                }}
              />
            </div>
          </Card>
        </div>

        {/* Right Column - Relief Stats */}
        <div className="space-y-6">
          <Card className="h-full">
            <h2 className="text-lg font-semibold text-[#DC7F56] mb-4">
              إحصائيات توزيع الإغاثات
            </h2>
            <div className="overflow-hidden">
              <div className="min-w-full overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-200">
                      <th className="pb-3 text-xs font-medium text-gray-500 uppercase">
                        اسم المنظمة
                      </th>
                      <th className="pb-3 text-xs font-medium text-gray-500 uppercase text-right">
                        عدد الإغاثات
                      </th>
                      <th className="pb-3 text-xs font-medium text-gray-500 uppercase text-right">
                        الكمية
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reliefStats.length === 0 ? (
                      <tr>
                        <td
                          colSpan="3"
                          className="py-4 text-center text-sm text-gray-500"
                        >
                          لا توجد بيانات
                        </td>
                      </tr>
                    ) : (
                      reliefStats.map((relief, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-3 text-sm font-medium text-gray-900">
                            {relief.name}
                          </td>
                          <td className="py-3 text-sm text-gray-500 text-right">
                            {relief.count}
                          </td>
                          <td className="py-3 text-sm text-gray-500 text-right">
                            {relief.totalQuantity}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Custom icons using the specified color palette
const CampIcon = () => (
  <svg
    className="w-6 h-6 text-[#A6B78D]"
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
);

const PeopleIcon = () => (
  <svg
    className="w-6 h-6 text-[#DC7F56]"
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

const FamilyIcon = () => (
  <svg
    className="w-6 h-6 text-[#A6B78D]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
    />
  </svg>
);

const OrgIcon = () => (
  <svg
    className="w-6 h-6 text-[#DC7F56]"
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
);

export default AdminDashboard;
