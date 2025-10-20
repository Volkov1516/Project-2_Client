// utils/transformComponent.ts (Пример)

export const transformComponent = (component, projectId) => {
  // 💡 Добавляем projectId в аргументы
  const componentInfo = {
    id: component.id,
    name: component.name,
    type: "component",
    projectId: projectId, // 💡 Сохраняем ID проекта в данных компонента
  }

  if (!component.children || component.children.length === 0) {
    return componentInfo
  }

  // Рекурсивно передаем projectId в дочерние вызовы
  const transformedChildren = component.children.map(
    child => transformComponent(child, projectId), // 💡 Передача projectId
  )

  return [componentInfo, ...transformedChildren]
}
