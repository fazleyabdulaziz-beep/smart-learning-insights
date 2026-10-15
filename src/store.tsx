import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { Attempt, Role, seedAttempts, students as seedStudents, Student } from './data/data'
// Prototype-only persistence. localStorage is NOT secure storage for children's records.
const KEY = 'sli_v1'
interface State { session: { role: Role; name: string } | null; selected: string; attempts: Attempt[]; students: Student[] }
const initial = (): State => ({ session: null, selected: 's1', attempts: seedAttempts, students: seedStudents })
function load(): State {
  try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && Array.isArray(s.attempts) && Array.isArray(s.students)) return { ...initial(), ...s } } catch { /* fall through */ }
  return initial()
}
interface Ctx extends State { login: (role: Role, name: string) => void; logout: () => void; select: (id: string) => void; addAttempt: (a: Attempt) => void; editStudent: (id: string, p: Partial<Student>) => void; reset: () => void }
const C = createContext<Ctx>(null as unknown as Ctx)
export const useApp = () => useContext(C)
export function Provider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<State>(load)
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(s)) } catch { /* storage full/blocked */ } }, [s])
  const v: Ctx = { ...s,
    login: (role, name) => setS(p => ({ ...p, session: { role, name }, selected: role === 'student' ? 's1' : p.selected })),
    logout: () => setS(p => ({ ...p, session: null })),
    select: id => setS(p => ({ ...p, selected: id })),
    addAttempt: a => setS(p => ({ ...p, attempts: [...p.attempts, a] })),
    editStudent: (id, patch) => setS(p => ({ ...p, students: p.students.map(x => x.id === id ? { ...x, ...patch } : x) })),
    reset: () => setS(initial()) }
  return <C.Provider value={v}>{children}</C.Provider>
}
