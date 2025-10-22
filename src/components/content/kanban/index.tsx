import { useState } from "react"
import { useSelector } from "react-redux"
import { selectActiveItemTelegramKey } from "@/features/projects/projectsSlice"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable"

import { Column } from "./Column"
import { CardComponent } from "./Card"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Kanban as Icon } from "lucide-react"

export const Kanban = () => {
  const activeItemTelegramKey = useSelector(selectActiveItemTelegramKey)

  const [columns, setColumns] = useState([
    {
      id: 1,
      name: "Thread",
      cards: [
        { id: 11, text: "First" },
        { id: 12, text: "First-Two" },
      ],
    },
    { id: 2, name: "Active", cards: [{ id: 21, text: "Second" }] },
    { id: 3, name: "Done", cards: [{ id: 31, text: "Third" }] },
  ])

  const [activeId, setActiveId] = useState()

  const activeItemData = activeId
    ? columns.flatMap(col => col.cards).find(card => card.id === activeId)
    : null

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  function findContainer(id) {
    const container = columns.find(
      column => column.id === id || column.name === id,
    )
    if (container) {
      return container.id // Возвращаем ID колонки
    }

    // 2. Ищем ID карточки внутри массива 'cards' каждой колонки
    const columnWithCard = columns.find(column =>
      column.cards.some(card => card.id === id),
    )

    if (columnWithCard) {
      return columnWithCard.id // Возвращаем ID колонки, содержащей карточку
    }

    return undefined // Ничего не найдено
  }

  const handleDragStart = event => {
    const { active } = event
    const { id } = active

    setActiveId(id)
  }

  function handleDragOver(event) {
    const { active, over, draggingRect } = event
    const { id } = active

    // Если over — null (вышли за пределы), или нет ID (DragOverlay), то возвращаемся
    if (!over) return
    const { id: overId } = over

    // 💡 Используем columns вместо items
    const activeContainerId = findContainer(id, columns)
    const overContainerId = findContainer(overId, columns)

    if (
      !activeContainerId ||
      !overContainerId ||
      activeContainerId === overContainerId
    ) {
      return
    }

    setColumns(prevColumns => {
      // Находим реальные объекты колонок
      const activeContainer = prevColumns.find(c => c.id === activeContainerId)
      const overContainer = prevColumns.find(c => c.id === overContainerId)

      if (!activeContainer || !overContainer) return prevColumns

      // Массивы карточек
      const activeItems = activeContainer.cards
      const overItems = overContainer.cards

      // Находим индексы (findIndex, т.к. это массив объектов)
      const activeIndex = activeItems.findIndex(item => item.id === id)
      const overIndex = overItems.findIndex(item => item.id === overId)

      // 💡 Находим объект перемещаемой карточки
      const movedItem = activeItems[activeIndex]

      // --- Логика определения нового индекса (сложная, из dnd-kit) ---
      let newIndex
      // Если бросаем на саму колонку (пустую или нет)
      if (overContainer.id === overId) {
        newIndex = overItems.length
      } else {
        // Если бросаем на другую карточку
        const isBelowLastItem =
          over &&
          overIndex === overItems.length - 1 &&
          draggingRect?.offsetTop > over.rect?.offsetTop + over.rect.height

        const modifier = isBelowLastItem ? 1 : 0

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length
      }

      // --- Обновление состояния ---
      return prevColumns.map(column => {
        if (column.id === activeContainerId) {
          // 1. Удаляем из активного контейнера
          return {
            ...column,
            cards: column.cards.filter(card => card.id !== active.id),
          }
        } else if (column.id === overContainerId) {
          // 2. Вставляем в целевой контейнер в newIndex
          const newCards = [...overItems]
          newCards.splice(newIndex, 0, movedItem) // Вставка в определенную позицию

          return {
            ...column,
            cards: newCards,
          }
        }
        return column
      })
    })
  }

  function handleDragEnd(event) {
    const { active, over } = event
    const { id } = active

    // Сброс activeId для DragOverlay
    setActiveId(null)

    if (!over) return

    const { id: overId } = over

    // 💡 Используем columns
    // const activeContainerId = findContainer(id, columns)
    // const overContainerId = findContainer(overId, columns)
    const activeContainerId = findContainer(id)
    const overContainerId = findContainer(overId)

    // Если overContainerId отличается, значит, handleDragOver уже переместил данные.
    // Нам нужно только выполнить сортировку, если контейнер не изменился.
    if (
      !activeContainerId ||
      !overContainerId ||
      activeContainerId !== overContainerId
    ) {
      return
    }

    // --- Логика СОРТИРОВКИ ВНУТРИ ОДНОГО КОНТЕЙНЕРА ---

    setColumns(prevColumns => {
      const targetContainer = prevColumns.find(c => c.id === activeContainerId)
      if (!targetContainer) return prevColumns

      const activeItems = targetContainer.cards

      // Находим индексы (findIndex, т.к. это массив объектов)
      const activeIndex = activeItems.findIndex(item => item.id === active.id)
      const overIndex = activeItems.findIndex(item => item.id === overId)

      if (activeIndex !== overIndex) {
        return prevColumns.map(column => {
          if (column.id === activeContainerId) {
            return {
              ...column,
              // Используем arrayMove для безопасной сортировки массива объектов
              cards: arrayMove(activeItems, activeIndex, overIndex),
            }
          }
          return column
        })
      }
      return prevColumns
    })
  }

  if (!activeItemTelegramKey) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Icon />
          </EmptyMedia>
          <EmptyTitle>Kanban Not Activated</EmptyTitle>
          <EmptyDescription>
            To activate the Kanban board for this component, please navigate to
            the "Settings" tab to enter the required data.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="flex flex-col h-full gap-4">
        <div className="grid gap-4 md:grid-cols-3 flex-1">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            {columns.map(column => (
              <Column
                key={column.id}
                id={column.id}
                name={column.name}
                cards={column.cards}
              />
            ))}
            <DragOverlay>
              {activeItemData ? (
                <CardComponent
                  id={activeItemData.id}
                  text={activeItemData.text} // или другой пропс для текста
                  isOverlay={true}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  )
}
