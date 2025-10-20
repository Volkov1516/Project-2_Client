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
    componentMap[component.id] = {
      ...component,
      children: [],
    } as ComponentTreeNodeType
  })

  Object.values(componentMap).forEach(component => {
    const parentId = component.parentid

    if (parentId && componentMap[parentId]) {
      componentMap[parentId].children.push(component)
    } else {
      rootComponents.push(component)
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
    projectMap.set(project.id, { ...project, components: [] })
  })

  componentTree.forEach(rootComponent => {
    const projectId = rootComponent.projectid
    const project = projectMap.get(projectId)

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
