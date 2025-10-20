/**
 * Рекурсивно преобразует компонент и его потомков в формат [название, [потомки...]] или "название".
 * @param {object} component Объект компонента с полем children.
 * @returns {Array|string} Массив или строка, представляющие компонент в виде "файловой" структуры.
 */
export const transformComponent = component => {
  const componentInfo = {
    id: component.id,
    name: component.name,
    type: "component",
  }
  // Если у компонента нет потомков, он считается "листом" (как файл или конечный компонент)
  if (!component.children || component.children.length === 0) {
    // В вашем примере "файлы" - это просто строки
    return componentInfo
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
  return [componentInfo, ...transformedChildren]
}
