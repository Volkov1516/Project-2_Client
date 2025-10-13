import type { Action, ThunkAction } from "@reduxjs/toolkit"
import { combineSlices, configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { counterSlice } from "../features/counter/counterSlice"
import { quotesApiSlice } from "../features/quotes/quotesApiSlice"
import { projectsApiSlice } from "../features/projects/projectsApiSlice"
import projectsReducer from "../features/projects/projectsSlice"

// Комбинируем slices
const rootReducer = combineSlices(
  counterSlice,
  quotesApiSlice,
  { projects: projectsReducer }, // добавляем локальный slice
  projectsApiSlice, // добавляем RTK Query slice
)

// Тип состояния
export type RootState = ReturnType<typeof rootReducer>

// Настройка store
export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware()
        .concat(quotesApiSlice.middleware)
        .concat(projectsApiSlice.middleware), // добавляем middleware RTK Query для проектов
    preloadedState,
  })

  setupListeners(store.dispatch)
  return store
}

export const store = makeStore()

// Типы для dispatch и thunk
export type AppStore = typeof store
export type AppDispatch = AppStore["dispatch"]
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>
