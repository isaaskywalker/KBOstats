"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Calendar, User } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface PlayerData {
  [key: string]: any
}

export default function PlayerSearch() {
  const [searchYear, setSearchYear] = useState("2024")
  const [playerData, setPlayerData] = useState<PlayerData[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const searchPlayers = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/player-stats/${searchYear}`)
      const data = await response.json()

      if (data.data) {
        setPlayerData(data.data)
      }
    } catch (error) {
      console.error("선수 데이터를 가져오는데 실패했습니다:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPlayers = playerData.filter((player) => {
    if (!searchTerm) return true
    const playerName = Object.values(player).join(" ").toLowerCase()
    return playerName.includes(searchTerm.toLowerCase())
  })

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>선수 통계 검색</span>
          </CardTitle>
          <CardDescription>연도별 선수 타격 기록을 검색하고 조회할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">검색 연도</label>
              <Select value={searchYear} onValueChange={setSearchYear}>
                <SelectTrigger>
                  <SelectValue placeholder="연도 선택" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}년
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">선수명 검색</label>
              <Input
                placeholder="선수명을 입력하세요..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={searchPlayers} disabled={loading} className="w-full sm:w-auto">
                <Search className="h-4 w-4 mr-2" />
                {loading ? "검색 중..." : "검색"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && playerData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{searchYear}년 선수 타격 기록</CardTitle>
            <CardDescription>
              총 {filteredPlayers.length}명의 선수 기록
              {searchTerm && ` (검색어: "${searchTerm}")`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    {playerData.length > 0 &&
                      Object.keys(playerData[0]).map((key, index) => (
                        <TableHead key={index} className="text-center whitespace-nowrap">
                          {key}
                        </TableHead>
                      ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlayers.slice(0, 50).map((player, index) => (
                    <TableRow key={index}>
                      {Object.values(player).map((value, cellIndex) => (
                        <TableCell key={cellIndex} className="text-center">
                          {value?.toString() || "-"}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {filteredPlayers.length > 50 && (
              <p className="text-sm text-gray-500 mt-4 text-center">
                상위 50명만 표시됩니다. 검색어를 사용해 결과를 필터링하세요.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {!loading && playerData.length === 0 && searchYear && (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">데이터가 없습니다</h3>
            <p className="text-gray-500">{searchYear}년 선수 데이터를 찾을 수 없습니다. 다른 연도를 선택해보세요.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
