import React, { useMemo } from 'react';

const branchPositions = {
  巳: [1, 1], 午: [1, 2], 未: [1, 3], 申: [1, 4],
  酉: [2, 4], 戌: [3, 4], 亥: [4, 4], 子: [4, 3],
  丑: [4, 2], 寅: [4, 1], 卯: [3, 1], 辰: [2, 1],
};

function Palace({ palace, active, onClick, style }) {
  const major = palace.majorStars ?? [];
  const minor = palace.minorStars ?? [];
  const displayed = [...major, ...minor].slice(0, 7);
  return (
    <button style={style} className={`palace ${active ? 'palace-active' : ''}`} onClick={onClick} aria-pressed={active}>
      <div className="palace-top"><span>{palace.heavenlyStem}{palace.earthlyBranch}</span><span className="palace-age">{palace.decadal?.range?.join('–') ?? '—'}</span></div>
      <div className="star-list">{displayed.map((star) => <span key={star.name} className={`star ${star.type === 'major' ? 'major' : ''}`}>{star.name}</span>)}</div>
      <div className="palace-bottom"><span className={palace.name === '命宫' ? 'soul-name' : ''}>{palace.name}</span><span>{palace.earthlyBranch}</span></div>
    </button>
  );
}

export default function ChartGrid({ chart, activePalace, setActivePalace, selectedYear, selectedDecade }) {
  const palaces = useMemo(() => chart?.palaces ?? [], [chart]);
  const center = chart?.palaces?.find((p) => p.name === '命宫') ?? chart?.palaces?.[0];
  return (
    <div className="chart-frame">
      <div className="chart-grid">
        {palaces.map((palace) => {
          const [gridRow, gridColumn] = branchPositions[palace.earthlyBranch] ?? [1, 1];
          return <Palace key={`${palace.name}-${palace.earthlyBranch}`} palace={palace} active={activePalace === palace.name} onClick={() => setActivePalace(palace.name)} style={{ gridRow, gridColumn, borderRight: gridColumn === 4 ? 0 : '1px solid #eeeae2', borderBottom: gridRow === 4 ? 0 : '1px solid #eeeae2' }} />;
        })}
        <section className="chart-center">
          <div className="center-mark"><span>紫微</span><i>✳</i></div>
          <p className="center-title">星历排盘</p>
          <div className="center-meta"><span>命主 <b>{chart?.soul ?? '—'}</b></span><span>身主 <b>{chart?.body ?? '—'}</b></span></div>
          <div className="center-meta"><span>五行局</span><b>{chart?.fiveElementsClass ?? '—'}</b></div>
          <div className="center-divider" />
          <p className="center-period">{selectedDecade ? `${selectedDecade.range?.join('–')}岁 · ${selectedDecade.palaceName ?? selectedDecade.name}` : '本命盘'}</p>
          <p className="center-year">{selectedYear} 流年</p>
          <p className="center-note">点击任一宫位查看星曜</p>
          {center && <div className="center-soul">命宫 · {center.earthlyBranch}</div>}
        </section>
      </div>
      <div className="chart-legend"><span><i className="legend-red" />主星</span><span><i className="legend-black" />辅曜</span><span>所示为传统术数排盘信息，仅供兴趣研究</span></div>
    </div>
  );
}
