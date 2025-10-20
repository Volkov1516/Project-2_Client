import { transformComponent } from "./transformComponent"

/**
 * Преобразует итоговую структуру проектов в формат, готовый для рендеринга компонентом Tree.
 * * Формат: [ {id, name, type}, item1, item2, ... ]
 * item1, item2 могут быть либо листом ({id, name}), либо узлом ([{id, name}, subitem1, ...]).
 * * @param {Array<Project>} finalStructure Массив объектов проектов, содержащих поле components.
 * @returns {Array<Array>} Массив, имитирующий файловую структуру, готовую для рендеринга.
 */
export const transformToProjectTree = finalStructure => {
  const tree = []

  // Итерация по каждому проекту
  finalStructure.forEach(project => {
    // 1. Создаем объект информации о самом проекте (для вывода в заголовке)
    const projectInfo = {
      id: project.id, // ID Проекта
      name: project.name,
      type: "project",
    }

    // 2. Преобразуем все корневые компоненты проекта
    // transformComponent возвращает либо {id, name} (лист), либо [ {id, name}, ...дети ] (узел).
    const transformedComponents = project.components.map(component =>
      transformComponent(component, project.id),
    )

    // 3. Формируем итоговый элемент проекта:
    // [ projectInfo, component1, component2, ... ]
    const projectItem = [projectInfo, ...transformedComponents]

    tree.push(projectItem)
  })

  return tree
}
