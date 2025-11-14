import { CSS } from "@dnd-kit/utilities"

import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { useSortable } from "@dnd-kit/sortable"

interface CardComponentProps {
  id: string
  text: string
  isOverlay?: boolean
}

export const CardComponent = ({ id, text, isOverlay = false }: CardComponentProps) => {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isOverlay ? 999 : "auto",
    opacity: isOverlay ? 0.9 : 1,
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="@container/card cursor-grab hover:shadow-lg transition-shadow"
    >
      <CardContent>
        <p>{text}</p>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">Thomas Anderson | 21.10.2025</CardFooter>
    </Card>
  )
}
