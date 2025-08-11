import React, { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import {
  useCreateVehicleMakeMutation,
  useUpdateVehicleMakeMutation,
} from '../store/services/vehicleMakeApi';
import type { VehicleMake } from '../store/services/vehicleMakeApi';

interface VehicleMakeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: VehicleMake | null;
}

type FormValues = {
  Name: string;
  Abrv: string;
};

const VehicleMakeFormModal: React.FC<VehicleMakeFormModalProps> = ({ isOpen, onClose, initialData }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: initialData || { Name: '', Abrv: '' },
  });

  const [createVehicleMake, { isLoading: isCreating, isSuccess: createSuccess }] = useCreateVehicleMakeMutation();
  const [updateVehicleMake, { isLoading: isUpdating, isSuccess: updateSuccess }] = useUpdateVehicleMakeMutation();

  useEffect(() => {
    if (isOpen) {
      reset(initialData || { Name: '', Abrv: '' });
    }
  }, [isOpen, initialData, reset]);

  useEffect(() => {
    if (createSuccess || updateSuccess) {
      onClose();
    }
  }, [createSuccess, updateSuccess, onClose]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      if (initialData) {
        await updateVehicleMake({ id: initialData.id, ...data }).unwrap();
      } else {
        await createVehicleMake(data).unwrap();
      }
    } catch (err) {
      alert('Error saving vehicle make: ' + (err && 'data' in err ? JSON.stringify(err.data) : 'Unknown error'));
    }
  };

  if (!isOpen) return null;

  const title = initialData ? 'Edit Vehicle Make' : 'Add New Vehicle Make';
  const submitButtonText = initialData ? 'Save Changes' : 'Add Make';
  const isSaving = isCreating || isUpdating;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="relative p-8 bg-white w-96 max-w-full rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">{title}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="Name" className="block text-gray-700 text-sm font-bold mb-2">
              Name:
            </label>
            <input
              type="text"
              id="Name"
              {...register('Name', { required: 'Name is required' })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.Name && <p className="text-red-500 text-xs italic mt-1">{errors.Name.message}</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="Abrv" className="block text-gray-700 text-sm font-bold mb-2">
              Abbreviation:
            </label>
            <input
              type="text"
              id="Abrv"
              {...register('Abrv', { required: 'Abbreviation is required' })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.Abrv && <p className="text-red-500 text-xs italic mt-1">{errors.Abrv.message}</p>}
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleMakeFormModal;
