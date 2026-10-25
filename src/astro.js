import { astro } from 'iztro';

export const timeOptions = [
  '早子时 00:00–00:59', '丑时 01:00–02:59', '寅时 03:00–04:59',
  '卯时 05:00–06:59', '辰时 07:00–08:59', '巳时 09:00–10:59',
  '午时 11:00–12:59', '未时 13:00–14:59', '申时 15:00–16:59',
  '酉时 17:00–18:59', '戌时 19:00–20:59', '亥时 21:00–22:59',
  '晚子时 23:00–23:59',
];

export function createChart({ date, timeIndex, gender }) {
  const [year, month, day] = date.split('-').map(Number);
  const chart = astro.bySolar(`${year}-${month}-${day}`, Number(timeIndex), gender, true, 'zh-CN');
  return chart.toJSON();
}

export function getHoroscope(chart, date, timeIndex, year) {
  const liveChart = astro.bySolar(date, Number(timeIndex), chart.gender, true, 'zh-CN');
  return liveChart.horoscope(`${year}-6-1`);
}
