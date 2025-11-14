import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Column, UpdateColumnArgs, Card } from "./types"

export const requestsApiSlice = createApi({
  reducerPath: "requestsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://project-2-server-das9.onrender.com",
  }),
  // Добавляем tagTypes
  tagTypes: ["Column", "Card"],
  endpoints: builder => ({
    getColumns: builder.query<Column[], string>({
      query: componentId => `/columns?componentId=${componentId}`,
      providesTags: (_result, _error, componentId) => [{ type: "Column", id: componentId }],
    }),
    getColumn: builder.query<Column, string>({
      query: id => `/columns/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Column", id }],
    }),
    createColumn: builder.mutation<Column, Partial<Column>>({
      query: data => ({
        url: "/columns",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Column"],
    }),
    updateColumn: builder.mutation<Column, UpdateColumnArgs>({
      query: ({ id, data }) => ({
        url: `/columns/${id}`,
        method: "PATCH",
        body: data,
      }),
      // После успешного обновления делаем тег недействительным
      invalidatesTags: ["Column"],
    }),
    deleteColumn: builder.mutation<void, string>({
      query: id => ({
        url: `/columns/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "Column", id }],
    }),
    getCards: builder.query<Card[], string>({
      query: componentId => `/cards?componentId=${componentId}`,
      providesTags: (_result, _error, componentId) => [{ type: "Card", id: componentId }],
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
} = requestsApiSlice
