import { useState } from "react"

import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

export const SidebarDialogCreateProject = ({ createProject }) => {
  const [name, setName] = useState("My Project")

  const handleCreateProject = async () => {
    try {
      await createProject({
        name: name.trim(),
        ownerId: "Admin",
      }).unwrap()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <SidebarMenuItem>
      <Dialog>
        <DialogTrigger asChild>
          <SidebarMenuButton>
            <Plus />
            <span>Create New</span>
          </SidebarMenuButton>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input
                id="name-1"
                name="name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleCreateProject}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarMenuItem>
  )
}
