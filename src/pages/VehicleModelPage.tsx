import React, { useState, useEffect } from 'react';
import { useGetVehicleModelsQuery, useDeleteVehicleModelMutation } from '../store/services/vehicleMakeApi';
import type { VehicleModel } from '../store/services/vehicleMakeApi';
import VehicleModelFormModal from '../components/VehicleModelFormModal';

const LOCAL_STORAGE_KEY = 'vehicleModelsFilter';

const VehicleModelPage: React.FC = () => {
  const getInitialState = () => {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedState) {
      return JSON.parse(savedState);
    }
    return {
      page: 1,
      pageSize: 10,
      sortBy: 'Name',
      sortOrder: 'asc',
      filter: '',
    };
  };

  const initialState = getInitialState();

  const [page, setPage] = useState(initialState.page);
  const [pageSize, setPageSize] = useState(initialState.pageSize);
  const [sortBy, setSortBy] = useState(initialState.sortBy);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialState.sortOrder);
  const [filter, setFilter] = useState(initialState.filter);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState<VehicleModel | null>(null);

  const { data, error, isLoading, isError } = useGetVehicleModelsQuery({
    page,
    pageSize,
    sortBy,
    sortOrder,
    filter,
  });

  const [deleteVehicleModel, { isLoading: isDeleting }] = useDeleteVehicleModelMutation();

  useEffect(() => {
    const stateToSave = { page, pageSize, sortBy, sortOrder, filter };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
  }, [page, pageSize, sortBy, sortOrder, filter]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Jeste li sigurni da želite obrisati ovaj model?')) {
      try {
        await deleteVehicleModel(id).unwrap();
      } catch (err) {
        alert('Greška pri brisanju modela: ' + (err && 'data' in err ? JSON.stringify(err.data) : 'Nepoznata greška'));
      }
    }
  };

  const handleEdit = (model: VehicleModel) => {
    setCurrentModel(model);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setCurrentModel(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentModel(null);
  };

  if (isLoading) {
    return <div className="p-5 text-center text-lg">Učitavanje modela vozila...</div>;
  }

  if (isError) {
    return <div className="p-5 text-center text-red-500 text-lg">Greška pri učitavanju modela vozila: {error && 'data' in error ? JSON.stringify(error.data) : 'Nepoznata greška'}</div>;
  }

  if (!data || !data.data) {
    return <div className="p-5 text-center text-lg">Nema pronađenih modela vozila.</div>;
  }

  const totalItems = data.count || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  const handleSortChange = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
    setPage(1);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Modeli vozila</h1>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <input
          type="text"
          placeholder="Filtriraj po nazivu"
          value={filter}
          onChange={handleFilterChange}
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
        />
        <div className="flex items-center gap-4">
          <span className="mr-2 text-gray-700">Stavki po stranici:</span>
          <select value={pageSize} onChange={handlePageSizeChange} className="p-2 border border-gray-300 rounded-md shadow-sm">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          <button
            onClick={handleAddNew}
            className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-150 ease-in-out shadow-sm"
          >
            Dodaj novi model
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => handleSortChange('id')}
              >
                ID {sortBy === 'id' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => handleSortChange('Name')}
              >
                Naziv {sortBy === 'Name' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => handleSortChange('Abrv')}
              >
                Skraćenica {sortBy === 'Abrv' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
              >
                Proizvođač
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Akcije
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.data.length > 0 ? (
              data.data.map((model) => (
                <tr key={model.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{model.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{model.Name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{model.Abrv}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{model.VehicleMake?.Name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(model)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4 transition duration-150 ease-in-out"
                    >
                      Uredi
                    </button>
                    <button
                      onClick={() => handleDelete(model.id)}
                      disabled={isDeleting}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
                    >
                      {isDeleting ? 'Brisanje...' : 'Obriši'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <React.Fragment>
                <tr>
                  <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 italic">
                    Nema modela koji odgovaraju vašim kriterijima.
                  </td>
                </tr>
              </React.Fragment>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center items-center gap-4">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="py-2 px-4 border border-gray-300 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out shadow-sm"
        >
          Prethodna
        </button>
        <span className="text-lg font-medium text-gray-700">Stranica {page} od {totalPages}</span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="py-2 px-4 border border-gray-300 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out shadow-sm"
        >
          Sljedeća
        </button>
      </div>

      <VehicleModelFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={currentModel}
      />
    </div>
  );
};

export default VehicleModelPage;
