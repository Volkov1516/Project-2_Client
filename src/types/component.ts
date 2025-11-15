export type ComponentType = {
  id: string
  projectid: string
  parentid?: string | null
  name: string
  telegramkey?: string | null
  children?: ComponentTreeNodeType[]
}

export type ComponentsType = ComponentType[]

export type ComponentTreeNodeType = ComponentType & {
  children: ComponentTreeNodeType[]
}

export type ComponentMapType = Record<string, ComponentTreeNodeType>

export type ComponentUpdateArgsType = {
  id: string
  data: Partial<ComponentType>
}
