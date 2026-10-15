import { Link, useParams } from 'react-router-dom'
import { classes, relationships, skills } from '../data/data'
import { skillStats, statusColor, statusLabel } from '../features/analytics'
import { useApp } from '../store'
import { Recs, SkillTable } from './shared'

export function TeacherHome() {
  const { students, attempts } = useApp(); const cls = classes[0]
  const kids = students.filter(s => relationships.some(r => r.classId === cls.id && r.studentId === s.id))
  const agg = skills.map(k => { let c = 0, n = 0; kids.forEach(s => skillStats(attempts, s.id).filter(x => x.skillId === k.id).forEach(x => { c += x.correct; n += x.answered })); return { k, c, n } }).filter(x => x.n)
  return <div className="space-y-5"><h1 className="text-2xl font-extrabold">Papan pemuka guru</h1>
    <div className="card"><h2 className="font-bold">{cls.name}</h2><p className="text-sm text-slate-500">{kids.length} murid (rekod contoh)</p>
      <div className="mt-3 flex gap-2 flex-wrap">{kids.map(s => <Link key={s.id} className="btn2" to={'/teacher/students/' + s.id}>{s.avatar} {s.name}</Link>)}</div></div>
    <div className="card"><h2 className="font-bold mb-3">Kemahiran kelas yang perlu perhatian</h2>{agg.map(({ k, c, n }) => {
      const pct = Math.round(100 * c / n); const s = n < 3 ? 'insufficient' : pct < 50 ? 'developing' : pct >= 80 ? 'consistent' : 'building'
      return <div key={k.id} className="flex justify-between text-sm border-t py-2"><span>{k.name}</span><span>{c}/{n} ({pct}%) <span className={`badge ${statusColor[s]}`}>{statusLabel[s]}</span></span></div> })}
      <p className="text-xs text-slate-500 mt-2">Akses sebenar mesti dikuatkuasakan oleh backend dan pangkalan data, bukan frontend.</p></div></div>
}
export function TeacherStudent() {
  const { id } = useParams(); const { students, attempts } = useApp(); const s = students.find(x => x.id === id)
  if (!s) return <p>Murid tidak ditemui.</p>
  return <div className="space-y-4"><Link to="/teacher" className="text-teal underline">Kembali ke kelas</Link><h1 className="text-2xl font-extrabold">{s.avatar} {s.name} (Darjah {s.grade})</h1>
    <div className="card"><SkillTable attempts={attempts} studentId={s.id} /></div><div className="card"><Recs attempts={attempts} studentId={s.id} /></div></div>
}
