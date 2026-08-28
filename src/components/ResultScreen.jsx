import { useState } from 'react'
import { pickPythonCode } from '../utils/random.js'

// `백틱` 구간을 <code>로 강조해서 렌더링
function FortuneText({ text }) {
  const parts = String(text).split(/(`[^`]+`)/g)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('`') && part.endsWith('`') ? (
          // oxlint-disable-next-line no-array-index-key
          <code key={i} className="inline-code">{part.slice(1, -1)}</code>
        ) : (
          part
        ),
      )}
    </>
  )
}

export default function ResultScreen({ result, onRetry, onReset }) {
  const [codeCard, setCodeCard] = useState(null)
  const { type, fortune, keyword, quote, action, stats, luck, prize } = result

  return (
    <div className="screen result-screen">
      <div className="result-card pop-in">
        <div className="type-emoji" aria-hidden="true">{type.emoji}</div>
        <p className="type-label">오늘의 개발자 타입</p>
        <h2 className="type-name">{type.name}</h2>
        <p className="type-tagline">{type.tagline}</p>

        <div className="luck-box">
          <p className="section-label">🍀 오늘의 행운지수</p>
          <div className="luck-display">
            <span className="luck-number">{luck}</span>
            <span className="luck-unit">/ 100</span>
          </div>
          <div className="luck-track">
            <div className="luck-fill" style={{ '--luck-width': `${luck}%` }} />
          </div>
          <div className="luck-tier-badge">
            {prize.emoji} {prize.label} 당첨!
          </div>
        </div>

        <div className="fortune-box">
          <p className="section-label">🔮 오늘의 운세</p>
          <p className="fortune-text"><FortuneText text={fortune} /></p>
        </div>

        <div className="keyword-box">
          <p className="section-label">🍀 오늘의 행운의 키워드</p>
          <code className="keyword-chip">{keyword}</code>
        </div>

        <div className="stats-box">
          <p className="section-label">📊 오늘의 개발자 능력치 <span className="stats-note">(과학적 근거 0%)</span></p>
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div key={s.label} className="stat-row">
                <span className="stat-label">{s.label}</span>
                <div className="stat-track">
                  <div
                    className="stat-fill"
                    style={{ '--stat-width': `${s.value}%`, animationDelay: `${0.3 + i * 0.15}s` }}
                  />
                </div>
                <span className="stat-value">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="extras-row">
          <div className="extra-box">
            <p className="section-label">💬 오늘의 한마디</p>
            <p className="extra-text">{quote}</p>
          </div>
          <div className="extra-box">
            <p className="section-label">✨ 행운의 행동</p>
            <p className="extra-text"><FortuneText text={action} /></p>
          </div>
        </div>

        {codeCard ? (
          <div className="code-card pop-in" key={codeCard.code}>
            <div className="terminal-bar">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
              <span className="terminal-title">today_luck.py</span>
            </div>
            <pre className="code-block"><code>{codeCard.code}</code></pre>
            <p className="code-comment">💡 {codeCard.comment}</p>
          </div>
        ) : null}

        <div className="button-row">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setCodeCard(pickPythonCode())}
          >
            🐍 {codeCard ? 'Python 코드 다시 뽑기' : 'Python 코드 뽑기'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onRetry}>
            🔄 다시 뽑기
          </button>
        </div>

        <div className="prize-banner">
          <p className="prize-title">🎉 오늘의 Python 운세 생성 완료!</p>
          <div className="prize-result">
            <span className="prize-result-emoji" aria-hidden="true">{prize.emoji}</span>
            <div className="prize-result-text">
              <p className="prize-rank">행운지수 {luck} → <strong>{prize.label}</strong></p>
              <p className="prize-name">{prize.prize}</p>
            </div>
          </div>
          <p className="prize-text">
            직원에게 이 화면을 보여주고<br />
            <strong>{prize.label} 경품을 받아가세요! 🐍</strong>
          </p>
          <button type="button" className="btn btn-ghost" onClick={onReset}>
            🏠 처음으로
          </button>
        </div>
      </div>
    </div>
  )
}
