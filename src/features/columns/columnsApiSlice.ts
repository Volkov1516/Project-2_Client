import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { ColumnType, UpdateColumnArgsType } from "@/types/column"

export const columnsApiSlice = createApi({
  reducerPath: "columnsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://project-2-server-das9.onrender.com",
  }),
  tagTypes: ["Column"],
  endpoints: builder => ({
    getColumns: builder.query<ColumnType[], string>({
      query: componentId => `/columns/by-component/${componentId}`,
      providesTags: (_result, _error, componentId) => [
        { type: "Column", id: componentId },
      ],
    }),
    getColumn: builder.query<ColumnType, string>({
      query: id => `/columns/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Column", id }],
    }),
    createColumn: builder.mutation<ColumnType, Partial<ColumnType>>({
      query: data => ({
        url: "/columns",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Column"],
    }),
    updateColumn: builder.mutation<ColumnType, UpdateColumnArgsType>({
      query: ({ id, data }) => ({
        url: `/columns/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Column"],
    }),
    deleteColumn: builder.mutation<void, string>({
      query: id => ({
        url: `/columns/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "Column", id }],
    }),
    getCards: builder.query<ColumnType[], string>({
      query: componentId => `/cards?componentId=${componentId}`,
      providesTags: (_result, _error, componentId) => [
        { type: "Card", id: componentId },
      ],
    }),
  }),
})

export const {
  useGetColumnsQuery,
  useGetColumnQuery,
  useCreateColumnMutation,
  useUpdateColumnMutation,
  useDeleteColumnMutation,
  useGetCardsQuery,
} = columnsApiSlice
