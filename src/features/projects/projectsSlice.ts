import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { ProjectsState } from "./types"

const initialState: ProjectsState = {
  selectedProjectId: null,
  activeItemId: null,
  activeItemTelegramKey: null,
  activeItemType: null,
}

export const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setSelectedProject: (state, action: PayloadAction<number>) => {
      state.selectedProjectId = action.payload
    },
    setActiveItem: (
      state,
      action: PayloadAction<{
        id: string
        telegramKey?: string
        type?: "project" | "kanban" | "component"
      }>,
    ) => {
      state.activeItemId = action.payload.id
      state.activeItemTelegramKey = action.payload.telegramKey
      state.activeItemType = action.payload.type
    },
  },
})

export const { setSelectedProject, setActiveItem } = projectsSlice.actions

export default projectsSlice.reducer

export const selectActiveItemId = (state: { projects: ProjectsState }) =>
  state.projects.activeItemId

export const selectActiveItemTelegramKey = (state: {
  projects: ProjectsState
}) => state.projects.activeItemTelegramKey

export const selectActiveItemType = (state: { projects: ProjectsState }) =>
  state.projects.activeItemType
