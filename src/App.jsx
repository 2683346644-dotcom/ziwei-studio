import React, { useMemo, useState } from 'react';
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Compass, Download, Sparkles } from 'lucide-react';
import { createChart, getHoroscope, timeOptions } from './astro.js';
import ChartGrid from './ChartGrid.jsx';

const initial = { name: '示例命盘', date: '1992-08-16', timeIndex: '2', gender: '女' };

function toHourRange(index) { return timeOptions[Number(index)]?.replace(/^[^ ]+ /, '') ?? '—'; }

function BirthForm({ value, onChange, onSubmit }) {
  return (
    <form className="birth-form" onSubmit={onSubmit}>
      <label className="field-label" htmlFor="person-name">命盘名称</label>
      <input id="person-name" className="text-input" value={value.name} maxLength="20" onChange={(e) => onChange({ ...value, name: e.target.value })} placeholder="例如：我的命盘" />
      <div className="field-row"><label className="field-label" htmlFor="birth-date">出生日期</label><span className="field-hint">公历</span></div>
      <div className="input-with-icon"><CalendarDays size={16} /><input id="birth-date" type="date" className="text-input date-input" value={value.date} onInput={(e) => onChange({ ...value, date: e.currentTarget.value })} onChange={(e) => onChange({ ...value, date: e.currentTarget.value })} required /></div>
      <label className="field-label" htmlFor="birth-time">出生时辰</label>
      <div className="select-wrap"><select id="birth-time" className="text-input" value={value.timeIndex} onChange={(e) => onChange({ ...value, timeIndex: e.target.value })}>{timeOptions.map((time, index) => <option value={index} key={time}>{time}</option>)}</select><ChevronDown size={15} /></div>
      <span className="field-hint timezone-hint">不确定时辰？可先选择最接近的时间</span>
      <span className="field-label gender-label">性别</span>
      <div className="segmented" role="group" aria-label="性别">{['男', '女'].map((gender) => <button type="button" key={gender} className={value.gender === gender ? 'selected' : ''} onClick={() => onChange({ ...value, gender })}>{gender}</button>)}</div>
      <button className="primary-button" type="submit"><Sparkles size={16} />生成命盘</button>
      <p className="privacy-note">出生信息仅在当前页面用于排盘，不会上传保存。</p>
    </form>
  );
}

