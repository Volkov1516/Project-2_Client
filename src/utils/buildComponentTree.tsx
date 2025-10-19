import type { ComponentType, ComponentsType } from "../types/componentType"

export const buildComponentTree = (components: ComponentsType) => {
  const componentMap = {} // Словарь для быстрого доступа к компонентам по ID
  const rootComponents = [] // Массив, куда попадут все корневые элементы

  // 1. Создание словаря и инициализация поля 'children'
  components.forEach(component => {
    // Делаем копию и добавляем поле children
    componentMap[component.id] = { ...component, children: [] }
  })

  // 2. Построение связей (дерева)
  Object.values(componentMap).forEach(component => {
    const parentId = component.parentid

    // Проверяем, есть ли parentId и существует ли родитель
    if (parentId !== null && parentId !== undefined && componentMap[parentId]) {
      // Это потомок: добавляем его в массив children родителя
      componentMap[parentId].children.push(component)
    } else {
      // Это корневой компонент
      rootComponents.push(component)
    }
  })

  return rootComponents
}
