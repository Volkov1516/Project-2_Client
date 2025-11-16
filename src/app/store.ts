import type { Action, ThunkAction } from "@reduxjs/toolkit"
import { combineSlices, configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import projectsReducer from "../features/projects/projectsSlice"
import { projectsApiSlice } from "../features/projects/projectsApiSlice"
import { componentsApiSlice } from "@/features/components/componentsApiSlice"
import { columnsApiSlice } from "@/features/columns/columnsApiSlice"
import { cardsApiSlice } from "@/features/cards/cardsApiSlice"

const rootReducer = combineSlices(
  { projects: projectsReducer },
  projectsApiSlice,
  componentsApiSlice,
  columnsApiSlice,
  cardsApiSlice,
)

export type RootState = ReturnType<typeof rootReducer>

export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware()
        .concat(projectsApiSlice.middleware)
        .concat(componentsApiSlice.middleware)
        .concat(columnsApiSlice.middleware)
        .concat(cardsApiSlice.middleware),
    preloadedState,
  })

  setupListeners(store.dispatch)
  return store
}

export const store = makeStore()

export type AppStore = typeof store
export type AppDispatch = AppStore["dispatch"]
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>
