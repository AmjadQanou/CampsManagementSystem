import React, { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { TokenContext } from "../../TokenContext";

export default function DeleteCampManger() {
  const { id } = useParams();
  const navigate = useNavigate();
  // let token=localStorage.getItem("token")
  const { token } = useContext(TokenContext);

  useEffect(() => {
    const confirmAndDelete = async () => {
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

      try {
        const response = await fetch(
          `https://camps.runasp.net/campmanager/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          await Swal.fire({
            icon: "success",
            title: "تم الحذف",
            text: "تم حذف الطلب بنجاح.",
            confirmButtonText: "حسنًا",
          });
          navigate("..");
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "خطأ أثناء الحذف",
          text: error.message || "حدث خطأ غير متوقع",
        });
        console.error(error);
      }
    };

    confirmAndDelete();
  }, [id, navigate]);

  return null; // لا حاجة لعرض شيء في الصفحة
}
