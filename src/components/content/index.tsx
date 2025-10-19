import { Header } from "./Header"
import { Kanban } from "./Kanban"

export const AppContent = () => {
  return (
    <div className="flex flex-col h-full">
      <Header />
      <Kanban />
    </div>
  )
}
