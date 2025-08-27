import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function HealthIssueModal({
  isOpen,
  onClose,
  onSubmit,
  selectedDPId,
}) {
  const [healthIssues, setHealthIssues] = useState([]);
  const [severity, setSeverity] = useState("متوسطة");
  const [healthIssueId, setHealthIssueId] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchHealthIssues();
    }
  }, [isOpen]);

  const fetchHealthIssues = async () => {
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch("http://camps.runasp.net/healthisuues", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resp.ok) throw new Error("Failed to fetch health issues");
      const data = await resp.json();
      setHealthIssues(data);
    } catch (err) {
      console.error(err);
      Swal.fire("خطأ", "فشل تحميل المشاكل الصحية", "error");
    }
  };

  const handleSubmit = () => {
    if (!healthIssueId) {
      Swal.fire("تحذير", "يرجى اختيار مشكلة صحية", "warning");
      return;
    }
    onSubmit({
      dpId: selectedDPId,
      severity,
      healthIssueId,
      notes,
    });
    setNotes("");
    setHealthIssueId("");
    setSeverity("متوسطة");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-2xl w-[400px] shadow-xl">
        <h2 className="text-xl font-bold text-[#A6B78D] mb-4 text-center">
          إضافة مشكلة صحية
        </h2>

        <div className="mb-4">
          <label className="block mb-1 text-sm">ملاحظات</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A6B78D]"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm">شدة المشكلة</label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="طفيفة">طفيفة</option>
            <option value="متوسطة">متوسطة</option>
            <option value="شديدة">شديدة</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm">المشكلة الصحية</label>
          <select
            value={healthIssueId}
            onChange={(e) => setHealthIssueId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">-- اختر --</option>
            {healthIssues.map((hi) => (
              <option key={hi.id} value={hi.id}>
                {hi.issueName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            className="bg-[#DC7F56] text-white px-4 py-2 rounded-lg hover:bg-[#c46b45]"
          >
            إضافة
          </button>
        </div>
      </div>
    </div>
  );
}
