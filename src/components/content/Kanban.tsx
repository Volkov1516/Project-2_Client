import { useSelector } from "react-redux"
import { selectActiveItemTelegramKey } from "@/features/projects/projectsSlice"

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
          <div className="bg-muted/50 rounded-xl h-full" />
          <div className="bg-muted/50 rounded-xl h-full" />
          <div className="bg-muted/50 rounded-xl h-full" />
        </div>
      </div>
    </div>
  )
}
