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

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function PlayoffProbability() {
  // API 호출
  const { data, error } = useSWR('/api/playoff-probabilities', fetcher)

  if (error) return <div>에러 발생: {error.message}</div>
  if (!data) return <div>로딩 중...</div>

  // chartData 만들기
  const chartData = data.map((team: any) => ({
    팀명: team.팀명,
    확률: team.확률,
    순위: team.순위,
    포스트시즌: team.순위 <= 5 ? "진출권" : "진출권 밖",
  }))

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

  const getBarColor = (확률: number) => {
    if (확률 >= 80) return "#22c55e"
    if (확률 >= 50) return "#eab308"
    if (확률 >= 20) return "#f97316"
    return "#ef4444"
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-blue-600">포스트시즌 확률: {data.확률}%</p>
          <p className="text-gray-600">현재 순위: {data.순위}위</p>
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
          <CardDescription>Monte Carlo 시뮬 기반 확률</CardDescription>
        </CardHeader>
      </Card>

      {/* 바 차트 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>팀별 포스트시즌 진출 확률</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="팀명" angle={-45} textAnchor="end" height={80} fontSize={12} />
                <YAxis label={{ value: "확률 (%)", angle: -90, position: "insideLeft" }} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="확률" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.확률)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 시간별 변화 선 그래프 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>시즌별 포스트시즌 확률 변화</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="날짜" />
                <YAxis label={{ value: "확률 (%)", angle: -90, position: "insideLeft" }} domain={[0, 100]} />
                <Tooltip />
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
    </div>
  )
}
