import { useSelector } from "react-redux"
import { selectActiveItemId } from "../../../features/projects/projectsSlice"

import {
  useGetProjectsQuery,
  useGetComponentsQuery,
} from "../../../features/projects/projectsApiSlice"

import { Label } from "./Label"
import { Tree } from "./Tree"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar"

import { buildComponentTree } from "../../../utils/buildComponentTree"
import { mergeProjectsAndComponents } from "../../../utils/mergeProjectsAndComponents"
import { transformToProjectTree } from "../../../utils/transformToProjectTree"

export const Projects = () => {
  const activeItemId = useSelector(selectActiveItemId)
  const {
    data: projects,
    isLoading: isProjectLoading,
    error: projectError,
  } = useGetProjectsQuery()

  const {
    data: components,
    isLoading: isComponentsLoading,
    error: componentsError,
  } = useGetComponentsQuery()

  if (isProjectLoading || isComponentsLoading) {
    return <div>Loading...</div>
  }

  if (projectError || componentsError) {
    return <div>Error...</div>
  }

  const componentTree = buildComponentTree(components)
  const finalStructure = mergeProjectsAndComponents(projects, componentTree)
  const outputTree = transformToProjectTree(finalStructure)

  return (
    <SidebarGroup className="overflow-y-auto">
      <Label />
      <SidebarGroupContent className="overflow-x-auto">
        <SidebarMenu>
          {outputTree.map((item, index) => (
            <Tree key={index} item={item} activeItemId={activeItemId} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
