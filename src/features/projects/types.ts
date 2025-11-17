// features/projects/types.ts
import type { ProjectType } from "@/types/project"
import type { ComponentType } from "@/types/component"

export type Project = ProjectType

export type Component = ComponentType

interface ProjectsState {
  selectedProjectId: number | null
  activeItemId: string | null
  activeItemTelegramKey: string | null
  activeItemType: "project" | "kanban" | "component" | null
  activeView: "kanban" | "analytics" | "members" | "settings"
}

export type UpdateProjectArgsType = {
  id: string
  data: Partial<Project>
}

export type UpdateComponentArgsType = {
  id: string
  data: Partial<Component>
}