function App() {
  const [form, setForm] = useState(initial);
  const [submitted, setSubmitted] = useState(initial);
  const [chart, setChart] = useState(() => createChart(initial));
  const [activePalace, setActivePalace] = useState('命宫');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDecadeIndex, setSelectedDecadeIndex] = useState(0);
  const [error, setError] = useState('');
  const decades = useMemo(() => (chart?.palaces ?? []).map((palace) => ({ ...palace.decadal, palaceName: palace.name })).filter((item) => item.range).sort((a, b) => a.range[0] - b.range[0]), [chart]);
  const active = chart?.palaces?.find((p) => p.name === activePalace);
  let horoscope;
  try { horoscope = getHoroscope(chart, submitted.date, submitted.timeIndex, selectedYear); } catch { horoscope = null; }

  function submit(e) {
    e.preventDefault();
    try {
      const next = createChart(form);
      setChart(next); setSubmitted(form); setActivePalace('命宫'); setSelectedDecadeIndex(0); setError('');
    } catch (err) { setError(err?.message ?? '无法生成命盘，请检查出生日期和时辰。'); }
  }

  function changeYear(step) { setSelectedYear((year) => Math.min(2100, Math.max(1900, year + step))); }
  const currentDecade = decades[selectedDecadeIndex] ?? decades[0] ?? null;
  const [birthYear, birthMonth, birthDay] = submitted.date.split('-');

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="星历首页"><span className="brand-symbol">星</span><span>星历<span className="brand-divider">/</span><small>紫微排盘</small></span></a>
        <nav className="top-nav"><a className="nav-active" href="#chart">命盘</a><a href="#periods">运限</a><a href="#about">关于</a></nav>
        <div className="top-actions"><span className="local-badge"><i />本地排盘</span><button className="icon-button" title="导出命盘" onClick={() => window.print()}><Download size={17} /><span>导出</span></button></div>
      </header>

      <main id="top" className="main-layout">
        <aside className="sidebar">
          <div className="side-heading"><div><span className="section-kicker">PERSONAL CHART</span><h1>排一张命盘</h1></div><span className="heading-orbit"><Compass size={20} /></span></div>
          <p className="side-intro">填写出生信息，生成你的紫微斗数命盘。</p>
          <BirthForm value={form} onChange={setForm} onSubmit={submit} />
          {error && <p className="error-message" role="alert">{error}</p>}
          <div className="side-footer"><span className="footer-line" />所有计算在本机浏览器完成</div>
        </aside>

        <section id="chart" className="workspace">
          <div className="workspace-heading"><div><div className="breadcrumb">命盘工作台 <span>/</span> <b>{submitted.name || '未命名'}</b></div><h2>{submitted.name || '未命名'}</h2><p>{birthYear}年{Number(birthMonth)}月{Number(birthDay)}日 · {toHourRange(submitted.timeIndex)} · {submitted.gender}命</p></div><div className="chart-tools"><button className="tool-button" onClick={() => { document.getElementById('person-name')?.focus(); }}><span>编辑信息</span><ChevronDown size={14} /></button></div></div>

          <div className="period-toolbar" id="periods"><div className="period-label"><span>流年</span><strong>{selectedYear}</strong><span>年</span></div><div className="year-control"><button aria-label="上一年" onClick={() => changeYear(-1)}><ChevronLeft size={17} /></button><button aria-label="下一年" onClick={() => changeYear(1)}><ChevronRight size={17} /></button></div><div className="toolbar-divider" /><div className="decade-picker"><span>大限</span><div className="select-wrap compact"><select value={selectedDecadeIndex} onChange={(e) => setSelectedDecadeIndex(Number(e.target.value))} aria-label="选择大限">{decades.map((item, index) => <option value={index} key={`${item.palaceName}-${index}`}>{item.range.join('–')} 岁 · {item.palaceName}</option>)}</select><ChevronDown size={14} /></div></div><span className="toolbar-spacer" /><span className="muted-small">算法：标准排盘</span></div>

          <div className="content-columns"><div className="chart-column"><ChartGrid chart={chart} activePalace={activePalace} setActivePalace={setActivePalace} selectedYear={selectedYear} selectedDecade={currentDecade} /></div><aside className="detail-panel"><div className="detail-head"><span className="detail-label">宫位详情</span><span className="detail-index">{active?.heavenlyStem}{active?.earthlyBranch ?? ''}</span></div><h3>{activePalace}</h3><p className="detail-caption">{active?.earthlyBranch ?? '—'}宫 · {active?.isBodyPalace ? '身宫' : '本命宫位'}</p><div className="detail-rule" /><div className="detail-section"><span>主星</span><div className="detail-stars">{(active?.majorStars ?? []).length ? active.majorStars.map((star) => <b key={star.name}>{star.name}</b>) : <em>无主星</em>}</div></div><div className="detail-section"><span>辅曜</span><div className="detail-stars secondary">{(active?.minorStars ?? []).slice(0, 8).map((star) => <b key={star.name}>{star.name}</b>)}{!active?.minorStars?.length && <em>—</em>}</div></div><div className="detail-section"><span>四化</span><div className="transform-list">{(active?.majorStars ?? []).filter((star) => star.mutagen).map((star) => <span key={star.name}>{star.mutagen} · {star.name}</span>)}{!(active?.majorStars ?? []).some((star) => star.mutagen) && <em>本宫无四化</em>}</div></div><div className="detail-bottom"><span>流年提示</span><p>{horoscope?.yearly?.name ? `${horoscope.yearly.name} · ${selectedYear}年` : '选择年份以查看运限变化。'}</p></div></aside></div>

          <div className="notes-row"><div className="note-symbol">i</div><p>紫微斗数属于传统文化与术数体系，本工具仅作排盘与学习参考，不构成现实决策建议。</p><span className="version-label">独立实现 · 试用版</span></div>
        </section>
      </main>
      <footer id="about" className="page-footer"><span>星历 · 紫微排盘</span><span>排盘结果由开源 iztro 库计算，具体流派设置可能影响结果。</span></footer>
    </div>
  );
}

export default App;
