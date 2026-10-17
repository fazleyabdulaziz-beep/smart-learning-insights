import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { DEMO_PASSWORD, site } from '../config/siteConfig'
import { Role, users } from '../data/data'
import { useApp } from '../store'

export function Landing() {
  const steps = [['📝', 'Murid menjawab penilaian', 'bg-teal-soft'], ['💾', 'Sistem merekod setiap jawapan', 'bg-violet-soft'], ['📊', 'Analisis ikut kemahiran', 'bg-pink-soft'], ['🎯', 'Cadangan latihan berkaitan', 'bg-amber-soft'], ['📈', 'Penilaian susulan & sejarah kemajuan', 'bg-teal-soft']]
  return <div className="space-y-10">
    <section className="card !p-8 md:!p-12 overflow-hidden relative"><div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-pink-soft blur-2xl" /><div className="absolute right-24 bottom-0 w-40 h-40 rounded-full bg-violet-soft blur-2xl" />
      <div className="relative"><span className="badge bg-teal-soft text-teal">Darjah 1–3 • Bahasa Melayu • Matematik</span>
        <h1 className="mt-4 text-4xl md:text-6xl font-extrabold leading-tight max-w-3xl grad-text">{site.tagline}</h1>
        <p className="mt-4 max-w-xl text-lg text-slate-600">Bantu ibu bapa dan guru melihat kemahiran yang mungkin memerlukan latihan tambahan, dengan cara yang jelas dan positif.</p>
        <div className="mt-6 flex gap-3 flex-wrap"><Link to="/login" className="btn">Cuba demo 🚀</Link><a href="#cara" className="btn2">Cara ia berfungsi</a></div>
        <p className="mt-4 text-sm text-slate-500">Bukan alat diagnosis kesukaran pembelajaran, dan tidak meramal kecerdasan atau kerjaya.</p></div></section>
    <section id="cara"><h2 className="text-2xl font-extrabold mb-4">Cara analisis berfungsi</h2>
      <ol className="grid md:grid-cols-5 gap-3">{steps.map(([e, s, c], i) => <li key={s} className={`${c} rounded-3xl p-4 text-sm font-semibold transition duration-300 hover:-translate-y-1 hover:shadow-lg`}><div className="text-3xl mb-2">{e}</div>{i + 1}. {s}</li>)}</ol></section>
    <section className="grid md:grid-cols-2 gap-4"><div className="card"><h3 className="font-extrabold text-lg">👨‍👩‍👧 Untuk ibu bapa</h3><p className="text-slate-600 mt-1">Faham kemajuan anak ikut kemahiran, dengan bilangan soalan dipaparkan di sebelah setiap peratusan.</p></div>
      <div className="card"><h3 className="font-extrabold text-lg">🍎 Untuk guru</h3><p className="text-slate-600 mt-1">Lihat kemahiran yang perlu perhatian merentas kelas dan buka laporan murid.</p></div></section>
    <section className="card"><h2 className="text-xl font-extrabold mb-2">Soalan lazim</h2>
      <p className="font-semibold">Adakah ini mendiagnosis murid?</p><p className="text-slate-600 mb-2">Tidak. Ia hanya meringkaskan jawapan pada sampel soalan.</p>
      <p className="font-semibold">Adakah data ini sebenar?</p><p className="text-slate-600">Tidak. Semua rekod ialah data contoh fiksyen.</p></section></div>
}
export function Login() {
  const { login, signIn, live } = useApp(); const nav = useNavigate()
  const [role, setRole] = useState<Role>('parent'); const [email, setEmail] = useState(''); const [pw, setPw] = useState(''); const [show, setShow] = useState(false); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false)
  const pick = (r: Role) => { setRole(r); setErr(''); setEmail(r === 'parent' ? 'parent@example.com' : r === 'teacher' ? 'teacher@example.com' : ''); setPw(r === 'student' ? '' : DEMO_PASSWORD) }
  const submit = async (e: FormEvent) => { e.preventDefault()
    if (live) { if (!email.trim() || !pw) return setErr('Sila isi e-mel dan kata laluan.')
      setBusy(true); const r = await signIn(email.trim(), pw); setBusy(false); return r.error ? setErr(r.error) : nav('/' + r.role) }
    if (role === 'student') { login('student', 'Aisyah'); return nav('/student') }
    if (!email.trim() || !pw) return setErr('Sila isi e-mel dan kata laluan.')
    const u = users.find(x => x.email === email.trim().toLowerCase() && x.role === role)
    if (!u || pw !== DEMO_PASSWORD) return setErr('E-mel atau kata laluan demo tidak sepadan.')
    login(role, u.name); nav('/' + role) }
  const needsFields = live || role !== 'student'
  return <form onSubmit={submit} className="card max-w-md mx-auto space-y-4"><h1 className="text-2xl font-extrabold">{live ? 'Log masuk' : 'Log masuk demo'}</h1>
    {!live && <div className="flex gap-2" role="radiogroup">{(['parent', 'teacher', 'student'] as Role[]).map(r => <button type="button" key={r} onClick={() => pick(r)} className={r === role ? 'btn flex-1' : 'btn2 flex-1'}>{r === 'parent' ? 'Ibu bapa' : r === 'teacher' ? 'Guru' : 'Murid'}</button>)}</div>}
    {!needsFields ? <p className="text-sm text-slate-600">Masuk sebagai profil murid demo (Aisyah, Darjah 2).</p> : <>
      <label className="block text-sm font-semibold">E-mel<input className="mt-1 w-full border rounded-xl px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} /></label>
      <label className="block text-sm font-semibold">Kata laluan<div className="mt-1 flex border rounded-xl"><input className="flex-1 px-3 py-2 rounded-xl" type={show ? 'text' : 'password'} value={pw} onChange={e => setPw(e.target.value)} />
        <button type="button" className="px-3" aria-label="Tunjuk/sembunyi kata laluan" onClick={() => setShow(!show)}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label></>}
    {err && <p role="alert" className="text-sm text-red-700">{err}</p>}
    <button className="btn w-full" disabled={busy}>{busy ? 'Sila tunggu...' : 'Log masuk'}</button>
    <p className="text-xs text-slate-500">{live ? 'Log masuk dengan akaun Supabase anda. Gunakan data fiksyen sahaja sehingga persetujuan penjaga dan semakan pematuhan selesai.' : `Demo: parent@example.com / teacher@example.com, kata laluan ${DEMO_PASSWORD}. Bukan pengesahan sebenar.`}</p></form>
}
