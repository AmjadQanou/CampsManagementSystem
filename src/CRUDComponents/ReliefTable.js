import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../AuthProvider";
import Swal from "sweetalert2";
import {
  organizationService,
  itemService,
  distributionCriteriaService,
  campService,
  reliefRegisterService,
  notificationService,
} from "../services/apiService";

export default function ReliefTable({
  tableName,
  list,
  columnsToExclude,
  url,
  hidebtn,
  hideactions,
}) {
  const rawColumns =
    list.length > 0
      ? Object.keys(list[0]).filter((key) => !columnsToExclude.includes(key))
      : [];
  // Always put 'id' first
  const columns = rawColumns.includes("id")
    ? ["id", ...rawColumns.filter((key) => key !== "id")]
    : rawColumns;

  const { user } = useContext(AuthContext);

  const [colWidths, setColWidths] = useState(() =>
    columns.reduce((acc, col) => {
      acc[col] = 150;
      return acc;
    }, {}),
  );

  const [selectedRows, setSelectedRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [form, setForm] = useState({
    itemId: "",
    distributionCriteriaId: "",
    quantity: "",
    name: "",
  });
  const [org, setOrg] = useState([]);

  const resizingCol = useRef(null);
  const startX = useRef(null);
  const startWidth = useRef(null);

  const onMouseDown = (e, col) => {
    resizingCol.current = col;
    startX.current = e.clientX;
    startWidth.current = colWidths[col];
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

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSelectAll = (e) => {
    setSelectedRows(e.target.checked ? list.map((item) => item.id) : []);
  };

  // Fetch organizations using apiService on mount
  useEffect(() => {
    organizationService
      .getAll()
      .then((res) => setOrg(res.data))
      .catch(console.error);
  }, []);

  const handleSendHelp = async () => {
    try {
      const [itemRes, criteriaRes] = await Promise.all([
        itemService.getAll(),
        distributionCriteriaService.getAll(),
      ]);
      setItems(itemRes.data);
      setCriteria(criteriaRes.data);
      setShowModal(true);
    } catch (err) {
      console.error("Failed to fetch form data", err);
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "لا توجد مؤسسة مرتبطة بهذا الحساب. يرجى التواصل مع مدير النظام.",
      });
    }
  };

  async function postNotification(campData) {
    const orgName = Array.isArray(org) && org.length > 0 ? org[0].name : "";
    const notification = {
      message: `${orgName} وصلتك مساعدة من مؤسسة`,
      senderId: parseInt(1),
      receiverId: campData.campManagerId,
    };
    await notificationService.create(notification);
  }

  const handleReliefSubmit = async () => {
    for (let campId of selectedRows) {
      try {
        const campRes = await campService.getById(campId);
        const campData = campRes.data;

        const bod = {
          quantity: parseInt(form.quantity),
          itemId: parseInt(form.itemId),
          name: form.name,
          campManagerId: campData.campManagerId,
          orgManagerId: user.id,
          distributionCriteriaId: parseInt(form.distributionCriteriaId),
        };

        const res = await reliefRegisterService.create(bod);
        if (res.status === 200) {
          await postNotification(campData);
        }
      } catch (err) {
        console.error("Error submitting relief:", err);
      }
    }
    setShowModal(false);
    setSelectedRows([]);
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.04, duration: 0.25, ease: "easeOut" },
    }),
  };

  return (
    <div className="min-h-screen bg-[#F9F7F4] py-8 px-4">
      <div className="container mx-auto">
        {/* Page Title */}
        <motion.h1
          className="text-2xl font-bold text-center text-[#2D2926] mb-6 tracking-tight"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {tableName}
        </motion.h1>

        {list ? (
          <>
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6 gap-3 flex-wrap">
              {user.role === "OrganizationManager" && (
                <button
                  onClick={handleSendHelp}
                  disabled={selectedRows.length === 0}
                  className={`inline-flex items-center gap-2 text-sm font-medium px-5 py-2 rounded-lg border transition ${
                    selectedRows.length === 0
                      ? "border-[#E8E4DE] text-[#B0A89E] bg-[#F9F7F4] cursor-not-allowed"
                      : "border-[#A6B78D] text-[#A6B78D] hover:bg-[#A6B78D] hover:text-white"
                  }`}
                >
                  إرسال مساعدة
                </button>
              )}

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
            <div className="bg-white rounded-xl border border-[#E8E4DE] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F3F1EE] border-b border-[#E8E4DE]">
                      <th className="py-3 px-4 w-10 text-center">
                        <input
                          type="checkbox"
                          onChange={handleSelectAll}
                          checked={
                            list.length > 0 &&
                            selectedRows.length === list.length
                          }
                          className="accent-[#A6B78D] w-4 h-4 cursor-pointer"
                        />
                      </th>
                      {columns.map((col) => (
                        <th
                          key={col}
                          className="relative py-3 px-4 text-right font-semibold text-[#7A706A] text-xs uppercase tracking-wider group"
                          style={{ width: colWidths[col] }}
                        >
                          <div className="flex justify-between items-center gap-2">
                            <span>
                              {col.charAt(0).toUpperCase() + col.slice(1)}
                            </span>
                            <div
                              className="w-px h-4 bg-[#D0C8C0] cursor-col-resize opacity-0 group-hover:opacity-100 transition"
                              onMouseDown={(e) => onMouseDown(e, col)}
                            />
                          </div>
                        </th>
                      ))}
                      <th className="py-3 px-4 text-center font-semibold text-[#7A706A] text-xs uppercase tracking-wider">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#F0EDE9]">
                    <AnimatePresence>
                      {list.map((item, index) => (
                        <motion.tr
                          key={item.id}
                          className="hover:bg-[#F9F7F4] transition-colors duration-150"
                          custom={index}
                          initial="hidden"
                          animate="visible"
                          exit={{ opacity: 0 }}
                          variants={rowVariants}
                        >
                          <td className="py-3 px-4 text-center">
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(item.id)}
                              onChange={() => handleSelectRow(item.id)}
                              className="accent-[#A6B78D] w-4 h-4 cursor-pointer"
                            />
                          </td>
                          {columns.map((col) => (
                            <td
                              key={col}
                              className="py-3 px-4 text-right text-[#2D2926] truncate"
                              style={{
                                width: colWidths[col],
                                maxWidth: colWidths[col],
                              }}
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
                                <span className="line-clamp-1">
                                  {item[col]}
                                </span>
                              )}
                            </td>
                          ))}

                          {/* Actions */}
                          {user.role === "OrganizationManager" &&
                          hideactions ? (
                            <td className="py-3 px-4 text-center">
                              <Link
                                to={`show/${item.id}`}
                                className="text-[#A6B78D] hover:text-[#6d7b52] transition-colors text-sm"
                              >
                                عرض
                              </Link>
                            </td>
                          ) : (
                            <td className="py-3 px-4 text-center">
                              <div className="flex justify-center gap-3">
                                <Link
                                  to={`update/${item.id}`}
                                  className="text-[#A6B78D] hover:text-[#6d7b52] transition-colors"
                                  title="تعديل"
                                >
                                  <FaEdit size={16} />
                                </Link>
                                <Link
                                  to={`delete/${item.id}`}
                                  className="text-[#DC7F56] hover:text-[#b55f3f] transition-colors"
                                  title="حذف"
                                >
                                  <FaTrash size={16} />
                                </Link>
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

            {/* Selected Rows Info */}
            {selectedRows.length > 0 && (
              <p className="mt-4 text-xs text-[#7A706A] text-center">
                تم تحديد {selectedRows.length} عنصر
              </p>
            )}
          </>
        ) : (
          <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#A6B78D] border-t-transparent" />
          </div>
        )}

        {/* Send Relief Modal - Clean Design */}
        {showModal && items && criteria && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
            <motion.div
              className="bg-white rounded-xl border border-[#E8E4DE] shadow-lg p-6 w-[420px] space-y-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-lg font-semibold text-[#2D2926] border-b border-[#F0EDE9] pb-3">
                إرسال مساعدة
              </h2>

              <div>
                <label className="block text-sm font-medium text-[#7A706A] mb-1">
                  الاسم
                </label>
                <input
                  type="text"
                  placeholder="الاسم"
                  className="w-full border border-[#E8E4DE] rounded-lg px-3 py-2 text-sm text-[#2D2926] focus:outline-none focus:ring-2 focus:ring-[#A6B78D]/40 focus:border-[#A6B78D]"
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#7A706A] mb-1">
                  العنصر
                </label>
                <select
                  className="w-full border border-[#E8E4DE] rounded-lg px-3 py-2 text-sm text-[#2D2926] bg-white focus:outline-none focus:ring-2 focus:ring-[#A6B78D]/40 focus:border-[#A6B78D]"
                  onChange={(e) =>
                    setForm((f) => ({ ...f, itemId: e.target.value }))
                  }
                >
                  <option value="">اختر العنصر</option>
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#7A706A] mb-1">
                  معيار التوزيع
                </label>
                <select
                  className="w-full border border-[#E8E4DE] rounded-lg px-3 py-2 text-sm text-[#2D2926] bg-white focus:outline-none focus:ring-2 focus:ring-[#A6B78D]/40 focus:border-[#A6B78D]"
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      distributionCriteriaId: e.target.value,
                    }))
                  }
                >
                  <option value="">اختر معيار التوزيع</option>
                  {criteria.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#7A706A] mb-1">
                  الكمية
                </label>
                <input
                  type="number"
                  placeholder="الكمية"
                  className="w-full border border-[#E8E4DE] rounded-lg px-3 py-2 text-sm text-[#2D2926] focus:outline-none focus:ring-2 focus:ring-[#A6B78D]/40 focus:border-[#A6B78D]"
                  onChange={(e) =>
                    setForm((f) => ({ ...f, quantity: e.target.value }))
                  }
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm rounded-lg border border-[#E8E4DE] text-[#7A706A] hover:bg-[#F9F7F4] transition"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleReliefSubmit}
                  className="px-4 py-2 text-sm rounded-lg bg-[#A6B78D] text-white hover:bg-[#8ca170] transition"
                >
                  إرسال
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
