import { developerTypes } from '../data/developerTypes.js'
import { fortunes } from '../data/fortunes.js'
import { pythonCodes } from '../data/pythonCodes.js'
import { luckyKeywords } from '../data/luckyKeywords.js'
import { quotes, luckyActions } from '../data/extras.js'
import { defaultPrizes, normalizePrizes } from '../data/prizes.js'

// 직전 결과와 같은 항목이 연속으로 나오지 않도록 마지막 인덱스를 기억한다.
const lastIndex = new Map()

function pick(key, list) {
  if (!Array.isArray(list) || list.length === 0) return null
  if (list.length === 1) return list[0]
  let idx = Math.floor(Math.random() * list.length)
  if (idx === lastIndex.get(key)) {
    idx = (idx + 1 + Math.floor(Math.random() * (list.length - 1))) % list.length
  }
  lastIndex.set(key, idx)
  return list[idx]
}

function randomStat(min = 40, max = 100) {
  return min + Math.floor(Math.random() * (max - min + 1))
}

// weight 비중대로 등수를 뽑고, 그 등수 구간 안에서 행운지수를 생성한다.
export function drawPrize(prizeTiers) {
  const tiers = normalizePrizes(prizeTiers) ?? normalizePrizes(defaultPrizes)
  const total = tiers.reduce((sum, t) => sum + t.weight, 0)
  let roll = Math.random() * total
  let tier = tiers[tiers.length - 1]
  for (const t of tiers) {
    roll -= t.weight
    if (roll < 0) {
      tier = t
      break
    }
  }
  const luck = randomStat(tier.minLuck, tier.maxLuck)
  return { tier, luck }
}

export function generateFortune(prizeTiers = defaultPrizes) {
  const { tier, luck } = drawPrize(prizeTiers)
  return {
    luck,
    prize: tier,
    type: pick('type', developerTypes) ?? { emoji: '🐍', name: 'Python Developer', tagline: '' },
    fortune: pick('fortune', fortunes) ?? '오늘은 모든 코드가 잘 실행되는 날입니다.',
    keyword: pick('keyword', luckyKeywords) ?? 'print("Hello World")',
    quote: pick('quote', quotes) ?? '"It works on my machine."',
    action: pick('action', luckyActions) ?? '커피를 한 잔 마시면 코드가 잘 풀립니다.',
    stats: [
      { label: '디버깅력', value: randomStat() },
      { label: 'Python력', value: randomStat() },
      { label: '커뮤니케이션', value: randomStat() },
      { label: '배포 운', value: randomStat(50, 100) },
    ],
  }
}

export function pickPythonCode() {
  return (
    pick('code', pythonCodes) ?? {
      code: 'print("Hello, World!")',
      comment: '오늘도 무사히 실행되었습니다.',
    }
  )
}
