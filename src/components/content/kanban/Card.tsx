import { CSS } from "@dnd-kit/utilities"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useSortable } from "@dnd-kit/sortable"

export const CardComponent = ({ id, text, isOverlay = false }) => {
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
      <CardHeader>
        <CardTitle>Request #1234</CardTitle>
        <CardDescription>Thomas Anderson | 21.10.2025</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{text}</p>
      </CardContent>
    </Card>
  )
}
