import React, { useState, useEffect, useContext, useRef } from "react";
import logo from "../Assests/images/logo without bg.png";
import "../App.css";
import { Dialog, DialogPanel } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { TokenContext } from "../TokenContext";
import { AuthContext } from "../AuthProvider";
import { Bell, LogOut, Settings, User, UserCircle } from "lucide-react";
import { AnimatePresence } from "framer-motion";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const { token, setToken } = useContext(TokenContext);
  const { user } = useContext(AuthContext);
  const profileRef = useRef(null);
  const [loading, setLoading] = useState(true); // حالة التحميل
  const navigate = useNavigate();
  const handleScroll = () => {
    if (window.scrollY > 50) {
      setScrolling(true);
    } else {
      setScrolling(false);
    }
  };

  const markAsRead = async (notification) => {
    try {
      const res = await fetch(
        `http://camps.runasp.net/notification/${notification.id}`,
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
      const response = await fetch(`http://camps.runasp.net/user/${senderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          //'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error("فشل في جلب اسم المرسل");
      const data = await response.json();
      console.log(data);

      return `${data.fname || "مجهول"} ${data.lname || ""}`.trim();
    } catch (error) {
      console.error("خطأ في getSenderName:", error);
      return "مجهول";
    }
  };
  useEffect(() => {
    const fetchNotificationsWithSenders = async () => {
      setLoading(true); // بداية تحميل
      try {
        const response = await fetch(
          "http://camps.runasp.net/rec-notifications",
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

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-40 shadow-md transition-all duration-300 ${
        scrolling ? "bg-[#F5F5F5] bg-opacity-100" : "bg-[#F5F5F5] bg-opacity-60"
      }`}
    >
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-8xl items-center justify-between p-3 lg:px-10 lg:py-3"
      >
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-[#A6B78D]"
          >
            <span className="sr-only">Open [#E26629] menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12 items-center">
          {token ? (
            <>
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
                    <div className="absolute left-0 mt-2 w-96 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-auto">
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
                      <div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
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
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Modal: All Notifications */}
              {showAllNotifications && (
                <div className="fixed inset-0  bg-black bg-opacity-40 flex items-center justify-center z-50">
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
              {user.role == "DPs" ? (
                <NavLink
                  to={"/dpprof"}
                  className="text-sm/6 font-semibold text-[#A6B78D] hover:text-[#E26629] duration-300"
                >
                  حسابي
                </NavLink>
              ) : user.role == "CampManager" ? (
                <NavLink
                  to={"/dashboard/mycamp"}
                  className="text-sm/6 font-semibold text-[#A6B78D] hover:text-[#E26629] duration-300"
                >
                  لوحة التحكم
                </NavLink>
              ) : user.role == "OrganizationManager" ? (
                <NavLink
                  to={"/dashboard/myorg"}
                  className="text-sm/6 font-semibold text-[#A6B78D] hover:text-[#E26629] duration-300"
                >
                  لوحة التحكم
                </NavLink>
              ) : (
                <NavLink
                  to={"/dashboard/admindash"}
                  className="text-sm/6 font-semibold text-[#A6B78D] hover:text-[#E26629] duration-300"
                >
                  لوحة التحكم
                </NavLink>
              )}
            </>
          ) : (
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              {/* Login/Dropdown menu */}
              <button className="text-sm/6 font-semibold text-[#E26629] hover:text-[#A6B78D] duration-300 flex items-center bg-white p-2 rounded-xl">
                <span className="mr-2">
                  {dropdownOpen ? (
                    <ChevronUpIcon className="w-4 h-4" />
                  ) : (
                    <ChevronDownIcon className="w-4 h-4" />
                  )}
                </span>
                تسجيل الدخول
              </button>
              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute top-[30px] right-0 mt-1 w-40 bg-white shadow-lg rounded-lg p-2">
                  <NavLink
                    to="/register"
                    className="block px-4 py-2 text-sm text-[#E26629] hover:bg-gray-100"
                  >
                    التسجيل كمدير
                  </NavLink>
                  <NavLink
                    to="/dpregister"
                    className="block px-4 py-2 text-sm text-[#E26629] hover:bg-gray-100"
                  >
                    التسجيل كنازح
                  </NavLink>
                </div>
              )}
            </div>
          )}

          {/* Active Link Styling */}
          <NavLink
            to={"/announcment"}
            className={({ isActive }) =>
              `text-sm/6 font-semibold hover:text-[#A6B78D] duration-300 ${
                isActive ? "text-[#A6B78D]" : " text-[#E26629]"
              }`
            }
          >
            أخر الأخبار
          </NavLink>
          <NavLink
            to={"/organizations"}
            className={({ isActive }) =>
              `text-sm/6 font-semibold hover:text-[#A6B78D] duration-300 ${
                isActive ? "text-[#A6B78D]" : " text-[#E26629]"
              }`
            }
          >
            مؤسساتنا
          </NavLink>
          <NavLink
            to={"/camps"}
            className={({ isActive }) =>
              `text-sm/6 font-semibold hover:text-[#A6B78D] duration-300 ${
                isActive ? "text-[#A6B78D]" : " text-[#E26629]"
              }`
            }
          >
            مخيماتنا
          </NavLink>
          <NavLink
            to={"/aboutus"}
            className={({ isActive }) =>
              `text-sm/6 font-semibold hover:text-[#A6B78D] duration-300 ${
                isActive ? "text-[#A6B78D]" : " text-[#E26629]"
              }`
            }
          >
            من نحن
          </NavLink>
          <NavLink
            to={"/"}
            className={({ isActive }) =>
              `text-sm/6 font-semibold hover:text-[#A6B78D] duration-300 ${
                isActive ? "text-[#A6B78D]" : " text-[#E26629]"
              }`
            }
          >
            الرئيسية
          </NavLink>
        </div>
        <div className="flex lg:flex-1 lg:justify-end">
          <NavLink to={"/"} className="-m-1.5 p-1.5">
            <span className="sr-only">Hands Of Hands</span>
            <img alt="Logo" src={logo} className="h-12 w-auto" />
          </NavLink>
        </div>
      </nav>

      {/* Mobile Menu */}
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-10 bg-[#ffffff65]" />
        <DialogPanel className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-[#F5F5F5] px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-[#A6B78D]"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
            <NavLink to={"/"} className="-m-1.5 p-1.5">
              <span className="sr-only">Hands Of Hope</span>
              <img alt="Logo" src={logo} className="h-10 w-auto" />
            </NavLink>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <NavLink
                  to={"/"}
                  className={({ isActive }) =>
                    `-mx-3 block rounded-lg px-3 py-2 text-base/7 font-medium ${
                      isActive ? "text-[#A6B78D]" : "text-[#E26629]"
                    } hover:bg-gray-50`
                  }
                >
                  الرئيسية
                </NavLink>
                <NavLink
                  to={"/aboutus"}
                  className={({ isActive }) =>
                    `-mx-3 block rounded-lg px-3 py-2 text-base/7 font-medium ${
                      isActive ? "text-[#A6B78D]" : "text-[#E26629]"
                    } hover:bg-gray-50`
                  }
                >
                  من نحن
                </NavLink>
                <NavLink
                  to={"/camps"}
                  className={({ isActive }) =>
                    `-mx-3 block rounded-lg px-3 py-2 text-base/7 font-medium ${
                      isActive ? "text-[#A6B78D]" : "text-[#E26629]"
                    } hover:bg-gray-50`
                  }
                >
                  مخيماتنا
                </NavLink>
                <NavLink
                  to={"/organizations"}
                  className={({ isActive }) =>
                    `-mx-3 block rounded-lg px-3 py-2 text-base/7 font-medium ${
                      isActive ? "text-[#A6B78D]" : "text-[#E26629]"
                    } hover:bg-gray-50`
                  }
                >
                  مؤسساتنا
                </NavLink>
                <NavLink
                  to={"/announcment"}
                  className={({ isActive }) =>
                    `-mx-3 block rounded-lg px-3 py-2 text-base/7 font-medium ${
                      isActive ? "text-[#A6B78D]" : "text-[#E26629]"
                    } hover:bg-gray-50`
                  }
                >
                  أخر الأخبار
                </NavLink>
              </div>
              <div className="py-6">
                {token ? (
                  <>
                    <NavLink
                      to={"/notification"}
                      className={({ isActive }) =>
                        `-mx-3 block rounded-lg px-3 py-2 text-base/7 font-medium ${
                          isActive ? "text-[#A6B78D]" : "text-[#E26629]"
                        } hover:bg-gray-50`
                      }
                    >
                      الإشعارات
                    </NavLink>
                    <NavLink
                      to={"/profile"}
                      className={({ isActive }) =>
                        `-mx-3 block rounded-lg px-3 py-2 text-base/7 font-medium ${
                          isActive ? "text-[#A6B78D]" : "text-[#E26629]"
                        } hover:bg-gray-50`
                      }
                    >
                      صفحتي
                    </NavLink>
                    <NavLink
                      to={"/"}
                      onClick={handleLogout}
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-[#E26629] hover:bg-gray-50"
                    >
                      تسجيل الخروج
                    </NavLink>
                  </>
                ) : (
                  <div className="relative">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="font-semibold text-[#E26629] hover:text-[#A6B78D] duration-300 flex items-center -mx-3  rounded-lg px-3 py-2.5 text-base/7 hover:bg-gray-50"
                    >
                      <span className="mr-2">
                        {dropdownOpen ? (
                          <ChevronUpIcon className="w-4 h-4" />
                        ) : (
                          <ChevronDownIcon className="w-4 h-4" />
                        )}
                      </span>
                      تسجيل الدخول
                    </button>
                    {dropdownOpen && (
                      <div className="absolute top-[30px] right-0 left-0 mt-1 w-40 bg-white shadow-lg rounded-lg p-2">
                        <NavLink
                          to="/register"
                          className="block px-4 py-2 text-sm text-[#E26629] hover:bg-gray-100"
                        >
                          التسجيل كمدير
                        </NavLink>
                        <NavLink
                          to="/dpregister"
                          className="block px-4 py-2 text-sm text-[#E26629] hover:bg-gray-100"
                        >
                          التسجيل كنازح
                        </NavLink>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
