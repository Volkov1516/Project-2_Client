import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { ComponentType, ComponentUpdateArgsType } from "@/types/component"

export const componentsApiSlice = createApi({
  reducerPath: "componentsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://project-2-server-das9.onrender.com",
  }),
  tagTypes: ["Component"],
  endpoints: builder => ({
    getComponents: builder.query<ComponentType[], void>({
      query: () => `/components`,
      providesTags: ["Component"],
    }),
    createComponent: builder.mutation<ComponentType, Partial<ComponentType>>({
      query: data => ({
        url: "/components",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Component"],
    }),
    updateComponent: builder.mutation<ComponentType, ComponentUpdateArgsType>({
      query: ({ id, data }) => ({
        url: `/components/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Component"],
    }),
    deleteComponent: builder.mutation<void, string>({
      query: id => ({
        url: `/components/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Component"],
    }),
  }),
})

export const {
  useGetComponentsQuery,
  useCreateComponentMutation,
  useUpdateComponentMutation,
  useDeleteComponentMutation,
} = componentsApiSlice
