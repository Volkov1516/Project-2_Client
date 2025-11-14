import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { io } from "socket.io-client"
import {
  selectActiveItemId,
  selectActiveItemTelegramKey,
  selectActiveItemType,
} from "@/features/projects/projectsSlice"
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

import { ChartAreaInteractive } from "@/components/chart/MockChart"

import {
  // ✅ ИСПРАВЛЕНИЕ: Используем более точное имя хука (если оно было изменено в requestsApiSlice)
  // Если вы не меняли имя в apiSlice, используйте useGetColumnsQuery
  useGetColumnsQuery,
  useGetCardsQuery,
} from "@/features/requests/requestsApiSlice"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Kanban as Icon } from "lucide-react"
import { ChartPieInteractive } from "@/components/chart/MockPieChart"
import { ChartRadarInteractive } from "@/components/chart/MockRadarChart"
import { ChartTooltipDefault } from "@/components/chart/MockTooltip"

// 💡 КОНСТАНТА ДЛЯ КОЛОНКИ ПО УМОЛЧАНИЮ
const DEFAULT_THREAD_COLUMN = {
  id: "thread",
  name: "Thread",
  cards: [],
}

export const Kanban = () => {
  // ------------------------------------------------------------------------
  // ✅ 1. ВСЕ ВЫЗОВЫ ХУКОВ ДОЛЖНЫ БЫТЬ ВНАЧАЛЕ! (Исправляет ошибку Uncaught Error: Rendered fewer hooks)
  // ------------------------------------------------------------------------

  // Хуки Redux
  const activeItemId = useSelector(selectActiveItemId)
  const activeItemTelegramKey = useSelector(selectActiveItemTelegramKey)
  const activeItemType = useSelector(selectActiveItemType)

  // Хуки RTK Query
  const {
    data: columns,
    isLoading: isColumnsLoading,
    error: columnsError,
  } = useGetColumnsQuery(
    // ✅ Добавляем ! для устранения ошибки TypeScript (ts 2345)
    activeItemId!,
    { skip: !activeItemId },
  )

  const {
    data: cards,
    isLoading: isCardsLoading,
    error: cardsError,
  } = useGetCardsQuery(
    // ✅ Добавляем ! для устранения ошибки TypeScript (ts 2345)
    activeItemId!,
    { skip: !activeItemId },
  )

  // Хуки useState
  const [kanbanData, setKanbanData] = useState([]) // Основное состояние DND
  const [activeId, setActiveId] = useState()

  useEffect(() => {
    const socket = io("https://project-2-server-das9.onrender.com") // Replace with your server URL

    socket.on("newCard", newCard => {
      console.log("New card received:", newCard)
      setKanbanData(prevKanbanData => {
        const updatedKanbanData = prevKanbanData.map(column => {
          if (column.id === newCard.columnId) {
            return {
              ...column,
              cards: [...column.cards, newCard],
            }
          }
          return column
        })

        // If the new card's column doesn't exist, add it to the default thread column.
        const targetColumnExists = updatedKanbanData.some(
          column => column.id === newCard.columnId,
        )
        if (!targetColumnExists) {
          return updatedKanbanData.map(column => {
            if (column.id === DEFAULT_THREAD_COLUMN.id) {
              return {
                ...column,
                cards: [...column.cards, newCard],
              }
            }
            return column
          })
        }

        return updatedKanbanData
      })
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  // Хуки Dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // ------------------------------------------------------------------------
  // ✅ 2. useEffect для синхронизации и структурирования данных
  // ------------------------------------------------------------------------
  useEffect(() => {
    let finalColumns = [] // 1. Определяем, какие колонки мы будем использовать
    if (columns && columns.length > 0) {
      // Ищем, есть ли колонка "thread" среди данных с сервера
      const serverThreadColumn = columns.find(
        col => col.id === DEFAULT_THREAD_COLUMN.id,
      ) // Если колонка "thread" пришла с сервера, используем ее и добавляем остальные

      if (serverThreadColumn) {
        finalColumns = [
          serverThreadColumn,
          ...columns.filter(col => col.id !== DEFAULT_THREAD_COLUMN.id),
        ]
      } else {
        // Если колонки есть, но thread отсутствует, добавляем дефолтную Thread первой
        finalColumns = [DEFAULT_THREAD_COLUMN, ...columns]
      }
    } else {
      // Если колонок с сервера нет или они не загружены, всегда показываем Thread
      finalColumns = [DEFAULT_THREAD_COLUMN]
    } // 2. Распределение карточек по этим колонкам
    // Мы выполняем эту логику, только если у нас есть хотя бы одна колонка (Thread) и данные карточек

    if (finalColumns.length > 0 && cards) {
      const columnMap = finalColumns.reduce((map, col) => {
        // Создаем новый объект колонки с пустым массивом cards
        map[col.id] = { ...col, cards: [] }
        return map
      }, {})

      cards.forEach(card => {
        // Карточки без columnId или с columnId, который соответствует Thread
        const targetId = card.status || DEFAULT_THREAD_COLUMN.id
        const column = columnMap[targetId]

        if (column) {
          column.cards.push(card)
        } else {
          // Если карточка пришла с columnId, которого нет в finalColumns,
          // по умолчанию отправляем ее в Thread (это предотвращает потерю данных)
          columnMap[DEFAULT_THREAD_COLUMN.id]?.cards.push(card)
        }
      }) // 3. Обновляем состояние DND, сохраняя порядок

      const structuredColumns = finalColumns.map(col => columnMap[col.id])
      setKanbanData(structuredColumns)
    } else if (finalColumns.length > 0 && !cards) {
      // Если колонки загружены, но карточки еще нет (или их нет вообще),
      // просто устанавливаем пустые колонки (включая Thread)
      setKanbanData(finalColumns.map(col => ({ ...col, cards: [] })))
    }
  }, [columns, cards])
  // ------------------------------------------------------------------------
  // ✅ 3. УСЛОВНЫЙ РЕНДЕР (Идет после ВСЕХ хуков)
  // ------------------------------------------------------------------------

  // 1. Проверка активации Telegram
  if (activeItemType === "project") {
    return (
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        <ChartAreaInteractive />
        <div className="flex flex-row gap-4 flex-1">
          <ChartTooltipDefault className="w-1/3" />
          <ChartPieInteractive className="w-1/3" />
          <ChartRadarInteractive className="w-1/3" />
        </div>
      </div>
    )
  }

  // 1.1. Проверка для компонента: если есть telegramKey, рендерим Kanban, иначе заглушку.
  if (activeItemType === "component" && !activeItemTelegramKey) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Icon />
          </EmptyMedia>
          <EmptyTitle>Component Selected</EmptyTitle>
          <EmptyDescription>
            This is a placeholder for component-specific content.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  // 1.2. Общая проверка для Kanban: если нет telegramKey, показываем заглушку.
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

  // 2. Проверка загрузки
  if (
    isColumnsLoading ||
    isCardsLoading ||
    (activeItemId && kanbanData.length === 0)
  ) {
    return <div>Loading...</div>
  }

  // 3. Проверка ошибки
  if (columnsError || cardsError) {
    return <div>Error loading data.</div>
  }

  // ------------------------------------------------------------------------
  // 4. ЛОГИКА КОМПОНЕНТА (НЕ ХУКИ)
  // ------------------------------------------------------------------------

  // 💡 Используем kanbanData
  const activeItemData = activeId
    ? kanbanData.flatMap(col => col.cards).find(card => card.id === activeId)
    : null

  function findContainer(id) {
    const container = kanbanData.find(
      column => column.id === id || column.name === id,
    )
    if (container) {
      return container.id
    }

    // 2. Ищем ID карточки
    const columnWithCard = kanbanData.find(column =>
      column.cards.some(card => card.id === id),
    )

    if (columnWithCard) {
      return columnWithCard.id
    }

    return undefined
  }

  const handleDragStart = event => {
    setActiveId(event.active.id)
  }

  function handleDragOver(event) {
    const { active, over, draggingRect } = event
    if (!over) return

    const { id } = active
    const { id: overId } = over

    // 💡 Используем kanbanData
    const activeContainerId = findContainer(id)
    const overContainerId = findContainer(overId)

    if (
      !activeContainerId ||
      !overContainerId ||
      activeContainerId === overContainerId
    ) {
      return
    }

    setKanbanData(prevColumns => {
      const activeContainer = prevColumns.find(c => c.id === activeContainerId)
      const overContainer = prevColumns.find(c => c.id === overContainerId)

      if (!activeContainer || !overContainer) return prevColumns

      const activeItems = activeContainer.cards
      const overItems = overContainer.cards
      const activeIndex = activeItems.findIndex(item => item.id === id)
      const overIndex = overItems.findIndex(item => item.id === overId)
      const movedItem = activeItems[activeIndex]

      let newIndex
      if (overContainer.id === overId) {
        newIndex = overItems.length
      } else {
        const isBelowLastItem =
          over &&
          overIndex === overItems.length - 1 &&
          draggingRect?.offsetTop > over.rect?.offsetTop + over.rect.height

        const modifier = isBelowLastItem ? 1 : 0
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length
      }

      // Обновление состояния (перемещение)
      return prevColumns.map(column => {
        if (column.id === activeContainerId) {
          // 1. Удаляем из активного контейнера
          return {
            ...column,
            cards: column.cards.filter(card => card.id !== active.id),
          }
        } else if (column.id === overContainerId) {
          // 2. Вставляем в целевой контейнер
          const newCards = [...overItems]
          newCards.splice(newIndex, 0, movedItem)

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
    setActiveId(null)

    if (!over) return

    const { id } = active
    const { id: overId } = over

    const activeContainerId = findContainer(id)
    const overContainerId = findContainer(overId)

    if (
      !activeContainerId ||
      !overContainerId ||
      activeContainerId !== overContainerId
    ) {
      return
    }

    // console.log(`Card ${active.id} moved from ${activeContainerId} to ${overContainerId}`);

    fetch("https://project-2-server-das9.onrender.com/cards/status", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cardId: active.id,
        newColumnId: overContainerId,
        componentId: activeItemId,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log("Card status updated on server:", data)
      })
      .catch(error => {
        console.error("Error updating card status:", error)
      })

    // Логика СОРТИРОВКИ ВНУТРИ ОДНОГО КОНТЕЙНЕРА
    setKanbanData(prevColumns => {
      const targetContainer = prevColumns.find(c => c.id === activeContainerId)
      if (!targetContainer) return prevColumns

      const activeItems = targetContainer.cards
      const activeIndex = activeItems.findIndex(item => item.id === active.id)
      const overIndex = activeItems.findIndex(item => item.id === overId)

      if (activeIndex !== overIndex) {
        return prevColumns.map(column => {
          if (column.id === activeContainerId) {
            return {
              ...column,
              cards: arrayMove(activeItems, activeIndex, overIndex),
            }
          }
          return column
        })
      }
      return prevColumns
    })
  }

  // ------------------------------------------------------------------------
  // 5. ОСНОВНОЙ JSX РЕНДЕР
  // ------------------------------------------------------------------------
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {/* This is where the Kanban board will be rendered when activeItemType is not 'project' or 'component' */}
      <div className="flex flex-col h-full gap-4">
        <div className="flex flex-row gap-4 flex-1 overflow-x-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            {kanbanData?.map(column => (
              <Column
                key={column.id}
                id={column.id}
                name={column.name}
                cards={column.cards}
                className="flex-shrink-0 min-w-[380px]"
              />
            ))}
            <DragOverlay>
              {activeItemData ? (
                <CardComponent
                  id={activeItemData.id}
                  text={activeItemData.text}
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
