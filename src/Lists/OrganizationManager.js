import React, { useContext, useEffect, useState, useCallback } from "react";
import Table from "../CRUDComponents/Table";
import { AuthContext } from "../AuthProvider";
import { organizationManagerService } from "../services/apiService";
import Swal from "sweetalert2";

export default function OrganizationManager() {
  const [orgmanagers, setOrgManagers] = useState(null);
  const [hidebtn, sethidebtn] = useState(false);
  const [hideactions, sethideActions] = useState(false);
  const { user } = useContext(AuthContext);

  const columnsToExclude = [
    "displacements",
    "reliefRequests",
    "passwordHash",
    "accessFailedCount",
    "lockoutEnabled",
    "twoFactorEnabled",
    "lockoutEnd",
    "phoneNumberConfirmed",
    "concurrencyStamp",
    "securityStamp",
    "emailConfirmed",
    "normalizedEmail",
    "normalizedUserName",
    "reliefRegisters",
    "distributionDocumentation",
    "organization",
    "notifications",
    "id",
    "role",
  ];

  const getorgManagers = useCallback(async () => {
    try {
      const response = await organizationManagerService.getAll();
      setOrgManagers(response.data);
    } catch (error) {
      console.error("Error fetching organization managers:", error);
      Swal.fire({
        icon: "error",
        title: "خطأ في جلب البيانات",
        text: "تعذر جلب بيانات مدراء المؤسسات",
      });
    }
  }, []);

  useEffect(() => {
    if (user?.role === "CampManager") {
      sethideActions(true);
      sethidebtn(true);
    }
    getorgManagers();
  }, [user?.role, getorgManagers]);

  /**
   * Toggle the Approved flag on an OrganiztionManager.
   * Calls PUT /organizationmanager/{id} with updated data
   */
  const handleToggleApproval = useCallback(
    async (managerId, currentApproved) => {
      const newValue = !currentApproved;
      const actionLabel = newValue ? "الموافقة" : "إلغاء الموافقة";

      const { isConfirmed } = await Swal.fire({
        title: `تأكيد ${actionLabel}`,
        text: newValue
          ? "سيتمكن مدير المؤسسة من الوصول إلى لوحة التحكم بعد الموافقة."
          : "سيفقد مدير المؤسسة صلاحية الوصول إلى لوحة التحكم.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: newValue ? "#A6B78D" : "#DC7F56",
        cancelButtonColor: "#9ca3af",
        confirmButtonText: newValue ? "✓ موافقة" : "✗ إلغاء الموافقة",
        cancelButtonText: "تراجع",
      });

      if (!isConfirmed) return;

      try {
        // Get manager from local state — no extra API call needed
        const manager = orgmanagers.find((m) => m.id === managerId);
        if (!manager) throw new Error("Manager not found in local state");

        const updateData = { ...manager, approved: newValue };

        await organizationManagerService.update(managerId, updateData);

        setOrgManagers((prev) =>
          prev.map((m) =>
            m.id === managerId ? { ...m, approved: newValue } : m,
          ),
        );

        Swal.fire({
          icon: "success",
          title: newValue ? "تمت الموافقة" : "تم إلغاء الموافقة",
          text: newValue
            ? "تم تفعيل حساب مدير المؤسسة بنجاح."
            : "تم إلغاء صلاحية مدير المؤسسة.",
          confirmButtonColor: "#A6B78D",
          confirmButtonText: "حسناً",
        });
      } catch (err) {
        console.error("Approval toggle failed:", err);
        Swal.fire({
          icon: "error",
          title: "فشل التعديل",
          text: "حدث خطأ أثناء تحديث حالة الموافقة. حاول مجدداً.",
          confirmButtonColor: "#DC7F56",
        });
      }
    },
    [orgmanagers], // ← add orgmanagers to dependency array
  );

  return (
    <div className="flex flex-col flex-1 w-full h-full bg-gray-50">
      {orgmanagers ? (
        <Table
          tableName={"مدراء المؤسسات"}
          list={orgmanagers}
          columnsToExclude={columnsToExclude}
          hidebtn={hidebtn}
          hideactions={hideactions}
          // Only SystemManager sees the approve/revoke toggle button
          onToggleApproval={
            user?.role === "SystemManager" ? handleToggleApproval : undefined
          }
        />
      ) : (
        <div className="flex items-center justify-center flex-1 min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-400 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}
