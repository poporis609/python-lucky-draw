export default function StartScreen({ onStart }) {
  return (
    <div className="screen start-screen">
      <div className="start-badge">PYTHON COMMUNITY BOOTH</div>
      <h1 className="start-title">
        <span className="start-snake" aria-hidden="true">🐍</span>
        오늘의 <span className="accent">Python</span> 운세
      </h1>
      <p className="start-subtitle">당신의 오늘은 어떤 코드로 실행될까요?</p>
      <button type="button" className="btn btn-primary btn-huge" onClick={onStart}>
        🎰 운세 뽑기
      </button>
      <p className="start-hint">버튼 한 번이면 끝! · 소요 시간 약 30초</p>
      <div className="start-ticker" aria-hidden="true">
        <span>
          {'>>> import luck · >>> luck.today() · >>> "대박" · >>> import this · >>> print("어서오세요!") · '}
          {'>>> import luck · >>> luck.today() · >>> "대박" · >>> import this · >>> print("어서오세요!") · '}
        </span>
      </div>
    </div>
  )
}
