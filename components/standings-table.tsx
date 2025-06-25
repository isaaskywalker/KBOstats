import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface StandingData {
  순위: number
  팀명: string
  경기수: number
  승: number
  패: number
  승률: string
  게임차: string
}

interface StandingsTableProps {
  data: StandingData[]
  loading: boolean
}

export default function StandingsTable({ data, loading }: StandingsTableProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  const getPositionBadge = (position: number) => {
    if (position <= 5) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">포스트시즌</Badge>
    }
    return (
      <Badge variant="outline" className="bg-gray-50 text-gray-600">
        -
      </Badge>
    )
  }

  const getPositionColor = (position: number) => {
    if (position === 1) return "bg-yellow-50 border-l-4 border-l-yellow-400"
    if (position <= 5) return "bg-green-50 border-l-4 border-l-green-400"
    return ""
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-16 text-center">순위</TableHead>
            <TableHead>팀명</TableHead>
            <TableHead className="text-center">경기수</TableHead>
            <TableHead className="text-center">승</TableHead>
            <TableHead className="text-center">패</TableHead>
            <TableHead className="text-center">승률</TableHead>
            <TableHead className="text-center">게임차</TableHead>
            <TableHead className="text-center">포스트시즌</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((team, index) => (
            <TableRow key={index} className={getPositionColor(team.순위)}>
              <TableCell className="text-center font-bold text-lg">{team.순위}</TableCell>
              <TableCell className="font-semibold text-gray-900">{team.팀명}</TableCell>
              <TableCell className="text-center">{team.경기수}</TableCell>
              <TableCell className="text-center font-medium text-blue-600">{team.승}</TableCell>
              <TableCell className="text-center font-medium text-red-600">{team.패}</TableCell>
              <TableCell className="text-center font-mono">{team.승률}</TableCell>
              <TableCell className="text-center">{team.게임차 === "0" ? "-" : team.게임차}</TableCell>
              <TableCell className="text-center">{getPositionBadge(team.순위)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
