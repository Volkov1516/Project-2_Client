import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { ProjectsState } from "./types"

const initialState: ProjectsState = {
  selectedProjectId: null,
  activeItemId: null,
  activeItemTelegramKey: null,
}

export const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setSelectedProject: (state, action: PayloadAction<number>) => {
      state.selectedProjectId = action.payload
    },
    setActiveItem: (state, action: PayloadAction<string>) => {
      state.activeItemId = action.payload.id
      state.activeItemTelegramKey = action.payload.telegramKey
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
