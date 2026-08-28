import { useEffect, useState } from 'react'

const LINES = [
  '> python today.py',
  'Loading Python luck...',
  'Generating developer destiny...',
]

const TOTAL_MS = 1800

export default function LoadingScreen({ onDone }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 300),
      setTimeout(() => setStep(2), 800),
      setTimeout(() => setStep(3), 1400), // SUCCESS!
      setTimeout(onDone, TOTAL_MS),
    ]
    return () => timers.forEach(clearTimeout)
  }, [onDone])

  return (
    <div className="screen loading-screen">
      <div className="terminal" role="status" aria-label="운세 생성 중">
        <div className="terminal-bar">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
          <span className="terminal-title">luck.py — python3</span>
        </div>
        <div className="terminal-body">
          {LINES.slice(0, step + 1).map((line) => (
            <p key={line} className="terminal-line">{line}</p>
          ))}
          <div className="progress-track">
            <div className="progress-fill" />
          </div>
          {step >= 3 ? (
            <p className="terminal-line success glitch" data-text="SUCCESS!">SUCCESS!</p>
          ) : (
            <p className="terminal-line cursor-line"><span className="cursor" /></p>
          )}
        </div>
      </div>
    </div>
  )
}
