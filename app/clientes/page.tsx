"use client";

import React, { useState } from "react";
import { useClientes } from "@/hooks/useClientes";
import { useDrones } from "@/hooks/useDrones";
import { useRotas } from "@/hooks/useRotas";

export default function DroneManagementSystem() {
  // Hooks customizados
  const {
    clientes,
    loading: clientesLoading,
    addCliente,
    updateCliente,
    deleteCliente,
    getClienteNome,
  } = useClientes();

  const {
    drones,
    loading: dronesLoading,
    addDrone,
    updateDrone,
    deleteDrone,
    getDroneModelo,
    getDronesAtivos,
  } = useDrones();

  const {
    rotas,
    loading: rotasLoading,
    addRota,
    updateRota,
    deleteRota,
  } = useRotas();

  // Estados para formulários
  const [activeTab, setActiveTab] = useState("clientes");

  // Estados para edição
  const [editingCliente, setEditingCliente] = useState(null);
  const [editingDrone, setEditingDrone] = useState(null);
  const [editingRota, setEditingRota] = useState(null);

  // Estados Cliente
  const [clienteForm, setClienteForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    ativo: true,
  });

  // Estados Drone
  const [droneForm, setDroneForm] = useState({
    modelo: "",
    numeroSerie: "",
    clienteId: "",
    status: "ativo",
    horasVoo: 0,
  });

  // Estados Rota
  const [rotaForm, setRotaForm] = useState({
    droneId: "",
    nomeRota: "",
    coordenadas: "",
    duracao: "",
    altitude: "",
    status: "planejada",
  });

  // Handlers para Cliente
  const handleClienteSubmit = async (e) => {
    e.preventDefault();

    let result;
    if (editingCliente) {
      result = await updateCliente(editingCliente.id, clienteForm);
    } else {
      result = await addCliente(clienteForm);
    }

    if (result.success) {
      setClienteForm({
        nome: "",
        email: "",
        telefone: "",
        endereco: "",
        ativo: true,
      });
      setEditingCliente(null);
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  const handleEditCliente = (cliente) => {
    setEditingCliente(cliente);
    setClienteForm({
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      endereco: cliente.endereco,
      ativo: cliente.ativo,
    });
  };

  const handleDeleteCliente = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      const result = await deleteCliente(id);
      alert(result.message);
    }
  };

  // Handlers para Drone
  const handleDroneSubmit = async (e) => {
    e.preventDefault();

    let result;
    if (editingDrone) {
      result = await updateDrone(editingDrone.id, droneForm);
    } else {
      result = await addDrone(droneForm);
    }

    if (result.success) {
      setDroneForm({
        modelo: "",
        numeroSerie: "",
        clienteId: "",
        status: "ativo",
        horasVoo: 0,
      });
      setEditingDrone(null);
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  const handleEditDrone = (drone) => {
    setEditingDrone(drone);
    setDroneForm({
      modelo: drone.modelo,
      numeroSerie: drone.numeroSerie,
      clienteId: drone.clienteId,
      status: drone.status,
      horasVoo: drone.horasVoo || 0,
    });
  };

  const handleDeleteDrone = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este drone?")) {
      const result = await deleteDrone(id);
      alert(result.message);
    }
  };

  // Handlers para Rota
  const handleRotaSubmit = async (e) => {
    e.preventDefault();

    const rotaData = {
      ...rotaForm,
      duracao: parseInt(rotaForm.duracao),
      altitude: parseInt(rotaForm.altitude),
    };

    let result;
    if (editingRota) {
      result = await updateRota(editingRota.id, rotaData);
    } else {
      result = await addRota(rotaData);
    }

    if (result.success) {
      setRotaForm({
        droneId: "",
        nomeRota: "",
        coordenadas: "",
        duracao: "",
        altitude: "",
        status: "planejada",
      });
      setEditingRota(null);
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  const handleEditRota = (rota) => {
    setEditingRota(rota);
    setRotaForm({
      droneId: rota.droneId,
      nomeRota: rota.nomeRota,
      coordenadas: JSON.stringify(rota.coordenadas, null, 2),
      duracao: rota.duracao.toString(),
      altitude: rota.altitude.toString(),
      status: rota.status,
    });
  };

  const handleDeleteRota = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta rota?")) {
      const result = await deleteRota(id);
      alert(result.message);
    }
  };

  const cancelEdit = () => {
    setEditingCliente(null);
    setEditingDrone(null);
    setEditingRota(null);
    setClienteForm({
      nome: "",
      email: "",
      telefone: "",
      endereco: "",
      ativo: true,
    });
    setDroneForm({
      modelo: "",
      numeroSerie: "",
      clienteId: "",
      status: "ativo",
      horasVoo: 0,
    });
    setRotaForm({
      droneId: "",
      nomeRota: "",
      coordenadas: "",
      duracao: "",
      altitude: "",
      status: "planejada",
    });
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Sistema de Gerenciamento de Drones
        </h1>

        {/* Navegação por Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            {["clientes", "drones", "rotas"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  cancelEdit();
                }}
                className={`px-6 py-2 rounded-md font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Indicador de Loading */}
        {(clientesLoading || dronesLoading || rotasLoading) && (
          <div className="text-center mb-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-gray-600 mt-2">Carregando...</p>
          </div>
        )}

        {/* Seção Clientes */}
        {activeTab === "clientes" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulário Cliente */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingCliente ? "Editar Cliente" : "Adicionar Cliente"}
                </h2>
                {editingCliente && (
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Cancelar
                  </button>
                )}
              </div>
              <form onSubmit={handleClienteSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Nome:
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    value={clienteForm.nome}
                    onChange={(e) =>
                      setClienteForm({ ...clienteForm, nome: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Email:
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    value={clienteForm.email}
                    onChange={(e) =>
                      setClienteForm({ ...clienteForm, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Telefone:
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    value={clienteForm.telefone}
                    onChange={(e) =>
                      setClienteForm({
                        ...clienteForm,
                        telefone: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Endereço:
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    rows="3"
                    value={clienteForm.endereco}
                    onChange={(e) =>
                      setClienteForm({
                        ...clienteForm,
                        endereco: e.target.value,
                      })
                    }
                  />
                </div>
                {editingCliente && (
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Status:
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      value={clienteForm.ativo}
                      onChange={(e) =>
                        setClienteForm({
                          ...clienteForm,
                          ativo: e.target.value === "true",
                        })
                      }
                    >
                      <option value={true}>Ativo</option>
                      <option value={false}>Inativo</option>
                    </select>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={clientesLoading}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  {clientesLoading
                    ? "Processando..."
                    : editingCliente
                      ? "Atualizar Cliente"
                      : "Adicionar Cliente"}
                </button>
              </form>
            </div>

            {/* Lista de Clientes */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Clientes Cadastrados
              </h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {clientes.map((cliente) => (
                  <div
                    key={cliente.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-gray-800">
                        {cliente.nome}
                      </h3>
                      <div className="space-x-2">
                        <button
                          onClick={() => handleEditCliente(cliente)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteCliente(cliente.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600">{cliente.email}</p>
                    <p className="text-gray-600">{cliente.telefone}</p>
                    <p className="text-gray-600 text-sm">{cliente.endereco}</p>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        cliente.ativo
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {cliente.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Seção Drones */}
        {activeTab === "drones" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulário Drone */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingDrone ? "Editar Drone" : "Adicionar Drone"}
                </h2>
                {editingDrone && (
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Cancelar
                  </button>
                )}
              </div>
              <form onSubmit={handleDroneSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Modelo:
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    value={droneForm.modelo}
                    onChange={(e) =>
                      setDroneForm({ ...droneForm, modelo: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Número de Série:
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    value={droneForm.numeroSerie}
                    onChange={(e) =>
                      setDroneForm({
                        ...droneForm,
                        numeroSerie: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Cliente:
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    value={droneForm.clienteId}
                    onChange={(e) =>
                      setDroneForm({ ...droneForm, clienteId: e.target.value })
                    }
                  >
                    <option value="">Selecione um cliente</option>
                    {clientes
                      .filter((c) => c.ativo)
                      .map((cliente) => (
                        <option key={cliente.id} value={cliente.id}>
                          {cliente.nome}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Status:
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    value={droneForm.status}
                    onChange={(e) =>
                      setDroneForm({ ...droneForm, status: e.target.value })
                    }
                  >
                    <option value="ativo">Ativo</option>
                    <option value="manutenção">Manutenção</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
                {editingDrone && (
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Horas de Voo:
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      value={droneForm.horasVoo}
                      onChange={(e) =>
                        setDroneForm({
                          ...droneForm,
                          horasVoo: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                )}
                <button
                  type="submit"
                  disabled={dronesLoading}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  {dronesLoading
                    ? "Processando..."
                    : editingDrone
                      ? "Atualizar Drone"
                      : "Adicionar Drone"}
                </button>
              </form>
            </div>

            {/* Lista de Drones */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Drones Cadastrados
              </h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {drones.map((drone) => (
                  <div
                    key={drone.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-gray-800">
                        {drone.modelo}
                      </h3>
                      <div className="space-x-2">
                        <button
                          onClick={() => handleEditDrone(drone)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteDrone(drone.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600">Série: {drone.numeroSerie}</p>
                    <p className="text-gray-600">
                      Cliente: {getClienteNome(drone.clienteId)}
                    </p>
                    <p className="text-gray-600">
                      Horas de Voo: {drone.horasVoo || 0}h
                    </p>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        drone.status === "ativo"
                          ? "bg-green-100 text-green-800"
                          : drone.status === "manutenção"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {drone.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Seção Rotas */}
        {activeTab === "rotas" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulário Rota */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingRota ? "Editar Rota" : "Adicionar Rota"}
                </h2>
                {editingRota && (
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Cancelar
                  </button>
                )}
              </div>

              <form onSubmit={handleRotaSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Drone:
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    value={rotaForm.droneId}
                    onChange={(e) =>
                      setRotaForm({ ...rotaForm, droneId: e.target.value })
                    }
                  >
                    <option value="">Selecione um drone</option>
                    {getDronesAtivos().map((drone) => (
                      <option key={drone.id} value={drone.id}>
                        {drone.modelo} ({drone.numeroSerie})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Nome da Rota:
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    value={rotaForm.nomeRota}
                    onChange={(e) =>
                      setRotaForm({ ...rotaForm, nomeRota: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Coordenadas (JSON):
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    rows="4"
                    placeholder='[{"lat": -30.123, "lng": -51.456}, {"lat": -30.124, "lng": -51.457}]'
                    value={rotaForm.coordenadas}
                    onChange={(e) =>
                      setRotaForm({ ...rotaForm, coordenadas: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Duração (minutos):
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    value={rotaForm.duracao}
                    onChange={(e) =>
                      setRotaForm({ ...rotaForm, duracao: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Altitude (metros):
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    value={rotaForm.altitude}
                    onChange={(e) =>
                      setRotaForm({ ...rotaForm, altitude: e.target.value })
                    }
                  />
                </div>

                {editingRota && (
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Status:
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      value={rotaForm.status}
                      onChange={(e) =>
                        setRotaForm({ ...rotaForm, status: e.target.value })
                      }
                    >
                      <option value="planejada">Planejada</option>
                      <option value="em_execucao">Em Execução</option>
                      <option value="concluida">Concluída</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={rotasLoading}
                  className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  {rotasLoading
                    ? "Processando..."
                    : editingRota
                      ? "Atualizar Rota"
                      : "Adicionar Rota"}
                </button>
              </form>
            </div>

            {/* Lista de Rotas */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Rotas Cadastradas
              </h2>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {rotas.map((rota) => (
                  <div
                    key={rota.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-gray-800">
                        {rota.nomeRota}
                      </h3>
                      <div className="space-x-2">
                        <button
                          onClick={() => handleEditRota(rota)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteRota(rota.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-600">
                      Drone: {getDroneModelo(rota.droneId)}
                    </p>
                    <p className="text-gray-600">Duração: {rota.duracao} min</p>
                    <p className="text-gray-600">Altitude: {rota.altitude}m</p>
                    <p className="text-gray-600 text-sm">
                      Data:{" "}
                      {rota.dataVoo?.toDate?.()?.toLocaleDateString() || "N/A"}
                    </p>

                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        rota.status === "planejada"
                          ? "bg-blue-100 text-blue-800"
                          : rota.status === "em_execucao"
                            ? "bg-orange-100 text-orange-800"
                            : rota.status === "concluida"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                      }`}
                    >
                      {rota.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
