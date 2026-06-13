import { useContext, useEffect } from "react";
import { createContext, useState } from "react";
import { TokenContext } from "./TokenContext";
import {
  campService,
  campManagerService,
  displacementService,
} from "./services/apiService";

export let DataContext = createContext();
export function DataContextProvider(props) {
  const { token } = useContext(TokenContext);

  const [Camps, setCamps] = useState();
  const [CampManagers, setCampManagers] = useState();
  const [displacments, setDisplacments] = useState();

  useEffect(() => {
    async function GetAll() {
      await getCamps();
    }
    GetAll();
  }, [token]);

  async function getCamps() {
    try {
      const response = await campService.getAllOtherCamps();
      if (response.data) {
        setCamps(response.data);
      }
    } catch (error) {
      console.error("Error fetching camps:", error);
      return null;
    }
  }

  async function getCampManagers() {
    try {
      const response = await campManagerService.getAll();
      if (response.data) {
        setCampManagers(response.data);
      }
    } catch (error) {
      console.error("Error fetching camp managers:", error);
      return null;
    }
  }

  async function getDisplacments() {
    try {
      const response = await displacementService.getAll();
      if (response.data) {
        setDisplacments(response.data);
      }
    } catch (error) {
      console.error("Error fetching displacements:", error);
      return null;
    }
  }

  return (
    <DataContext.Provider value={{ Camps, CampManagers, displacments }}>
      {props.children}
    </DataContext.Provider>
  );
}
