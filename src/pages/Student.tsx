import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Attempt, Question, activities, questions, skills, subjects } from '../data/data'
import { recommend } from '../features/analytics'
import { useApp } from '../store'

export function StudentHome() {
  const { visibleStudents, attempts } = useApp(); const s = visibleStudents[0]
  if (!s) return <div className="card">Belum ada profil murid dipautkan.</div>
  const recs = recommend(attempts, s.id).filter(r => r.activityId)
  const done = attempts.filter(a => a.studentId === s.id && !a.sample)
  const stars = done.reduce((n, a) => n + a.responses.filter(r => r.isCorrect).length, 0)
  return <div className="space-y-5"><h1 className="text-3xl font-extrabold">Hai {s.name}! {s.avatar}</h1><p>Darjah {s.grade} • ⭐ {stars} bintang daripada aktiviti demo</p>
    <div className="grid md:grid-cols-2 gap-4">{subjects.map(sub => <div key={sub.id} className="card"><h2 className="font-bold text-lg">{sub.name}</h2><p className="text-sm text-slate-500 mb-3">Mari cuba soalan Darjah {s.grade}!</p><Link className="btn" to={`/student/run/assessment/${sub.id}`}>Mula penilaian</Link></div>)}</div>
    <div className="card"><h2 className="font-bold mb-2">Latihan untuk kamu</h2>{recs.length ? recs.map(r => { const a = activities.find(x => x.id === r.activityId)!; return <div key={a.id} className="flex justify-between items-center border-t py-2"><span>{a.title}</span><Link className="btn" to={`/student/run/practice/${a.id}`}>Latih</Link></div> }) : <p className="text-slate-500">Selesaikan penilaian dahulu untuk mendapat latihan yang sesuai.</p>}</div>
    <div className="card"><h2 className="font-bold mb-2">Aktiviti selesai</h2>{done.length ? done.map(a => <p key={a.id} className="text-sm">{a.date} • {a.type === 'assessment' ? 'Penilaian' : 'Latihan'} • {a.responses.filter(r => r.isCorrect).length}/{a.responses.length}</p>) : <p className="text-slate-500">Belum ada. Anda boleh mulakan sekarang!</p>}</div></div>
}
const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5)
export function Run() {
  const { mode, id } = useParams(); const { visibleStudents, addAttempt } = useApp(); const nav = useNavigate(); const s = visibleStudents[0]
  const qs: Question[] = useMemo(() => {
    const base = mode === 'practice' ? questions.filter(q => q.skillId === activities.find(a => a.id === id)?.skillId) : questions.filter(q => q.subjectId === id && q.grade === s?.grade)
    return base.map(q => ({ ...q, options: shuffle(q.options) }))
  }, [mode, id, s?.grade])
  const [i, setI] = useState(0); const [ans, setAns] = useState<Record<string, string>>({}); const [err, setErr] = useState('')
  if (!s || !qs.length) return <div className="card"><p>Belum ada soalan untuk murid ini di sini.</p><Link className="btn mt-3" to="/student">Kembali</Link></div>
  const q = qs[i]
  const submit = async () => {
    if (qs.some(x => !ans[x.id])) return setErr('Sila jawab semua soalan sebelum hantar.')
    const a: Attempt = { id: 'tmp', studentId: s.id, type: mode === 'practice' ? 'practice' : 'assessment', subjectId: qs[0].subjectId, skillId: mode === 'practice' ? qs[0].skillId : undefined, date: new Date().toISOString().slice(0, 10), sample: false,
      responses: qs.map(x => ({ questionId: x.id, selected: ans[x.id], isCorrect: ans[x.id] === x.answerKey })) }
    const aid = await addAttempt(a); nav('/student/results/' + aid)
  }
  return <div className="card max-w-xl mx-auto space-y-4"><div className="h-2 bg-slate-100 rounded"><div className="h-2 bg-teal rounded" style={{ width: (i + 1) / qs.length * 100 + '%' }} /></div>
    <p className="text-sm text-slate-500">Soalan {i + 1} / {qs.length} • {skills.find(k => k.id === q.skillId)!.name}</p><h2 className="text-xl font-bold">{q.text}</h2>
    <div className="grid gap-2">{q.options.map(o => <button key={o} onClick={() => { setAns({ ...ans, [q.id]: o }); setErr('') }} className={ans[q.id] === o ? 'btn' : 'btn2'}>{o}</button>)}</div>
    {err && <p role="alert" className="text-sm text-red-700">{err}</p>}
    <div className="flex justify-between"><button className="btn2" disabled={i === 0} onClick={() => setI(i - 1)}>Sebelum</button>
      {i < qs.length - 1 ? <button className="btn" onClick={() => setI(i + 1)}>Seterusnya</button> : <button className="btn" onClick={submit}>Hantar</button>}</div></div>
}
export function Results() {
  const { id } = useParams(); const { attempts } = useApp(); const a = attempts.find(x => x.id === id)
  if (!a) return <div className="card"><p>Keputusan tidak ditemui.</p><Link className="btn mt-3" to="/student">Kembali</Link></div>
  const c = a.responses.filter(r => r.isCorrect).length
  return <div className="space-y-4 max-w-xl mx-auto"><div className="card text-center"><h1 className="text-2xl font-extrabold">Syabas! 🎉</h1><p className="text-4xl font-extrabold my-2">{c} / {a.responses.length}</p>
    <p className="text-sm text-slate-500">{a.type === 'practice' ? 'Latihan direkod secara berasingan dan tidak membuktikan penguasaan. Cuba penilaian susulan.' : 'Setiap jawapan direkod untuk analisis kemahiran.'}</p></div>
    {a.responses.map(r => { const q = questions.find(x => x.id === r.questionId)!; return <div key={q.id} className="card text-sm"><b>{q.text}</b><p>Jawapan kamu: {r.selected} {r.isCorrect ? '✓ Betul' : `✗ Jawapan betul: ${q.answerKey}`}</p><p className="text-slate-500">{q.explanation}</p></div> })}
    <div className="flex gap-2"><Link className="btn" to={a.type === 'practice' ? `/student/run/practice/act-${a.skillId}` : `/student/run/assessment/${a.subjectId}`}>Cuba lagi</Link>
      {a.type === 'practice' && <Link className="btn2" to={`/student/run/assessment/${a.subjectId}`}>Penilaian susulan</Link>}<Link className="btn2" to="/student">Papan pemuka</Link></div></div>
}
