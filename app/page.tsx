"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, TrendingUp, Calendar, Users } from "lucide-react"
import StandingsTable from "@/components/standings-table"
import PlayerSearch from "@/components/player-search"
import PlayoffProbability from "@/components/playoff-probability"

interface StandingData {
  순위: number
  팀명: string
  경기수: number
  승: number
  패: number
  승률: string
  게임차: string
}

export default function KBODashboard() {
  const [standings, setStandings] = useState<StandingData[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>("")

  useEffect(() => {
    fetchStandings()
  }, [])

  const fetchStandings = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/standings")
      const data = await response.json()

      if (data.data) {
        setStandings(data.data)
        setLastUpdated(new Date().toLocaleString("ko-KR"))
      }
    } catch (error) {
      console.error("순위 데이터를 가져오는데 실패했습니다:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">KBO 리그 센터</h1>
                <p className="text-sm text-gray-600">실시간 순위 및 선수 통계</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>최종 업데이트: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 경기수</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{standings.length > 0 ? standings[0]?.경기수 || 0 : 0}</div>
              <p className="text-xs text-muted-foreground">2025 시즌</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">참가 구단</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">10</div>
              <p className="text-xs text-muted-foreground">KBO 리그</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">1위 팀</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{standings.length > 0 ? standings[0]?.팀명 || "-" : "-"}</div>
              <p className="text-xs text-muted-foreground">
                승률 {standings.length > 0 ? standings[0]?.승률 || "0.000" : "0.000"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="standings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="standings">순위표</TabsTrigger>
            <TabsTrigger value="playoff">포스트시즌 확률</TabsTrigger>
            <TabsTrigger value="players">선수 검색</TabsTrigger>
          </TabsList>

          <TabsContent value="standings" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>2025 KBO 리그 순위</CardTitle>
                    <CardDescription>실시간 순위 및 경기 결과</CardDescription>
                  </div>
                  <Button onClick={fetchStandings} disabled={loading}>
                    {loading ? "업데이트 중..." : "새로고침"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <StandingsTable data={standings} loading={loading} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="playoff" className="space-y-6">
            <PlayoffProbability standings={standings} />
          </TabsContent>

          <TabsContent value="players" className="space-y-6">
            <PlayerSearch />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
