import {
  useGetProjectsQuery,
  useGetComponentsQuery,
} from "../../../features/projects/projectsApiSlice"

import { Tree } from "./Tree"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar"

import { buildComponentTree } from "../../../utils/buildComponentTree"
import { mergeProjectsAndComponents } from "../../../utils/mergeProjectsAndComponents"
import { transformToProjectTree } from "../../../utils/transformToProjectTree"

export const Projects = () => {
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
  console.log("Component Tree:", componentTree)
  const finalStructure = mergeProjectsAndComponents(projects, componentTree)
  const outputTree = transformToProjectTree(finalStructure)
  console.log("Output Tree:", outputTree)

  return (
    <SidebarGroup className="overflow-y-auto">
      <SidebarGroupLabel className="select-none">Projects</SidebarGroupLabel>
      <SidebarGroupContent className="overflow-x-auto">
        <SidebarMenu>
          {outputTree.map((item, index) => (
            <Tree key={index} item={item} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
