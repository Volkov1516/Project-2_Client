import { useState } from "react"

import {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetComponentsQuery,
  useCreateComponentMutation,
  useUpdateComponentMutation,
  useDeleteComponentMutation,
} from "../features/projects/projectsApiSlice"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar"

import { Tree } from "./sidebar-tree"
import { SidebarDialogCreateProject } from "@/components/sidebar-dialog-create-project"

export const SidebarContentProjects = () => {
  const {
    data: projects,
    isLoading: isProjectLoading,
    error: projectError,
  } = useGetProjectsQuery()
  const [createProject] = useCreateProjectMutation()
  const [updateProject] = useUpdateProjectMutation()
  const [deleteProject] = useDeleteProjectMutation()

  const {
    data: components,
    isLoading: isComponentsLoading,
    error: componentsError,
  } = useGetComponentsQuery()
  const [createComponent] = useCreateComponentMutation()
  const [updateComponent] = useUpdateComponentMutation()
  const [deleteComponent] = useDeleteComponentMutation()

  if (isProjectLoading || isComponentsLoading) {
    return <div>Загрузка...</div>
  }

  if (projectError || componentsError) {
    return <div>Ошибка загрузки данных.</div>
  }

  console.log(components)

  function buildComponentTree(components) {
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
      if (
        parentId !== null &&
        parentId !== undefined &&
        componentMap[parentId]
      ) {
        // Это потомок: добавляем его в массив children родителя
        componentMap[parentId].children.push(component)
      } else {
        // Это корневой компонент
        rootComponents.push(component)
      }
    })

    return rootComponents
  }

  const componentTree = buildComponentTree(components)
  console.log("Дерево компонентов:", JSON.stringify(componentTree, null, 2))

  // Предполагая, что 'componentTree' — это ваш вывод
  function mergeProjectsAndComponents(projects, componentTree) {
    // 1. Создание Map для проектов для быстрого доступа и для итоговой структуры
    const projectMap = new Map()
    projects.forEach(project => {
      // Инициализируем каждый проект с пустым массивом для компонентов
      projectMap.set(project.id, { ...project, components: [] })
    })

    // 2. Привязка корневых компонентов к проектам
    componentTree.forEach(rootComponent => {
      // ВНИМАНИЕ: Используем projectid (строчные буквы), как в вашем JSON
      const projectId = rootComponent.projectid
      const project = projectMap.get(projectId)

      if (project) {
        // Добавляем корневой компонент (уже с его потомками) в проект
        project.components.push(rootComponent)
      }
    })

    // 3. Возвращаем массив готовых проектов
    return Array.from(projectMap.values())
  }

  const finalStructure = mergeProjectsAndComponents(projects, componentTree)
  console.log(JSON.stringify(finalStructure, null, 2))

  /**
   * Рекурсивно преобразует компонент и его потомков в формат [название, [потомки...]] или "название".
   * @param {object} component Объект компонента с полем children.
   * @returns {Array|string} Массив или строка, представляющие компонент в виде "файловой" структуры.
   */
  function transformComponent(component) {
    // Если у компонента нет потомков, он считается "листом" (как файл или конечный компонент)
    if (!component.children || component.children.length === 0) {
      // В вашем примере "файлы" - это просто строки
      return component.name
    }

    // Если у компонента есть потомки, он считается "каталогом"
    // Структура: [название_каталога, [потомок1, потомок2, ...]]

    // 1. Получаем преобразованных потомков
    const transformedChildren = component.children.map(transformComponent)

    // 2. Возвращаем массив, где первый элемент — имя компонента, а второй — массив его потомков.
    // Обратите внимание: в вашем целевом формате элементы children могут идти сразу после имени:
    // [ "название_каталога", "файл1", ["вложенная_папка", [...] ] ]

    const filteredChildren = transformedChildren.filter(child => {
      // Проверяем, что элемент не является массивом [имя, []]
      if (
        Array.isArray(child) &&
        child.length === 2 &&
        Array.isArray(child[1]) &&
        child[1].length === 0
      ) {
        return false
      }
      // Убедимся, что это не просто пустой массив (хотя transformComponent его не возвращает)
      return (
        child !== null &&
        child !== undefined &&
        !(Array.isArray(child) && child.length === 0)
      )
    })

    // 3. Главное условие: Если после фильтрации потомков не осталось, считаем его листом.
    // ЭТО И ЕСТЬ ВАШЕ ОСНОВНОЕ ИСПРАВЛЕНИЕ:
    if (filteredChildren.length === 0) {
      return component.name
    }

    // Чтобы соответствовать целевому формату [ "название", [ содержимое ] ]
    // где содержимое - это массив, сделаем так:
    return [component.name, filteredChildren]
  }

  /**
   * Преобразует итоговый массив проектов в требуемую структуру.
   * @param {Array} finalStructure Массив объектов проектов, содержащих поле components.
   * @returns {Array} Массив, имитирующий файловую структуру.
   */
  function transformToProjectTree(finalStructure) {
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

  const outputTree = transformToProjectTree(finalStructure)

  console.log("Финальная структура в виде массива-дерева:")
  console.log(JSON.stringify(outputTree, null, 2))

  const handleUpdateProject = async (id: string, name: string) => {
    try {
      await updateProject({ id, data: { name: `Updated ${name}` } }).unwrap()
    } catch (err) {
      console.error("Ошибка при обновлении проекта:", err)
    }
  }

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id).unwrap()
    } catch (err) {
      console.error("Ошибка при удалении проекта:", err)
    }
  }

  const handleCreateComponent = async (id: string) => {
    try {
      await createComponent({
        name: `Component ${String(Date.now())}`,
        projectId: id,
      }).unwrap()
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdateComponent = async (id: string, name: string) => {
    try {
      await updateComponent({ id, data: { name: `Updated ${name}` } }).unwrap()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteComponent = async (id: string) => {
    try {
      await deleteComponent(id).unwrap()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarGroupContent className="overflow-x-scroll">
        <SidebarMenu>
          {outputTree.map((item, index) => (
            <Tree key={index} item={item} />
          ))}

          <SidebarDialogCreateProject createProject={createProject} />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
