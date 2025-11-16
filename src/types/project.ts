import type { ComponentTreeNodeType } from "./component"

export type ProjectType = {
  id: number
  name: number
  ownerid?: string
}

export type ProjectWithComponentsType = ProjectType & {
  components: ComponentTreeNodeType[]
}

export type ProjectMapType = Map<string, ProjectWithComponentsType>

export type ProjectUpdateArgsType = {
  id: string
  data: Partial<ProjectType>
}
