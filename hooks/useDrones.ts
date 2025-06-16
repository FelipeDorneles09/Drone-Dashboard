// hooks/useDrones.js
import { useState, useEffect } from "react";
import { droneService } from "../services/droneService";

export const useDrones = (clienteId = null) => {
  const [drones, setDrones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carregar drones
  const loadDrones = async (filterClienteId = clienteId) => {
    setLoading(true);
    setError(null);

    const result = await droneService.fetchDrones(filterClienteId);

    if (result.success) {
      setDrones(result.data);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  // Adicionar drone
  const addDrone = async (droneData) => {
    setLoading(true);
    setError(null);

    const result = await droneService.addDrone(droneData);

    if (result.success) {
      await loadDrones(); // Recarregar lista
      return { success: true, message: "Drone adicionado com sucesso!" };
    } else {
      setError(result.error);
      return { success: false, message: "Erro ao adicionar drone!" };
    }
  };

  // Atualizar drone
  const updateDrone = async (id, droneData) => {
    setLoading(true);
    setError(null);

    const result = await droneService.updateDrone(id, droneData);

    if (result.success) {
      await loadDrones(); // Recarregar lista
      return { success: true, message: "Drone atualizado com sucesso!" };
    } else {
      setError(result.error);
      return { success: false, message: "Erro ao atualizar drone!" };
    }
  };

  // Deletar drone
  const deleteDrone = async (id) => {
    setLoading(true);
    setError(null);

    const result = await droneService.deleteDrone(id);

    if (result.success) {
      await loadDrones(); // Recarregar lista
      return { success: true, message: "Drone excluído com sucesso!" };
    } else {
      setError(result.error);
      return { success: false, message: "Erro ao excluir drone!" };
    }
  };

  // Buscar drone por ID
  const getDroneById = (id) => {
    return drones.find((drone) => drone.id === id);
  };

  // Buscar modelo do drone por ID
  const getDroneModelo = (id) => {
    const drone = getDroneById(id);
    return drone
      ? `${drone.modelo} (${drone.numeroSerie})`
      : "Drone não encontrado";
  };

  // Filtrar drones ativos
  const getDronesAtivos = () => {
    return drones.filter((drone) => drone.status === "ativo");
  };

  // Carregar dados iniciais
  useEffect(() => {
    loadDrones();
  }, [clienteId]);

  return {
    drones,
    loading,
    error,
    loadDrones,
    addDrone,
    updateDrone,
    deleteDrone,
    getDroneById,
    getDroneModelo,
    getDronesAtivos,
  };
};
