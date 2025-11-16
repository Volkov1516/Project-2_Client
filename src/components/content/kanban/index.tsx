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

import { useGetColumnsQuery } from "@/features/columns/columnsApiSlice"
import { useGetCardsQuery } from "@/features/cards/cardsApiSlice"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Kanban as Icon } from "lucide-react"

interface KanbanCard {
  id: string
  columnId: string
  text: string
  status?: string
}

interface KanbanColumn {
  id: string
  name: string
  cards: KanbanCard[]
  componentId?: string
  position?: number
}

const DEFAULT_THREAD_COLUMN: KanbanColumn = {
  id: "thread",
  name: "Thread",
  cards: [],
}

export const Kanban = () => {
  const activeItemId = useSelector(selectActiveItemId)
  const activeItemTelegramKey = useSelector(selectActiveItemTelegramKey)
  const activeItemType = useSelector(selectActiveItemType)

  const {
    data: columns,
    isLoading: isColumnsLoading,
    error: columnsError,
  } = useGetColumnsQuery(activeItemId!, { skip: !activeItemId })

  const {
    data: cards,
    isLoading: isCardsLoading,
    error: cardsError,
  } = useGetCardsQuery(activeItemId!, { skip: !activeItemId })

  const [kanbanData, setKanbanData] = useState<KanbanColumn[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const socket = io("https://project-2-server-das9.onrender.com")

    socket.on("newCard", (newCard: KanbanCard) => {
      console.log("New card received:", newCard)
      setKanbanData(prevKanbanData => {
        const updatedKanbanData = prevKanbanData.map((column: KanbanColumn) => {
          if (column.id === newCard.columnId) {
            return {
              ...column,
              cards: [...column.cards, newCard],
            }
          }
          return column
        })

        const targetColumnExists = updatedKanbanData.some(
          (column: KanbanColumn) => column.id === newCard.columnId,
        )
        if (!targetColumnExists) {
          return updatedKanbanData.map((column: KanbanColumn) => {
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  useEffect(() => {
    let finalColumns: KanbanColumn[] = []
    if (columns && columns.length > 0) {
      const serverThreadColumn = columns.find(
        (col: KanbanColumn) => col.id === DEFAULT_THREAD_COLUMN.id,
      )

      if (serverThreadColumn) {
        finalColumns = [
          serverThreadColumn,
          ...columns.filter(
            (col: KanbanColumn) => col.id !== DEFAULT_THREAD_COLUMN.id,
          ),
        ]
      } else {
        finalColumns = [DEFAULT_THREAD_COLUMN, ...columns]
      }
    } else {
      finalColumns = [DEFAULT_THREAD_COLUMN]
    }

    if (finalColumns.length > 0 && cards) {
      const columnMap: Record<string, KanbanColumn> = finalColumns.reduce(
        (map, col: KanbanColumn) => {
          // Создаем новый объект колонки с пустым массивом cards
          map[col.id] = { ...col, cards: [] }
          return map
        },
        {},
      )

      cards.forEach((card: KanbanCard) => {
        const targetId = card.status || DEFAULT_THREAD_COLUMN.id
        const column = columnMap[targetId]

        if (column) {
          column.cards.push(card)
        } else {
          columnMap[DEFAULT_THREAD_COLUMN.id]?.cards.push(card)
        }
      })

      const structuredColumns = finalColumns.map(
        (col: KanbanColumn) => columnMap[col.id],
      )
      setKanbanData(structuredColumns)
    } else if (finalColumns.length > 0 && !cards) {
      setKanbanData(
        finalColumns.map((col: KanbanColumn) => ({ ...col, cards: [] })),
      )
    }
  }, [columns, cards])

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

  if (
    isColumnsLoading ||
    isCardsLoading ||
    (activeItemId && kanbanData.length === 0)
  ) {
    return <div>Loading...</div>
  }

  console.log(columnsError)
  console.log(cardsError)

  if (columnsError || cardsError) {
    return <div>Error loading data.</div>
  }

  const activeItemData = activeId
    ? kanbanData.flatMap(col => col.cards).find(card => card.id === activeId)
    : null

  function findContainer(id: string) {
    const container = kanbanData.find(
      (column: KanbanColumn) => column.id === id || column.name === id,
    )
    if (container) {
      return container.id
    }

    const columnWithCard = kanbanData.find((column: KanbanColumn) =>
      column.cards.some((card: KanbanCard) => card.id === id),
    )

    if (columnWithCard) {
      return columnWithCard.id
    }

    return undefined
  }

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
  }

  function handleDragOver(event: any) {
    const { active, over, draggingRect } = event
    if (!over) return

    const { id } = active
    const { id: overId } = over

    // 💡 Используем kanbanData
    const activeContainerId = findContainer(id as string)
    const overContainerId = findContainer(overId as string)

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
      const activeIndex = activeItems.findIndex(
        (item: KanbanCard) => item.id === id,
      )
      const overIndex = overItems.findIndex(
        (item: KanbanCard) => item.id === overId,
      )
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
            cards: column.cards.filter(
              (card: KanbanCard) => card.id !== active.id,
            ),
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

  function handleDragEnd(event: any) {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const { id } = active
    const { id: overId } = over

    const activeContainerId = findContainer(id as string)
    const overContainerId = findContainer(overId as string)

    if (
      !activeContainerId ||
      !overContainerId ||
      activeContainerId !== overContainerId
    ) {
      return
    }

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

    setKanbanData(prevColumns => {
      const targetContainer = prevColumns.find(c => c.id === activeContainerId)
      if (!targetContainer) return prevColumns

      const activeItems = targetContainer.cards
      const activeIndex = activeItems.findIndex(
        (item: KanbanCard) => item.id === active.id,
      )
      const overIndex = activeItems.findIndex(
        (item: KanbanCard) => item.id === overId,
      )

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

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="flex flex-col h-full gap-4">
        <div className="flex flex-row gap-4 flex-1 overflow-x-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            {kanbanData?.map((column: KanbanColumn) => (
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
