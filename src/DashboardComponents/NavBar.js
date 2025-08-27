import React, { useState, useEffect, useContext, useRef } from "react";
import { Bell, User, LogOut, Settings, UserCircle } from "lucide-react";
import { AuthContext } from "../AuthProvider";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const NavBar = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [loading, setLoading] = useState(true); // حالة التحميل
  const profileRef = useRef(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch notifications + sender names
  useEffect(() => {
    const fetchNotificationsWithSenders = async () => {
      setLoading(true); // بداية تحميل
      try {
        const response = await fetch(
          "https://camps.runasp.net/rec-notifications",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) throw new Error("فشل في جلب الإشعارات");

        const notificationsData = await response.json();
        const uniqueSenderIds = [
          ...new Set(notificationsData.map((n) => n.senderId)),
        ];

        const senderNameMap = {};
        const senderNames = await Promise.all(
          uniqueSenderIds.map(async (id) => {
            senderNameMap[id] = await getSenderName(id);
          })
        );

        const enrichedNotifications = notificationsData.map((n) => ({
          ...n,
          senderName: senderNameMap[n.senderId] || "مجهول",
        }));

        setNotifications(enrichedNotifications);
        setUnreadCount(enrichedNotifications.filter((n) => !n.seen).length);
      } catch (error) {
        console.error("حدث خطأ أثناء جلب الإشعارات مع أسماء المرسلين:", error);
      } finally {
        setLoading(false); // انتهى التحميل
      }
    };

    fetchNotificationsWithSenders();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    logout();
    navigate("/login");
  };

  const markAsRead = async (notification) => {
    try {
      const res = await fetch(
        `https://camps.runasp.net/notification/${notification.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            message: notification.message,
            seen: true,
          }),
        }
      );

      if (res.ok) {
        const updatedNotifications = notifications.map((n) =>
          n.id === notification.id ? { ...n, seen: true } : n
        );
        setNotifications(updatedNotifications);
        setUnreadCount(updatedNotifications.filter((n) => !n.seen).length);
      } else {
        console.error("فشل في تعديل حالة الإشعار.");
      }
    } catch (err) {
      console.error("فشل في تحديث الإشعار:", err);
    }
  };

  const getSenderName = async (senderId) => {
    console.log(senderId);
    if (!senderId) return "مجهول";
    try {
      const response = await fetch(
        `https://camps.runasp.net/user/${senderId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            //'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) throw new Error("فشل في جلب اسم المرسل");
      const data = await response.json();
      console.log(data);

      return `${data.fname || "مجهول"} ${data.lname || ""}`.trim();
    } catch (error) {
      console.error("خطأ في getSenderName:", error);
      return "مجهول";
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="bg-white shadow-md px-4 py-3 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div
            className="text-2xl font-bold text-[#DC7F56] cursor-pointer"
            onClick={() => navigate("/")}
          >
            ReliefPortal
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
            className="hidden md:block text-[18px] px-[70px] py-1.5 rounded-full text-white font-semibold bg-gradient-to-r from-[#DC7F56] to-[#A6B78D] shadow-lg animate-pulse text-center"
          >
            لوحة التحكم
          </motion.div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <Bell
                className="text-gray-600 hover:text-[#DC7F56] cursor-pointer transition-transform hover:scale-110"
                onClick={() => setShowDropdown(!showDropdown)}
              />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>
              )}

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-96 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-auto">
                  <ul className="divide-y divide-gray-200 text-sm p-2">
                    {notifications.filter((n) => !n.seen).length === 0 ? (
                      <li className="px-4 py-2 text-gray-500">
                        لا توجد إشعارات غير مقروءة
                      </li>
                    ) : (
                      notifications
                        .filter((n) => !n.seen)
                        .slice(0, 3)
                        .map((notif) => (
                          <li
                            key={notif.id}
                            className="flex justify-between items-center px-2 py-2 hover:bg-gray-50"
                          >
                            <span className="text-sm font-medium text-black">
                              <span className="text-[#DC7F56]">
                                {notif.senderName}:
                              </span>{" "}
                              {notif.message}
                            </span>
                            <button
                              onClick={() => markAsRead(notif)}
                              className="text-blue-500 text-xs"
                            >
                              Mark as Read
                            </button>
                          </li>
                        ))
                    )}
                  </ul>
                  <div className="text-center p-2 border-t">
                    <button
                      onClick={() => {
                        setShowAllNotifications(true);
                        setShowDropdown(false);
                      }}
                      className="text-[#DC7F56] hover:underline text-sm"
                    >
                      عرض جميع الإشعارات
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-10 h-10 rounded-full bg-[#F2F2F2] flex items-center justify-center hover:ring-2 hover:ring-[#DC7F56] transition-shadow"
              >
                <User size={22} className="text-[#DC7F56]" />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm text-gray-500">مرحبًا 👋</p>
                      <p className="font-medium text-gray-800">
                        {user?.firstName || "User"}
                      </p>
                    </div>
                    <ul className="text-sm">
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                        <UserCircle size={18} /> الملف الشخصي
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                        <Settings size={18} /> الإعدادات
                      </li>
                      <li
                        onClick={handleLogout}
                        className="px-4 py-2 hover:bg-gray-100 text-red-500 cursor-pointer flex items-center gap-2"
                      >
                        <LogOut size={18} /> تسجيل الخروج
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Modal: All Notifications */}
      {showAllNotifications && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-lg rounded-lg shadow-lg p-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">جميع الإشعارات</h2>
              <button
                onClick={() => setShowAllNotifications(false)}
                className="text-gray-500 hover:text-red-500 text-xl font-bold"
              >
                ×
              </button>
            </div>
            <ul className="divide-y divide-gray-200">
              {notifications.length === 0 ? (
                <li className="py-4 text-center text-gray-500">
                  لا توجد إشعارات
                </li>
              ) : (
                notifications
                  .sort((a, b) => b.seen - a.seen) // ترتيب الإشعارات: الجديدة أولًا
                  .map((notif) => (
                    <li
                      key={notif.id}
                      className="py-2 px-1 flex justify-between items-center hover:bg-gray-50 rounded"
                    >
                      <span
                        className={`text-sm ${
                          notif.seen
                            ? "text-gray-500"
                            : "text-black font-medium"
                        }`}
                      >
                        <span className="text-[#DC7F56]">
                          {notif.senderName}:
                        </span>{" "}
                        {notif.message}
                      </span>
                      {!notif.seen && (
                        <button
                          onClick={() => markAsRead(notif)}
                          className="text-xs text-blue-500 hover:underline"
                        >
                          Mark as Read
                        </button>
                      )}
                    </li>
                  ))
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
