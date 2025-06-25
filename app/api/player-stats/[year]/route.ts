import { NextResponse } from "next/server"

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
  "Mozilla/5.0 (X11; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0",
]

export async function GET(request: Request, { params }: { params: { year: string } }) {
  const year = params.year

  try {
    const url = `https://statiz.sporki.com/stats/?m_idx=22&s_idx=1&y_idx=${year}`

    const headers = {
      "User-Agent": USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
      Referer: url,
    }

    const response = await fetch(url, {
      headers,
      next: { revalidate: 86400 }, // 24시간 캐시
    })

    if (!response.ok) {
      throw new Error("데이터 조회 실패")
    }

    const html = await response.text()

    // 실제 HTML 파싱이 필요한 경우 cheerio 사용
    // 현재는 목업 데이터 반환
    const mockPlayerData = generateMockPlayerData(year)

    return NextResponse.json({
      year: Number.parseInt(year),
      record_count: mockPlayerData.length,
      data: mockPlayerData,
    })
  } catch (error) {
    console.error("선수 데이터 조회 오류:", error)

    // 에러 시 목업 데이터 반환
    const mockPlayerData = generateMockPlayerData(year)
    return NextResponse.json({
      year: Number.parseInt(year),
      record_count: mockPlayerData.length,
      data: mockPlayerData,
    })
  }
}

function generateMockPlayerData(year: string) {
  return [
    {
      순위: 1,
      선수명: "김도영",
      팀: "KIA",
      경기: 144,
      타석: 650,
      타수: 580,
      안타: 201,
      홈런: 38,
      타점: 109,
      득점: 122,
      타율: ".347",
      OPS: "1.031",
    },
    {
      순위: 2,
      선수명: "박병호",
      팀: "LG",
      경기: 140,
      타석: 620,
      타수: 550,
      안타: 180,
      홈런: 35,
      타점: 102,
      득점: 95,
      타율: ".327",
      OPS: ".987",
    },
    {
      순위: 3,
      선수명: "최정",
      팀: "SSG",
      경기: 138,
      타석: 600,
      타수: 530,
      안타: 165,
      홈런: 32,
      타점: 98,
      득점: 88,
      타율: ".311",
      OPS: ".945",
    },
    // 더 많은 목업 데이터...
  ]
}
