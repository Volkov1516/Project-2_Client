import { CardComponent } from "./Card"

export const Column = ({ name }) => {
  return (
    <div className="h-full flex flex-col">
      <h3 className="text-2xl font-bold tracking-tight pb-2">{name}</h3>
      <div className="bg-muted/50 rounded-xl flex-1 p-2 flex flex-col gap-2 overflow-y-auto">
        <CardComponent />
        <CardComponent />
        <CardComponent />
      </div>
    </div>
  )
}
