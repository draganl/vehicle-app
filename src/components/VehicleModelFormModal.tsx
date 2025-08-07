import React, { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import {
  useCreateVehicleModelMutation,
  useUpdateVehicleModelMutation,
  useGetAllVehicleMakesQuery,
} from '../store/services/vehicleMakeApi';
import type { VehicleModel } from '../store/services/vehicleMakeApi';

interface VehicleModelFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: VehicleModel | null;
}

type FormValues = {
  Name: string;
  Abrv: string;
  MakeId: string;
};

const VehicleModelFormModal: React.FC<VehicleModelFormModalProps> = ({ isOpen, onClose, initialData }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: initialData || { Name: '', Abrv: '', MakeId: '' },
  });

  const [createVehicleModel, { isLoading: isCreating, isSuccess: createSuccess }] = useCreateVehicleModelMutation();
  const [updateVehicleModel, { isLoading: isUpdating, isSuccess: updateSuccess }] = useUpdateVehicleModelMutation();
  const { data: makes, isLoading: areMakesLoading } = useGetAllVehicleMakesQuery();

  useEffect(() => {
    reset(initialData || { Name: '', Abrv: '', MakeId: '' });
  }, [initialData, isOpen, reset]);

  useEffect(() => {
    if (createSuccess || updateSuccess) {
      onClose();
    }
  }, [createSuccess, updateSuccess, onClose]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      if (initialData) {
        await updateVehicleModel({ id: initialData.id, ...data }).unwrap();
      } else {
        await createVehicleModel(data).unwrap();
      }
    } catch (err) {
      alert('Greška pri spremanju modela: ' + (err && 'data' in err ? JSON.stringify(err.data) : 'Nepoznata greška'));
    }
  };

  if (!isOpen) return null;

  const title = initialData ? 'Uredi model vozila' : 'Dodaj novi model vozila';
  const submitButtonText = initialData ? 'Spremi promjene' : 'Dodaj model';
  const isLoading = isCreating || isUpdating;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="relative p-8 bg-white w-96 max-w-full rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">{title}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="MakeId" className="block text-gray-700 text-sm font-bold mb-2">
              Proizvođač:
            </label>
            {areMakesLoading ? (
              <p>Učitavanje proizvođača...</p>
            ) : (
              <select
                id="MakeId"
                {...register('MakeId', { required: 'Odabir proizvođača je obavezan' })}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="" disabled>Odaberite proizvođača</option>
                {makes?.map((make) => (
                  <option key={make.id} value={make.id}>
                    {make.Name}
                  </option>
                ))}
              </select>
            )}
            {errors.MakeId && <p className="text-red-500 text-xs italic mt-1">{errors.MakeId.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="Name" className="block text-gray-700 text-sm font-bold mb-2">
              Naziv modela:
            </label>
            <input
              type="text"
              id="Name"
              {...register('Name', { required: 'Naziv modela je obavezan' })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.Name && <p className="text-red-500 text-xs italic mt-1">{errors.Name.message}</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="Abrv" className="block text-gray-700 text-sm font-bold mb-2">
              Skraćenica:
            </label>
            <input
              type="text"
              id="Abrv"
              {...register('Abrv', { required: 'Skraćenica je obavezna' })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.Abrv && <p className="text-red-500 text-xs italic mt-1">{errors.Abrv.message}</p>}
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

export default VehicleModelFormModal;
