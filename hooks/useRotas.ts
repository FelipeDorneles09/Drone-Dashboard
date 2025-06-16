// hooks/useRotas.js
import { useState, useEffect } from "react";
import { rotaService } from "../services/rotaService";

export const useRotas = (droneId = null) => {
  const [rotas, setRotas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carregar rotas
  const loadRotas = async (filterDroneId = droneId) => {
    setLoading(true);
    setError(null);

    const result = await rotaService.fetchRotas(filterDroneId);

    if (result.success) {
      setRotas(result.data);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  // Adicionar rota
  const addRota = async (rotaData) => {
    setLoading(true);
    setError(null);

    // Validar coordenadas se for string
    if (typeof rotaData.coordenadas === "string") {
      try {
        rotaData.coordenadas = JSON.parse(rotaData.coordenadas);
      } catch (error) {
        setError("Formato de coordenadas inválido");
        setLoading(false);
        return {
          success: false,
          message:
            "Formato de coordenadas inválido! Use: [{'lat': -30.123, 'lng': -51.456}]",
        };
      }
    }

    const result = await rotaService.addRota(rotaData);

    if (result.success) {
      await loadRotas(); // Recarregar lista
      return { success: true, message: "Rota adicionada com sucesso!" };
    } else {
      setError(result.error);
      return { success: false, message: "Erro ao adicionar rota!" };
    }
  };

  // Atualizar rota
  const updateRota = async (id, rotaData) => {
    setLoading(true);
    setError(null);

    // Validar coordenadas se for string
    if (typeof rotaData.coordenadas === "string") {
      try {
        rotaData.coordenadas = JSON.parse(rotaData.coordenadas);
      } catch (error) {
        setError("Formato de coordenadas inválido");
        setLoading(false);
        return {
          success: false,
          message:
            "Formato de coordenadas inválido! Use: [{'lat': -30.123, 'lng': -51.456}]",
        };
      }
    }

    const result = await rotaService.updateRota(id, rotaData);

    if (result.success) {
      await loadRotas(); // Recarregar lista
      return { success: true, message: "Rota atualizada com sucesso!" };
    } else {
      setError(result.error);
      return { success: false, message: "Erro ao atualizar rota!" };
    }
  };

  // Deletar rota
  const deleteRota = async (id) => {
    setLoading(true);
    setError(null);

    const result = await rotaService.deleteRota(id);

    if (result.success) {
      await loadRotas(); // Recarregar lista
      return { success: true, message: "Rota excluída com sucesso!" };
    } else {
      setError(result.error);
      return { success: false, message: "Erro ao excluir rota!" };
    }
  };

  // Buscar rota por ID
  const getRotaById = (id) => {
    return rotas.find((rota) => rota.id === id);
  };

  // Filtrar rotas por status
  const getRotasByStatus = (status) => {
    return rotas.filter((rota) => rota.status === status);
  };

  // Carregar dados iniciais
  useEffect(() => {
    loadRotas();
  }, [droneId]);

  return {
    rotas,
    loading,
    error,
    loadRotas,
    addRota,
    updateRota,
    deleteRota,
    getRotaById,
    getRotasByStatus,
  };
};
