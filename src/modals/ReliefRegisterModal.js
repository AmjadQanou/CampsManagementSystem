import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { AuthContext } from "../AuthProvider";
import {
  itemService,
  distributionCriteriaService,
  reliefRegisterService,
  notificationService,
} from "../services/apiService";

export default function ReliefRegisterModal({
  isOpen,
  onClose,
  onRegistered,
  reliefRequestItem,
}) {
  const { user } = useContext(AuthContext);

  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);

  const [criteria, setCriteria] = useState([]);
  const [loadingCriteria, setLoadingCriteria] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    quantity: 0,
    itemId: "",
    campManagerId: 0,
    orgManagerId: 0,
    distributionCriteriaId: "",
    IsRecived: false,
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchItems();
      fetchCriteria();
    }
  }, [isOpen]);

  // Pre-fill form when reliefRequestItem changes
  useEffect(() => {
    if (reliefRequestItem && isOpen) {
      const orgManagerId =
        user?.id || user?.userId || user?.nameid || user?.sub || 0;

      // campManagerUid IS the camp manager's id (GUID string)
      const campManagerId =
        reliefRequestItem.campManagerId ||
        reliefRequestItem.campManagerUid ||
        0;

      setFormData((prev) => ({
        ...prev,
        name: reliefRequestItem.reliefType || reliefRequestItem.name || "",
        quantity:
          reliefRequestItem.neededQuantity || reliefRequestItem.quantity || 0,
        campManagerId,
        orgManagerId,
        itemId: "",
        distributionCriteriaId: "",
      }));
    }
  }, [reliefRequestItem, isOpen, user]);

  const fetchItems = async () => {
    setLoadingItems(true);
    try {
      const res = await itemService.getAll();
      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch items:", err);
    } finally {
      setLoadingItems(false);
    }
  };

  const fetchCriteria = async () => {
    setLoadingCriteria(true);
    try {
      const res = await distributionCriteriaService.getAll();
      setCriteria(res.data);
      if (res.data && res.data.length > 0) {
        setFormData((prev) => ({
          ...prev,
          distributionCriteriaId: res.data[res.data.length - 1].id.toString(),
        }));
      }
    } catch (err) {
      console.error("Failed to fetch criteria:", err);
    } finally {
      setLoadingCriteria(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.itemId) {
      Swal.fire("تنبيه", "يرجى اختيار نوع المادة", "warning");
      return;
    }
    if (!formData.distributionCriteriaId) {
      Swal.fire("تنبيه", "يرجى اختيار معيار التوزيع", "warning");
      return;
    }
    if (!formData.quantity || Number(formData.quantity) <= 0) {
      Swal.fire("تنبيه", "يرجى إدخال كمية صحيحة", "warning");
      return;
    }

    setSubmitting(true);

    try {
      let campManagerId = formData.campManagerId;

      if (!campManagerId) {
        Swal.fire(
          "تنبيه",
          "تعذر تحديد مدير المخيم، يرجى التحقق من بيانات الطلب.",
          "warning",
        );
        setSubmitting(false);
        return;
      }

      const orgManagerId =
        formData.orgManagerId ||
        user?.id ||
        user?.userId ||
        user?.nameid ||
        user?.sub;

      if (!orgManagerId) {
        Swal.fire(
          "تنبيه",
          "تعذر تحديد مدير المنظمة، يرجى تسجيل الدخول مجدداً.",
          "warning",
        );
        setSubmitting(false);
        return;
      }

      const payload = {
        name: formData.name,
        quantity: Number(formData.quantity),
        itemId: Number(formData.itemId),
        campManagerId: formData.campManagerId,
        orgManagerId: orgManagerId,
        distributionCriteriaId: Number(formData.distributionCriteriaId),
        IsRecived: false,
      };

      const res = await reliefRegisterService.create(payload);

      if (res.status === 200 || res.status === 201) {
        try {
          await notificationService.create({
            message: `وصلتك مساعدة جديدة`,
            senderId: orgManagerId,
            receiverId: formData.campManagerId,
          });
        } catch (notifErr) {
          console.error("Failed to send notification:", notifErr);
        }

        Swal.fire({
          icon: "success",
          title: "تم التسجيل بنجاح!",
          text: "تم إنشاء سجل الإغاثة بناءً على بيانات الطلب ✅",
          confirmButtonText: "موافق",
          confirmButtonColor: "#A6B78D",
        });

        setFormData({
          name: "",
          quantity: 0,
          itemId: "",
          campManagerId: 0,
          orgManagerId: 0,
          distributionCriteriaId: "",
          IsRecived: false,
        });
        if (onRegistered) onRegistered(reliefRequestItem.id);
        else onClose();
      } else {
        throw new Error("فشل في الإضافة");
      }
    } catch (err) {
      console.error("Error creating relief register:", err);
      Swal.fire({
        icon: "error",
        title: "حدث خطأ!",
        text: "تعذر إنشاء سجل الإغاثة، يرجى المحاولة لاحقاً.",
        confirmButtonText: "رجوع",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const inputClass =
    "w-full border border-[#E8E4DE] rounded-lg px-3 py-2.5 text-sm text-[#2D2926] bg-white focus:outline-none focus:ring-2 focus:ring-[#DC7F56]/40 focus:border-[#DC7F56] transition";
  const labelClass = "block text-sm font-medium text-[#7A706A] mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <motion.div
        className="bg-white rounded-2xl border border-[#E8E4DE] shadow-2xl p-0 w-[480px] max-h-[90vh] overflow-hidden"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        dir="rtl"
      >
        {/* Header */}
        <div className="bg-gradient-to-l from-[#DC7F56] to-[#c46b45] px-6 py-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-xl">📋</span>
            تسجيل إغاثة جديد
          </h2>
          <p className="text-white/70 text-xs mt-1">
            تعبئة بيانات سجل الإغاثة بناءً على طلب المساعدة
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]"
        >
          {/* Name */}
          <div>
            <label className={labelClass}>الاسم</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="اسم المساعدة"
              required
              className={inputClass}
            />
          </div>

          {/* Quantity */}
          <div>
            <label className={labelClass}>الكمية</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="أدخل الكمية"
              min={1}
              required
              className={inputClass}
            />
          </div>

          {/* Item Dropdown */}
          <div>
            <label className={labelClass}>نوع المادة</label>
            <select
              name="itemId"
              value={formData.itemId}
              onChange={handleChange}
              required
              className={inputClass}
              disabled={loadingItems}
            >
              <option value="" disabled>
                {loadingItems ? "جاري التحميل..." : "اختر نوع المادة"}
              </option>
              {items.map((itm) => (
                <option key={itm.id} value={itm.id}>
                  {itm.category}
                </option>
              ))}
            </select>
          </div>

          {/* Distribution Criteria */}
          <div>
            <label className={labelClass}>معيار التوزيع</label>
            <select
              name="distributionCriteriaId"
              value={formData.distributionCriteriaId}
              onChange={handleChange}
              required
              className={inputClass}
              disabled={loadingCriteria}
            >
              <option value="" disabled>
                {loadingCriteria ? "جاري التحميل..." : "اختر معيار التوزيع"}
              </option>
              {criteria.map((c) => (
                <option key={c.id} value={c.id}>
                  عدد الأسرة: {c.minimumFamilySize}, المستوى:{" "}
                  {c.vulnerabilityLevel}
                </option>
              ))}
            </select>
          </div>

          {/* Pre-filled info badge */}
          {reliefRequestItem && (
            <div className="bg-[#F9F7F4] border border-[#E8E4DE] rounded-lg p-3 text-xs text-[#7A706A] space-y-1">
              <div className="font-semibold text-[#2D2926] mb-1">
                📌 بيانات مستخرجة من الطلب:
              </div>
              {reliefRequestItem.reliefType && (
                <div>
                  نوع المساعدة:{" "}
                  <span className="text-[#DC7F56] font-medium">
                    {reliefRequestItem.reliefType}
                  </span>
                </div>
              )}
              {reliefRequestItem.neededQuantity && (
                <div>
                  الكمية المطلوبة:{" "}
                  <span className="text-[#DC7F56] font-medium">
                    {reliefRequestItem.neededQuantity}
                  </span>
                </div>
              )}
              {reliefRequestItem.message && (
                <div>
                  الرسالة:{" "}
                  <span className="text-[#5a7a45] font-medium">
                    {reliefRequestItem.message}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-[#F0EDE9]">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-2.5 text-sm rounded-lg border border-[#E8E4DE] text-[#7A706A] hover:bg-[#F9F7F4] transition font-medium"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-5 py-2.5 text-sm rounded-lg text-white font-medium transition shadow-sm ${
                submitting
                  ? "bg-[#DC7F56]/50 cursor-not-allowed"
                  : "bg-[#DC7F56] hover:bg-[#c46b45] hover:shadow-md"
              }`}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                  جاري التسجيل...
                </span>
              ) : (
                "➕ تسجيل الإغاثة"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
