import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function DeleteNotification() {
  const { id } = useParams();
  const navigate = useNavigate();
  let token = localStorage.getItem("token");

  useEffect(() => {
    const confirmAndDelete = async () => {
      // عرض نافذة التأكيد
      const result = await Swal.fire({
        title: "هل أنت متأكد؟",
        text: "لا يمكنك التراجع بعد الحذف!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "نعم، احذفه",
        cancelButtonText: "إلغاء",
      });

      // التأكد من أن المستخدم أكد الحذف
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `http://camps.runasp.net/notification/${id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            // إذا تم الحذف بنجاح، عرض رسالة تأكيد
            await Swal.fire({
              icon: "success",
              title: "تم الحذف",
              text: "تم حذف الاشعار بنجاح.",
              confirmButtonText: "حسنًا",
            });
            // توجيه المستخدم إلى صفحة الإشعارات بعد الحذف
            navigate("/notifications");
          } else {
            // في حالة فشل الحذف، عرض رسالة خطأ
            const errorText = await response.text();
            Swal.fire({
              icon: "error",
              title: "فشل في الحذف",
              text: errorText || "حدث خطأ غير متوقع",
            });
          }
        } catch (error) {
          // في حالة وجود خطأ أثناء الطلب، عرض رسالة خطأ
          Swal.fire({
            icon: "error",
            title: "خطأ أثناء الحذف",
            text: error.message || "حدث خطأ غير متوقع",
          });
          console.error(error);
        }
      } else {
        // إذا لم يؤكد المستخدم الحذف، يتم إلغاء العملية
        console.log("تم إلغاء الحذف");
      }
    };

    // استدعاء دالة التأكيد والحذف
    confirmAndDelete();
  }, [id, navigate, token]);

  return null; // لا حاجة لعرض شيء في الصفحة
}
