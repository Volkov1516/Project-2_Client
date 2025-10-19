import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { SidebarMenuButton, SidebarMenuSub } from "@/components/ui/sidebar"
import { ChevronRight, Component } from "lucide-react"

import { SidebarTreeItem } from "./sidebar-tree-item"

export const Tree = ({ item }: { item: string | any[] }) => {
  const [name, ...items] = Array.isArray(item) ? item : [item]

  if (!items.length) {
    return (
      <SidebarTreeItem>
        <SidebarMenuButton
          isActive={name === "button.tsx"}
          className="w-[239px] truncate overflow-hidden whitespace-nowrap"
        >
          <Component />
          <span>{name}</span>
        </SidebarMenuButton>
      </SidebarTreeItem>
    )
  }

  return (
    <SidebarTreeItem>
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
        defaultOpen={name === "components" || name === "ui"}
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="w-[239px] truncate overflow-hidden whitespace-nowrap">
            <ChevronRight />
            <span>{name}</span>
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
    </SidebarTreeItem>
  )
}
