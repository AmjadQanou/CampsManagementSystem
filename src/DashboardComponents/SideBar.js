import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Home,
  Users,
  Package,
  ClipboardList,
  ShieldCheck,
  HeartPulse,
  UserRoundSearch,
  Megaphone,
  Lock,
  ChevronDown,
} from "lucide-react";
import { AuthContext } from "../AuthProvider";
import { OrgStatusContext } from "../Context/OrgStatusContext";

export default function SideBar() {
  const { user } = useContext(AuthContext);
  const orgStatus = useContext(OrgStatusContext);
  const [openGroup, setOpenGroup] = useState(null);

  const isOrgManager = user?.role === "OrganizationManager";
  const isLocked =
    isOrgManager && orgStatus && (!orgStatus.hasOrg || !orgStatus.isApproved);

  const homePath =
    user?.role === "SystemManager"
      ? "/dashboard/admindash"
      : user?.role === "CampManager"
        ? "/dashboard/mycamp"
        : "/dashboard/myorg";

  const isActive = (path) => window.location.hash === `#${path}`;

  const NavItem = ({ to, icon, label }) => {
    if (isLocked) {
      return (
        <li>
          <span className="sidebar-nav-item sidebar-nav-item--locked">
            <Lock size={14} />
            <span>{label}</span>
          </span>
        </li>
      );
    }
    return (
      <li>
        <Link
          to={to}
          className={`sidebar-nav-item ${isActive(to) ? "sidebar-nav-item--active" : ""}`}
        >
          <span className="sidebar-nav-item__icon">{icon}</span>
          <span className="sidebar-nav-item__label">{label}</span>
          {isActive(to) && <span className="sidebar-nav-item__dot" />}
        </Link>
      </li>
    );
  };

  const groups = [
    {
      id: "management",
      label: "الإدارة",
      items: [
        user?.role !== "CampManager" && {
          to: "/dashboard/Camps",
          icon: <Home size={14} />,
          label: "المخيمات",
        },
        user?.role === "SystemManager" && {
          to: "/dashboard/campManagers",
          icon: <Users size={14} />,
          label: "مدراء المخيمات",
        },
        user?.role !== "OrganizationManager" && {
          to: "/dashboard/org",
          icon: <ShieldCheck size={14} />,
          label: "المؤسسات",
        },
        user?.role !== "OrganizationManager" && {
          to: "/dashboard/orgManager",
          icon: <Users size={14} />,
          label: "مدراء المؤسسات",
        },
        (user?.role === "CampManager" || user?.role === "SystemManager") && {
          to: "/dashboard/dps",
          icon: <UserRoundSearch size={14} />,
          label: "النازحين",
        },
        user?.role !== "OrganizationManager" && {
          to: "/dashboard/displacments",
          icon: <Home size={14} />,
          label: "تغيير المخيم",
        },
      ].filter(Boolean),
    },
    {
      id: "relief",
      label: "المساعدات",
      items: [
        {
          to: "/dashboard/items",
          icon: <Package size={14} />,
          label: "تصنيف المساعدات",
        },
        {
          to: "/dashboard/reliefreg",
          icon: <ClipboardList size={14} />,
          label: "تسجيل المساعدات",
        },
        {
          to: "/dashboard/reliefreq",
          icon: <ClipboardList size={14} />,
          label: "طلبات المساعدة",
        },
        {
          to: "/dashboard/discriteria",
          icon: <ClipboardList size={14} />,
          label: "معايير التوزيع",
        },
        user?.role === "CampManager" && {
          to: "/dashboard/dpsRelief",
          icon: <UserRoundSearch size={14} />,
          label: "توزيع المساعدات",
        },
        {
          to: "/dashboard/reliefTracking",
          icon: <ClipboardList size={14} />,
          label: "تتبع المساعدات",
        },
        {
          to: "/dashboard/showfiles",
          icon: <ClipboardList size={14} />,
          label: "توثيقات التوزيع",
        },
      ].filter(Boolean),
    },
    {
      id: "health",
      label: "الصحة والتواصل",
      items: [
        {
          to: "/dashboard/healthIssues",
          icon: <HeartPulse size={14} />,
          label: "المشاكل الصحية",
        },
        {
          to: "/dashboard/announcments",
          icon: <Megaphone size={14} />,
          label: "الإعلانات",
        },
        {
          to: "/dashboard/notifications",
          icon: <ClipboardList size={14} />,
          label: "الإشعارات",
        },
      ],
    },
  ];

  return (
    <>
      <style>{`
        .sidebar {
          position: fixed;
          top: 0;
          right: 0;
          z-index: 40;
          width: 256px;
          height: 100vh;
          background: #FFFFFF;
          border-left: 1px solid #E8E4DE;
          padding-top: 56px;
          display: flex;
          flex-direction: column;
          font-family: 'Segoe UI', system-ui, sans-serif;
          direction: rtl;
          box-shadow: -2px 0 16px rgba(45,41,38,0.06);
        }

        .sidebar__scroll {
          flex: 1;
          overflow-y: auto;
          padding: 16px 12px 24px;
          scrollbar-width: thin;
          scrollbar-color: #E8E4DE transparent;
        }

        /* Logo */
        .sidebar__logo-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 4px 0 18px;
        }

        .sidebar__logo-ring {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: linear-gradient(135deg, #DC7F56 0%, #c46b45 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 0 6px rgba(220,127,86,0.12), 0 6px 20px rgba(220,127,86,0.25);
          margin-bottom: 10px;
        }

        .sidebar__logo-ring img {
          width: 42px;
          height: 42px;
          object-fit: contain;
          filter: brightness(0) invert(1);
        }

        .sidebar__app-name {
          font-size: 12.5px;
          font-weight: 700;
          color: #2D2926;
          letter-spacing: 0.04em;
        }

        .sidebar__app-sub {
          font-size: 10px;
          color: #7A706A;
          margin-top: 2px;
          letter-spacing: 0.03em;
        }

        /* Divider */
        .sidebar__divider {
          height: 1px;
          background: #E8E4DE;
          margin: 4px 0 14px;
        }

        /* Pending banner */
        .sidebar__banner {
          border-radius: 8px;
          padding: 8px 10px;
          font-size: 11px;
          text-align: center;
          margin-bottom: 12px;
          line-height: 1.5;
        }
        .sidebar__banner--warn {
          background: rgba(220,127,86,0.08);
          border: 1px solid rgba(220,127,86,0.25);
          color: #c46b45;
        }
        .sidebar__banner--info {
          background: rgba(166,183,141,0.1);
          border: 1px solid rgba(166,183,141,0.3);
          color: #6d7b52;
        }

        /* Home link */
        .sidebar__home {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 10px 13px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          background: linear-gradient(135deg, #DC7F56, #c46b45);
          text-decoration: none;
          margin-bottom: 18px;
          box-shadow: 0 3px 10px rgba(220,127,86,0.3);
          transition: opacity 0.15s, box-shadow 0.15s;
        }
        .sidebar__home:hover {
          opacity: 0.92;
          box-shadow: 0 5px 16px rgba(220,127,86,0.38);
        }

        /* Group */
        .sidebar__group {
          margin-bottom: 4px;
        }

        .sidebar__group-toggle {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 5px 8px;
          border-radius: 6px;
          border: none;
          background: transparent;
          cursor: pointer;
          transition: background 0.15s;
          margin-bottom: 3px;
        }
        .sidebar__group-toggle:hover {
          background: #F9F7F4;
        }

        .sidebar__group-label {
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #B0A89E;
        }

        .sidebar__group-chevron {
          color: #B0A89E;
          transition: transform 0.2s;
          flex-shrink: 0;
        }
        .sidebar__group-chevron--open {
          transform: rotate(180deg);
        }

        .sidebar__group-items {
          list-style: none;
          margin: 0 0 0 4px;
          padding: 0 0 4px 10px;
          display: flex;
          flex-direction: column;
          gap: 1px;
          border-right: 2px solid #F0EDE9;
          overflow: hidden;
        }

        /* Nav item */
        .sidebar-nav-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 10px;
          border-radius: 8px;
          font-size: 12.5px;
          color: #7A706A;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
          position: relative;
          cursor: pointer;
        }
        .sidebar-nav-item:hover {
          background: #F9F7F4;
          color: #2D2926;
        }
        .sidebar-nav-item--active {
          background: rgba(220,127,86,0.1);
          color: #DC7F56;
          font-weight: 600;
        }
        .sidebar-nav-item--active:hover {
          background: rgba(220,127,86,0.14);
          color: #DC7F56;
        }
        .sidebar-nav-item--locked {
          color: #B0A89E;
          cursor: not-allowed;
          pointer-events: none;
        }

        .sidebar-nav-item__icon {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          color: inherit;
          opacity: 0.8;
        }
        .sidebar-nav-item--active .sidebar-nav-item__icon {
          opacity: 1;
        }

        .sidebar-nav-item__label {
          flex: 1;
          line-height: 1.3;
        }

        .sidebar-nav-item__dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #DC7F56;
          flex-shrink: 0;
        }

        /* User badge */
        .sidebar__user {
          padding: 11px 14px;
          border-top: 1px solid #E8E4DE;
          display: flex;
          align-items: center;
          gap: 10px;
          background: #FDFCFB;
        }
        .sidebar__user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #DC7F56, #c46b45);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
          box-shadow: 0 2px 6px rgba(220,127,86,0.3);
        }
        .sidebar__user-info {
          flex: 1;
          min-width: 0;
        }
        .sidebar__user-name {
          font-size: 12px;
          font-weight: 600;
          color: #2D2926;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sidebar__user-role {
          font-size: 10px;
          color: #7A706A;
          margin-top: 1px;
        }
        .sidebar__user-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #A6B78D;
          flex-shrink: 0;
          box-shadow: 0 0 0 2px rgba(166,183,141,0.2);
        }
      `}</style>

      <aside className="sidebar">
        <div className="sidebar__scroll">
          {/* Logo */}
          <div className="sidebar__logo-wrap">
            <div className="sidebar__logo-ring">
              <img src="../images/logo.png" alt="logo" />
            </div>
            <div className="sidebar__app-name">إدارة المخيمات</div>
            <div className="sidebar__app-sub">نظام متكامل للإدارة</div>
          </div>

          <div className="sidebar__divider" />

          {/* Pending banner */}
          {isOrgManager && orgStatus && (
            <>
              {!orgStatus.hasOrg && (
                <div className="sidebar__banner sidebar__banner--warn">
                  سجّل مؤسستك أولاً للوصول إلى لوحة التحكم
                </div>
              )}
              {orgStatus.hasOrg && !orgStatus.isApproved && (
                <div className="sidebar__banner sidebar__banner--info">
                  ⏳ مؤسستك في انتظار موافقة المدير
                </div>
              )}
            </>
          )}

          {/* Home */}
          <Link to={homePath} className="sidebar__home">
            <LayoutDashboard size={15} />
            الصفحة الرئيسية
          </Link>

          {/* Groups */}
          {groups.map((group) =>
            group.items.length === 0 ? null : (
              <div key={group.id} className="sidebar__group">
                <button
                  className="sidebar__group-toggle"
                  onClick={() =>
                    setOpenGroup(openGroup === group.id ? null : group.id)
                  }
                >
                  <span className="sidebar__group-label">{group.label}</span>
                  <ChevronDown
                    size={11}
                    className={`sidebar__group-chevron ${
                      openGroup === group.id
                        ? "sidebar__group-chevron--open"
                        : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {(openGroup === group.id || openGroup === null) && (
                    <motion.ul
                      className="sidebar__group-items"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      {group.items.map((item) => (
                        <NavItem key={item.to} {...item} />
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            ),
          )}
        </div>

        {/* User badge */}
        {user && (
          <div className="sidebar__user">
            <div className="sidebar__user-avatar">
              {(user.username || user.name || "U")[0].toUpperCase()}
            </div>
            <div className="sidebar__user-info">
              <div className="sidebar__user-name">
                {user.username || user.name || "المستخدم"}
              </div>
              <div className="sidebar__user-role">{user.role}</div>
            </div>
            <div className="sidebar__user-dot" />
          </div>
        )}
      </aside>
    </>
  );
}
