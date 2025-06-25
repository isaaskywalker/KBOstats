// app/api/playoff-probabilities/route.ts

import { NextResponse } from 'next/server'

export async function GET() {
  const data = [
    { 팀명: 'KIA 타이거즈', 순위: 1, 확률: Math.round(Math.random() * 10 + 90) },
    { 팀명: 'LG 트윈스', 순위: 2, 확률: Math.round(Math.random() * 10 + 85) },
    { 팀명: 'SSG 랜더스', 순위: 3, 확률: Math.round(Math.random() * 15 + 70) },
    { 팀명: '두산 베어스', 순위: 4, 확률: Math.round(Math.random() * 15 + 60) },
    { 팀명: '삼성 라이온즈', 순위: 5, 확률: Math.round(Math.random() * 20 + 45) },
    { 팀명: '한화 이글스', 순위: 6, 확률: Math.round(Math.random() * 20 + 20) },
    { 팀명: 'NC 다이노스', 순위: 7, 확률: Math.round(Math.random() * 20 + 10) },
    { 팀명: 'KT 위즈', 순위: 8, 확률: Math.round(Math.random() * 15 + 5) },
    { 팀명: '키움 히어로즈', 순위: 9, 확률: Math.round(Math.random() * 10 + 1) },
    { 팀명: '롯데 자이언츠', 순위: 10, 확률: Math.round(Math.random() * 5) },
  ]

  return NextResponse.json(data, { status: 200 })
}
