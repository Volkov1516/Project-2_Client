export const mergeProjectsAndComponents = (projects, componentTree) => {
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
