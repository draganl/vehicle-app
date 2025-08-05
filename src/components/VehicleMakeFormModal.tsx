import React, { useState, useEffect } from 'react';
import { useCreateVehicleMakeMutation, useUpdateVehicleMakeMutation } from '../store/services/vehicleMakeApi';
import type { VehicleMake } from '../store/services/vehicleMakeApi';

interface VehicleMakeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: VehicleMake | null;
}

const VehicleMakeFormModal: React.FC<VehicleMakeFormModalProps> = ({ isOpen, onClose, initialData }) => {
  const [name, setName] = useState('');
  const [abrv, setAbrv] = useState('');

  const [createVehicleMake, { isLoading: isCreating, isSuccess: createSuccess }] = useCreateVehicleMakeMutation();
  const [updateVehicleMake, { isLoading: isUpdating, isSuccess: updateSuccess }] = useUpdateVehicleMakeMutation();

  useEffect(() => {
    if (initialData) {
      setName(initialData.Name);
      setAbrv(initialData.Abrv);
    } else {
      setName('');
      setAbrv('');
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    if (createSuccess || updateSuccess) {
      onClose();
    }
  }, [createSuccess, updateSuccess, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (initialData) {
        await updateVehicleMake({ id: initialData.id, Name: name, Abrv: abrv }).unwrap();
      } else {
        await createVehicleMake({ Name: name, Abrv: abrv }).unwrap();
      }
    } catch (err) {
      alert('Greška pri spremanju proizvođača: ' + (err && 'data' in err ? JSON.stringify(err.data) : 'Nepoznata greška'));
    }
  };

  if (!isOpen) return null;

  const title = initialData ? 'Uredi proizvođača vozila' : 'Dodaj novog proizvođača vozila';
  const submitButtonText = initialData ? 'Spremi promjene' : 'Dodaj proizvođača';
  const isLoading = isCreating || isUpdating;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="relative p-8 bg-white w-96 max-w-full rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">{title}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
              Naziv:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="abrv" className="block text-gray-700 text-sm font-bold mb-2">
              Skraćenica:
            </label>
            <input
              type="text"
              id="abrv"
              value={abrv}
              onChange={(e) => setAbrv(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
              disabled={isLoading}
            >
              Odustani
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Spremanje...' : submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleMakeFormModal;
