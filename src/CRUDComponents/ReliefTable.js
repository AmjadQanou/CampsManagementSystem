import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaShower, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../AuthProvider";
import { TokenContext } from "../TokenContext";

export default function ReliefTable({
  tableName,
  list,
  columnsToExclude,
  url,
  hidebtn,
  hideactions,
}) {
  const columns =
    list.length > 0
      ? Object.keys(list[0]).filter((key) => !columnsToExclude.includes(key))
      : [];
  const { user } = useContext(AuthContext);

  const [colWidths, setColWidths] = useState(() =>
    columns.reduce((acc, col) => {
      acc[col] = 150;
      return acc;
    }, {})
  );
  // let token=localStorage.getItem("token")
  const { token } = useContext(TokenContext);

  const [selectedRows, setSelectedRows] = useState([]);
  const resizingCol = useRef(null);
  const startX = useRef(null);
  const startWidth = useRef(null);
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
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(list.map((item) => item.id));
    } else {
      setSelectedRows([]);
    }
  };
  async function GetOrgannizations(url) {
    try {
      let resp = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (resp.ok) {
        let data = await resp.json();
        await setOrg((pre) => [...pre, data]);
        console.log(data);
        console.log("ok");
      } else throw new Error("error" + resp.status);
    } catch (er) {
      console.error(er);
      console.log("notok");

      return null;
    }
  }
  useEffect(() => {
    GetOrgannizations("https://camps.runasp.net/organization");
  }, [0]);

  const handleSendHelp = async () => {
    try {
      const itemRes = await fetch("https://camps.runasp.net/item", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const criteriaRes = await fetch(
        "https://camps.runasp.net/distributioncriteria",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setItems(await itemRes.json());
      setCriteria(await criteriaRes.json());
      console.log(items);

      setShowModal(true);
    } catch (err) {
      console.error("Failed to fetch form data", err);
    }
  };

  async function postNotification(campData) {
    console.log(org);

    const notification = {
      message: `  ${org[0].name} وصلتك مساعدة من مؤسسة  `,
      senderId: parseInt(1),
      receiverId: parseInt(campData.campManagerId),
    };
    console.log(notification);

    const resp = await fetch("https://camps.runasp.net/notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(notification),
    });
  }

  const handleReliefSubmit = async () => {
    for (let campId of selectedRows) {
      try {
        const campRes = await fetch(`https://camps.runasp.net/camp/${campId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!campRes.ok) throw new Error(`Failed to fetch camp ${campId}`);

        const campData = await campRes.json();
        const campManagerId = campData.campManagerId;

        const bod = {
          quantity: parseInt(form.quantity),
          itemId: parseInt(form.itemId),
          name: form.name,
          campManagerId: campManagerId,
          orgManagerId: user.id,
          distributionCriteriaId: parseInt(form.distributionCriteriaId),
        };

        const res = await fetch("https://camps.runasp.net/reliefregister", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bod),
        });

        if (res.ok) {
          await postNotification(campData);
          console.log(`Relief item submitted for camp ${campId}`);
        } else {
          console.log(`Failed to submit relief item for camp ${campId}`);
        }
      } catch (err) {
        console.error("Error submitting relief:", err);
      }
    }

    setShowModal(false);
    setSelectedRows([]);
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
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
  };

  return (
    <motion.div
      className="bg-gray-50 min-h-screen py-12 px-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto">
        <motion.h1 className="text-4xl font-extrabold text-center text-[#A6B78D] mb-10">
          قائمة {tableName}
        </motion.h1>

        {user.role === "OrganizationManager" ? (
          <div className="flex justify-between items-center mb-6">
            <motion.button
              onClick={handleSendHelp}
              disabled={selectedRows.length === 0}
              className={`px-6 py-3 rounded-full shadow-lg font-semibold transition-all duration-300 ${
                selectedRows.length === 0
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              🆘 إرسال مساعدة
            </motion.button>

            <motion.div whileTap={{ scale: 0.95 }}>
              {user.role == "OrganizationManager" && hidebtn ? (
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
          </div>
        ) : (
          <div className="flex justify-end items-center mb-6">
            <motion.div whileTap={{ scale: 0.95 }}>
              <Link
                to="add"
                className="bg-[#DC7F56] hover:bg-[#c46b45] text-white font-medium px-6 py-3 rounded-full shadow-lg transition-all duration-300"
              >
                ➕ إضافة {tableName}
              </Link>
            </motion.div>
          </div>
        )}

        <motion.div className="overflow-x-auto bg-white rounded-3xl shadow-xl border border-gray-200">
          <table className="min-w-full table-fixed">
            <thead>
              <tr className="bg-[#A6B78D] text-white text-sm uppercase">
                <th className="py-4 px-6 text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedRows.length === list.length}
                  />
                </th>
                {columns.map((col) => (
                  <th
                    key={col}
                    style={{ width: colWidths[col] }}
                    className="relative py-4 px-6 border-r border-[#95a87f] group"
                  >
                    <div className="flex justify-between items-center">
                      <span>{col.charAt(0).toUpperCase() + col.slice(1)}</span>
                      <div
                        className="w-1 h-full bg-[#DC7F56] cursor-col-resize absolute top-0 right-0 opacity-0 group-hover:opacity-100"
                        onMouseDown={(e) => onMouseDown(e, col)}
                      />
                    </div>
                  </th>
                ))}
                <th className="py-4 px-6 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              <AnimatePresence>
                {list.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    className="border-b border-gray-100 hover:bg-[#f9fbf7]"
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0 }}
                    variants={rowVariants}
                  >
                    <td className="py-4 px-6 text-center">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(item.id)}
                        onChange={() => handleSelectRow(item.id)}
                      />
                    </td>
                    {columns.map((col) => (
                      <td
                        key={col}
                        className="py-4 px-6 text-center truncate"
                        style={{
                          width: colWidths[col],
                          maxWidth: colWidths[col],
                        }}
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
                    {user.role == "OrganizationManager" && hideactions ? (
                      <Link
                        to={`show/${item.id}`}
                        className="text-[#A6B78D] hover:text-[#6d7b52]"
                      >
                        <FaShower size={18} />
                      </Link>
                    ) : (
                      <td className="py-4 px-6 text-center">
                        <div className="flex justify-center gap-4">
                          <motion.div whileTap={{ scale: 0.9 }}>
                            <Link
                              to={`update/${item.id}`}
                              className="text-[#A6B78D] hover:text-[#6d7b52]"
                            >
                              <FaEdit size={18} />
                            </Link>
                          </motion.div>
                          <motion.div whileTap={{ scale: 0.9 }}>
                            <Link
                              to={`delete/${item.id}`}
                              className="text-[#DC7F56] hover:text-[#b55f3f]"
                            >
                              <FaTrash size={18} />
                            </Link>
                          </motion.div>
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </motion.div>

        <div className="mt-6 text-sm text-gray-700 text-center">
          Selected IDs: {selectedRows.join(", ") || "None"}
        </div>

        {showModal && items && criteria && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-96 space-y-4">
              <h2 className="text-xl font-bold text-[#DC7F56]">إرسال مساعدة</h2>
              <input
                type="text"
                placeholder="الاسم"
                className="w-full border p-2 rounded"
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
              <select
                className="w-full border p-2 rounded"
                onChange={(e) =>
                  setForm((f) => ({ ...f, itemId: e.target.value }))
                }
              >
                <option>اختر العنصر</option>
                {items.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </select>
              <select
                className="w-full border p-2 rounded"
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    distributionCriteriaId: e.target.value,
                  }))
                }
              >
                <option>اختر معيار التوزيع</option>
                {criteria.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.description}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="الكمية"
                className="w-full border p-2 rounded"
                onChange={(e) =>
                  setForm((f) => ({ ...f, quantity: e.target.value }))
                }
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleReliefSubmit}
                  className="px-4 py-2 bg-[#A6B78D] text-white rounded hover:bg-[#8ca170]"
                >
                  إرسال
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
