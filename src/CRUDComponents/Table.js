import React, { useState, useRef, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { AuthContext } from "../AuthProvider";
import ActionsDropDown from "./DPs/ActionsDropDown";
import { TokenContext } from "../TokenContext";
import {
  healthIssuesService,
  dpsHealthIssuesService,
  reliefRegisterService,
} from "../services/apiService";
import ReliefRegisterModal from "../modals/ReliefRegisterModal";

export default function Table({
  tableName,
  list,
  hideactions,
  showconfirm,
  hidebtn,
  column,
  columnsToExclude,
  columnOrder,
  onDelete,
  onToggleApproval,
  onReliefRegistered,
  searchValue = "",
  setSearchValue = () => {},
}) {
  const { token } = useContext(TokenContext);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [healthIssues, setHealthIssues] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDPId, setSelectedDPId] = useState(null);
  const [notes, setNotes] = useState("");
  const [sevierty, setSeverity] = useState("");
  const [selectedHealthIssueId, setSelectedHealthIssueId] = useState("");

  // Relief Register Modal state
  const [showReliefModal, setShowReliefModal] = useState(false);
  const [selectedReliefRequest, setSelectedReliefRequest] = useState(null);

  useEffect(() => {
    const fetchHealthIssues = async () => {
      try {
        const res = await healthIssuesService.getAll();
        setHealthIssues(res.data);
      } catch (error) {
        console.error("Failed to fetch health issues:", error);
      }
    };
    fetchHealthIssues();
  }, [token]);

  const openHealthModal = (dpId) => {
    setSelectedDPId(dpId);
    setShowModal(true);
  };

  const submitHealthIssue = async () => {
    if (!selectedDPId || !selectedHealthIssueId || !sevierty) {
      Swal.fire("خطأ", "يرجى تعبئة جميع الحقول المطلوبة", "error");
      return;
    }

    const newHealthEntry = {
      dpsId: selectedDPId,
      healthIssueId: selectedHealthIssueId,
      sevierty,
      notes,
    };

    try {
      const res = await dpsHealthIssuesService.create(newHealthEntry);

      if (res.status === 200 || res.status === 201) {
        Swal.fire("تم!", "تمت إضافة الحالة الصحية بنجاح", "success");
        setShowModal(false);
        setNotes("");
        setSeverity("");
        setSelectedHealthIssueId("");
      } else {
        throw new Error("فشل في الإضافة");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("خطأ", "حدث خطأ أثناء الإضافة", "error");
    }
  };

  // دالة معالجة إضافة سجل إغاثة جديد معتمد على بيانات السطر المختار
  // دالة معالجة إضافة سجل إغاثة جديد معتمد على بيانات السطر المختار
  const handleAddReliefRegister = async (item) => {
    try {
      // 1. محاولة استخراج اسم المخيم بالطرق المباشرة المتاحة في السطر (item)
      let extractedCampName =
        item.campName ||
        (item.campManager && item.campManager.campName) ||
        (item.camp && item.camp.name);

      // 2. إذا لم يُعثر عليه، وكان المستخدم الحالي هو مدير المخيم صاحب الطلب (باستخدام المعرف)
      if (
        !extractedCampName &&
        user &&
        (item.campManagerId === user.id || item.campManagerUid === user.uid)
      ) {
        extractedCampName = user.campName;
      }

      // 3. كخيار احتياطي أخير إذا كان الاسم مخزناً داخل حقل مخصص في كائن المدير المرفق
      if (!extractedCampName && item.campManager && item.campManager.camp) {
        extractedCampName =
          item.campManager.camp.name || item.campManager.camp.campName;
      }

      // بناء الكائن بالاعتماد على حقول الطلب الحالي
      const reliefRegisterData = {
        reliefRequestId: item.id,
        campName: extractedCampName || "",
        quantity: item.neededQuantity || 0,
        reliefType: item.reliefType || "",
      };

      // التحقق من وجود اسم المخيم قبل الإرسال للتأكد من سلامة البيانات
      if (!reliefRegisterData.campName) {
        Swal.fire({
          icon: "warning",
          title: "تنبيه",
          text: "لم يتم العثور على اسم المخيم باستخدام بيانات مدير المخيم، يرجى التأكد من ربط الحقول في السيرفر.",
          confirmButtonText: "موافق",
        });
        return;
      }

      // إرسال الطلب لخدمة reliefRegisterService
      const res = await reliefRegisterService.create(reliefRegisterData);

      if (res.status === 200 || res.status === 201) {
        Swal.fire({
          icon: "success",
          title: "تمت الإضافة بنجاح!",
          text: "تم إنشاء سجل إغاثة جديد بناءً على بيانات الطلب.",
          confirmButtonText: "موافق",
          confirmButtonColor: "#A6B78D",
        });
      } else {
        throw new Error("فشل في إضافة السجل");
      }
    } catch (error) {
      console.error("Error creating relief register:", error);
      Swal.fire({
        icon: "error",
        title: "حدث خطأ!",
        text: "تعذر إنشاء سجل الإغاثة، يرجى المحاولة لاحقاً.",
        confirmButtonText: "رجوع",
      });
    }
  };

  const allColumns =
    list && list.length > 0
      ? Object.keys(list[0]).filter((key) => !columnsToExclude.includes(key))
      : [];
  const orderedColumns = columnOrder
    ? [
        ...columnOrder.filter((key) => allColumns.includes(key)),
        ...allColumns.filter((key) => !columnOrder.includes(key)),
      ]
    : allColumns;
  // Always put 'id' first
  const columns = orderedColumns.includes("id")
    ? ["id", ...orderedColumns.filter((key) => key !== "id")]
    : orderedColumns;

  const [colWidths, setColWidths] = useState({});

  const resizingCol = useRef(null);
  const startX = useRef(null);
  const startWidth = useRef(null);

  const onMouseDown = (e, col) => {
    resizingCol.current = col;
    startX.current = e.clientX;
    startWidth.current = colWidths[col] || 150;
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e) => {
    if (!resizingCol.current) return;
    const newWidth = startWidth.current + (e.clientX - startX.current);
    setColWidths((prev) => ({
      ...prev,
      [resizingCol.current]: Math.max(newWidth, 60),
    }));
  };

  const onMouseUp = () => {
    resizingCol.current = null;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.04, duration: 0.25, ease: "easeOut" },
    }),
  };

  async function hundleConfirmation(id) {
    try {
      const res = await reliefRegisterService.confirm(id, true);

      if (res.status === 200 || res.status === 204) {
        Swal.fire({
          icon: "success",
          title: "تم التعديل",
          text: "تم تأكيد استلام المساعدة بنجاح",
          confirmButtonText: "رجوع",
          confirmButtonColor: "#A6B78D",
        }).then(() => window.location.reload());
      } else {
        Swal.fire({
          icon: "error",
          title: "فشل التعديل",
          text: "حدث خطأ أثناء التعديل",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "خطأ في الشبكة",
        text: "تعذر الاتصال بالخادم",
      });
    }
  }

  return (
    <div className="min-h-screen bg-[#F9F7F4] py-8 px-4">
      {list ? (
        <div className="container mx-auto">
          {/* Page Title */}
          <motion.h1
            className="text-2xl font-bold text-center text-[#2D2926] mb-1 tracking-tight"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {tableName}
          </motion.h1>
          <div className="w-16 h-1 bg-[#DC7F56] rounded-full mx-auto mb-6" />

          {/* Toolbar */}
          <div className="flex justify-between items-center mb-6 gap-3 flex-wrap">
            {/* Search */}
            <div className="flex-1 max-w-sm">
              <input
                type="text"
                className="w-full px-4 py-2 bg-white border border-[#E8E4DE] rounded-lg text-sm text-[#2D2926] placeholder:text-[#B0A89E] focus:outline-none focus:ring-2 focus:ring-[#A6B78D]/40 focus:border-[#A6B78D] transition"
                placeholder="بحث..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>

            {/* Add Button - Original Color */}
            {!hidebtn && (
              <Link
                to="add"
                className="inline-flex items-center gap-2 bg-[#DC7F56] hover:bg-[#c46b45] text-white text-sm font-medium px-5 py-2 rounded-lg shadow-sm transition-colors duration-200"
              >
                <span>+</span>
                <span>إضافة {tableName}</span>
              </Link>
            )}
          </div>

          {/* Table - Clean & Attractive Design */}
          <div className="bg-white rounded-xl border border-[#E8E4DE] shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gradient-to-l from-[#A6B78D] to-[#8ca170] border-b-2 border-[#8ca170]">
                    {columns.map((col) => (
                      <th
                        key={col}
                        style={{ width: colWidths[col] || 150 }}
                        className="relative py-3.5 px-4 text-right font-semibold text-white text-xs uppercase tracking-wider group border-l border-white/10 first:border-l-0"
                      >
                        <div className="flex justify-between items-center gap-2">
                          <span>
                            {col.charAt(0).toUpperCase() + col.slice(1)}
                          </span>
                          <div
                            className="w-px h-4 bg-white/30 cursor-col-resize opacity-0 group-hover:opacity-100 transition"
                            onMouseDown={(e) => onMouseDown(e, col)}
                          />
                        </div>
                      </th>
                    ))}

                    {user.role === "CampManager" &&
                      tableName === "تسجيل المساعدات" && (
                        <th className="py-3.5 px-4 text-center font-semibold text-white text-xs uppercase tracking-wider border-l border-white/10">
                          تأكيد الاستلام
                        </th>
                      )}

                    {/* إضافة رأس العمود لزر سجل الإغاثة الجديد */}
                    {tableName === "ReliefRequests" && (
                      <th className="py-3.5 px-4 text-center font-semibold text-white text-xs uppercase tracking-wider border-l border-white/10">
                        سجل الإغاثة
                      </th>
                    )}

                    {(!hideactions || !hidebtn) && (
                      <th className="py-3.5 px-4 text-center font-semibold text-white text-xs uppercase tracking-wider border-l border-white/10">
                        الإجراءات
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F0EDE9]">
                  <AnimatePresence>
                    {list.map((item, index) => (
                      <motion.tr
                        key={item.id}
                        className={`transition-colors duration-150 hover:bg-[#F3F1EE] ${
                          index % 2 === 0 ? "bg-white" : "bg-[#FBFAF8]"
                        }`}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0 }}
                        variants={rowVariants}
                      >
                        {columns.map((col) => (
                          <td
                            key={col}
                            style={{
                              width: colWidths[col] || 150,
                              maxWidth: colWidths[col] || 150,
                            }}
                            className="py-3 px-4 text-right text-[#2D2926] truncate border-l border-[#F0EDE9] first:border-l-0"
                            title={
                              typeof item[col] === "boolean"
                                ? item[col]
                                  ? "مقبول"
                                  : "غير مقبول"
                                : item[col]
                            }
                          >
                            {typeof item[col] === "boolean" ? (
                              <span
                                className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                                  item[col]
                                    ? "bg-[#A6B78D]/15 text-[#5a7a45]"
                                    : "bg-red-50 text-red-500"
                                }`}
                              >
                                {item[col] ? "✓ مقبول" : "✗ مرفوض"}
                              </span>
                            ) : (
                              <span className="line-clamp-1">{item[col]}</span>
                            )}
                          </td>
                        ))}

                        {/* Confirm Button - Original Style */}
                        {user.role === "CampManager" && showconfirm && (
                          <td className="py-3 px-4 text-center border-l border-[#F0EDE9]">
                            <button
                              disabled={item.isRecived}
                              onClick={() => hundleConfirmation(item.id)}
                              className={`text-xs font-medium px-3 py-1 rounded-lg border transition ${
                                item.isRecived
                                  ? "border-[#E8E4DE] text-[#B0A89E] cursor-not-allowed bg-[#F9F7F4]"
                                  : "border-[#A6B78D] text-[#A6B78D] hover:bg-[#A6B78D] hover:text-white"
                              }`}
                            >
                              {item.isRecived ? "تم التأكيد" : "تأكيد الاستلام"}
                            </button>
                          </td>
                        )}

                        {/* إضافة زر "تسجيل إغاثة" داخل خلايا جدول طلبات المساعدة */}
                        {tableName === "ReliefRequests" &&
                          user.role === "OrganizationManager" && (
                            <td className="py-3 px-4 text-center border-l border-[#F0EDE9]">
                              <button
                                onClick={() => {
                                  setSelectedReliefRequest(item);
                                  setShowReliefModal(true);
                                }}
                                className="text-xs font-medium px-3 py-1 rounded-lg border border-[#DC7F56] text-[#DC7F56] hover:bg-[#DC7F56] hover:text-white transition"
                              >
                                + تسجيل إغاثة
                              </button>
                            </td>
                          )}

                        {/* Action Buttons */}
                        {(!hideactions || !hidebtn) && (
                          <td className="py-3 px-4 text-center border-l border-[#F0EDE9]">
                            <div className="flex justify-center items-center gap-3">
                              {/* Toggle Approval Button - Original Colors */}
                              {onToggleApproval && (
                                <button
                                  onClick={() =>
                                    onToggleApproval(item.id, item.approved)
                                  }
                                  className={`text-xs font-medium px-3 py-1 rounded-lg border transition ${
                                    item.approved
                                      ? "border-[#DC7F56] text-[#DC7F56] hover:bg-[#DC7F56] hover:text-white"
                                      : "border-[#A6B78D] text-[#A6B78D] hover:bg-[#A6B78D] hover:text-white"
                                  }`}
                                  title={
                                    item.approved ? "إلغاء التفعيل" : "تفعيل"
                                  }
                                >
                                  {item.approved
                                    ? "✗ إلغاء التفعيل"
                                    : "✓ تفعيل"}
                                </button>
                              )}

                              {user.role === "CampManager" &&
                              tableName === "نازح" ? (
                                <ActionsDropDown
                                  onEdit={() => navigate(`update/${item.id}`)}
                                  onDelete={() => {
                                    Swal.fire({
                                      title: "هل أنت متأكد؟",
                                      text: `سيتم حذف ${tableName} نهائيًا`,
                                      icon: "warning",
                                      showCancelButton: true,
                                      confirmButtonColor: "#DC7F56",
                                      cancelButtonColor: "#A6B78D",
                                      confirmButtonText: "نعم، احذفه",
                                      cancelButtonText: "إلغاء",
                                    }).then((result) => {
                                      if (result.isConfirmed) {
                                        onDelete(item.id);
                                        Swal.fire(
                                          "تم الحذف!",
                                          `${tableName} تم حذفه بنجاح.`,
                                          "success",
                                        );
                                      }
                                    });
                                  }}
                                  onAddHealth={() => openHealthModal(item.id)}
                                />
                              ) : (user.role === "SystemManager" && hidebtn) ||
                                (user.role === "OrganizationManager" &&
                                  hideactions) ||
                                (user.role === "CampManager" &&
                                  hideactions) ? null : (
                                <>
                                  {(tableName === "تغييرات المخيمات" &&
                                    item.approved === false) ||
                                  user.role === "CampManager" ||
                                  (user.role === "OrganizationManager" &&
                                    !hideactions) ? (
                                    <Link
                                      to={`update/${item.id}`}
                                      className="text-[#A6B78D] hover:text-[#6d7b52] transition-colors"
                                      title="تعديل"
                                    >
                                      <FaEdit size={16} />
                                    </Link>
                                  ) : null}

                                  {onDelete ? (
                                    <button
                                      onClick={() => {
                                        Swal.fire({
                                          title: "هل أنت متأكد؟",
                                          text: `سيتم حذف ${tableName} نهائيًا`,
                                          icon: "warning",
                                          showCancelButton: true,
                                          confirmButtonColor: "#DC7F56",
                                          cancelButtonColor: "#A6B78D",
                                          confirmButtonText: "نعم، احذفه",
                                          cancelButtonText: "إلغاء",
                                        }).then((result) => {
                                          if (result.isConfirmed) {
                                            onDelete(item.id);
                                            Swal.fire(
                                              "تم الحذف!",
                                              `${tableName} تم حذفه بنجاح.`,
                                              "success",
                                            );
                                          }
                                        });
                                      }}
                                      className="text-[#DC7F56] hover:text-[#b55f3f] transition-colors"
                                      title="حذف"
                                    >
                                      <FaTrash size={16} />
                                    </button>
                                  ) : (
                                    <Link
                                      to={`delete/${item.id}`}
                                      className="text-[#DC7F56] hover:text-[#b55f3f] transition-colors"
                                      title="حذف"
                                    >
                                      <FaTrash size={16} />
                                    </Link>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        )}
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {list.length === 0 && (
              <div className="py-16 text-center text-[#B0A89E] text-sm">
                لا توجد بيانات لعرضها
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#A6B78D] border-t-transparent" />
        </div>
      )}

      {/* Health Issue Modal - Original Style */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <motion.div
            className="bg-white rounded-xl border border-[#E8E4DE] shadow-lg p-6 w-[420px] space-y-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-lg font-semibold text-[#2D2926] border-b border-[#F0EDE9] pb-3">
              إضافة حالة صحية
            </h2>

            <div>
              <label className="block text-sm font-medium text-[#7A706A] mb-1">
                الملاحظات
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full border border-[#E8E4DE] rounded-lg px-3 py-2 text-sm text-[#2D2926] focus:outline-none focus:ring-2 focus:ring-[#A6B78D]/40 focus:border-[#A6B78D] resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#7A706A] mb-1">
                الحدة
              </label>
              <select
                value={sevierty}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full border border-[#E8E4DE] rounded-lg px-3 py-2 text-sm text-[#2D2926] focus:outline-none focus:ring-2 focus:ring-[#A6B78D]/40 focus:border-[#A6B78D] bg-white"
              >
                <option value="">اختر الحدة</option>
                <option value="Mild">خفيف</option>
                <option value="Moderate">متوسط</option>
                <option value="Severe">حاد</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#7A706A] mb-1">
                نوع الحالة الصحية
              </label>
              <select
                value={selectedHealthIssueId}
                onChange={(e) => setSelectedHealthIssueId(e.target.value)}
                className="w-full border border-[#E8E4DE] rounded-lg px-3 py-2 text-sm text-[#2D2926] focus:outline-none focus:ring-2 focus:ring-[#A6B78D]/40 focus:border-[#A6B78D] bg-white"
              >
                <option value="">اختر الحالة</option>
                {healthIssues.map((issue) => (
                  <option key={issue.id} value={issue.id}>
                    {issue.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm rounded-lg border border-[#E8E4DE] text-[#7A706A] hover:bg-[#F9F7F4] transition"
              >
                إلغاء
              </button>
              <button
                onClick={submitHealthIssue}
                className="px-4 py-2 text-sm rounded-lg bg-[#A6B78D] text-white hover:bg-[#8ca170] transition"
              >
                حفظ
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Relief Register Modal */}
      <ReliefRegisterModal
        isOpen={showReliefModal}
        onClose={() => {
          setShowReliefModal(false);
          setSelectedReliefRequest(null);
        }}
        reliefRequestItem={selectedReliefRequest}
        onRegistered={(id) => {
          setShowReliefModal(false);
          setSelectedReliefRequest(null);
          if (onReliefRegistered) onReliefRegistered(id);
        }}
      />
    </div>
  );
}
