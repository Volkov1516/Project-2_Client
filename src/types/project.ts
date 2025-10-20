import type { ComponentTreeNodeType } from "./component"

export type ProjectType = {
  id: string
  name: string
  ownerid?: string
}

export type ProjectWithComponentsType = ProjectType & {
  components: ComponentTreeNodeType[]
}

export type ProjectMapType = Map<string, ProjectWithComponentsType>
