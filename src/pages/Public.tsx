import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { DEMO_PASSWORD, site } from '../config/siteConfig'
import { Role, users } from '../data/data'
import { useApp } from '../store'

export function Landing() {
  const steps = ['Murid menjawab penilaian', 'Sistem merekod setiap jawapan', 'Analisis ikut kemahiran', 'Cadangan latihan berkaitan', 'Penilaian susulan & sejarah kemajuan']
  return <div className="space-y-10">
    <section className="py-8"><h1 className="text-4xl md:text-5xl font-extrabold max-w-2xl leading-tight">{site.tagline}</h1>
      <p className="mt-4 max-w-xl text-lg text-slate-600">Bantu ibu bapa dan guru melihat kemahiran Bahasa Melayu dan Matematik (Darjah 1–3) yang mungkin memerlukan latihan tambahan.</p>
      <div className="mt-6 flex gap-3 flex-wrap"><Link to="/login" className="btn">Cuba demo</Link><a href="#cara" className="btn2">Cara ia berfungsi</a></div>
      <p className="mt-4 text-sm text-slate-500">Platform ini bukan alat diagnosis kesukaran pembelajaran dan tidak meramal kecerdasan atau kerjaya.</p></section>
    <section id="cara" className="card"><h2 className="text-xl font-extrabold mb-3">Cara analisis berfungsi</h2>
      <ol className="grid md:grid-cols-5 gap-3">{steps.map((s, i) => <li key={s} className="bg-teal-soft rounded-xl p-3 text-sm"><b>{i + 1}.</b> {s}</li>)}</ol></section>
    <section className="grid md:grid-cols-2 gap-4"><div className="card"><h3 className="font-bold">Untuk ibu bapa</h3><p className="text-slate-600 mt-1">Faham kemajuan anak ikut kemahiran, dengan bilangan soalan dipaparkan di sebelah setiap peratusan.</p></div>
      <div className="card"><h3 className="font-bold">Untuk guru</h3><p className="text-slate-600 mt-1">Lihat kemahiran yang perlu perhatian merentas kelas dan buka laporan murid.</p></div></section>
    <section className="card"><h2 className="text-xl font-extrabold mb-2">Soalan lazim</h2>
      <p className="font-semibold">Adakah ini mendiagnosis murid?</p><p className="text-slate-600 mb-2">Tidak. Ia hanya meringkaskan jawapan pada sampel soalan.</p>
      <p className="font-semibold">Adakah data ini sebenar?</p><p className="text-slate-600">Tidak. Semua rekod terlebih dahulu ialah data contoh fiksyen.</p></section></div>
}
export function Login() {
  const { login } = useApp(); const nav = useNavigate()
  const [role, setRole] = useState<Role>('parent'); const [email, setEmail] = useState(''); const [pw, setPw] = useState(''); const [show, setShow] = useState(false); const [err, setErr] = useState('')
  const pick = (r: Role) => { setRole(r); setErr(''); setEmail(r === 'parent' ? 'parent@example.com' : r === 'teacher' ? 'teacher@example.com' : ''); setPw(r === 'student' ? '' : DEMO_PASSWORD) }
  const submit = (e: FormEvent) => { e.preventDefault()
    if (role === 'student') { login('student', 'Aisyah'); return nav('/student') }
    if (!email.trim() || !pw) return setErr('Sila isi e-mel dan kata laluan.')
    const u = users.find(x => x.email === email.trim().toLowerCase() && x.role === role)
    if (!u || pw !== DEMO_PASSWORD) return setErr('E-mel atau kata laluan demo tidak sepadan.')
    login(role, u.name); nav('/' + role) }
  return <form onSubmit={submit} className="card max-w-md mx-auto space-y-4"><h1 className="text-2xl font-extrabold">Log masuk demo</h1>
    <div className="flex gap-2" role="radiogroup">{(['parent', 'teacher', 'student'] as Role[]).map(r => <button type="button" key={r} onClick={() => pick(r)} className={r === role ? 'btn flex-1' : 'btn2 flex-1'}>{r === 'parent' ? 'Ibu bapa' : r === 'teacher' ? 'Guru' : 'Murid'}</button>)}</div>
    {role === 'student' ? <p className="text-sm text-slate-600">Masuk sebagai profil murid demo (Aisyah, Darjah 2).</p> : <>
      <label className="block text-sm font-semibold">E-mel<input className="mt-1 w-full border rounded-xl px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} /></label>
      <label className="block text-sm font-semibold">Kata laluan<div className="mt-1 flex border rounded-xl"><input className="flex-1 px-3 py-2 rounded-xl" type={show ? 'text' : 'password'} value={pw} onChange={e => setPw(e.target.value)} />
        <button type="button" className="px-3" aria-label="Tunjuk/sembunyi kata laluan" onClick={() => setShow(!show)}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label></>}
    {err && <p role="alert" className="text-sm text-red-700">{err}</p>}
    <button className="btn w-full">Log masuk</button>
    <p className="text-xs text-slate-500">Demo: parent@example.com / teacher@example.com, kata laluan {DEMO_PASSWORD}. Ini bukan pengesahan sebenar dan pilihan peranan bukan kawalan keselamatan.</p></form>
}
