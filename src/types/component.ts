export type ComponentType = {
  id: string
  projectid: string
  parentid?: string
  name: string
  telegramkey?: string
}

export type ComponentsType = ComponentType[]

export type ComponentTreeNodeType = ComponentType & {
  children: ComponentTreeNodeType[]
}

export type ComponentMapType = Record<string, ComponentTreeNodeType>
