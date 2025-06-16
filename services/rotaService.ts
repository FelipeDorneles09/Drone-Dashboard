// services/rotaService.js
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
  orderBy,
} from "firebase/firestore";

export const rotaService = {
  // Buscar rotas (todas ou por drone)
  async fetchRotas(droneId = null) {
    try {
      let q;
      if (droneId) {
        q = query(
          collection(db, "rotas"),
          where("droneId", "==", droneId),
          orderBy("dataVoo", "desc")
        );
      } else {
        q = query(collection(db, "rotas"), orderBy("dataVoo", "desc"));
      }

      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data };
    } catch (error) {
      console.error("Erro ao buscar rotas:", error);
      return { success: false, error, data: [] };
    }
  },

  // Adicionar nova rota
  async addRota(rotaData) {
    try {
      const { droneId, nomeRota, coordenadas, duracao, altitude } = rotaData;
      const docRef = await addDoc(collection(db, "rotas"), {
        droneId,
        nomeRota,
        coordenadas,
        duracao,
        altitude,
        dataVoo: new Date(),
        status: "planejada",
        distanciaTotal: 0,
        observacoes: "",
      });
      console.log("Rota adicionada com ID:", docRef.id);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Erro ao adicionar rota:", error);
      return { success: false, error };
    }
  },

  // Atualizar rota
  async updateRota(id, rotaData) {
    try {
      const { droneId, nomeRota, coordenadas, duracao, altitude, status } =
        rotaData;
      await updateDoc(doc(db, "rotas", id), {
        droneId,
        nomeRota,
        coordenadas,
        duracao,
        altitude,
        status,
      });
      return { success: true };
    } catch (error) {
      console.error("Erro ao atualizar rota:", error);
      return { success: false, error };
    }
  },

  // Deletar rota
  async deleteRota(id) {
    try {
      await deleteDoc(doc(db, "rotas", id));
      return { success: true };
    } catch (error) {
      console.error("Erro ao excluir rota:", error);
      return { success: false, error };
    }
  },
};
