import { useState } from "react"
import { useSelector } from "react-redux"
import {
  selectActiveItemId,
  selectActiveItemTelegramKey,
} from "@/features/projects/projectsSlice"

import { Header } from "./Header"
import { Kanban } from "./kanban"
import { Settings } from "./Settings"
import { Members } from "./Members"
import { Analytics } from "./Analytics"
import type { ComponentType } from "@/types/component"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { PanelsTopLeft, ArrowUpRightIcon, Frown } from "lucide-react"

type ViewComponents = {
  kanban: React.FC
  analytics: React.FC
  members: React.FC
  settings: React.FC<{
    activeItemTelegramKey: ComponentType["telegramkey"]
    activeItemId: ComponentType["id"]
  }>
}

const VIEWS: ViewComponents = {
  kanban: Kanban,
  analytics: Analytics,
  members: Members,
  settings: Settings,
}

export const AppContent = () => {
  const [activeView, setActiveView] = useState("kanban")

  const activeItemId = useSelector(selectActiveItemId)
  const activeItemTelegramKey = useSelector(selectActiveItemTelegramKey)

  const ActiveComponent = VIEWS[activeView]

  return (
    <div className="flex flex-col h-full">
      {activeItemId ? (
        <>
          <Header activeView={activeView} setActiveView={setActiveView} />
          {ActiveComponent ? (
            <ActiveComponent
              activeItemTelegramKey={activeItemTelegramKey}
              activeItemId={activeItemId}
            />
          ) : (
            <div className="p-4 text-center text-gray-500">View not found.</div>
          )}
        </>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PanelsTopLeft />
            </EmptyMedia>
            <EmptyTitle>Please Select Component</EmptyTitle>
            <EmptyDescription>
              You haven&apos;t selected any component.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap2">
              <Button
                variant="link"
                asChild
                className="text-muted-foreground"
                size="sm"
              >
                <a href="#">
                  Learn More <ArrowUpRightIcon />
                </a>
              </Button>
            </div>
          </EmptyContent>
        </Empty>
      )}
    </div>
  )
}
