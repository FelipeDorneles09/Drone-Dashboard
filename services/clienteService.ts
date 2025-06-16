// services/clienteService.js
import { db } from "@/app/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export const clienteService = {
  // Buscar todos os clientes
  async fetchClientes() {
    try {
      const querySnapshot = await getDocs(collection(db, "clientes"));
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data };
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      return { success: false, error, data: [] };
    }
  },

  // Adicionar novo cliente
  async addCliente(clienteData) {
    try {
      const { nome, email, telefone, endereco } = clienteData;
      const docRef = await addDoc(collection(db, "clientes"), {
        nome,
        email,
        telefone,
        endereco,
        dataCriacao: new Date(),
        ativo: true,
      });
      console.log("Cliente adicionado com ID:", docRef.id);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
      return { success: false, error };
    }
  },

  // Atualizar cliente
  async updateCliente(id, clienteData) {
    try {
      const { nome, email, telefone, endereco, ativo } = clienteData;
      await updateDoc(doc(db, "clientes", id), {
        nome,
        email,
        telefone,
        endereco,
        ativo,
      });
      return { success: true };
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      return { success: false, error };
    }
  },

  // Deletar cliente
  async deleteCliente(id) {
    try {
      await deleteDoc(doc(db, "clientes", id));
      return { success: true };
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      return { success: false, error };
    }
  },
};
