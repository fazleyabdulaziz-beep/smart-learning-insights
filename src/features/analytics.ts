import { rules } from '../config/siteConfig'
import { Attempt, activities, questions, skills } from '../data/data'
export type Status = 'insufficient' | 'developing' | 'building' | 'consistent'
export const statusLabel: Record<Status, string> = { insufficient: 'Belum cukup data', developing: 'Sedang berkembang', building: 'Membina keyakinan', consistent: 'Prestasi konsisten' }
export const statusColor: Record<Status, string> = { insufficient: 'bg-slate-100 text-slate-600', developing: 'bg-amber-soft text-amber-800', building: 'bg-teal-soft text-teal', consistent: 'bg-green-100 text-green-800' }
export const NOT_ENOUGH = 'Belum cukup data untuk membuat kesimpulan yang kukuh.'
export interface SkillStat { skillId: string; correct: number; answered: number; accuracy: number; status: Status; tags: Record<string, number> }
export const statusOf = (c: number, n: number): Status => n < rules.minEvidence ? 'insufficient' : c / n < rules.developingBelow ? 'developing' : c / n >= rules.consistentFrom ? 'consistent' : 'building'
// Practice attempts are recorded separately and excluded from skill status (practice alone is not proof of mastery).
export function skillStats(attempts: Attempt[], studentId: string): SkillStat[] {
  const m = new Map<string, SkillStat>()
  attempts.filter(a => a.studentId === studentId && a.type === 'assessment').forEach(a => a.responses.forEach(r => {
    const q = questions.find(x => x.id === r.questionId)!
    const s = m.get(q.skillId) ?? { skillId: q.skillId, correct: 0, answered: 0, accuracy: 0, status: 'insufficient' as Status, tags: {} }
    s.answered++; if (r.isCorrect) s.correct++; else if (q.misconceptionTag) s.tags[q.misconceptionTag] = (s.tags[q.misconceptionTag] ?? 0) + 1
    m.set(q.skillId, s)
  }))
  return [...m.values()].map(s => ({ ...s, accuracy: Math.round(100 * s.correct / s.answered), status: statusOf(s.correct, s.answered) }))
}
export interface Rec { skillId: string; activityId?: string; reason: string }
export function recommend(attempts: Attempt[], studentId: string): Rec[] {
  const sk = (id: string) => skills.find(s => s.id === id)!.name
  return skillStats(attempts, studentId).filter(s => s.status !== 'consistent').map(s => {
    if (s.status === 'insufficient') return { skillId: s.skillId, reason: `${sk(s.skillId)}: hanya ${s.answered} soalan dijawab. Disyorkan penilaian lanjut dahulu. ${NOT_ENOUGH}` }
    const tag = Object.entries(s.tags).sort((a, b) => b[1] - a[1])[0]
    return { skillId: s.skillId, activityId: activities.find(a => a.skillId === s.skillId)?.id,
      reason: `${sk(s.skillId)}: ${s.correct}/${s.answered} betul (${s.accuracy}%).` + (tag ? ` Kemungkinan corak ralat: ${tag[0]} (tafsiran awal, perlu disemak guru).` : '') }
  })
}
export function progressSeries(attempts: Attempt[], studentId: string) {
  return attempts.filter(a => a.studentId === studentId && a.type === 'assessment').sort((a, b) => a.date.localeCompare(b.date))
    .map(a => ({ id: a.id, date: a.date, sample: a.sample, subjectId: a.subjectId, pct: Math.round(100 * a.responses.filter(r => r.isCorrect).length / a.responses.length) }))
}
