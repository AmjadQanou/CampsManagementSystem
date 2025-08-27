import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FolderKanban,
  ArrowDownUp,
  HelpingHand,
  Home,
  Users,
  Package,
  ClipboardList,
  ShieldCheck,
  HeartPulse,
  UserRoundSearch,
  Megaphone,
} from 'lucide-react';
import { AuthContext } from '../AuthProvider';

export default function SideBar() {

  const subLinkStyle = (path) =>
    `flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition bg-[#DC7F56] text-white rounded-xl ${
      window.location.pathname  === path
        ? ' bg-[#DC7F56]/80 text-white -translate-x-5  rounded-xl '
        : 'hover:bg-[#DC7F56] text-white  rounded-xl'
    }`;
  const [isOpen, setIsOpen] = useState(false);
 const {user}=useContext(AuthContext)
  const fadeSlide = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.2 },
  };

  

  return (
    <aside className="fixed top-0 overflow-hidden right-0 z-40 w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-lg pt-14 px-4 transition-all">      <div className="h-full overflow-y-auto py-4">
      
      <div className="relative mb-12 flex justify-center h-40">
  {/* Quantum Particle Background */}
  <div className="absolute inset-0 overflow-hidden rounded-2xl">
    {[...Array(12)].map((_, i) => (
      <div 
        key={i}
        className="absolute rounded-full bg-[#DC7F56] opacity-20"
        style={{
          width: `${Math.random() * 10 + 2}px`,
          height: `${Math.random() * 10 + 2}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `float ${Math.random() * 10 + 10}s linear infinite`,
          animationDelay: `${Math.random() * 5}s`
        }}
      />
    ))}
  </div>

  {/* Holographic Card */}
  <div className="relative w-36 h-36 group perspective-1000">
    {/* 3D Container */}
    <div className="relative w-full h-full preserve-3d transition-all duration-700 group-hover:rotate-x-15 group-hover:rotate-y-15">
      {/* Card Face - Prismatic Effect */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl overflow-hidden">
        {/* Chromatic Flare */}
        <div className="absolute inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,#DC7F56_0%,#E8A87C_25%,#FFFFFF_50%,#84E0F0_75%,#DC7F56_100%)] opacity-10 mix-blend-overlay" />
        
   
        
        <div className="relative z-10 w-full h-full flex items-center justify-center p-4 transition-transform duration-500 group-hover:translate-z-10">
          <img 
            src='../images/logo.png' 
            className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(220,127,86,0.7)]"
            alt="System Logo"
          />
        </div>
      </div>

      <div className="absolute inset-0 rounded-xl border-2 border-[#DC7F56]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className="absolute inset-0 rounded-xl border border-[#DC7F56]"
            style={{
              transform: `translateZ(${-i * 5}px)`,
              opacity: 1 - i * 0.12
            }}
          />
        ))}
      </div>
    </div>

    <div className="absolute -bottom-4 left-1/2 w-24 h-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#DC7F56]/40 via-transparent to-transparent -translate-x-1/2 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300" />
  </div>

  <div className="absolute -bottom-6 left-0 right-0 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
    <div className="w-2 h-2 rounded-full bg-[#DC7F56] animate-pulse" />
    <div className="w-2 h-2 rounded-full bg-[#DC7F56] animate-pulse delay-100" />
    <div className="w-2 h-2 rounded-full bg-[#DC7F56] animate-pulse delay-200" />
  </div>
</div>


        <ul className="space-y-2">
           <li>
            <Link
              to={user.role=="SystemManager"?"/dashboard/admindash":user.role=="CampManager"?"/dashboard/mycamp":"/dashboard/myorg"}
              className={subLinkStyle(user.role=="SystemManager"?"/dashboard/admindash":user.role=="CampManager"?"/dashboard/mycamp":"/dashboard/myorg")}
              >
              <LayoutDashboard className="w-5 h-5" />
              الصفحة الرئيسية
            </Link>
          </li>

          <li>


            <AnimatePresence>
              { (
                <motion.ul
                  className="mt-2 ml-6 space-y-2"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={fadeSlide}
                >
                  { user.role=="CampManager"?"":<li>
                    <Link
                      to="/dashboard/Camps"
                      className={subLinkStyle('/dashboard/Camps')}
                    >
                      <Home className="w-4 h-4" /> المخيمات
                    </Link>
                  </li>
                  }
                 {user.role=="SystemManager" ?<li>
                    <Link
                      to="/dashboard/campManagers"
                      className={subLinkStyle('/dashboard/campManagers')}
                    >
                      <Users className="w-4 h-4" /> مدراء المخيمات
                    </Link>
                  </li>:""
                 }
                  <li>
                    <Link
                      to="/dashboard/items"
                      className={subLinkStyle('/dashboard/items')}
                    >
                      <Package className="w-4 h-4" /> تصنيف المساعدات
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/reliefreg"
                      className={subLinkStyle('/dashboard/reliefreg')}
                    >
                      <ClipboardList className="w-4 h-4" /> تسجيل المساعدات
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/reliefreq"
                      className={subLinkStyle('/dashboard/reliefreq')}
                    >
                      <ClipboardList className="w-4 h-4" /> طلبات المساعدة
                    </Link>
                  </li>
                  { user.role=="OrganizationManager"?"": <li>
                    <Link
                      to="/dashboard/org"
                      className={subLinkStyle('/dashboard/org')}
                    >
                      <ShieldCheck className="w-4 h-4" /> المؤسسات
                    </Link>
                  </li>
                  }
                  <li>
                    <Link
                      to="/dashboard/discriteria"
                      className={subLinkStyle('/dashboard/discriteria')}
                    >
                      <ClipboardList className="w-4 h-4" /> معايير التوزيع
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/healthIssues"
                      className={subLinkStyle('/dashboard/healthIssues')}
                    >
                      <HeartPulse className="w-4 h-4" /> المشاكل الصحية
                    </Link>
                  </li>
                 { user.role=="CampManager"||user.role=="SystemManager"? <li>
                    <Link
                      to="/dashboard/dps"
                      className={subLinkStyle('/dashboard/dps')}
                    >
                      <UserRoundSearch className="w-4 h-4" /> النازحين
                    </Link>
                  </li>:""
                 }

                                  { user.role=="CampManager"? <li>
                    <Link
                      to="/dashboard/dpsRelief"
                      className={subLinkStyle('/dashboard/dpsRelief')}
                    >
                      <UserRoundSearch className="w-4 h-4" /> توزيع المساعدات
                    </Link>
                  </li>:""
                 }

              { user.role=="OrganizationManager"?"":   <li>
  <Link
    to="/dashboard/orgManager"
    className={subLinkStyle('/dashboard/orgManager')}
    >
    <Users className="w-4 h-4" /> مدراء المؤسسات
  </Link>
</li>
              }
{  user.role=="OrganizationManager"?"":<li>
  <Link
    to="/dashboard/displacments"
    className={subLinkStyle('/dashboard/displacments')}
  >
    <Home className="w-4 h-4" /> تغيير المخيم 
  </Link>
</li>
}
<li>
  <Link
    to="/dashboard/reliefTracking"
    className={subLinkStyle('/dashboard/reliefTracking')}
  >
    <ClipboardList className="w-4 h-4" /> تتبع المساعدات
  </Link>
</li>

<li>
  <Link
    to="/dashboard/announcments"
    className={subLinkStyle('/dashboard/announcments')}
  >
    <Megaphone className="w-4 h-4" /> الاعلانات
  </Link>
</li> 

<li>
  <Link
    to="/dashboard/notifications"
    className={subLinkStyle('/dashboard/notifications')}
  >
    <ClipboardList className="w-4 h-4" /> Notifications
  </Link>
</li>

<li>
  <Link
    to="/dashboard/showfiles"
    className={subLinkStyle('/dashboard/showfiles')}
  >
    <ClipboardList className="w-4 h-4" /> عرض توثيقات التوزيع
  </Link>
</li>
 
                </motion.ul>
              )}
            </AnimatePresence>
          </li>
        </ul>

  
      </div>
    </aside>
  );
}
