import { transformComponent } from "./transformComponent"

/**
 * Преобразует итоговый массив проектов в требуемую структуру.
 * @param {Array} finalStructure Массив объектов проектов, содержащих поле components.
 * @returns {Array} Массив, имитирующий файловую структуру.
 */
export const transformToProjectTree = finalStructure => {
  const tree = []

  // Итерация по каждому проекту
  finalStructure.forEach(project => {
    const projectContents = []

    // Преобразование корневых компонентов проекта
    project.components.forEach(rootComponent => {
      // Каждый корневой компонент преобразуется с помощью рекурсивной функции
      const transformedComponent = transformComponent(rootComponent)

      // Внимание: если transformComponent вернул массив, его содержимое нужно "раскрыть"
      // чтобы оно соответствовало целевому формату
      if (
        Array.isArray(transformedComponent) &&
        transformedComponent.length > 1
      ) {
        // Если это компонент-каталог, добавляем его содержимое в projectContents
        // Проверка 2: Убедиться, что потомки не пустой массив
        const descendants = transformedComponent.slice(1)
        const hasDescendants =
          descendants.length > 0 &&
          !(Array.isArray(descendants[0]) && descendants[0].length === 0)

        if (hasDescendants) {
          // Если есть потомки, раскрываем их
          projectContents.push(transformedComponent[0], ...descendants)
        } else {
          // Если потомков нет, добавляем только имя (как будто это был лист)
          projectContents.push(transformedComponent[0])
        }
      } else {
        // Если это компонент-лист, просто добавляем его название
        projectContents.push(transformedComponent)
      }
    })

    // Формирование итогового элемента для проекта: [название_проекта, [содержимое...]]
    // Примечание: Ваш целевой формат [ "название", [ содержимое ] ]
    tree.push([project.name, projectContents])
  })

  return tree
}
