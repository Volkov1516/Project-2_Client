export type Column = {
  id: string
  componentId: string
  name: string
  position?: number
}

export type UpdateColumnArgs = {
  id: string
  data: Partial<Column>
}

export type Card = {
  id: string | number
  userId?: string
  userFirstName?: string
  userLastName?: string
  componentId?: string
  origin?: string
  text?: string
  status: string
}
