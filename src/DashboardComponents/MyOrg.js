import React, { useContext, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { AuthContext } from "../AuthProvider";
import { TokenContext } from "../TokenContext";
import { motion } from "framer-motion";
import OrgFlag from "../OrgFlag";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const StatCard = ({ title, value, icon }) => (
  <motion.div
    className="bg-white rounded-xl shadow-sm border-l-4 border-[#DC7F56] p-6"
    whileHover={{ y: -5 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-[#2c3e50] mt-1">{value}</p>
      </div>
      <div className="p-3 rounded-lg bg-[#A6B78D] bg-opacity-20 text-[#A6B78D]">
        {icon}
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { token } = useContext(TokenContext);

  const [camps, setCamps] = useState([]);
  const [org, setOrg] = useState();
  const [reliefRequests, setReliefRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getAll() {
      try {
        const orgRes = await fetch(
          `http://camps.runasp.net/organization/bymanager/${user.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const orgData = await orgRes.json();
        setOrg(orgData);

        const campsRes = await fetch("http://camps.runasp.net/DisCamps", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const campsData = await campsRes.json();
        setCamps(campsData);

        if (orgData?.id) {
          const requestsRes = await fetch(
            `http://camps.runasp.net/reliefrequests/org/${orgData.id}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const requestsData = await requestsRes.json();
          setReliefRequests(requestsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    getAll();
  }, [token, user.id]);

  // Prepare data for charts
  const topCamps = [...camps]
    .sort((a, b) => b.numOfFamilies - a.numOfFamilies)
    .slice(0, 5);

  const barData = {
    labels: topCamps.map((camp) => camp.name),
    datasets: [
      {
        label: "عدد العائلات",
        data: topCamps.map((camp) => camp.numOfFamilies),
        backgroundColor: "#A6B78D",
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const requestsPerCamp = camps.map((camp) => {
    const campRequests = reliefRequests.filter(
      (req) => req.senderCampName === camp.name
    ).length;
    return { name: camp.name, requestCount: campRequests };
  });

  const reliefRequestsData = {
    labels: requestsPerCamp.map((data) => data.name),
    datasets: [
      {
        label: "عدد طلبات الإغاثة",
        data: requestsPerCamp.map((data) => data.requestCount),
        backgroundColor: "#DC7F56",
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      Pending: "bg-yellow-100 text-yellow-800",
      Approved: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800",
      Delivered: "bg-blue-100 text-blue-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          statusClasses[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A6B78D]"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[#f8f8f8] to-[#f0f5ec] p-6"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#2c3e50]">لوحة التحكم</h1>
          <p className="text-gray-600 mt-2">نظرة عامة على نشاط المنظمة</p>
        </div>
        {org && <OrgFlag orgName={org.name} />}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="إجمالي المخيمات"
          value={camps.length}
          icon={
            <svg
              className="w-6 h-6"
              fill="[#A6B78D]"
              stroke="[#A6B78D]"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          }
        />
        <StatCard
          title="إجمالي العائلات"
          value={camps.reduce(
            (sum, camp) => sum + (camp.numOfFamilies || 0),
            0
          )}
          icon={
            <svg
              className="w-6 h-6"
              fill="[#A6B78D]"
              stroke="[#A6B78D]"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          }
        />
        <StatCard
          title="طلبات الإغاثة"
          value={reliefRequests.length}
          icon={
            <svg
              className="w-6 h-6"
              fill="[#A6B78D]"
              stroke="[#A6B78D]"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          }
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Camps Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-[#DC7F56] mb-4 text-right">
            أعلى 5 مخيمات حسب عدد العائلات
          </h2>
          <div className="h-64">
            <Bar
              data={barData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const total = topCamps.reduce(
                          (sum, camp) => sum + camp.numOfFamilies,
                          0
                        );
                        const percentage =
                          total > 0
                            ? Math.round((context.raw / total) * 100)
                            : 0;
                        return `${context.raw} عائلة (${percentage}%)`;
                      },
                    },
                  },
                },
                scales: {
                  x: {
                    grid: { display: false },
                  },
                  y: {
                    beginAtZero: true,
                    grid: { color: "#f0f0f0" },
                  },
                },
              }}
            />
          </div>
        </motion.div>

        {/* Relief Requests Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-[#DC7F56] mb-4 text-right">
            طلبات الإغاثة حسب المخيم
          </h2>
          <div className="h-64">
            <Bar
              data={reliefRequestsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const total = requestsPerCamp.reduce(
                          (sum, camp) => sum + camp.requestCount,
                          0
                        );
                        const percentage =
                          total > 0
                            ? Math.round((context.raw / total) * 100)
                            : 0;
                        return `${context.raw} طلب (${percentage}%)`;
                      },
                    },
                  },
                },
                scales: {
                  x: {
                    grid: { display: false },
                  },
                  y: {
                    beginAtZero: true,
                    grid: { color: "#f0f0f0" },
                  },
                },
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Relief Requests Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[#DC7F56]">
            طلبات الإغاثة الواردة
          </h2>
          <span className="text-sm text-gray-500">
            {reliefRequests.length} طلب مسجل
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المخيم المرسل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  نوع الإغاثة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الرسالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الكمية المطلوبة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التاريخ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reliefRequests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
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
                        لا توجد طلبات إغاثة مسجلة
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                reliefRequests.map((req, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      {req.senderCampName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {req.reliefType}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate text-right">
                      {req.message}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {req.neededQuantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {new Date(req.createdAt).toLocaleDateString("ar-EG")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
