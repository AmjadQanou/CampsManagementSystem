import React, { useState, useEffect, useContext, useRef } from "react";
import { Bell, User, LogOut, Settings, UserCircle } from "lucide-react";
import { AuthContext } from "../AuthProvider";
import { useNavigate } from "react-router-dom";
import { notificationService, authService } from "../services/apiService";

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
      setLoading(true);
      try {
        const response = await notificationService.getReceived();
        const notificationsData = response.data;
        const uniqueSenderIds = [
          ...new Set(notificationsData.map((n) => n.senderId)),
        ];

        const senderNameMap = {};
        const senderNames = await Promise.all(
          uniqueSenderIds.map(async (id) => {
            senderNameMap[id] = await getSenderName(id);
          }),
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
        setLoading(false);
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
      await notificationService.update(notification.id, {
        message: notification.message,
        seen: true,
      });

      const updatedNotifications = notifications.map((n) =>
        n.id === notification.id ? { ...n, seen: true } : n,
      );
      setNotifications(updatedNotifications);
      setUnreadCount(updatedNotifications.filter((n) => !n.seen).length);
    } catch (err) {
      console.error("فشل في تحديث الإشعار:", err);
    }
  };

  const getSenderName = async (senderId) => {
    if (!senderId) return "مجهول";
    try {
      const response = await authService.getUser(senderId);
      const data = response.data;
      return `${data.fname || "مجهول"} ${data.lname || ""}`.trim();
    } catch (error) {
      console.error("خطأ في getSenderName:", error);
      return "مجهول";
    }
  };

  return (
    <>
      <nav className="bg-white border-b border-[#E8E4DE] px-4 py-3 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#DC7F56] to-[#A6B78D] flex items-center justify-center text-white text-lg font-bold shadow-sm group-hover:scale-105 transition-transform">
              R
            </span>
            <span className="text-2xl font-bold text-[#2D2926] tracking-tight">
              Relief<span className="text-[#DC7F56]">Portal</span>
            </span>
          </div>

          <span className="hidden md:block text-sm font-semibold text-[#7A706A] tracking-wide bg-[#F9F7F4] border border-[#E8E4DE] rounded-full px-4 py-1.5">
            لوحة التحكم
          </span>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative w-10 h-10 rounded-full bg-[#F9F7F4] border border-[#E8E4DE] flex items-center justify-center hover:bg-[#F3F1EE] hover:border-[#A6B78D]/40 transition-colors"
              >
                <Bell size={19} className="text-[#7A706A]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#DC7F56] text-white text-[10px] font-semibold w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-96 bg-white border border-[#E8E4DE] rounded-xl shadow-lg z-50 max-h-96 overflow-auto">
                  <div className="px-4 py-3 border-b border-[#F0EDE9]">
                    <h3 className="text-sm font-bold text-[#2D2926]">
                      الإشعارات
                    </h3>
                  </div>
                  <ul className="divide-y divide-[#F0EDE9] text-sm">
                    {notifications.filter((n) => !n.seen).length === 0 ? (
                      <li className="px-4 py-6 text-center text-[#B0A89E]">
                        لا توجد إشعارات غير مقروءة
                      </li>
                    ) : (
                      notifications
                        .filter((n) => !n.seen)
                        .slice(0, 3)
                        .map((notif) => (
                          <li
                            key={notif.id}
                            className="flex justify-between items-center gap-3 px-4 py-3 hover:bg-[#F9F7F4] transition-colors"
                          >
                            <span className="text-sm text-[#2D2926]">
                              <span className="font-semibold text-[#DC7F56]">
                                {notif.senderName}:
                              </span>{" "}
                              {notif.message}
                            </span>
                            <button
                              onClick={() => markAsRead(notif)}
                              className="text-xs font-medium text-[#A6B78D] hover:text-[#8ca170] whitespace-nowrap"
                            >
                              تحديد كمقروء
                            </button>
                          </li>
                        ))
                    )}
                  </ul>
                  <div className="text-center p-2 border-t border-[#F0EDE9]">
                    <button
                      onClick={() => {
                        setShowAllNotifications(true);
                        setShowDropdown(false);
                      }}
                      className="text-[#DC7F56] hover:text-[#c46b45] text-sm font-medium transition-colors"
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
                className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A6B78D] to-[#8ca170] flex items-center justify-center hover:ring-2 hover:ring-[#A6B78D]/40 transition-shadow shadow-sm"
              >
                <User size={20} className="text-white" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-[#E8E4DE] rounded-xl shadow-lg z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#F0EDE9] bg-[#F9F7F4]">
                    <p className="text-xs text-[#7A706A]">مرحبًا 👋</p>
                    <p className="font-semibold text-[#2D2926]">
                      {user?.name || user?.fname || user?.given_name || "User"}
                    </p>
                  </div>
                  <ul className="text-sm">
                    <li className="px-4 py-2.5 hover:bg-[#F9F7F4] cursor-pointer flex items-center gap-2 text-[#2D2926] transition-colors">
                      <UserCircle size={18} className="text-[#A6B78D]" /> الملف
                      الشخصي
                    </li>
                    <li className="px-4 py-2.5 hover:bg-[#F9F7F4] cursor-pointer flex items-center gap-2 text-[#2D2926] transition-colors">
                      <Settings size={18} className="text-[#A6B78D]" />{" "}
                      الإعدادات
                    </li>
                    <li
                      onClick={handleLogout}
                      className="px-4 py-2.5 hover:bg-[#FDF4F1] text-[#DC7F56] cursor-pointer flex items-center gap-2 border-t border-[#F0EDE9] transition-colors"
                    >
                      <LogOut size={18} /> تسجيل الخروج
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Modal: All Notifications */}
      {showAllNotifications && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-lg rounded-2xl border border-[#E8E4DE] shadow-2xl p-0 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center px-5 py-4 border-b border-[#F0EDE9]">
              <h2 className="text-lg font-bold text-[#2D2926]">
                جميع الإشعارات
              </h2>
              <button
                onClick={() => setShowAllNotifications(false)}
                className="text-[#B0A89E] hover:text-[#DC7F56] text-xl font-bold transition-colors"
              >
                ×
              </button>
            </div>
            <ul className="divide-y divide-[#F0EDE9] overflow-y-auto">
              {notifications.length === 0 ? (
                <li className="py-8 text-center text-[#B0A89E] text-sm">
                  لا توجد إشعارات
                </li>
              ) : (
                notifications
                  .sort((a, b) => b.seen - a.seen) // ترتيب الإشعارات: الجديدة أولًا
                  .map((notif) => (
                    <li
                      key={notif.id}
                      className="py-3 px-5 flex justify-between items-center gap-3 hover:bg-[#F9F7F4] transition-colors"
                    >
                      <span
                        className={`text-sm ${
                          notif.seen
                            ? "text-[#B0A89E]"
                            : "text-[#2D2926] font-medium"
                        }`}
                      >
                        <span className="text-[#DC7F56] font-semibold">
                          {notif.senderName}:
                        </span>{" "}
                        {notif.message}
                      </span>
                      {!notif.seen && (
                        <button
                          onClick={() => markAsRead(notif)}
                          className="text-xs font-medium text-[#A6B78D] hover:text-[#8ca170] whitespace-nowrap"
                        >
                          تحديد كمقروء
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
