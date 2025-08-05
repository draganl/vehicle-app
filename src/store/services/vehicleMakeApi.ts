import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface VehicleMake {
  id: string;
  Name: string;
  Abrv: string;
}

export interface VehicleModel {
  id: string;
  Name: string;
  Abrv: string;
  MakeId: string;
  Make?: VehicleMake;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number | null;
}

export const vehicleMakeApi = createApi({
  reducerPath: 'vehicleMakeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/`,
    prepareHeaders: (headers) => {
      headers.set('apikey', import.meta.env.VITE_SUPABASE_ANON_KEY || '');
      return headers;
    },
  }),
  tagTypes: ['VehicleMake', 'VehicleModel'],
  endpoints: (builder) => ({
    getVehicleMakes: builder.query<PaginatedResponse<VehicleMake>, {
      page?: number;
      pageSize?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      filter?: string;
    }>({
      query: ({ page = 1, pageSize = 10, sortBy = 'Name', sortOrder = 'asc', filter = '' }) => {
        const rangeFrom = (page - 1) * pageSize;
        const rangeTo = page * pageSize - 1;

        let queryString = `VehicleMake?`;
        queryString += `order=${sortBy}.${sortOrder}`;

        if (filter) {
          queryString += `&Name=ilike.*${filter}*`;
        }

        return {
          url: queryString,
          headers: {
            'Range': `${rangeFrom}-${rangeTo}`,
            'Prefer': 'count=exact'
          }
        };
      },
      transformResponse(baseResponse: VehicleMake[], meta) {
        const contentRange = meta?.response?.headers.get('content-range');
        let count: number | null = null;
        if (contentRange) {
          const match = contentRange.match(/\/(\d+)$/);
          if (match && match[1]) {
            count = parseInt(match[1], 10);
          }
        }
        return {
          data: baseResponse,
          count: count,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'VehicleMake' as const, id })),
              { type: 'VehicleMake', id: 'LIST' },
            ]
          : [{ type: 'VehicleMake', id: 'LIST' }],
    }),

    getVehicleModels: builder.query<PaginatedResponse<VehicleModel>, {
      page?: number;
      pageSize?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      filter?: string;
    }>({
      query: ({ page = 1, pageSize = 10, sortBy = 'Name', sortOrder = 'asc', filter = '' }) => {
        const rangeFrom = (page - 1) * pageSize;
        const rangeTo = page * pageSize - 1;

        // ISPRAVLJENO: 'Make(*)' je promijenjeno u 'VehicleMake(*)'
        let queryString = `VehicleModel?select=*,VehicleMake(*)`;
        queryString += `&order=${sortBy}.${sortOrder}`;

        if (filter) {
          queryString += `&Name=ilike.*${filter}*`;
        }

        return {
          url: queryString,
          headers: {
            'Range': `${rangeFrom}-${rangeTo}`,
            'Prefer': 'count=exact'
          }
        };
      },
      transformResponse(baseResponse: VehicleModel[], meta) {
        const contentRange = meta?.response?.headers.get('content-range');
        let count: number | null = null;
        if (contentRange) {
          const match = contentRange.match(/\/(\d+)$/);
          if (match && match[1]) {
            count = parseInt(match[1], 10);
          }
        }
        return {
          data: baseResponse,
          count: count,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'VehicleModel' as const, id })),
              { type: 'VehicleModel', id: 'LIST' },
            ]
          : [{ type: 'VehicleModel', id: 'LIST' }],
    }),

    getVehicleMakeById: builder.query<VehicleMake, string>({
      query: (id) => `VehicleMake?id=eq.${id}`,
      transformResponse: (response: VehicleMake[]) => response[0],
      providesTags: (result, error, id) => [{ type: 'VehicleMake', id }],
    }),

    createVehicleMake: builder.mutation<VehicleMake, Omit<VehicleMake, 'id'>>({
      query: (newMake) => ({
        url: 'VehicleMake',
        method: 'POST',
        body: newMake,
      }),
      invalidatesTags: [{ type: 'VehicleMake', id: 'LIST' }],
    }),

    updateVehicleMake: builder.mutation<VehicleMake, Partial<VehicleMake> & Pick<VehicleMake, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: `VehicleMake?id=eq.${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'VehicleMake', id }],
    }),

    deleteVehicleMake: builder.mutation<void, string>({
      query: (id) => ({
        url: `VehicleMake?id=eq.${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'VehicleMake', id: 'LIST' }],
    }),
    
    createVehicleModel: builder.mutation<VehicleModel, Omit<VehicleModel, 'id'>>({
      query: (newModel) => ({
        url: 'VehicleModel',
        method: 'POST',
        body: newModel,
      }),
      invalidatesTags: [{ type: 'VehicleModel', id: 'LIST' }],
    }),

    updateVehicleModel: builder.mutation<VehicleModel, Partial<VehicleModel> & Pick<VehicleModel, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: `VehicleModel?id=eq.${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'VehicleModel', id }],
    }),

    deleteVehicleModel: builder.mutation<void, string>({
      query: (id) => ({
        url: `VehicleModel?id=eq.${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'VehicleModel', id: 'LIST' }],
    }),

    getAllVehicleMakes: builder.query<VehicleMake[], void>({
      query: () => `VehicleMake?order=Name.asc`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'VehicleMake' as const, id })),
              { type: 'VehicleMake', id: 'LIST' },
            ]
          : [{ type: 'VehicleMake', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetVehicleMakesQuery,
  useGetVehicleModelsQuery,
  useGetVehicleMakeByIdQuery,
  useCreateVehicleMakeMutation,
  useUpdateVehicleMakeMutation,
  useDeleteVehicleMakeMutation,
  useCreateVehicleModelMutation,
  useUpdateVehicleModelMutation,
  useDeleteVehicleModelMutation,
  useGetAllVehicleMakesQuery,
} = vehicleMakeApi;
