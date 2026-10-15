import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { relationships } from '../data/data'
import { useApp } from '../store'
import { Chart, Recs, SkillTable } from './shared'

export function ParentHome() {
  const { students, attempts, selected, select, editStudent } = useApp()
  const kids = students.filter(s => relationships.some(r => r.userId === 'u1' && r.studentId === s.id))
  const kid = kids.find(k => k.id === selected) ?? kids[0]
  const [name, setName] = useState(kid.name)
  const mine = attempts.filter(a => a.studentId === kid.id).sort((a, b) => b.date.localeCompare(a.date))
  return <div className="space-y-5"><h1 className="text-2xl font-extrabold">Papan pemuka ibu bapa</h1>
    <div className="flex gap-2 flex-wrap">{kids.map(k => <button key={k.id} className={k.id === kid.id ? 'btn' : 'btn2'} onClick={() => { select(k.id); setName(k.name) }}>{k.avatar} {k.name} (Darjah {k.grade})</button>)}</div>
    <div className="grid md:grid-cols-3 gap-4">
      <div className="card"><p className="text-sm text-slate-500">Anak dipautkan</p><p className="text-3xl font-extrabold">{kids.length}</p></div>
      <div className="card"><p className="text-sm text-slate-500">Penilaian terkini</p><p className="text-xl font-extrabold">{mine[0]?.date ?? 'Tiada'}{mine[0]?.sample && ' (contoh)'}</p></div>
      <div className="card"><p className="text-sm text-slate-500">Percubaan direkod</p><p className="text-3xl font-extrabold">{mine.length}</p></div></div>
    <div className="grid md:grid-cols-2 gap-4">
      <div className="card"><h2 className="font-bold mb-3">Kemahiran {kid.name}</h2><SkillTable attempts={attempts} studentId={kid.id} />
        <div className="mt-4 flex gap-2 flex-wrap"><Link className="btn" to={'/parent/insights/' + kid.id}>Laporan terperinci</Link><Link className="btn2" to={'/parent/progress/' + kid.id}>Sejarah kemajuan</Link></div></div>
      <div className="card"><h2 className="font-bold mb-3">Cadangan seterusnya</h2><Recs attempts={attempts} studentId={kid.id} />
        <h3 className="font-bold mt-5 mb-1">Sunting profil (disimpan setempat)</h3>
        <div className="flex gap-2"><input aria-label="Nama paparan" className="border rounded-xl px-3 py-2 flex-1" value={name} onChange={e => setName(e.target.value)} />
          <button className="btn" disabled={!name.trim()} onClick={() => editStudent(kid.id, { name: name.trim() })}>Simpan</button></div></div></div></div>
}
export function Insights() {
  const { id } = useParams(); const { attempts, students } = useApp(); const s = students.find(x => x.id === id)
  if (!s) return <p>Profil tidak ditemui.</p>
  const list = attempts.filter(a => a.studentId === s.id).sort((a, b) => b.date.localeCompare(a.date))
  return <div className="space-y-4"><h1 className="text-2xl font-extrabold">Laporan: {s.name}</h1><p className="text-sm text-amber-800">Laporan menggunakan data contoh bagi rekod bertanda "contoh".</p>
    <div className="card"><SkillTable attempts={attempts} studentId={s.id} /></div>
    <div className="card"><h2 className="font-bold mb-2">Rekod jawapan</h2><table className="w-full text-sm"><thead><tr className="text-left"><th>Tarikh</th><th>Jenis</th><th>Jawab</th><th>Betul</th><th>Salah</th></tr></thead><tbody>
      {list.map(a => { const c = a.responses.filter(r => r.isCorrect).length; return <tr key={a.id} className="border-t"><td>{a.date} {a.sample && <span className="badge bg-slate-100">contoh</span>}</td><td>{a.type === 'assessment' ? 'Penilaian' : 'Latihan'}</td><td>{a.responses.length}</td><td>{c}</td><td>{a.responses.length - c}</td></tr> })}</tbody></table></div>
    <div className="card"><h2 className="font-bold mb-2">Cadangan</h2><Recs attempts={attempts} studentId={s.id} /></div></div>
}
export function Progress() {
  const { id } = useParams(); const { attempts, students } = useApp(); const s = students.find(x => x.id === id)
  if (!s) return <p>Profil tidak ditemui.</p>
  const practice = attempts.filter(a => a.studentId === s.id && a.type === 'practice')
  return <div className="space-y-4"><h1 className="text-2xl font-extrabold">Sejarah kemajuan: {s.name}</h1>
    <div className="card"><Chart attempts={attempts} studentId={s.id} /><p className="text-xs text-slate-500 mt-2">Bulatan kosong = data contoh; bulatan penuh = hasil baharu dijana dalam demo.</p></div>
    <div className="card"><h2 className="font-bold mb-1">Corak Pembelajaran (ilustrasi)</h2><p className="text-sm text-slate-600">Latihan selesai: {practice.length}. Corak hanya ringkasan perhatian pada data contoh; lebih banyak bukti diperlukan sebelum ditafsir. Kelajuan menjawab tidak dianggap prestasi lebih baik, dan ini bukan gaya belajar atau bakat tetap.</p></div></div>
}
