import { useState } from "react"
import type { ChangeEvent } from "react"
import { useCreateProjectMutation } from "../../features/projects/projectsApiSlice"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
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

export const CreateNew = () => {
  const [name, setName] = useState<string>("My Project")
  const [open, setOpen] = useState<boolean>(false)

  const [createProject] = useCreateProjectMutation()

  const handleCreateProject = async () => {
    if (name.trim().length === 0) {
      return
    }

    try {
      await createProject({
        name: name.trim(),
        ownerId: "Admin",
      }).unwrap()
    } catch (err) {
      console.error(err)
    }

    setOpen(false)
    setName("My Project")
  }

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Dialog open={open} onOpenChange={setOpen}>
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
                      onChange={handleNameChange}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    onClick={handleCreateProject}
                    disabled={name.trim().length === 0}
                  >
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
