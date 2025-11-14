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

type ViewComponents = {
  kanban: React.FC
  analytics: React.FC
  members: React.FC
  settings: React.FC<{activeItemTelegramKey: ComponentType["telegramkey"], activeItemId: ComponentType["id"]}>
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
      <Header activeView={activeView} setActiveView={setActiveView} />
      {ActiveComponent ? (
        <ActiveComponent
          activeItemTelegramKey={activeItemTelegramKey}
          activeItemId={activeItemId}
        />
      ) : (
        <div className="p-4 text-center text-gray-500">View not found.</div>
      )}
    </div>
  )
}
