import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Project, Component, UpdateProjectArgs } from "./types"

export const projectsApiSlice = createApi({
  reducerPath: "projectsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://project-2-server-das9.onrender.com",
  }),
  // Добавляем tagTypes
  tagTypes: ["Project", "Component"],
  endpoints: builder => ({
    getProjects: builder.query<Project[], void>({
      query: () => `/projects`,
      // Добавляем providesTags, чтобы пометить данные тегом "Project"
      providesTags: ["Project"],
    }),
    getProjectById: builder.query<Project, string>({
      query: id => `/projects/${id}`,
      providesTags: (result, error, id) => [{ type: "Project", id }],
    }),
    createProject: builder.mutation<Project, Partial<Project>>({
      query: data => ({
        url: "/projects",
        method: "POST",
        body: data,
      }),
      // После успешного создания проекта делаем тег "Project" недействительным
      invalidatesTags: ["Project"],
    }),
    updateProject: builder.mutation<Project, UpdateProjectArgs>({
      query: ({ id, data }) => ({
        url: `/projects/${id}`,
        method: "PATCH",
        body: data,
      }),
      // После успешного обновления делаем тег недействительным
      invalidatesTags: ["Project"],
    }),
    deleteProject: builder.mutation<void, string>({
      query: id => ({
        url: `/projects/${id}`,
        method: "DELETE",
      }),
      // После успешного удаления делаем тег недействительным
      invalidatesTags: ["Project"],
    }),
    getComponents: builder.query<Component[], void>({
      query: () => `/components`,
      // Добавляем providesTags, чтобы пометить данные тегом "Project"
      providesTags: ["Component"],
    }),
    createComponent: builder.mutation<Component, Partial<Component>>({
      query: data => ({
        url: "/components",
        method: "POST",
        body: data,
      }),
      // После успешного создания проекта делаем тег "Project" недействительным
      invalidatesTags: ["Component"],
    }),
    updateComponent: builder.mutation<Component, UpdateProjectArgs>({
      query: ({ id, data }) => ({
        url: `/components/${id}`,
        method: "PATCH",
        body: data,
      }),
      // После успешного обновления делаем тег недействительным
      invalidatesTags: ["Component"],
    }),
    deleteComponent: builder.mutation<void, string>({
      query: id => ({
        url: `/components/${id}`,
        method: "DELETE",
      }),
      // После успешного удаления делаем тег недействительным
      invalidatesTags: ["Component"],
    }),
  }),
})

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetComponentsQuery,
  useCreateComponentMutation,
  useUpdateComponentMutation,
  useDeleteComponentMutation,
} = projectsApiSlice
