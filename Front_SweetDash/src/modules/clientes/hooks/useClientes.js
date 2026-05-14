import { useState, useEffect } from "react";
import { clientesApi } from "../../../services/api";
import { mapCliente } from "../clientesUtils";

const ITEMS_PER_PAGE = 8;

export default function useClientes() {
  const [clientes,    setClientes]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [searchTerm,  setSearchTerm]  = useState("");
  const [page,        setPage]        = useState(1);
  const [modalOpen,   setModalOpen]   = useState(false);
  const [editCliente, setEditCliente] = useState(null);
  const [verCliente,  setVerCliente]  = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,    setDeleting]    = useState(false);

  const cargarClientes = () => {
    setLoading(true);
    clientesApi.getAll()
      .then((data) => { setClientes(data.map(mapCliente)); setError(null); })
      .catch((err)  => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { cargarClientes(); }, []);

  const handleNuevo  = () => { setEditCliente(null); setModalOpen(true); };
  const handleEditar = (c) => { setVerCliente(null); setEditCliente(c); setModalOpen(true); };
  const handleSaved  = () => { setModalOpen(false);  cargarClientes();   };

  const handleEliminar = async () => {
    setDeleting(true);
    try {
      await clientesApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      cargarClientes();
    } catch (e) {
      alert("Error al eliminar: " + e.message);
    } finally {
      setDeleting(false);
    }
  };

  const filtrados  = clientes.filter((c) =>
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtrados.length / ITEMS_PER_PAGE));
  const paginados  = filtrados.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const handleSearch = (v) => { setSearchTerm(v); setPage(1); };

  return {
    clientes, loading, error,
    searchTerm, page, setPage,
    modalOpen, setModalOpen,
    editCliente,
    verCliente, setVerCliente,
    deleteTarget, setDeleteTarget,
    deleting,
    handleNuevo, handleEditar, handleSaved, handleEliminar,
    filtrados, totalPages, paginados, handleSearch,
  };
}
