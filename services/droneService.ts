// services/droneService.js
import { db } from "@/app/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

export const droneService = {
  // Buscar drones (todos ou por cliente)
  async fetchDrones(clienteId = null) {
    try {
      let q;
      if (clienteId) {
        q = query(
          collection(db, "drones"),
          where("clienteId", "==", clienteId)
        );
      } else {
        q = collection(db, "drones");
      }

      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data };
    } catch (error) {
      console.error("Erro ao buscar drones:", error);
      return { success: false, error, data: [] };
    }
  },

  // Adicionar novo drone
  async addDrone(droneData) {
    try {
      const { modelo, numeroSerie, clienteId, status = "ativo" } = droneData;
      const docRef = await addDoc(collection(db, "drones"), {
        modelo,
        numeroSerie,
        clienteId,
        status,
        dataCriacao: new Date(),
        ultimaManutencao: null,
        horasVoo: 0,
      });
      console.log("Drone adicionado com ID:", docRef.id);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Erro ao adicionar drone:", error);
      return { success: false, error };
    }
  },

  // Atualizar drone
  async updateDrone(id, droneData) {
    try {
      const { modelo, numeroSerie, clienteId, status, horasVoo } = droneData;
      await updateDoc(doc(db, "drones", id), {
        modelo,
        numeroSerie,
        clienteId,
        status,
        horasVoo: horasVoo || 0,
      });
      return { success: true };
    } catch (error) {
      console.error("Erro ao atualizar drone:", error);
      return { success: false, error };
    }
  },

  // Deletar drone
  async deleteDrone(id) {
    try {
      await deleteDoc(doc(db, "drones", id));
      return { success: true };
    } catch (error) {
      console.error("Erro ao excluir drone:", error);
      return { success: false, error };
    }
  },
};
