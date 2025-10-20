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

export const Tree = ({ item, activeItemId }) => {
  const dispatch = useDispatch()
  let info, items

  if (Array.isArray(item)) {
    info = item[0]
    items = item.slice(1)
  } else {
    info = item
    items = []
  }

  const { id, name, type, projectId } = info

  const handleItemClick = () => {
    dispatch(setActiveItem(id))
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
