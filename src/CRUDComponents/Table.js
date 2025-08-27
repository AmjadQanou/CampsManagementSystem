import React, { useState, useRef, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaShower, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { AuthContext } from "../AuthProvider";
import ActionsDropDown from "./DPs/ActionsDropDown";
import { Search } from "lucide-react";
import { TokenContext } from "../TokenContext";

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
  searchValue = "",
  setSearchValue = () => {},
}) {
  // const token = localStorage.getItem('token');
  const { token } = useContext(TokenContext);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [query, setQuery] = useState("");
  const [healthIssues, setHealthIssues] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDPId, setSelectedDPId] = useState(null);
  const [notes, setNotes] = useState("");
  const [sevierty, setSeverity] = useState("");
  const [selectedHealthIssueId, setSelectedHealthIssueId] = useState("");

  useEffect(() => {
    const fetchHealthIssues = async () => {
      try {
        const res = await fetch("https://camps.runasp.net/healthisuues", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setHealthIssues(data);
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
    console.log(newHealthEntry);

    try {
      const res = await fetch("https://camps.runasp.net/dpshealthissues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newHealthEntry),
      });

      if (res.ok) {
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

  const allColumns =
    list.length > 0
      ? Object.keys(list[0]).filter((key) => !columnsToExclude.includes(key))
      : [];
  const columns = columnOrder
    ? [
        ...columnOrder.filter((key) => allColumns.includes(key)),
        ...allColumns.filter((key) => !columnOrder.includes(key)),
      ]
    : allColumns;

  const [colWidths, setColWidths] = useState(() =>
    columns.reduce((acc, col) => {
      acc[col] = 150;
      return acc;
    }, {})
  );

  const tableRef = useRef(null);
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

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.3, ease: "easeOut" },
    }),
  };

  async function hundleConfirmation(id) {
    try {
      const res = await fetch(
        `https://camps.runasp.net/Confirmreliefregister/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(true),
        }
      );

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "تم التعديل",
          text: "تم تأكيد استلام المساعدة بنجاح",
          confirmButtonText: "رجوع",
        }).then(window.location.reload());
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
    <motion.div
      className="bg-gray-50 min-h-screen  py-12 px-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {list ? (
        <div className="container mx-auto">
          <motion.h1
            className="text-4xl font-extrabold text-center text-[#A6B78D] mb-10 tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            قائمة {tableName}
          </motion.h1>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="flex justify-between mb-6"
          >
            <div className="flex-1 max-w-[600px]  group mr-4">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-xl shadow focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none transition-all duration-300 placeholder:text-gray-400"
                placeholder="بحث بالاسم أو اسم المستخدم"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>

            <motion.div whileTap={{ scale: 0.95 }}>
              {(user.role == "SystemManager" && hidebtn) ||
              (user.role == "OrganizationManager" && hidebtn) ||
              (user.role == "CampManager" && hidebtn) ? (
                ""
              ) : (
                <Link
                  to="add"
                  className="bg-[#DC7F56] hover:bg-[#c46b45] text-white font-medium px-6 py-3 rounded-full shadow-lg transition-all duration-300"
                >
                  ➕ إضافة {tableName}
                </Link>
              )}
            </motion.div>
          </motion.div>

          <motion.div className="overflow-x-auto flex justify-center p-4">
            <table className="table-auto border-collapse  w-fit shadow-lg rounded-xl">
              <thead>
                <tr className="bg-[#A6B78D] text-white text-sm tracking-wider">
                  {columns.map((col) => (
                    <th
                      key={col}
                      style={{ width: colWidths[col] }}
                      className="relative py-3 px-6 border-r border-[#95a87f] group text-nowrap"
                    >
                      <div className="flex justify-between items-center">
                        <span>
                          {col.charAt(0).toUpperCase() + col.slice(1)}
                        </span>
                        <div
                          className="w-1 h-full bg-[#DC7F56] cursor-col-resize absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition"
                          onMouseDown={(e) => onMouseDown(e, col)}
                        />
                      </div>
                    </th>
                  ))}

                  {user.role === "CampManager" &&
                    tableName === "تسجيل المساعدات" && (
                      <th className="py-3 px-6 text-center">تأكيد الاستلام</th>
                    )}

                  {!hideactions || !hidebtn ? (
                    <th className="py-3 px-6 text-center">الإجراءات</th>
                  ) : null}
                </tr>
              </thead>

              <tbody className="text-gray-800 text-sm bg-white">
                <AnimatePresence>
                  {list.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      className="border-b border-gray-200 hover:bg-[#f5f8f2] transition-all"
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
                            width: colWidths[col],
                            maxWidth: colWidths[col],
                          }}
                          className="py-3 px-6 text-center truncate hover:whitespace-normal"
                          title={
                            typeof item[col] === "boolean"
                              ? item[col]
                                ? "Approved"
                                : "Not Approved"
                              : item[col]
                          }
                        >
                          {typeof item[col] === "boolean" ? (
                            <span
                              className={`font-bold text-lg ${
                                item[col] ? "text-green-600" : "text-red-500"
                              }`}
                            >
                              {item[col] ? "✔️" : "❌"}
                            </span>
                          ) : (
                            item[col]
                          )}
                        </td>
                      ))}

                      {/* Confirm Button */}
                      {user.role === "CampManager" && showconfirm && (
                        <td className="py-3 px-6 text-center">
                          <button
                            disabled={item.isRecived}
                            onClick={() => hundleConfirmation(item.id)}
                            className={`px-4 py-1 rounded transition font-semibold ${
                              item.isRecived
                                ? "text-gray-500 cursor-not-allowed"
                                : "text-[#DC7F56] hover:text-[#b55f3f]"
                            }`}
                          >
                            {item.isRecived
                              ? "تم تأكيد الاستلام"
                              : "تأكيد الاستلام"}
                          </button>
                        </td>
                      )}

                      {/* Action Buttons */}
                      {!hideactions || !hidebtn ? (
                        <td className="py-3 px-6 text-center">
                          {user.role === "CampManager" &&
                          tableName === "نازح" ? (
                            <ActionsDropDown
                              onEdit={() => navigate(`update/${item.id}`)}
                              onDelete={() => {
                                Swal.fire({
                                  title: `هل أنت متأكد؟`,
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
                                      "success"
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
                            <div className="flex justify-center items-center gap-4">
                              {(tableName === "تغييرات المخيمات" &&
                                item.approved === false) ||
                              user.role === "CampManager" ||
                              (user.role === "OrganizationManager" &&
                                !hideactions) ? (
                                <Link
                                  to={`update/${item.id}`}
                                  className="text-[#A6B78D] hover:text-[#6d7b52]"
                                  title="تعديل"
                                >
                                  <FaEdit size={18} />
                                </Link>
                              ) : null}

                              {onDelete ? (
                                <button
                                  onClick={() => {
                                    Swal.fire({
                                      title: `هل أنت متأكد؟`,
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
                                          "success"
                                        );
                                      }
                                    });
                                  }}
                                  className="text-[#DC7F56] hover:text-[#b55f3f]"
                                  title="حذف"
                                >
                                  <FaTrash size={18} />
                                </button>
                              ) : (
                                <Link
                                  to={`delete/${item.id}`}
                                  className="text-[#DC7F56] hover:text-[#b55f3f]"
                                  title="حذف"
                                >
                                  <FaTrash size={18} />
                                </Link>
                              )}
                            </div>
                          )}
                        </td>
                      ) : null}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </motion.div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-96">
          <h1 className="text-4xl font-bold">جاري التحميل...</h1>
        </div>
      )}

      {/* Modal for Add Health */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl p-6 w-[400px] shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-[#A6B78D]">
              إضافة حالة صحية
            </h2>
            <div className="mb-3">
              <label className="block font-semibold mb-1">الملاحظات:</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="mb-3">
              <label className="block font-semibold mb-1">الحدة:</label>
              <select
                value={sevierty}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="">اختر الحدة</option>
                <option value="Mild">خفيف</option>
                <option value="Moderate">متوسط</option>
                <option value="Severe">حاد</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">
                نوع الحالة الصحية:
              </label>
              <select
                value={selectedHealthIssueId}
                onChange={(e) => setSelectedHealthIssueId(e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="">اختر الحالة</option>
                {healthIssues.map((issue) => (
                  <option key={issue.id} value={issue.id}>
                    {issue.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                إلغاء
              </button>
              <button
                onClick={submitHealthIssue}
                className="px-4 py-2 bg-[#DC7F56] text-white rounded hover:bg-[#c46b45]"
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
