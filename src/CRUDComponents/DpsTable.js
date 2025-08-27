import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FaArrowDown, FaArrowRight, FaEdit, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { AuthContext } from "../AuthProvider";
import { TokenContext } from "../TokenContext";
import * as XLSX from "xlsx";
import Select from "react-select";

let token = localStorage.getItem("token");

export default function ReliefDPTable({
  tableName,
  list,
  columnOrder,
  columnsToExclude = [],
  url,
  hidebtn,
  hideactions,
  searchValue = "",
  setSearchValue = () => {},
}) {
  const parentDps = list.filter((item) => item.parentId === "0");
  const childDps = list.filter((item) => item.parentId !== "0");

  // Group children by parentId
  const familyMembers = childDps.reduce((acc, child) => {
    if (!acc[child.parentId]) {
      acc[child.parentId] = [];
    }
    acc[child.parentId].push(child);
    return acc;
  }, {});

  const allcolumns =
    list.length > 0
      ? Object.keys(list[0]).filter((key) => !columnsToExclude.includes(key))
      : [];
  const columns = columnOrder
    ? [
        ...columnOrder.filter((key) => allcolumns.includes(key)),
        ...allcolumns.filter((key) => !columnOrder.includes(key)),
      ]
    : allcolumns;

  const { user } = useContext(AuthContext);
  const [colWidths, setColWidths] = useState(() =>
    columns.reduce((acc, col) => {
      acc[col] = 150;
      return acc;
    }, {})
  );

  const [selectedRows, setSelectedRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [reliefs, setReliefs] = useState([]);
  const [selectedReliefId, setSelectedReliefId] = useState("");
  const [selectedReliefQty, setSelectedReliefQty] = useState(0);
  const [showChangeCampModal, setShowChangeCampModal] = useState(false);
  const [expandedParents, setExpandedParents] = useState({});

  const [displacementData, setDisplacementData] = useState({
    reason: "",
    campIdTo: "",
    dpsId: "",
    campIdFrom: "",
    approved: false,
  });
  const [camps, setCamps] = useState([]);
  const [fromCamp, setFromCamp] = useState([]);

  const [criteriaList, setCriteriaList] = useState([]);
  const [selectedCriteriaId, setSelectedCriteriaId] = useState("");

  // const token = localStorage.getItem('token');
  const { token } = useContext(TokenContext);

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

  const [selectedOption, setSelectedOption] = useState(null);

  const criteriaOptions = criteriaList.map((c) => ({
    value: c.id,
    label: c.description || `معيار رقم ${c.id}`,
  }));

  const allOptions = [{ value: "", label: "عرض الجميع" }, ...criteriaOptions];

  useEffect(() => {
    if (selectedCriteriaId === "") {
      setSelectedOption(allOptions[0]);
    } else if (selectedCriteriaId) {
      const found = allOptions.find((opt) => opt.value === selectedCriteriaId);
      if (found) setSelectedOption(found);
    }
  }, [selectedCriteriaId, criteriaList]);

  const customStyles = {
    control: (base) => ({
      ...base,
      borderColor: "#A6B78D",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#8ca170",
      },
      minHeight: "42px",
    }),
    option: (base, { isSelected }) => ({
      ...base,
      backgroundColor: isSelected ? "#A6B78D" : "white",
      color: isSelected ? "white" : "#333",
      "&:hover": {
        backgroundColor: "#f0f4e8",
      },
      textAlign: "right",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    placeholder: (base) => ({
      ...base,
      textAlign: "right",
    }),
    singleValue: (base) => ({
      ...base,
      textAlign: "right",
    }),
  };

  const onMouseMove = (e) => {
    if (!resizingCol.current) return;
    const newWidth = startWidth.current + (e.clientX - startX.current);
    setColWidths((prev) => ({
      ...prev,
      [resizingCol.current]: Math.max(newWidth, 60),
    }));
  };

  const handleDisplacementChange = (e) => {
    const { name, value } = e.target;
    setDisplacementData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleExpand = (parentId) => {
    setExpandedParents((prev) => ({
      ...prev,
      [parentId]: !prev[parentId],
    }));
  };

  const handleSelectRow = (id, isParent = false) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = [
        ...parentDps.map((p) => p.id),
        ...childDps.map((c) => c.id),
      ];
      setSelectedRows(allIds);
    } else {
      setSelectedRows([]);
    }
  };

  const isFamilySelected = (parentId) => {
    if (!familyMembers[parentId]) return selectedRows.includes(parentId);
    const familyIds = [parentId, ...familyMembers[parentId].map((m) => m.id)];
    return familyIds.every((id) => selectedRows.includes(id));
  };

  const isFamilyPartialSelected = (parentId) => {
    if (!familyMembers[parentId]) return false;
    const familyIds = [parentId, ...familyMembers[parentId].map((m) => m.id)];
    return (
      familyIds.some((id) => selectedRows.includes(id)) &&
      !familyIds.every((id) => selectedRows.includes(id))
    );
  };

  const handleOpenChangeCampModal = async () => {
    if (selectedRows.length !== 1) {
      Swal.fire({
        icon: "warning",
        title: "تنبيه!",
        text: "يجب اختيار مستفيد واحد فقط لتغيير مخيمه.",
      });
      return;
    }

    try {
      const campRes = await fetch("http://camps.runasp.net/DisCamps", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const fromCampRes = await fetch("http://camps.runasp.net/camp", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (campRes.ok && fromCampRes.ok) {
        const campData = await campRes.json();
        const fromData = await fromCampRes.json();
        setCamps(campData);
        setFromCamp(fromData);
        setDisplacementData((prev) => ({
          ...prev,
          dpsId: selectedRows[0],
        }));
        setShowChangeCampModal(true);
      }
    } catch (err) {
      console.error("Error loading camp data", err);
    }
  };

  const handleSubmitChangeCamp = async () => {
    if (displacementData.campIdFrom === displacementData.campIdTo) {
      Swal.fire({
        icon: "warning",
        title: "تنبيه!",
        text: "لا يمكن أن يكون المخيم الجديد نفس المخيم الحالي",
      });
      return;
    }

    try {
      displacementData.campIdFrom = fromCamp[0]?.id;
      console.log(displacementData);

      const res = await fetch("http://camps.runasp.net/displacement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(displacementData),
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "تم!",
          text: "تم تغيير المخيم بنجاح.",
        });
        setShowChangeCampModal(false);
        setDisplacementData({
          reason: "",
          campIdTo: "",
          dpsId: "",
          campIdFrom: "",
          approved: false,
        });
        setSelectedRows([]);
      } else {
        Swal.fire({
          icon: "error",
          title: "خطأ!",
          text: "فشل في تغيير المخيم. حاول مرة أخرى.",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchCriteria = async () => {
      try {
        const res = await fetch(
          "http://camps.runasp.net/distributioncriteria",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setCriteriaList(data);
        }
      } catch (err) {
        console.error("Failed to fetch criteria", err);
      }
    };

    fetchCriteria();
  }, [token]);
  const filteredParents = parentDps.filter((parent) => {
    const matchesSearch =
      searchValue === "" ||
      Object.values(parent).some(
        (val) =>
          val &&
          val.toString().toLowerCase().includes(searchValue.toLowerCase())
      );

    // If no criteria selected or parent is in filtered list
    return matchesSearch;
  });

  const [filteredList, setFilteredList] = useState(filteredParents);

  useEffect(() => {
    const fetchFilteredDps = async () => {
      if (!selectedCriteriaId) {
        setFilteredList(filteredParents);
        return;
      }

      console.log(selectedCriteriaId);

      try {
        const res = await fetch(
          `http://camps.runasp.net/distributioncriteria/dps/bycriteria/${selectedCriteriaId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setFilteredList(data);
        }
      } catch (err) {
        console.error("Error fetching filtered DPS", err);
      }
    };

    fetchFilteredDps();
  }, [selectedCriteriaId, list, token]);

  const onMouseUp = () => {
    resizingCol.current = null;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  // const handleSelectRow = (id) => {
  //   setSelectedRows(prev =>
  //     prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
  //   );
  // };

  // const handleSelectAll = (e) => {
  //   setSelectedRows(e.target.checked ? list.map(item => item.id) : []);
  // };

  const handleOpenReliefModal = async () => {
    try {
      const res = await fetch("http://camps.runasp.net/reliefregister", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setReliefs(data);
      setShowModal(true);
    } catch (err) {
      console.error("Failed to fetch reliefs:", err);
    }
  };

  const handleExportToExcel = () => {
    const selectedData = filteredList
      .filter((item) => selectedRows.includes(item.id))
      .map((item) => ({
        fname: item.fname,
        lname: item.lname,
        grandFatherName: item.grandFatherName,
        fatherName: item.fatherName,
        gender: item.gender,
        dob: item.dob,
        parentId: item.parentId,
        identityNo: item.identityNo,
        isItdivorceds: item.isItdivorceds,
        unrwaNo: item.unrwaNo,
        isItwidows: item.isItwidows,
        identificationnumber: item.identificationnumber,
        numOfFemales: item.numOfFemales,
        vulnerabilityLevel: item.vulnerabilityLevel,
        relationToFamilyHead: item.relationToFamilyHead,
        olderThan60: item.olderThan60,
        childrenyoungrethan3Y: item.childrenyoungrethan3Y,
        childrenyoungrethan9Y: item.childrenyoungrethan9Y,
      }));

    const worksheet = XLSX.utils.json_to_sheet(selectedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Selected Data");
    XLSX.writeFile(workbook, "selected_rows.xlsx");
  };

  const handleSendRelief = async () => {
    const selectedRelief = reliefs.find(
      (r) => r.id === parseInt(selectedReliefId)
    );
    if (!selectedRelief) return;

    if (selectedRows.length > selectedRelief.quantity) {
      Swal.fire({
        icon: "warning",
        title: "تحذير",
        text: `عدد المستفيدين أقل من كمية العنصر (${selectedRelief.quantity})`,
      });
      return;
    }

    console.log(selectedReliefId);
    console.log(selectedReliefQty);
    console.log(selectedRows);

    for (let c of selectedRows) {
      const bod = {
        quantity: 1,
        relifId: selectedRelief.id,
        dpsId: c,
        status: "Recived",
      };
      console.log(bod);

      const res = await fetch("http://camps.runasp.net/dpsreleif", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bod),
      });
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "تم الإرسال",
          text: "تم إرسال المساعدة بنجاح!",
        });
      } else {
        Swal.fire({
          icon: "warning",
          text: '"حدث خطا أثناء الارسال',
        });
      }
    }

    setShowModal(false);
    setSelectedReliefId("");
    setSelectedReliefQty(0);
    setSelectedRows([]);
  };

  return (
    <motion.div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="container mx-auto">
        <motion.h1 className="text-4xl font-extrabold text-center text-[#A6B78D] mb-10">
          قائمة {tableName}
        </motion.h1>

        <div
          className={
            user.role === "CampManager"
              ? "flex justify-between flex-wrap  items-center mb-6"
              : "flex justify-end  items-center mb-6"
          }
        >
          {user.role === "CampManager" && (
            <div className="flex gap-5 flex-wrap mb-5 lg:mt-0">
              <motion.button
                onClick={handleExportToExcel}
                disabled={selectedRows.length === 0}
                className={`px-6 py-3 rounded-full shadow-lg font-semibold transition-all duration-300 ${
                  selectedRows.length === 0
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                📤 تصدير إلى Excel
              </motion.button>
              <motion.button
                onClick={handleOpenReliefModal}
                disabled={selectedRows.length === 0}
                className={`px-6 py-3 rounded-full shadow-lg font-semibold transition-all duration-300 ${
                  selectedRows.length === 0
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                🎁 إرسال الإغاثة
              </motion.button>

              <motion.button
                onClick={handleOpenChangeCampModal}
                disabled={selectedRows.length !== 1}
                className={`px-6 py-3 rounded-full shadow-lg font-semibold transition-all duration-300 ${
                  selectedRows.length !== 1
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-orange-500 text-white hover:bg-orange-600"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                🔁 تغيير المخيم
              </motion.button>
            </div>
          )}

          {!hidebtn && (
            <motion.div whileTap={{ scale: 0.95 }}>
              <Link
                to="add"
                className="bg-[#DC7F56] mt-5 hover:bg-[#c46b45] text-white font-medium px-6 py-3 rounded-full shadow-lg transition-all duration-300"
              >
                ➕ إضافة {tableName}
              </Link>
            </motion.div>
          )}
        </div>

        <div className="flex justify-between items-center flex-wrap">
          <div className="mb-6 w-full max-w-xs">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              تصفية حسب معيار التوزيع
            </label>
            <Select
              options={allOptions}
              value={selectedOption}
              onChange={(selected) => {
                setSelectedOption(selected);
                setSelectedCriteriaId(selected ? selected.value : "");
              }}
              placeholder="ابحث عن معيار..."
              isSearchable
              isClearable
              styles={customStyles}
              className="text-right"
              noOptionsMessage={() => "لا توجد نتائج"}
              loadingMessage={() => "جاري التحميل..."}
            />
          </div>

          <div className=" max-w-[600px]  group mr-4">
            <input
              type="text"
              className=" w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-xl shadow focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none transition-all duration-300 placeholder:text-gray-400"
              placeholder="بحث بالاسم أو اسم المستخدم"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-3xl shadow-xl border border-gray-200">
          <table className="min-w-full table-fixed">
            <thead>
              <tr className="bg-[#A6B78D] text-white text-sm uppercase">
                <th className="py-4 px-6 text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      parentDps.length > 0 &&
                      selectedRows.length === parentDps.length + childDps.length
                    }
                    ref={(indeterminate) => {
                      if (indeterminate) {
                        indeterminate.indeterminate =
                          selectedRows.length > 0 &&
                          selectedRows.length <
                            parentDps.length + childDps.length;
                      }
                    }}
                  />
                </th>
                {columns.map((col) => (
                  <th
                    key={col}
                    style={{ width: colWidths[col] }}
                    className="relative py-4 px-6 border-r border-[#95a87f] group"
                  >
                    <div className="flex justify-between items-center">
                      <span>{col}</span>
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
                {filteredList.map((parent, index) => (
                  <React.Fragment key={parent.id}>
                    {/* Parent Row */}
                    <motion.tr
                      className="border-b border-gray-100 hover:bg-[#f9fbf7] bg-gray-50"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <td className="py-4 px-6 text-center">
                        <input
                          type="checkbox"
                          checked={isFamilySelected(parent.id)}
                          ref={(indeterminate) => {
                            if (indeterminate) {
                              indeterminate.indeterminate =
                                isFamilyPartialSelected(parent.id);
                            }
                          }}
                          onChange={() => handleSelectRow(parent.id, true)}
                        />
                      </td>
                      {columns.map((col) => (
                        <td
                          key={col}
                          className="py-4 px-6 text-center truncate font-medium"
                          style={{
                            width: colWidths[col],
                            maxWidth: colWidths[col],
                          }}
                          title={
                            typeof parent[col] === "boolean"
                              ? parent[col]
                                ? "Approved"
                                : "Not Approved"
                              : parent[col]
                          }
                        >
                          {typeof parent[col] === "boolean" ? (
                            <span
                              className={`font-bold text-lg ${
                                parent[col] ? "text-green-600" : "text-red-500"
                              }`}
                            >
                              {parent[col] ? "✔️" : "❌"}
                            </span>
                          ) : (
                            parent[col]
                          )}
                        </td>
                      ))}
                      {!hideactions && (
                        <td className="py-4 px-6 text-center">
                          <div className="flex justify-center gap-4">
                            <motion.div whileTap={{ scale: 0.9 }}>
                              <Link
                                to={`update/${parent.id}`}
                                className="text-[#A6B78D] hover:text-[#6d7b52]"
                              >
                                <FaEdit size={18} />
                              </Link>
                            </motion.div>
                            <motion.div whileTap={{ scale: 0.9 }}>
                              <Link
                                to={`delete/${parent.id}`}
                                className="text-[#DC7F56] hover:text-[#b55f3f]"
                              >
                                <FaTrash size={18} />
                              </Link>
                            </motion.div>
                            {familyMembers[parent.id] && (
                              <motion.div
                                whileTap={{ scale: 0.9 }}
                                onClick={() => toggleExpand(parent.id)}
                                className="cursor-pointer text-gray-500 hover:text-gray-700"
                              >
                                {expandedParents[parent.id] ? (
                                  <FaArrowDown />
                                ) : (
                                  <FaArrowRight />
                                )}
                              </motion.div>
                            )}
                          </div>
                        </td>
                      )}
                    </motion.tr>

                    {/* Family Members - Collapsible */}
                    {familyMembers[parent.id] && expandedParents[parent.id] && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td colSpan={columns.length + 2} className="p-0">
                          <div className="bg-gray-100 pl-12">
                            <table className="w-full">
                              <tbody>
                                {familyMembers[parent.id].map(
                                  (member, memberIndex) => (
                                    <motion.tr
                                      key={member.id}
                                      className={`border-b border-gray-200 hover:bg-gray-50 ${
                                        memberIndex ===
                                        familyMembers[parent.id].length - 1
                                          ? "border-b-0"
                                          : ""
                                      }`}
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ delay: memberIndex * 0.05 }}
                                    >
                                      <td className="py-3 px-6 text-center">
                                        <input
                                          type="checkbox"
                                          checked={selectedRows.includes(
                                            member.id
                                          )}
                                          onChange={() =>
                                            handleSelectRow(member.id)
                                          }
                                        />
                                      </td>
                                      {columns.map((col) => (
                                        <td
                                          key={col}
                                          className="py-3 px-6 text-center truncate"
                                          style={{
                                            width: colWidths[col],
                                            maxWidth: colWidths[col],
                                          }}
                                          title={
                                            typeof member[col] === "boolean"
                                              ? member[col]
                                                ? "Approved"
                                                : "Not Approved"
                                              : member[col]
                                          }
                                        >
                                          {typeof member[col] === "boolean" ? (
                                            <span
                                              className={`font-bold text-lg ${
                                                member[col]
                                                  ? "text-green-600"
                                                  : "text-red-500"
                                              }`}
                                            >
                                              {member[col] ? "✔️" : "❌"}
                                            </span>
                                          ) : (
                                            member[col]
                                          )}
                                        </td>
                                      ))}
                                      {!hideactions && (
                                        <td className="py-3 px-6 text-center">
                                          <div className="flex justify-center gap-4">
                                            <motion.div
                                              whileTap={{ scale: 0.9 }}
                                            >
                                              <Link
                                                to={`update/${member.id}`}
                                                className="text-[#A6B78D] hover:text-[#6d7b52]"
                                              >
                                                <FaEdit size={18} />
                                              </Link>
                                            </motion.div>
                                            <motion.div
                                              whileTap={{ scale: 0.9 }}
                                            >
                                              <Link
                                                to={`delete/${member.id}`}
                                                className="text-[#DC7F56] hover:text-[#b55f3f]"
                                              >
                                                <FaTrash size={18} />
                                              </Link>
                                            </motion.div>
                                          </div>
                                        </td>
                                      )}
                                    </motion.tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </React.Fragment>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {showChangeCampModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-96 space-y-4">
              <h2 className="text-xl font-bold text-orange-500">
                تغيير المخيم
              </h2>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  سبب التغيير
                </label>
                <input
                  type="text"
                  name="reason"
                  value={displacementData.reason}
                  onChange={handleDisplacementChange}
                  className="w-full border p-2 rounded"
                  placeholder="سبب الانتقال"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  المخيم الجديد
                </label>
                <select
                  name="campIdTo"
                  value={displacementData.campIdTo}
                  onChange={handleDisplacementChange}
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="" disabled>
                    اختر المخيم الجديد
                  </option>
                  {camps.map((camp) => (
                    <option key={camp.id} value={camp.id}>
                      {camp.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowChangeCampModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSubmitChangeCamp}
                  className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                >
                  تأكيد التغيير
                </button>
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-96 space-y-4">
              <h2 className="text-xl font-bold text-[#DC7F56]">
                إرسال الإغاثة
              </h2>
              <select
                className="w-full border p-2 rounded"
                value={selectedReliefId}
                onChange={(e) => {
                  const selected = reliefs.find(
                    (r) => r.id === parseInt(e.target.value)
                  );
                  setSelectedReliefId(e.target.value);
                  setSelectedReliefQty(selected?.quantity || 0);
                }}
              >
                <option value="">اختر الإغاثة</option>
                {reliefs.map((relief) => (
                  <option key={relief.id} value={relief.id}>
                    {relief.name} (الكمية: {relief.quantity})
                  </option>
                ))}
              </select>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSendRelief}
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
