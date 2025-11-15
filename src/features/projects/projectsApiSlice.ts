import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { ProjectType, ProjectUpdateArgsType } from "@/types/project"

export const projectsApiSlice = createApi({
  reducerPath: "projectsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://project-2-server-das9.onrender.com",
  }),
  tagTypes: ["Project"],
  endpoints: builder => ({
    getProjects: builder.query<ProjectType[], string>({
      query: uid => `/projects?ownerId=${uid}`,
      providesTags: ["Project"],
    }),
    getProjectById: builder.query<ProjectType, string>({
      query: id => `/projects/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Project", id }],
    }),
    createProject: builder.mutation<ProjectType, Partial<ProjectType>>({
      query: data => ({
        url: "/projects",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Project"],
    }),
    updateProject: builder.mutation<ProjectType, ProjectUpdateArgsType>({
      query: ({ id, data }) => ({
        url: `/projects/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Project"],
    }),
    deleteProject: builder.mutation<void, string>({
      query: id => ({
        url: `/projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Project"],
    }),
  }),
})

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectsApiSlice
