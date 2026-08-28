// 경품 기본값 — public/prizes.json 로드에 실패했을 때 사용됩니다.
// 실제 운영 시에는 public/prizes.json(배포 후 dist/prizes.json)을 수정하세요.
export const defaultPrizes = [
  { rank: 1, label: '1등상', emoji: '🏆', minLuck: 90, weight: 4, prize: '프리미엄 굿즈 세트' },
  { rank: 2, label: '2등상', emoji: '🥈', minLuck: 75, weight: 12, prize: 'Python 티셔츠' },
  { rank: 3, label: '3등상', emoji: '🥉', minLuck: 55, weight: 24, prize: 'Python 스티커 팩' },
  { rank: 4, label: '4등상', emoji: '🎁', minLuck: 30, weight: 30, prize: '뱃지 + 스티커' },
  { rank: 5, label: '5등상', emoji: '🍀', minLuck: 0, weight: 30, prize: '스티커 1장' },
]

// 설정을 검증하고 minLuck 내림차순 정렬 + 각 등수의 maxLuck을 계산한다.
// 잘못된 설정이면 null을 반환해 기본값으로 폴백하게 한다.
export function normalizePrizes(raw) {
  const list = Array.isArray(raw) ? raw : raw?.prizes
  if (!Array.isArray(list) || list.length === 0) return null

  const valid = list.filter(
    (p) =>
      p &&
      typeof p.prize === 'string' &&
      typeof p.label === 'string' &&
      Number.isFinite(p.minLuck) &&
      p.minLuck >= 0 &&
      p.minLuck <= 100 &&
      Number.isFinite(p.weight) &&
      p.weight > 0,
  )
  if (valid.length === 0) return null

  const sorted = [...valid].sort((a, b) => b.minLuck - a.minLuck)
  return sorted.map((p, i) => ({
    ...p,
    emoji: p.emoji || '🎁',
    maxLuck: i === 0 ? 100 : sorted[i - 1].minLuck - 1,
  }))
}
