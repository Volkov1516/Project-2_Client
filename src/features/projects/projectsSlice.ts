import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { ProjectsState } from "./types"

const initialState: ProjectsState = {
  selectedProjectId: null,
}

export const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setSelectedProject: (state, action: PayloadAction<number>) => {
      state.selectedProjectId = action.payload
    },
  },
})

export const { setSelectedProject } = projectsSlice.actions
export default projectsSlice.reducer
