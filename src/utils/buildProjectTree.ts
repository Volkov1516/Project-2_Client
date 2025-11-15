import type {
  ComponentType,
  ComponentsType,
  ComponentTreeNodeType,
  ComponentMapType,
} from "../types/component"
import type {
  ProjectType,
  ProjectWithComponentsType,
  ProjectMapType,
} from "../types/project"

const buildComponentTree = (
  components: ComponentsType,
): ComponentTreeNodeType[] => {
  const componentMap: ComponentMapType = {}
  const rootComponents: ComponentTreeNodeType[] = []

  components.forEach((component: ComponentType) => {
    const componentIdString = String(component.id)

    componentMap[componentIdString] = {
      ...component,
      children: [],
    } as ComponentTreeNodeType
  })

  Object.values(componentMap).forEach(component => {
    const parentId = component.parent_id

    if (parentId !== null && parentId !== undefined) {
      const parentIdString = String(parentId)

      if (componentMap[parentIdString]) {
        componentMap[parentIdString].children.push(
          component as ComponentTreeNodeType,
        )
      } else {
        rootComponents.push(component as ComponentTreeNodeType)
      }
    } else {
      rootComponents.push(component as ComponentTreeNodeType)
    }
  })

  return rootComponents
}

const mergeProjectsAndComponents = (
  projects: ProjectType[],
  componentTree: ComponentTreeNodeType[],
): ProjectWithComponentsType[] => {
  const projectMap: ProjectMapType = new Map()

  projects.forEach(project => {
    const projectIdString = String(project.id)
    projectMap.set(projectIdString, { ...project, components: [] })
  })

  componentTree.forEach(rootComponent => {
    const projectId = rootComponent.project_id

    const projectIdString = String(projectId)
    const project = projectMap.get(projectIdString)

    if (project) {
      project.components.push(rootComponent)
    }
  })

  return Array.from(projectMap.values())
}

export const buildProjectTree = (
  projects: ProjectType[],
  components: ComponentsType,
): ProjectWithComponentsType[] => {
  const componentTree = buildComponentTree(components)

  return mergeProjectsAndComponents(projects, componentTree)
}
