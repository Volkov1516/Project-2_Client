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
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

import { TriangleAlert } from "lucide-react"

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

  console.log(components)

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
      {projects && projects.length > 0 ? (
        <SidebarGroupContent className="overflow-x-auto pb-4">
          <SidebarMenu>
            {outputTree.map((item, index) => (
              <Tree key={index} item={item} activeItemId={activeItemId} />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <TriangleAlert />
            </EmptyMedia>
            <EmptyTitle>No Projects Yet</EmptyTitle>
            <EmptyDescription>
              You haven&apos;t created any projects yet. Get started by creating
              your first project.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Button>Create Project</Button>
            </div>
          </EmptyContent>
        </Empty>
      )}
    </SidebarGroup>
  )
}
