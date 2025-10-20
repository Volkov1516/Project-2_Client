import type { ComponentType } from "../types/component"

const transformComponent = (component: ComponentType, projectId: string) => {
  const componentInfo = {
    id: component.id,
    name: component.name,
    telegramKey: component.telegramkey,
    type: "component",
    projectId: projectId,
  }

  if (!component.children || component.children.length === 0) {
    return componentInfo
  }

  const transformedChildren = component.children.map(child =>
    transformComponent(child, projectId),
  )

  return [componentInfo, ...transformedChildren]
}

export const buildSidebarTree = finalStructure => {
  const tree = []

  finalStructure.forEach(project => {
    const projectInfo = {
      id: project.id,
      name: project.name,
      type: "project",
    }

    const transformedComponents = project.components.map(component =>
      transformComponent(component, project.id),
    )

    const projectItem = [projectInfo, ...transformedComponents]

    tree.push(projectItem)
  })

  return tree
}
