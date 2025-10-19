export const Kanban = () => {
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
