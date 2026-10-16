import { Link, Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import { LogOut, RotateCcw } from 'lucide-react'
import { site } from './config/siteConfig'
import { useApp } from './store'
import { Role } from './data/data'
import { Landing, Login } from './pages/Public'
import { ParentHome, Insights, Progress } from './pages/Parent'
import { TeacherHome, TeacherStudent } from './pages/Teacher'
import { StudentHome, Run, Results } from './pages/Student'

function Shell({ role }: { role?: Role }) {
  const { session, logout, reset, live, ready } = useApp(); const nav = useNavigate()
  if (role && !ready) return <p className="p-10 text-center">Memuatkan...</p>
  if (role && session?.role !== role) return <Navigate to="/login" replace />
  return <div className="min-h-screen">
    <header className="bg-white border-b border-slate-200"><div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
      <Link to="/" className="font-extrabold text-lg">{site.name}</Link>
      {role && <span className="badge bg-amber-soft text-amber-800">{live ? 'Data langsung (Supabase)' : 'Data contoh / demo'}</span>}
      <div className="ml-auto flex gap-2">
        {role && <Link className="btn2" to={'/' + role}>Utama</Link>}
        {role && !live && <button className="btn2" onClick={() => { if (confirm('Set semula semua data demo?')) reset() }}><RotateCcw size={16} />Set semula</button>}
        {session ? <button className="btn2" aria-label="Log keluar" onClick={() => { logout(); nav('/') }}><LogOut size={16} />Keluar</button> : <Link className="btn" to="/login">Log masuk demo</Link>}
      </div></div></header>
    <main className="max-w-6xl mx-auto px-4 py-6"><Outlet /></main>
    <footer className="text-center text-xs text-slate-500 pb-8 px-4">Prototaip Fasa 1: data fiksyen. Log masuk dan localStorage bukan kawalan akses yang selamat.</footer>
  </div>
}
export default function App() {
  return <Routes>
    <Route element={<Shell />}><Route path="/" element={<Landing />} /><Route path="/login" element={<Login />} /><Route path="/demo" element={<Navigate to="/login" replace />} /><Route path="/how-it-works" element={<Navigate to="/#cara" replace />} /></Route>
    <Route element={<Shell role="parent" />}><Route path="/parent" element={<ParentHome />} /><Route path="/parent/insights/:id" element={<Insights />} /><Route path="/parent/progress/:id" element={<Progress />} /></Route>
    <Route element={<Shell role="teacher" />}><Route path="/teacher" element={<TeacherHome />} /><Route path="/teacher/students/:id" element={<TeacherStudent />} /></Route>
    <Route element={<Shell role="student" />}><Route path="/student" element={<StudentHome />} /><Route path="/student/run/:mode/:id" element={<Run />} /><Route path="/student/results/:id" element={<Results />} /></Route>
    <Route path="*" element={<div className="max-w-md mx-auto p-10 text-center"><h1 className="text-2xl font-extrabold">Halaman tidak ditemui</h1><p className="my-3">Pautan ini tidak wujud.</p><Link className="btn" to="/">Ke laman utama</Link></div>} />
  </Routes>
}
