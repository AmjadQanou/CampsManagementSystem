import React, { useContext, useEffect, useState } from "react";
import Table from "../CRUDComponents/Table";
import { TokenContext } from "../TokenContext";

export default function CampManagers() {
  const [campmanagers, setCampManagers] = useState([]);
  const [query, setQuery] = useState("");
  const columnsToExclude = [
    "displacements",
    "reliefRequests",
    "distributionDocumentation",
    "camp",
    "notifications",
  ];
  // const token = localStorage.getItem("token");
  const { token } = useContext(TokenContext);

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
      let url = await "http://camps.runasp.net/campmanagers";
      if (searchQuery) {
        url = `http://camps.runasp.net/campmanagers/search?query=${encodeURIComponent(
          searchQuery
        )}`;
      }

      const resp = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (resp.ok) {
        const data = await resp.json();
        setCampManagers(data);
      } else {
        throw new Error("Error " + resp.status);
      }
    } catch (er) {
      console.error(er);
    }
  };

  return (
    campmanagers && (
      <div>
        <Table
          tableName={"مدير مخيم"}
          list={campmanagers}
          columnsToExclude={columnsToExclude}
          searchValue={query}
          setSearchValue={setQuery}
        />
      </div>
    )
  );
}
