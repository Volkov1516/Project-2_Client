export type ColumnType = {
  id: number
  component_id: number
  name: string
  position: number
}

export type UpdateColumnArgsType = {
  id: number
  data: Partial<ColumnType>
}
