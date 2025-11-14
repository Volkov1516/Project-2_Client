import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"

import { CardComponent } from "./Card"

interface ColumnProps {
  id: string
  name: string
  cards: { id: string; text: string }[]
  className?: string
}

export const Column = ({ id, name, cards, className }: ColumnProps) => {
  const { setNodeRef } = useDroppable({ id })

  return (
    <div className={`h-full flex flex-col ${className}`}>
      <h3 className="text-2xl font-bold tracking-tight pb-2">{name}</h3>
      <SortableContext
        id={id}
        items={cards || []}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className="bg-muted/50 rounded-xl flex-1 p-2 flex flex-col gap-2 overflow-y-auto"
        >
          {cards?.map((card: { id: string; text: string }) => (
            <CardComponent key={card.id} id={card.id} text={card.text} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}
