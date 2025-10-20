import { useDispatch } from "react-redux"
import { setActiveItem } from "../../../features/projects/projectsSlice" // 👈 Импорт исправленного action

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
    // Элемент - это массив:
    // info = item[0] (объект {id, name}),
    // items = item.slice(1) (массив детей)
    info = item[0]
    items = item.slice(1)
  } else {
    // Элемент - это объект (Лист):
    info = item
    items = []
  }

  // Прямой доступ к ID и Name
  const { id, name, type, projectId } = info // 👈 ID и Name получены!

  const handleItemClick = () => {
    // Диспетчеризуем ID текущего элемента
    dispatch(setActiveItem(id))
    // ❗ Дополнительная логика: если это папка, возможно, тут нужно toggle collapsible,
    // но CollapsibleTrigger обычно делает это автоматически.
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
        {/*<Component />*/}
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
      // className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
      className="group/collapsible"
      defaultOpen={name === "components" || name === "ui"}
    >
      <CollapsibleTrigger asChild>
        <SidebarMenuButton
          isActive={isActive}
          onClick={handleItemClick}
          className="w-[239px] truncate overflow-hidden whitespace-nowrap pr-6 group relative group/item"
        >
          {/*<ChevronRight />*/}
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
