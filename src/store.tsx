import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { Attempt, relationships, Role, seedAttempts, students as seedStudents, Student } from './data/data'
import { live, supabase } from './services/supabase'
// Demo mode: localStorage (NOT secure). Live mode: Supabase + Row Level Security, nothing stored in localStorage.
const KEY = 'sli_v1'
interface State { session: { role: Role; name: string } | null; selected: string; attempts: Attempt[]; students: Student[]; ready: boolean }
const initial = (): State => ({ session: null, selected: 's1', attempts: seedAttempts, students: seedStudents, ready: true })
function load(): State {
  if (live) return { ...initial(), attempts: [], students: [], selected: '', ready: false }
  try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && Array.isArray(s.attempts) && Array.isArray(s.students)) return { ...initial(), ...s } } catch { /* fall through */ }
  return initial()
}
interface Ctx extends State { live: boolean; visibleStudents: Student[]; signIn: (e: string, p: string) => Promise<{ error?: string; role?: Role }>; login: (role: Role, name: string) => void; logout: () => void; select: (id: string) => void; addAttempt: (a: Attempt) => Promise<string>; editStudent: (id: string, p: Partial<Student>) => void; reset: () => void }
const C = createContext<Ctx>(null as unknown as Ctx)
export const useApp = () => useContext(C)
export function Provider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<State>(load)
  useEffect(() => { if (!live) try { localStorage.setItem(KEY, JSON.stringify(s)) } catch { /* blocked */ } }, [s])
  async function hydrate(uid: string): Promise<Role | null> {
    const db = supabase!
    const { data: p } = await db.from('profiles').select('display_name, role').eq('id', uid).maybeSingle()
    if (!p) return null
    const { data: links } = await db.from('student_links').select('students(id, display_name, grade, avatar, created_at)')
    const { data: att } = await db.from('attempts').select('id, student_id, attempt_type, subject_id, skill_id, completed_at, responses(question_id, selected_answer, is_correct)')
    const students: Student[] = (links ?? []).map((l: any) => Array.isArray(l.students) ? l.students[0] : l.students).filter(Boolean)
      .map((x: any) => ({ id: x.id, name: x.display_name, grade: x.grade, avatar: x.avatar ?? '🙂', createdAt: x.created_at }))
    const attempts: Attempt[] = (att ?? []).map((a: any) => ({ id: a.id, studentId: a.student_id, type: a.attempt_type, subjectId: a.subject_id, skillId: a.skill_id ?? undefined, date: String(a.completed_at).slice(0, 10), sample: false,
      responses: (a.responses ?? []).map((r: any) => ({ questionId: r.question_id, selected: r.selected_answer, isCorrect: r.is_correct })) }))
    setS(prev => ({ ...prev, session: { role: p.role as Role, name: p.display_name }, students, attempts, selected: students[0]?.id ?? '', ready: true }))
    return p.role as Role
  }
  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(async ({ data }) => { if (data.session) await hydrate(data.session.user.id); setS(p => ({ ...p, ready: true })) })
    const { data: sub } = supabase.auth.onAuthStateChange(ev => { if (ev === 'SIGNED_OUT') setS(p => ({ ...p, session: null, attempts: [], students: [] })) })
    return () => sub.subscription.unsubscribe()
  }, [])
  const role = s.session?.role
  const visibleStudents = live ? s.students : s.students.filter(st => role === 'student' ? st.id === 's1' : role ? relationships.some(r => r.studentId === st.id && r.userId === (role === 'parent' ? 'u1' : 'u2')) : false)
  const v: Ctx = { ...s, live, visibleStudents,
    signIn: async (email, pw) => {
      const { data, error } = await supabase!.auth.signInWithPassword({ email, password: pw })
      if (error || !data.user) return { error: 'E-mel atau kata laluan tidak sepadan. (' + (error?.message ?? 'tiada pengguna') + ')' }
      const r = await hydrate(data.user.id)
      return r ? { role: r } : { error: 'Akaun belum mempunyai profil. Hubungi pentadbir.' }
    },
    login: (r, name) => setS(p => ({ ...p, session: { role: r, name }, selected: r === 'student' ? 's1' : p.selected })),
    logout: () => { if (supabase) supabase.auth.signOut(); setS(p => ({ ...p, session: null })) },
    select: id => setS(p => ({ ...p, selected: id })),
    addAttempt: async a => {
      let id = 'n' + Date.now()
      if (supabase) {
        const { data, error } = await supabase.from('attempts').insert({ student_id: a.studentId, subject_id: a.subjectId, skill_id: a.skillId ?? null, attempt_type: a.type }).select('id').single()
        if (error || !data) { alert('Gagal menyimpan keputusan. Cuba lagi.'); throw error }
        id = data.id
        const { error: e2 } = await supabase.from('responses').insert(a.responses.map(r => ({ attempt_id: id, question_id: r.questionId, selected_answer: r.selected, is_correct: r.isCorrect })))
        if (e2) { alert('Gagal menyimpan jawapan.'); throw e2 }
      }
      setS(p => ({ ...p, attempts: [...p.attempts, { ...a, id }] })); return id
    },
    editStudent: (id, patch) => { if (supabase && patch.name) supabase.from('students').update({ display_name: patch.name }).eq('id', id).then(() => {})
      setS(p => ({ ...p, students: p.students.map(x => x.id === id ? { ...x, ...patch } : x) })) },
    reset: () => { if (!live) setS(initial()) } }
  return <C.Provider value={v}>{children}</C.Provider>
}
