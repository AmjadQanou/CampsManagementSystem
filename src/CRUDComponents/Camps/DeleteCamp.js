import React, { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { campService } from "../../services/apiService";

export default function DeleteCamp() {
  const { id } = useParams();
  const navigate = useNavigate();

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

      if (!result.isConfirmed) return;

      try {
        await campService.delete(id);

        await Swal.fire({
          icon: "success",
          title: "تم الحذف",
          text: "تم حذف المخيم بنجاح.",
          confirmButtonText: "حسنًا",
        });
        navigate("..");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "خطأ أثناء الحذف",
          text: error?.response?.data || "حدث خطأ غير متوقع",
        });
        console.error(error);
      }
    };

    confirmAndDelete();
  }, [id, navigate]);

  return null;
}
