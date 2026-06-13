import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { OrgStatusContext } from "../Context/OrgStatusContext";
import {
  organizationService,
  campService,
  reliefRequestService,
} from "../services/apiService";
import OrgFlag from "../OrgFlag";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-xl border border-gray-200 border-l-4 border-l-[#DC7F56] p-5">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      <div className="p-3 rounded-lg bg-[#A6B78D]/10 text-[#A6B78D]">
        {icon}
      </div>
    </div>
  </div>
);

// ── Waiting-for-approval screen ───────────────────────────────────────────────
const PendingApprovalScreen = ({ orgName }) => (
  <div
    className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f8f8] to-[#f0f5ec] p-6"
    dir="rtl"
  >
    <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
      <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-10 h-10 text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-[#2c3e50] mb-2">
        في انتظار الموافقة
      </h2>
      {orgName && (
        <p className="text-[#DC7F56] font-semibold mb-3">{orgName}</p>
      )}
      <p className="text-gray-500 text-sm leading-relaxed">
        تم تسجيل مؤسستك بنجاح وهي الآن في انتظار مراجعة مدير النظام.
        <br />
        ستتمكن من الوصول إلى جميع الميزات بعد الموافقة.
      </p>
      <div className="mt-6 flex items-center justify-center gap-2 text-blue-500 text-sm">
        <span className="animate-pulse">⏳</span>
        <span>جارٍ المراجعة...</span>
      </div>
    </div>
  </div>
);

// ── Main dashboard ────────────────────────────────────────────────────────────
const MyOrg = () => {
  const { user } = useContext(AuthContext);
  const { hasOrg, isApproved, org: ctxOrg } = useContext(OrgStatusContext);
  const navigate = useNavigate();

  const [camps, setCamps] = useState([]);
  const [org, setOrg] = useState(null);
  const [reliefRequests, setReliefRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const showPending = hasOrg && !isApproved;

  useEffect(() => {
    if (!isApproved) {
      setLoading(false);
      return;
    }

    async function getAll() {
      try {
        // organizationService.getByManager uses GET /organization/bymanager/:id
        const orgRes = await organizationService.getByManager(user.id);
        const orgData = orgRes.data;
        setOrg(orgData);

        // campService.getOtherCamps uses GET /DisCamps
        const campsRes = await campService.getOtherCamps();
        setCamps(campsRes.data);

        if (orgData?.id) {
          // reliefRequestService.getByOrg uses GET /reliefrequests/org/:orgId
          const requestsRes = await reliefRequestService.getByOrg(orgData.id);
          setReliefRequests(requestsRes.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    getAll();
  }, [user.id, isApproved]);

  // ── Pending approval ────────────────────────────────────────────────────────
  if (showPending) {
    return <PendingApprovalScreen orgName={ctxOrg?.name} />;
  }

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A6B78D]" />
      </div>
    );
  }

  // ── Chart data ──────────────────────────────────────────────────────────────
  const topCamps = [...camps]
    .sort((a, b) => b.numOfFamilies - a.numOfFamilies)
    .slice(0, 5);

  const barData = {
    labels: topCamps.map((c) => c.name),
    datasets: [
      {
        label: "عدد العائلات",
        data: topCamps.map((c) => c.numOfFamilies),
        backgroundColor: "#A6B78D",
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const requestsPerCamp = camps.map((camp) => ({
    name: camp.name,
    requestCount: reliefRequests.filter((r) => r.senderCampName === camp.name)
      .length,
  }));

  const reliefRequestsData = {
    labels: requestsPerCamp.map((d) => d.name),
    datasets: [
      {
        label: "عدد طلبات الإغاثة",
        data: requestsPerCamp.map((d) => d.requestCount),
        backgroundColor: "#DC7F56",
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const getStatusBadge = (status) => {
    const cls = {
      Pending: "bg-yellow-100 text-yellow-800",
      Approved: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800",
      Delivered: "bg-blue-100 text-blue-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${cls[status] || "bg-gray-100 text-gray-800"}`}
      >
        {status}
      </span>
    );
  };

  const chartOptions = (tooltipLabel) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((s, v) => s + v, 0);
            const pct = total > 0 ? Math.round((ctx.raw / total) * 100) : 0;
            return `${ctx.raw} ${tooltipLabel} (${pct}%)`;
          },
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, grid: { color: "#f0f0f0" } },
    },
  });

  // ── Full dashboard ──────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[#f8f8f8] to-[#f0f5ec] p-6"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2c3e50]">لوحة التحكم</h1>
          <p className="text-gray-600 mt-2">نظرة عامة على نشاط المنظمة</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard/registerorg")}
            className="flex items-center gap-2 bg-white border border-[#DC7F56] text-[#DC7F56] hover:bg-[#DC7F56] hover:text-white text-sm font-medium px-4 py-2 rounded-xl transition"
          >
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            تعديل بيانات المؤسسة
          </button>
          {org && <OrgFlag orgName={org.name} />}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="إجمالي المخيمات"
          value={camps.length}
          icon={
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          }
        />
        <StatCard
          title="إجمالي العائلات"
          value={camps.reduce((s, c) => s + (c.numOfFamilies || 0), 0)}
          icon={
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
          }
        />
        <StatCard
          title="طلبات الإغاثة"
          value={reliefRequests.length}
          icon={
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
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          }
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-[#DC7F56] mb-4 text-right">
            أعلى 5 مخيمات حسب عدد العائلات
          </h2>
          <div className="h-64">
            <Bar data={barData} options={chartOptions("عائلة")} />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-[#DC7F56] mb-4 text-right">
            طلبات الإغاثة حسب المخيم
          </h2>
          <div className="h-64">
            <Bar data={reliefRequestsData} options={chartOptions("طلب")} />
          </div>
        </div>
      </div>

      {/* Requests table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
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
                {[
                  "المخيم المرسل",
                  "نوع الإغاثة",
                  "الرسالة",
                  "الكمية المطلوبة",
                  "الحالة",
                  "التاريخ",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
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
                reliefRequests.map((req, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
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
      </div>
    </div>
  );
};

export default MyOrg;
