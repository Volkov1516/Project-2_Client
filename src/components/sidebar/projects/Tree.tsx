import { useDispatch } from "react-redux"
import { setActiveItem } from "../../../features/projects/projectsSlice"

import { Dropdown } from "./Dropdown"

import { SidebarMenuButton, SidebarMenuSub } from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Component, Folder, FolderKanban } from "lucide-react"
import type { ComponentType } from "@/types/component"
import type { ProjectType } from "@/types/project"

type TreeItem =
  | (ProjectType & { type: "project" })
  | (ComponentType & { type: "component" })

interface TreeProps {
  item: TreeItem | TreeItem[]
  activeItemId: string | null
}

export const Tree = ({ item, activeItemId }: TreeProps) => {
  const dispatch = useDispatch()
  let info: TreeItem
  let items: TreeItem[]

  if (Array.isArray(item)) {
    info = item[0]
    items = item.slice(1) as TreeItem[]
  } else {
    info = item
    items = []
  }

  const { id, name, type, projectId } = info

  const handleItemClick = () => {
    dispatch(
      setActiveItem({
        id,
        telegramKey: (info as ComponentType).telegramKey,
        type,
      }),
    )
  }
  const isActive = id === activeItemId

  const Icon = (() => {
    if (type === "project" && items.length > 0) return FolderKanban

    if (type === "project") return Folder

    return Component
  })()

  if (!items.length) {
    return (
      <SidebarMenuButton
        isActive={isActive}
        onClick={handleItemClick}
        className="w-[239px] truncate overflow-hidden whitespace-nowrap pr-6 group relative group/item"
      >
        <Icon />
        <span className="truncate overflow-hidden whitespace-nowrap select-none">
          {name}
        </span>
        <Dropdown id={id} type={type} projectId={projectId} />
      </SidebarMenuButton>
    )
  }

  return (
    <Collapsible
      className="group/collapsible"
      defaultOpen={name === "components" || name === "ui"}
    >
      <CollapsibleTrigger asChild>
        <SidebarMenuButton
          isActive={isActive}
          onClick={handleItemClick}
          className="w-[239px] truncate overflow-hidden whitespace-nowrap pr-6 group relative group/item"
        >
          <Icon />
          <span className="truncate overflow-hidden whitespace-nowrap select-none">
            {name}
          </span>
          <Dropdown id={id} type={type} projectId={projectId} />
        </SidebarMenuButton>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          {items.map((subItem, index) => (
            <Tree key={index} item={subItem} activeItemId={activeItemId} />
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  )
}
