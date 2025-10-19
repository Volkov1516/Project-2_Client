import { ContentHeader } from "./content-header"
import { ContentKanban } from "./content-kanban"

export const AppContent = () => {
  return (
    <div className="flex flex-col h-full">
      <ContentHeader />
      <ContentKanban />
    </div>
  )
}
