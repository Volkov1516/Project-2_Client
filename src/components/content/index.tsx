import { useDispatch, useSelector } from "react-redux"
import {
  selectActiveItemId,
  selectActiveItemTelegramKey,
  selectActiveItemType,
  selectActiveView,
  setActiveItem,
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
import { PanelsTopLeft, ArrowUpRightIcon } from "lucide-react"

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
  const dispatch = useDispatch()
  const activeView = useSelector(selectActiveView)

  const activeItemId = useSelector(selectActiveItemId)
  const activeItemTelegramKey = useSelector(selectActiveItemTelegramKey)
  const activeItemType = useSelector(selectActiveItemType)
  console.log(activeItemType)

  const ActiveComponent = VIEWS[activeView]

  console.log(activeItemId)

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {activeItemId ? (
        <>
          <Header activeView={activeView} setActiveView={view => dispatch(setActiveItem({ id: activeItemId!, activeView: view }))} />
          <ActiveComponent
            activeItemTelegramKey={activeItemTelegramKey}
            activeItemId={activeItemId}
          />
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
