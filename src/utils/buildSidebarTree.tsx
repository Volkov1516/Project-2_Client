import type { ComponentType, ComponentTreeNodeType } from "../types/component"
import type { ProjectWithComponentsType, ProjectType } from "../types/project"

const transformComponent = (
  component: ComponentTreeNodeType,
  projectId: string,
) => {
  const componentInfo = {
    id: component.id,
    name: component.name,
    telegramKey: component.telegram_key,
    type: "component" as const,
    projectId: projectId,
  }

  if (!component.children || component.children.length === 0) {
    return componentInfo
  }

  const transformedChildren = component.children.map(
    (child: ComponentTreeNodeType) => transformComponent(child, projectId),
  )

  return [componentInfo, ...transformedChildren]
}

export const buildSidebarTree = (
  finalStructure: ProjectWithComponentsType[],
) => {
  const tree: (ProjectType | ComponentType)[] = []

  finalStructure.forEach((project: ProjectWithComponentsType) => {
    const projectInfo = {
      id: project.id,
      name: project.name,
      type: "project" as const,
    }

    const transformedComponents = project.components.map(
      (component: ComponentTreeNodeType) =>
        transformComponent(component, project.id),
    )

    const projectItem: (ProjectType | ComponentType)[] = [
      projectInfo,
      ...transformedComponents,
    ]

    tree.push(projectItem as any)
  })

  return tree
}
