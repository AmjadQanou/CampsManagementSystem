import React, { useEffect, useState } from "react";
import Table from "../CRUDComponents/Table";
import Swal from "sweetalert2";
import { campManagerService } from "../services/apiService";

export default function CampManagers() {
  const [campmanagers, setCampManagers] = useState();
  const [query, setQuery] = useState("");

  const columnsToExclude = [
    "displacements",
    "reliefRequests",
    "distributionDocumentation",
    "camp",
    "notifications",
    "phoneNumber",
    "phoneNumberConfirmed",
    "twoFactorEnabled",
    "lockoutEnd",
    "lockoutEnabled",
    "accessFailedCount",
    "passwordHash",
    "securityStamp",
    "concurrencyStamp",
    "normalizedEmail",
    "normalizedUserName",
    "emailConfirmed",
  ];

  useEffect(() => {
    fetchCampManagers();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCampManagers(query);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const fetchCampManagers = async (searchQuery = "") => {
    try {
      let response;
      if (searchQuery) {
        response = await campManagerService.search(searchQuery);
      } else {
        response = await campManagerService.getAll();
      }
      setCampManagers(response.data);
    } catch (error) {
      console.error("Error fetching camp managers:", error);
    }
  };

  const handleToggleApproval = async (id, currentApproved) => {
    try {
      // Fetch the full manager object first to avoid partial updates
      const getResponse = await campManagerService.getById(id);
      const managerData = getResponse.data;

      // Toggle the approved field
      const updatedManager = { ...managerData, approved: !currentApproved };

      await campManagerService.update(id, updatedManager);

      await Swal.fire({
        icon: "success",
        title: !currentApproved ? "تم التفعيل" : "تم إلغاء التفعيل",
        text: !currentApproved
          ? "تم تفعيل مدير المخيم بنجاح."
          : "تم إلغاء تفعيل مدير المخيم بنجاح.",
        confirmButtonText: "حسناً",
        confirmButtonColor: "#A6B78D",
      });
      fetchCampManagers(query);
    } catch (error) {
      console.error("Error toggling approval:", error);
      Swal.fire({
        icon: "error",
        title: "حدث خطأ",
        text: "تعذر تغيير حالة المدير، يرجى المحاولة لاحقًا.",
      });
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full h-full bg-gray-50">
      {campmanagers ? (
        <Table
          tableName={"مدير مخيم"}
          list={campmanagers}
          columnsToExclude={columnsToExclude}
          searchValue={query}
          setSearchValue={setQuery}
          onToggleApproval={handleToggleApproval}
        />
      ) : (
        <div className="flex items-center justify-center flex-1 min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-400 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}
