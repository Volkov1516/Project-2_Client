import { useState } from "react"
import { useUpdateComponentMutation } from "@/features/projects/projectsApiSlice"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { Pencil, Trash, Grip, Check } from "lucide-react"

export const Settings = ({ activeItemTelegramKey, activeItemId }) => {
  const [telegramKey, setTelegramKey] = useState<string>(activeItemTelegramKey)
  const [columnName, setColumnName] = useState<string>("")

  const [updateComponent] = useUpdateComponentMutation()

  const handleUpdateComponent = async () => {
    try {
      await updateComponent({
        id: activeItemId,
        data: { telegramKey: telegramKey },
      }).unwrap()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteComponent = async () => {
    try {
      await updateComponent({
        id: activeItemId,
        data: { telegramKey: "" },
      }).unwrap()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="overflow-y-auto p-4">
      <div className="max-w-xl mx-auto pt-2">
        <div>
          <h3 className="text-2xl font-bold tracking-tight pb-2">
            Messengers Integration
          </h3>
          <p className="text-sm text-muted-foreground pb-4">
            Configure API keys for external services like Telegram to enable
            automated features.
          </p>
          <div className="pt-2 space-y-4 pb-2">
            <div className="grid gap-2">
              <Label htmlFor="tgkey">Telegram Bot Key</Label>
              <div className="flex space-x-2">
                <Input
                  id="tgkey"
                  placeholder="Enter Bot Token (e.g., 123456:ABC-DEF1234)"
                  value={telegramKey}
                  onChange={e => setTelegramKey(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Check"
                  disabled={
                    !telegramKey || telegramKey === activeItemTelegramKey
                  }
                  onClick={handleUpdateComponent}
                >
                  <Check />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Delete"
                  onClick={handleDeleteComponent}
                >
                  <Trash />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Separator className="my-6" />
        <div>
          <h3 className="text-2xl font-bold tracking-tight pb-2">
            Kanban Columns
          </h3>
          <p className="text-sm text-muted-foreground pb-6">
            Define and manage the columns for your component's Kanban board.
          </p>
          <div className="grid gap-2 pb-4">
            <Label htmlFor="columnName">Column Name</Label>
            <div className="flex space-x-2">
              <Input
                id="columnName"
                placeholder="Enter Column Name"
                className="flex-1"
                value={columnName}
                onChange={e => setColumnName(e.target.value)}
              />
              <Button
                variant="outline"
                className="shrink-0"
                disabled={!columnName}
              >
                Add Column
              </Button>
            </div>
          </div>
          <div className="pt-2 space-y-2">
            <div className="text-sm font-medium">Existing Columns</div>
            <ColumnItem name="Thread" />
            <ColumnItem name="Active" />
            <ColumnItem name="Done" />
          </div>
        </div>
      </div>
    </div>
  )
}

const ColumnItem = ({ name }) => (
  <div className="flex items-center justify-between p-1 bg-muted/50 rounded-md">
    <div>
      <Button variant="ghost" size="icon" aria-label="Delete">
        <Grip />
      </Button>
      <span className="font-medium">{name}</span>
    </div>
    <div className="space-x-2">
      <Button variant="outline" size="icon" aria-label="Edit">
        <Pencil />
      </Button>
      <Button variant="outline" size="icon" aria-label="Delete">
        <Trash />
      </Button>
    </div>
  </div>
)
