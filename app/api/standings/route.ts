import { NextResponse } from "next/server"

// 환경변수에서 API 설정 가져오기
const API_KEY = process.env.RAPIDAPI_KEY || "YOUR_API_KEY_HERE"
const API_HOST = process.env.RAPIDAPI_HOST || "api-baseball.p.rapidapi.com"
const KBO_LEAGUE_ID = Number(process.env.KBO_LEAGUE_ID) || 5
const CURRENT_SEASON = Number(process.env.CURRENT_SEASON) || 2025

export async function GET() {
  try {
    const url = `https://${API_HOST}/standings`
    const headers = {
      "x-rapidapi-key": API_KEY,
      "x-rapidapi-host": API_HOST,
    }
    const params = new URLSearchParams({
      league: KBO_LEAGUE_ID.toString(),
      season: CURRENT_SEASON.toString(),
    })

    const response = await fetch(`${url}?${params}`, {
      headers,
      next: { revalidate: 3600 }, // 1시간 캐시
    })

    if (!response.ok) {
      throw new Error("API 요청 실패")
    }

    const data = await response.json()
    const standings_data = data.response?.[0] || []

    const processed_data = standings_data.map((team_info: any) => ({
      순위: team_info.position || 0,
      팀명: team_info.team?.name || "알 수 없음",
      경기수: team_info.games?.played || 0,
      승: team_info.games?.win?.total || 0,
      패: team_info.games?.lose?.total || 0,
      승률: team_info.games?.win?.percentage || "0.000",
      게임차: team_info.games?.games_behind || "0",
    }))

    return NextResponse.json({ data: processed_data })
  } catch (error) {
    console.error("순위 데이터 조회 오류:", error)

    // 개발용 목업 데이터
    const mockData = [
      { 순위: 1, 팀명: "KIA 타이거즈", 경기수: 144, 승: 87, 패: 55, 승률: "0.613", 게임차: "0" },
      { 순위: 2, 팀명: "삼성 라이온즈", 경기수: 144, 승: 83, 패: 59, 승률: "0.585", 게임차: "4" },
      { 순위: 3, 팀명: "LG 트윈스", 경기수: 144, 승: 79, 패: 63, 승률: "0.556", 게임차: "8" },
      { 순위: 4, 팀명: "두산 베어스", 경기수: 144, 승: 76, 패: 66, 승률: "0.535", 게임차: "11" },
      { 순위: 5, 팀명: "KT 위즈", 경기수: 144, 승: 73, 패: 69, 승률: "0.514", 게임차: "14" },
      { 순위: 6, 팀명: "SSG 랜더스", 경기수: 144, 승: 70, 패: 72, 승률: "0.493", 게임차: "17" },
      { 순위: 7, 팀명: "롯데 자이언츠", 경기수: 144, 승: 66, 패: 76, 승률: "0.465", 게임차: "21" },
      { 순위: 8, 팀명: "한화 이글스", 경기수: 144, 승: 63, 패: 79, 승률: "0.444", 게임차: "24" },
      { 순위: 9, 팀명: "NC 다이노스", 경기수: 144, 승: 60, 패: 82, 승률: "0.423", 게임차: "27" },
      { 순위: 10, 팀명: "키움 히어로즈", 경기수: 144, 승: 57, 패: 85, 승률: "0.401", 게임차: "30" },
    ]

    return NextResponse.json({ data: mockData })
  }
}
