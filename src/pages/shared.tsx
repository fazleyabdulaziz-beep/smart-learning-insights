import { Link } from 'react-router-dom'
import { Attempt, skills, students } from '../data/data'
import { NOT_ENOUGH, progressSeries, recommend, skillStats, statusColor, statusLabel } from '../features/analytics'

export function SkillTable({ attempts, studentId }: { attempts: Attempt[]; studentId: string }) {
  const st = skillStats(attempts, studentId)
  if (!st.length) return <p className="text-slate-500">Belum ada penilaian. Mulakan penilaian untuk melihat analisis kemahiran.</p>
  return <div className="space-y-3">{st.map(s => <div key={s.skillId}>
    <div className="flex justify-between text-sm gap-2"><span className="font-semibold">{skills.find(k => k.id === s.skillId)!.name}</span>
      <span>{s.correct}/{s.answered} betul ({s.accuracy}%) <span className={`badge ${statusColor[s.status]}`}>{statusLabel[s.status]}</span></span></div>
    <div className="h-2 rounded bg-slate-100 mt-1"><div className="h-2 rounded bg-teal" style={{ width: s.accuracy + '%' }} /></div>
    {s.status === 'insufficient' && <p className="text-xs text-amber-800 mt-1">{NOT_ENOUGH}</p>}</div>)}
    <p className="text-xs text-slate-500">Ambang bukti dan status ialah tetapan prototaip, bukan piawaian tervalidasi. Hanya penilaian dikira; latihan sahaja bukan bukti penguasaan.</p></div>
}
export function Recs({ attempts, studentId }: { attempts: Attempt[]; studentId: string }) {
  const r = recommend(attempts, studentId)
  if (!r.length) return <p className="text-slate-500">Tiada cadangan buat masa ini.</p>
  return <ul className="space-y-2">{r.map(x => <li key={x.skillId} className="bg-amber-soft rounded-xl p-3 text-sm">{x.reason}
    {x.activityId ? <div className="mt-1 text-xs">Aktiviti: <b>Latihan {skills.find(k => k.id === x.skillId)!.name}</b></div> : <div className="mt-1 text-xs">Cadangan: ambil penilaian lanjut.</div>}</li>)}</ul>
}
export function Chart({ attempts, studentId }: { attempts: Attempt[]; studentId: string }) {
  const pts = progressSeries(attempts, studentId)
  if (pts.length < 2) return <p className="text-slate-500">Perlu sekurang-kurangnya dua penilaian untuk melihat perubahan. Belum cukup data.</p>
  const x = (i: number) => 30 + i * (440 / (pts.length - 1)), y = (p: number) => 140 - p * 1.2
  return <svg viewBox="0 0 500 170" className="w-full" role="img" aria-label="Ketepatan mengikut penilaian">
    {[0, 50, 100].map(g => <g key={g}><line x1="30" x2="470" y1={y(g)} y2={y(g)} stroke="#e2e8f0" /><text x="2" y={y(g) + 4} fontSize="10">{g}%</text></g>)}
    <polyline fill="none" stroke="#0e8f8a" strokeWidth="2" points={pts.map((p, i) => `${x(i)},${y(p.pct)}`).join(' ')} />
    {pts.map((p, i) => <g key={p.id}><circle cx={x(i)} cy={y(p.pct)} r="5" fill={p.sample ? '#fff' : '#0e8f8a'} stroke="#0e8f8a" strokeWidth="2" /><text x={x(i)} y="162" fontSize="9" textAnchor="middle">{p.date.slice(5)}</text></g>)}</svg>
}
export const ChildLink = ({ id, to }: { id: string; to: string }) => { const s = students.find(x => x.id === id)!; return <Link className="btn2" to={to}>{s.avatar} {s.name}</Link> }
