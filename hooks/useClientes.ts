// hooks/useClientes.js
import { useState, useEffect } from "react";
import { clienteService } from "../services/clienteService";

export const useClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carregar clientes
  const loadClientes = async () => {
    setLoading(true);
    setError(null);

    const result = await clienteService.fetchClientes();

    if (result.success) {
      setClientes(result.data);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  // Adicionar cliente
  const addCliente = async (clienteData) => {
    setLoading(true);
    setError(null);

    const result = await clienteService.addCliente(clienteData);

    if (result.success) {
      await loadClientes(); // Recarregar lista
      return { success: true, message: "Cliente adicionado com sucesso!" };
    } else {
      setError(result.error);
      return { success: false, message: "Erro ao adicionar cliente!" };
    }
  };

  // Atualizar cliente
  const updateCliente = async (id, clienteData) => {
    setLoading(true);
    setError(null);

    const result = await clienteService.updateCliente(id, clienteData);

    if (result.success) {
      await loadClientes(); // Recarregar lista
      return { success: true, message: "Cliente atualizado com sucesso!" };
    } else {
      setError(result.error);
      return { success: false, message: "Erro ao atualizar cliente!" };
    }
  };

  // Deletar cliente
  const deleteCliente = async (id) => {
    setLoading(true);
    setError(null);

    const result = await clienteService.deleteCliente(id);

    if (result.success) {
      await loadClientes(); // Recarregar lista
      return { success: true, message: "Cliente excluído com sucesso!" };
    } else {
      setError(result.error);
      return { success: false, message: "Erro ao excluir cliente!" };
    }
  };

  // Buscar cliente por ID
  const getClienteById = (id) => {
    return clientes.find((cliente) => cliente.id === id);
  };

  // Buscar nome do cliente por ID
  const getClienteNome = (id) => {
    const cliente = getClienteById(id);
    return cliente ? cliente.nome : "Cliente não encontrado";
  };

  // Carregar dados iniciais
  useEffect(() => {
    loadClientes();
  }, []);

  return {
    clientes,
    loading,
    error,
    loadClientes,
    addCliente,
    updateCliente,
    deleteCliente,
    getClienteById,
    getClienteNome,
  };
};
