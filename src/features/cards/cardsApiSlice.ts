import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { CardType } from "@/types/card"

export const cardsApiSlice = createApi({
  reducerPath: "cardsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://project-2-server-das9.onrender.com",
  }),
  tagTypes: ["Card"],
  endpoints: builder => ({
    getCards: builder.query<CardType[], string>({
      query: componentId => `/cards/by-component/${componentId}`,
      providesTags: (_result, _error, componentId) => [
        { type: "Card", id: componentId },
      ],
    }),
  }),
})

export const { useGetCardsQuery } = cardsApiSlice
