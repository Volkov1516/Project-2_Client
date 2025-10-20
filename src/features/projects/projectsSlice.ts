import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { ProjectsState } from "./types"

const initialState: ProjectsState = {
  selectedProjectId: null,
  activeItemId: null,
}

export const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setSelectedProject: (state, action: PayloadAction<number>) => {
      state.selectedProjectId = action.payload
    },
    // ✅ ИСПРАВЛЕНИЕ ОПЕЧАТКИ: etActiveItem -> setActiveItem
    setActiveItem: (state, action: PayloadAction<string>) => {
      // action.payload - это ID, который мы передаем из компонента Tree.jsx
      state.activeItemId = action.payload
    },
  },
})

// ✅ ИСПРАВЛЕНИЕ ЭКСПОРТА: убедитесь, что вы экспортируете setActiveItem
export const { setSelectedProject, setActiveItem } = projectsSlice.actions

export default projectsSlice.reducer

export const selectActiveItemId = (state: { projects: ProjectsState }) =>
  state.projects.activeItemId
