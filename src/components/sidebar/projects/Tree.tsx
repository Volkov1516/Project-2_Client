import { Dropdown } from "./Dropdown"

import { SidebarMenuButton, SidebarMenuSub } from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronRight, Component } from "lucide-react"

export const Tree = ({ item }: { item: string | any[] }) => {
  const [name, ...items] = Array.isArray(item) ? item : [item]

  if (!items.length) {
    return (
      <SidebarMenuButton
        isActive={name === "id"}
        className="w-[239px] truncate overflow-hidden whitespace-nowrap pr-6 group relative group/item"
      >
        <Component />
        <span className="truncate overflow-hidden whitespace-nowrap select-none">
          {name}
        </span>
        <Dropdown />
      </SidebarMenuButton>
    )
  }

  return (
    <Collapsible
      className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
      defaultOpen={name === "components" || name === "ui"}
    >
      <CollapsibleTrigger asChild>
        <SidebarMenuButton
          isActive={name === "id"}
          className="w-[239px] truncate overflow-hidden whitespace-nowrap pr-6 group relative group/item"
        >
          <ChevronRight />
          <span className="truncate overflow-hidden whitespace-nowrap select-none">
            {name}
          </span>
          <Dropdown />
        </SidebarMenuButton>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          {items.map((subItem, index) => (
            <Tree key={index} item={subItem} />
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  )
}
