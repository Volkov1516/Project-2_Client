import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Column, UpdateColumnArgs, Card } from "./types"

export const requestsApiSlice = createApi({
  reducerPath: "requestsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  // Добавляем tagTypes
  tagTypes: ["Column", "Card"],
  endpoints: builder => ({
    getColumns: builder.query<Column[], string>({
      query: componentId => `/columns/by-component/${componentId}`,
      providesTags: (result, error, componentId) => [
        { type: "Column", id: componentId },
        ...(result
          ? result.map(column => ({ type: "Column" as const, id: column.id }))
          : []),
      ],
    }),
    getColumn: builder.query<Column, string>({
      query: id => `/columns/${id}`,
      providesTags: (result, error, id) => [{ type: "Column", id }],
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
      // После успешного удаления делаем тег недействительным
      invalidatesTags: ["Column"],
    }),
    getCards: builder.query<Card[], string>({
      query: componentId => `/cards/by-component/${componentId}`,
      providesTags: (result, error, componentId) => [
        { type: "Card", id: componentId },
        ...(result
          ? result.map(card => ({ type: "Card" as const, id: card.id }))
          : []),
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
} = requestsApiSlice
