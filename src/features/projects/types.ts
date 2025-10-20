// features/projects/types.ts
export type Project = {
  id: number
  ownerId: string
  name: string
}

export type Component = {
  id: number
  projectId: string
  name: string
}

export type ProjectsState = {
  selectedProjectId: number | null
  activeItemId: string | null
}

export type UpdateProjectArgs = {
  id: string
  data: Partial<Project>
}
