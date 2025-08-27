import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import Swal from "sweetalert2";

export default function EditNotification() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [message, setMessage] = useState("");

  useEffect(() => {
    // جلب بيانات الإشعار الحالي
    const fetchNotification = async () => {
      try {
        const res = await fetch(`http://camps.runasp.net/notifications/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMessage(data.message);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotification();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedNotification = {
      message,
      senderId: parseInt(user.id),
    };

    const res = await fetch(`http://camps.runasp.net/notification/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedNotification),
    });

    if (res.ok) {
      Swal.fire("تم التحديث", "تم تعديل الإشعار بنجاح ", "success");
      navigate("/notifications");
    } else {
      Swal.fire("خطأ", "فشل في تعديل الإشعار ", "error");
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto" dir="rtl">
      <h2 className="text-2xl font-bold mb-4 text-center text-[#DC7F56]">
        تعديل نص الإشعار
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium">الرسالة</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="4"
            className="w-full border p-2 rounded bg-white focus:ring-2 focus:ring-[#DC7F56]"
            placeholder="اكتب نص الإشعار هنا..."
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-[#DC7F56] text-white py-2 rounded hover:bg-[#c46b45]"
        >
          💾 تعديل الإشعار
        </button>
      </form>
    </div>
  );
}
