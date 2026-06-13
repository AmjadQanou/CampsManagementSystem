import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthProvider";
import { TokenContext } from "../TokenContext";
import { OrgStatusContext } from "../Context/OrgStatusContext";
import { organizationService } from "../services/apiService";

export default function RegisterOrg() {
  const { user } = useContext(AuthContext);
  const { token } = useContext(TokenContext);
  const { hasOrg, org, refetch } = useContext(OrgStatusContext);
  const navigate = useNavigate();

  const isUpdateMode = hasOrg && org;

  const [form, setForm] = useState({ name: "", location: "", category: "" });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isUpdateMode) {
      setForm({
        name: org.name || "",
        location: org.location || "",
        category: org.category || "",
      });
    }
  }, [isUpdateMode, org]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  /**
   * After a NEW org is registered, set the manager's Approved flag to false
   * (pending). The SystemManager will flip it to true via the approval endpoint.
   *
   * PATCH /organizationmanager/{id}/approve   body: false
   */
  const setPendingApproval = async () => {
    try {
      await fetch(
        `https://localhost:5000/organizationmanager/${user.id}/approve`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(false),
        },
      );
    } catch (err) {
      // Non-fatal — the org was created; approval state defaults to false anyway
      console.warn("Could not set pending approval state:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isUpdateMode && !file) {
      setError("يرجى رفع صورة أو ملف للمؤسسة");
      return;
    }

    setSubmitting(true);

    try {
      // Build FormData — backend reads via ReadFormAsync()
      const formData = new FormData();
      formData.append("Name", form.name);
      formData.append("Location", form.location);
      formData.append("Category", form.category);
      formData.append("OrganizationManagerId", user.id);
      if (file) formData.append("file", file);
      if (isUpdateMode) formData.append("id", org.id);

      if (isUpdateMode) {
        await organizationService.update(org.id, formData);
      } else {
        // 1. Create the org
        await organizationService.create(formData);
        // 2. Mark the manager as pending approval (Approved = false)
        await setPendingApproval();
      }

      await refetch();
      setSuccess(true);

      if (isUpdateMode) {
        setTimeout(() => navigate("/dashboard/myorg"), 1500);
      }
    } catch (err) {
      const msg =
        err?.response?.data ||
        err?.response?.statusText ||
        err?.message ||
        "فشل في حفظ بيانات المؤسسة";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setSubmitting(false);
    }
  };

  // ── After first-time registration: waiting screen ─────────────────────────
  if (success && !isUpdateMode) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f8f8] to-[#f0f5ec] p-6"
        dir="rtl"
      >
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#2c3e50] mb-3">
            تم تسجيل المؤسسة بنجاح
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            تم إرسال طلب تسجيل مؤسستك إلى مدير النظام.
            <br />
            ستتمكن من الوصول إلى لوحة التحكم بعد موافقته.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-blue-500 text-sm">
            <span className="animate-pulse">⏳</span>
            <span>في انتظار الموافقة...</span>
          </div>
        </div>
      </div>
    );
  }

  // ── Register / Update form ────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[#f8f8f8] to-[#f0f5ec] p-6 flex items-start justify-center"
      dir="rtl"
    >
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2c3e50]">
            {isUpdateMode ? "تعديل بيانات المؤسسة" : "تسجيل مؤسستك"}
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            {isUpdateMode
              ? "يمكنك تحديث بيانات مؤسستك في أي وقت"
              : "أدخل بيانات مؤسستك ليقوم مدير النظام بمراجعتها والموافقة عليها"}
          </p>
        </div>

        {!isUpdateMode && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 flex items-start gap-3 text-sm text-amber-700">
            <svg
              className="w-5 h-5 mt-0.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              بعد التسجيل، ستظل قائمة التنقل الجانبية معطّلة حتى يوافق مدير
              النظام على طلبك.
            </span>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم المؤسسة <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="مثال: منظمة الإغاثة الإنسانية"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#DC7F56]/40 focus:border-[#DC7F56] transition"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الموقع / العنوان <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                placeholder="المدينة، المنطقة"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#DC7F56]/40 focus:border-[#DC7F56] transition"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تصنيف المؤسسة <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                placeholder="مثال: إغاثة، صحة، تعليم..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#DC7F56]/40 focus:border-[#DC7F56] transition"
              />
            </div>

            {/* File */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                صورة أو ملف المؤسسة{" "}
                {!isUpdateMode ? (
                  <span className="text-red-500">*</span>
                ) : (
                  <span className="text-gray-400 text-xs">
                    (اختياري — اتركه فارغاً للإبقاء على الحالي)
                  </span>
                )}
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.jfif,.xlsx"
                onChange={(e) => setFile(e.target.files[0] || null)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#DC7F56]/40 focus:border-[#DC7F56] transition file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-[#DC7F56]/10 file:text-[#DC7F56] cursor-pointer"
              />
              <p className="text-xs text-gray-400 mt-1">
                الصيغ المدعومة: jpg، jpeg، png، jfif، xlsx — الحجم الأقصى 5MB
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            {/* Success (update mode) */}
            {success && isUpdateMode && (
              <div className="bg-green-50 border border-green-200 text-green-600 text-sm rounded-xl px-4 py-3">
                ✓ تم تحديث بيانات المؤسسة بنجاح
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-[#DC7F56] hover:bg-[#c96e45] text-white font-medium py-2.5 rounded-xl text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting
                  ? "جاري الحفظ..."
                  : isUpdateMode
                    ? "حفظ التعديلات"
                    : "تسجيل المؤسسة"}
              </button>
              {isUpdateMode && (
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/myorg")}
                  className="px-5 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium py-2.5 rounded-xl text-sm transition"
                >
                  إلغاء
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
