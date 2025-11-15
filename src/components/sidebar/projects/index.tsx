import { useSelector } from "react-redux"
import { selectActiveItemId } from "@/features/projects/projectsSlice"
import { useGetProjectsQuery } from "@/features/projects/projectsApiSlice"
import { useGetComponentsQuery } from "@/features/components/componentsApiSlice"

import { auth } from "@/firebase"

import { buildProjectTree } from "../../../utils/buildProjectTree"
import { buildSidebarTree } from "../../../utils/buildSidebarTree"

import { Label } from "./Label"
import { Tree } from "./Tree"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar"
import { Spinner } from "@/components/ui/spinner"

export const Projects = () => {
  const activeItemId = useSelector(selectActiveItemId)
  const {
    data: projects,
    isLoading: isProjectLoading,
    error: projectError,
  } = useGetProjectsQuery(auth.currentUser?.uid)

  const {
    data: components,
    isLoading: isComponentsLoading,
    error: componentsError,
  } = useGetComponentsQuery()

  if (isProjectLoading || isComponentsLoading) {
    return <Spinner />
  }

  if (projectError || componentsError) {
    return <div>Error...</div>
  }

  const finalStructure = buildProjectTree(projects || [], components)
  const outputTree = buildSidebarTree(finalStructure)

  return (
    <SidebarGroup className="overflow-y-auto">
      <Label />
      <SidebarGroupContent className="overflow-x-auto pb-4">
        <SidebarMenu>
          {outputTree.map((item, index) => (
            <Tree key={index} item={item} activeItemId={activeItemId} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
