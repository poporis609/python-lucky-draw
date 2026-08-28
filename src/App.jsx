import { useCallback, useEffect, useState } from 'react'
import StartScreen from './components/StartScreen.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'
import ResultScreen from './components/ResultScreen.jsx'
import { generateFortune } from './utils/random.js'
import { defaultPrizes, normalizePrizes } from './data/prizes.js'
import './App.css'

export default function App() {
  const [phase, setPhase] = useState('start') // 'start' | 'loading' | 'result'
  const [result, setResult] = useState(null)
  const [prizes, setPrizes] = useState(defaultPrizes)

  // 경품 설정은 public/prizes.json에서 로드 — 실패하면 기본값 사용
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}prizes.json`)
      .then((res) => (res.ok ? res.json() : null))
      .then((config) => {
        const normalized = normalizePrizes(config)
        if (normalized) setPrizes(normalized)
      })
      .catch(() => {})
  }, [])

  const startDraw = useCallback(() => {
    setResult(generateFortune(prizes))
    setPhase('loading')
  }, [prizes])

  const showResult = useCallback(() => setPhase('result'), [])
  const reset = useCallback(() => {
    setResult(null)
    setPhase('start')
  }, [])

  return (
    <div className="app">
      <div className="bg-decor" aria-hidden="true">
        <span className="float-emoji e1">🐍</span>
        <span className="float-emoji e2">💻</span>
        <span className="float-emoji e3">☕</span>
        <span className="float-emoji e4">✨</span>
        <span className="float-emoji e5">🎲</span>
        <span className="float-emoji e6">🚀</span>
      </div>
      {phase === 'start' && <StartScreen onStart={startDraw} />}
      {phase === 'loading' && <LoadingScreen onDone={showResult} />}
      {phase === 'result' && result && (
        <ResultScreen result={result} onRetry={startDraw} onReset={reset} />
      )}
    </div>
  )
}
