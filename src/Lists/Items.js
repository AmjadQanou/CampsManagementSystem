import React, { useContext, useEffect, useState } from "react";
import Table from "../CRUDComponents/Table";
import { AuthContext } from "../AuthProvider";
import { TokenContext } from "../TokenContext";
import { itemService } from "../services/apiService";

export default function Items() {
  const [items, setItems] = useState();
  const [query, setQuery] = useState("");
  const [hidebtn, sethidebtn] = useState(false);
  const [hideactions, sethideActions] = useState(false);
  const { user } = useContext(AuthContext);
  console.log(query);

  const columnsToExclude = ["reliefRegisters"];
  useEffect(() => {
    if (user.role === "CampManager") {
      sethideActions(true);
      sethidebtn(true);
    }
    const delayDebounce = setTimeout(() => {
      GetItems();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query, user.role]);
  // let token=localStorage.getItem("token")

  // const handleDelete = async (id) => {
  //   try {
  //     await fetch(`https://camps.runasp.net/item/${id}`, {
  //       method: 'DELETE',
  //     });
  //     setItems((prev) => prev.filter((dp) => dp.id !== id));
  //   } catch (error) {
  //     console.error('Failed to delete DP:', error);
  //     alert('حدث خطأ أثناء الحذف. الرجاء المحاولة مرة أخرى.');
  //   }
  // };

  async function GetItems() {
    try {
      let resp = await itemService.getAll();
      setItems(resp.data);
    } catch (er) {
      console.error(er);
      return null;
    }
  }
  return (
    <div>
      <Table
        tableName={"مساعدات"}
        list={items}
        columnsToExclude={columnsToExclude}
        searchValue={query}
        setSearchValue={setQuery}
        hidebtn={hidebtn}
        hideactions={hideactions}
      />
    </div>
  );
}
