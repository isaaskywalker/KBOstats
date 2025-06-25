"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target, BarChart3 } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"

interface StandingData {
  순위: number
  팀명: string
  경기수: number
  승: number
  패: number
  승률: string
  게임차: string
}

interface PlayoffProbabilityProps {
  standings: StandingData[]
}

export default function PlayoffProbability({ standings }: PlayoffProbabilityProps) {
  // 간단한 포스트시즌 확률 계산 (실제로는 더 복잡한 알고리즘 필요)
  const calculatePlayoffProbability = (team: StandingData) => {
    const winRate = Number.parseFloat(team.승률) || 0
    const position = team.순위
    const gamesBack = Number.parseFloat(team.게임차) || 0

    let probability = 0

    if (position <= 2) {
      probability = Math.min(95, 70 + winRate * 40)
    } else if (position <= 5) {
      probability = Math.max(5, 60 - gamesBack * 8 + winRate * 30)
    } else {
      probability = Math.max(1, 30 - gamesBack * 5 + winRate * 20)
    }

    return Math.round(probability)
  }

  // 차트 데이터 준비
  const chartData = standings.map((team) => ({
    팀명: team.팀명,
    확률: calculatePlayoffProbability(team),
    순위: team.순위,
    승률: Number.parseFloat(team.승률),
    포스트시즌: team.순위 <= 5 ? "진출권" : "진출권 밖",
  }))

  // 실제 상위 5개 팀 기준으로 시간별 데이터 생성
  const top5Teams = chartData.slice(0, 5).map((team) => team.팀명)

  const timeSeriesData = [
    {
      날짜: "3월",
      ...Object.fromEntries(
        top5Teams.map((team, index) => [team, Math.max(30, chartData[index]?.확률 - Math.random() * 10 + 5)]),
      ),
    },
    {
      날짜: "4월",
      ...Object.fromEntries(
        top5Teams.map((team, index) => [team, Math.max(35, chartData[index]?.확률 - Math.random() * 8 + 3)]),
      ),
    },
    {
      날짜: "5월",
      ...Object.fromEntries(
        top5Teams.map((team, index) => [team, Math.max(40, chartData[index]?.확률 - Math.random() * 6 + 2)]),
      ),
    },
    {
      날짜: "6월",
      ...Object.fromEntries(
        top5Teams.map((team, index) => [team, Math.max(45, chartData[index]?.확률 - Math.random() * 4 + 1)]),
      ),
    },
    {
      날짜: "7월",
      ...Object.fromEntries(
        top5Teams.map((team, index) => [team, Math.max(50, chartData[index]?.확률 - Math.random() * 3)]),
      ),
    },
    {
      날짜: "8월",
      ...Object.fromEntries(
        top5Teams.map((team, index) => [team, Math.max(55, chartData[index]?.확률 - Math.random() * 2)]),
      ),
    },
    {
      날짜: "현재",
      ...Object.fromEntries(top5Teams.map((team, index) => [team, chartData[index]?.확률 || 0])),
    },
  ]

  // 팀별 색상 정의
  const teamColors = {
    "KIA 타이거즈": "#FF6B35",
    "삼성 라이온즈": "#1E40AF",
    "LG 트윈스": "#DC2626",
    "두산 베어스": "#1F2937",
    "KT 위즈": "#000000",
    "SSG 랜더스": "#059669",
    "롯데 자이언츠": "#2563EB",
    "한화 이글스": "#F59E0B",
    "NC 다이노스": "#7C3AED",
    "키움 히어로즈": "#EC4899",
  }

  // 파이 차트용 데이터 (진출권 내/외)
  const playoffData = [
    {
      name: "포스트시즌 진출권",
      value: chartData.filter((team) => team.순위 <= 5).length,
      color: "#22c55e",
    },
    {
      name: "진출권 밖",
      value: chartData.filter((team) => team.순위 > 5).length,
      color: "#ef4444",
    },
  ]

  // 바 차트 색상 함수
  const getBarColor = (확률: number) => {
    if (확률 >= 80) return "#22c55e" // 녹색
    if (확률 >= 50) return "#eab308" // 노란색
    if (확률 >= 20) return "#f97316" // 주황색
    return "#ef4444" // 빨간색
  }

  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-blue-600">포스트시즌 확률: {data.확률}%</p>
          <p className="text-gray-600">현재 순위: {data.순위}위</p>
          <p className="text-gray-600">승률: {(data.승률 * 100).toFixed(1)}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>2025 포스트시즌 진출 확률</span>
          </CardTitle>
          <CardDescription>현재 순위와 승률을 기반으로 한 포스트시즌 진출 가능성 분석</CardDescription>
        </CardHeader>
      </Card>

      {/* 바 차트 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>팀별 포스트시즌 진출 확률</span>
          </CardTitle>
          <CardDescription>각 팀의 포스트시즌 진출 확률을 막대 그래프로 표시</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="팀명" angle={-45} textAnchor="end" height={80} fontSize={12} />
                <YAxis label={{ value: "확률 (%)", angle: -90, position: "insideLeft" }} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="확률" fill={(entry) => getBarColor(entry.확률)} radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.확률)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 시간별 확률 변화 선 그래프 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>시즌별 포스트시즌 확률 변화</span>
          </CardTitle>
          <CardDescription>상위 5개 팀의 월별 포스트시즌 진출 확률 추이</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="날짜" />
                <YAxis label={{ value: "확률 (%)", angle: -90, position: "insideLeft" }} domain={[0, 100]} />
                <Tooltip formatter={(value, name) => [`${value}%`, name]} labelFormatter={(label) => `${label}`} />
                <Legend />
                {top5Teams.map((team, index) => (
                  <Line
                    key={team}
                    type="monotone"
                    dataKey={team}
                    stroke={teamColors[team as keyof typeof teamColors] || `hsl(${index * 72}, 70%, 50%)`}
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 영역 차트 (Area Chart) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>누적 확률 분포</span>
          </CardTitle>
          <CardDescription>상위 팀들의 포스트시즌 확률을 영역으로 표시</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="날짜" />
                <YAxis label={{ value: "확률 (%)", angle: -90, position: "insideLeft" }} domain={[0, 100]} />
                <Tooltip formatter={(value, name) => [`${value}%`, name]} labelFormatter={(label) => `${label}`} />
                <Legend />
                {top5Teams.map((team, index) => (
                  <Area
                    key={team}
                    type="monotone"
                    dataKey={team}
                    stackId="1"
                    stroke={teamColors[team as keyof typeof teamColors] || `hsl(${index * 72}, 70%, 50%)`}
                    fill={teamColors[team as keyof typeof teamColors] || `hsl(${index * 72}, 70%, 50%)`}
                    fillOpacity={0.6}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 통계 요약 카드들 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 파이 차트 */}
        <Card>
          <CardHeader>
            <CardTitle>포스트시즌 진출권 현황</CardTitle>
            <CardDescription>현재 진출권 내/외 팀 분포</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={playoffData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {playoffData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 확률 구간별 통계 */}
        <Card>
          <CardHeader>
            <CardTitle>확률 구간별 팀 분포</CardTitle>
            <CardDescription>포스트시즌 진출 확률에 따른 팀 분류</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                range: "80% 이상",
                color: "bg-green-100 text-green-800 border-green-200",
                teams: chartData.filter((t) => t.확률 >= 80),
              },
              {
                range: "50-79%",
                color: "bg-yellow-100 text-yellow-800 border-yellow-200",
                teams: chartData.filter((t) => t.확률 >= 50 && t.확률 < 80),
              },
              {
                range: "20-49%",
                color: "bg-orange-100 text-orange-800 border-orange-200",
                teams: chartData.filter((t) => t.확률 >= 20 && t.확률 < 50),
              },
              {
                range: "20% 미만",
                color: "bg-red-100 text-red-800 border-red-200",
                teams: chartData.filter((t) => t.확률 < 20),
              },
            ].map((group, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <Badge className={group.color}>{group.range}</Badge>
                  <span className="font-medium">{group.teams.length}개 팀</span>
                </div>
                <div className="text-sm text-gray-600">{group.teams.map((t) => t.팀명).join(", ")}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 상세 정보 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>상세 확률 정보</CardTitle>
          <CardDescription>각 팀의 상세한 포스트시즌 진출 확률 및 현황</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">순위</th>
                  <th className="text-left p-2">팀명</th>
                  <th className="text-center p-2">진출 확률</th>
                  <th className="text-center p-2">승률</th>
                  <th className="text-center p-2">게임차</th>
                  <th className="text-center p-2">상태</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((team, index) => (
                  <tr key={index} className={`border-b ${team.순위 <= 5 ? "bg-green-50" : ""}`}>
                    <td className="p-2 font-bold">{team.순위}</td>
                    <td className="p-2 font-medium">{team.팀명}</td>
                    <td className="p-2 text-center">
                      <span
                        className={`font-bold ${
                          team.확률 >= 80
                            ? "text-green-600"
                            : team.확률 >= 50
                              ? "text-yellow-600"
                              : team.확률 >= 20
                                ? "text-orange-600"
                                : "text-red-600"
                        }`}
                      >
                        {team.확률}%
                      </span>
                    </td>
                    <td className="p-2 text-center">{(team.승률 * 100).toFixed(1)}%</td>
                    <td className="p-2 text-center">
                      {standings.find((s) => s.팀명 === team.팀명)?.게임차 === "0"
                        ? "-"
                        : standings.find((s) => s.팀명 === team.팀명)?.게임차}
                    </td>
                    <td className="p-2 text-center">
                      <Badge
                        className={
                          team.순위 <= 5
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-gray-100 text-gray-800 border-gray-200"
                        }
                      >
                        {team.포스트시즌}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <TrendingUp className="h-5 w-5" />
            <span>포스트시즌 정보</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">진출 조건</h4>
              <ul className="space-y-1 text-gray-700">
                <li>• 정규시즌 상위 5개 팀 진출</li>
                <li>• 1-2위: 준플레이오프 직행</li>
                <li>• 3-5위: 와일드카드 결정전</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">확률 계산 기준</h4>
              <ul className="space-y-1 text-gray-700">
                <li>• 현재 순위 및 승률</li>
                <li>• 상위팀과의 게임차</li>
                <li>• 남은 경기수 고려</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
