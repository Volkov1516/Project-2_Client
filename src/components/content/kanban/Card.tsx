import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "lucide-react"

export const CardComponent = () => {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Request #1234</CardTitle>
        <CardDescription>Thomas Anderson | 21.10.2025</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Here comes some request info...</p>
      </CardContent>
    </Card>
  )
}
