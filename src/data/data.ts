export type Role = 'parent' | 'teacher' | 'student'
export interface Skill { id: string; subjectId: string; grades: number[]; name: string; description: string }
export interface Question { id: string; subjectId: string; grade: number; skillId: string; text: string; options: string[]; answerKey: string; difficulty: 'Mudah'|'Sederhana'|'Mencabar'; misconceptionTag?: string; explanation: string }
export interface Activity { id: string; skillId: string; title: string; description: string; difficulty: string }
export interface Student { id: string; name: string; grade: number; avatar: string; createdAt: string }
export interface Response { questionId: string; selected: string; isCorrect: boolean }
export interface Attempt { id: string; studentId: string; type: 'assessment'|'practice'; subjectId: string; skillId?: string; date: string; sample: boolean; responses: Response[] }

export const subjects = [{ id: 'bm', name: 'Bahasa Melayu' }, { id: 'mt', name: 'Matematik' }]
export const users = [
  { id: 'u1', name: 'Puan Rohana (Ibu bapa)', email: 'parent@example.com', role: 'parent' as Role },
  { id: 'u2', name: 'Cikgu Faridah', email: 'teacher@example.com', role: 'teacher' as Role },
]
export const relationships: { userId: string; studentId: string; type: string; classId?: string }[] = [
  { userId: 'u1', studentId: 's1', type: 'parent' }, { userId: 'u1', studentId: 's2', type: 'parent' },
  ...['s2','s3','s4','s5','s6'].map(s => ({ userId: 'u2', studentId: s, type: 'teacher', classId: 'c1' })),
]
export const classes = [{ id: 'c1', name: '3 Amanah (contoh)', teacherId: 'u2' }]
export const students: Student[] = [
  ['s1','Aisyah',2,'🦋'],['s2','Hafiz',3,'🚀'],['s3','Mei Ling',3,'🌻'],['s4','Ravi',3,'🐯'],['s5','Nur Iman',3,'🐬'],['s6','Daniel',3,'🦊'],
].map(([id,name,grade,avatar]) => ({ id: id as string, name: name as string, grade: grade as number, avatar: avatar as string, createdAt: '2026-01-05' }))

export const skills: Skill[] = [
  { id: 'bm-ejaan', subjectId: 'bm', grades: [1,2], name: 'Ejaan', description: 'Mengeja perkataan dengan betul' },
  { id: 'bm-kosa', subjectId: 'bm', grades: [1], name: 'Kosa kata', description: 'Memahami makna perkataan' },
  { id: 'bm-faham', subjectId: 'bm', grades: [2], name: 'Kefahaman bacaan', description: 'Memahami ayat dan petikan pendek' },
  { id: 'mt-tambah', subjectId: 'mt', grades: [1,2], name: 'Tambah', description: 'Operasi tambah' },
  { id: 'mt-tolak', subjectId: 'mt', grades: [1,3], name: 'Tolak', description: 'Operasi tolak' },
  { id: 'mt-nilai', subjectId: 'mt', grades: [2], name: 'Nombor dan nilai tempat', description: 'Nilai digit dalam nombor' },
  { id: 'mt-darab', subjectId: 'mt', grades: [3], name: 'Darab asas', description: 'Fakta darab asas' },
  { id: 'mt-masalah', subjectId: 'mt', grades: [2,3], name: 'Penyelesaian masalah', description: 'Mentafsir soalan cerita' },
]
const Q = (id: string, subjectId: string, grade: number, skillId: string, text: string, answerKey: string, wrong: string[], difficulty: Question['difficulty'], explanation: string, misconceptionTag?: string): Question =>
  ({ id, subjectId, grade, skillId, text, options: [answerKey, ...wrong], answerKey, difficulty, explanation, misconceptionTag })
// ILLUSTRATIVE content — must be reviewed by an educator against the Malaysian curriculum (KSSR).
// Answer keys are in the frontend for prototype only; a real system must keep them server-side.
export const questions: Question[] = [
  Q('q1','bm',1,'bm-ejaan','Pilih ejaan yang betul.','kucing',['kuching','kucieng','kucin'],'Mudah','Ejaan betul ialah "kucing".','Ralat ejaan'),
  Q('q2','bm',1,'bm-ejaan','Pilih ejaan yang betul.','sekolah',['sekolha','sekola','skolah'],'Mudah','Ejaan betul ialah "sekolah".','Ralat ejaan'),
  Q('q3','bm',1,'bm-kosa','Lawan bagi "besar" ialah ...','kecil',['tinggi','panjang','berat'],'Mudah','"Kecil" ialah lawan "besar".','Ralat pengecaman perkataan'),
  Q('q4','bm',1,'bm-kosa','Haiwan yang menyalak ialah ...','anjing',['kucing','ikan','burung'],'Mudah','Anjing menyalak.','Ralat pengecaman perkataan'),
  Q('q5','bm',2,'bm-faham','Ali ada tiga biji epal. Dia beri satu biji kepada adik. Apakah yang Ali beri?','Epal',['Buku','Kuih','Pensel'],'Mudah','Ali memberi epal.','Ralat kefahaman bacaan'),
  Q('q6','bm',2,'bm-faham','Hari hujan. Mak bawa payung. Mengapa Mak bawa payung?','Kerana hari hujan',['Kerana panas','Kerana malam','Kerana lapar'],'Sederhana','Ayat pertama memberi sebab.','Ralat kefahaman bacaan'),
  Q('q7','bm',2,'bm-ejaan','Pilih ejaan yang betul.','gembira',['gembera','gimbira','gembirah'],'Sederhana','Ejaan betul ialah "gembira".','Ralat ejaan'),
  Q('q8','mt',1,'mt-tambah','5 + 3 = ?','8',['7','9','6'],'Mudah','5 tambah 3 ialah 8.','Ralat aritmetik asas'),
  Q('q9','mt',1,'mt-tolak','9 − 4 = ?','5',['4','6','13'],'Mudah','9 tolak 4 ialah 5.','Ralat aritmetik asas'),
  Q('q10','mt',2,'mt-nilai','Nilai digit 4 dalam 46 ialah ...','40',['4','46','400'],'Sederhana','Digit 4 berada di tempat puluh.','Kekeliruan nilai tempat'),
  Q('q11','mt',2,'mt-tambah','27 + 15 = ?','42',['32','41','43'],'Sederhana','27 + 15 = 42 (kumpul semula satu).','Ralat aritmetik asas'),
  Q('q12','mt',2,'mt-masalah','Siti ada 12 gula-gula. Dia makan 5. Berapa baki gula-gula?','7',['17','5','8'],'Sederhana','Makan bermakna tolak: 12 − 5 = 7.','Sukar mentafsir soalan cerita'),
  Q('q13','mt',3,'mt-darab','6 × 4 = ?','24',['10','20','26'],'Sederhana','6 kumpulan 4 ialah 24.','Ralat fakta darab'),
  Q('q14','mt',3,'mt-darab','7 × 3 = ?','21',['10','24','18'],'Sederhana','7 kumpulan 3 ialah 21.','Ralat fakta darab'),
  Q('q15','mt',3,'mt-masalah','Ada 4 beg. Setiap beg ada 5 buku. Berapa jumlah buku?','20',['9','25','15'],'Sederhana','Kumpulan sama banyak: 4 × 5 = 20.','Sukar mentafsir soalan cerita'),
  Q('q16','mt',3,'mt-tolak','100 − 36 = ?','64',['74','66','136'],'Mencabar','100 − 36 = 64.','Ralat aritmetik asas'),
]
export const activities: Activity[] = skills.map(s => ({ id: 'act-' + s.id, skillId: s.id, title: `Latihan ${s.name}`, description: `Soalan latihan fokus: ${s.description}.`, difficulty: 'Sederhana' }))

// Compact SAMPLE seed: "q5:1,q6:0" => questionId:isCorrect. All flagged sample:true.
const seed = (id: string, studentId: string, date: string, subjectId: string, s: string): Attempt => ({
  id, studentId, type: 'assessment', subjectId, date, sample: true,
  responses: s.split(',').map(p => { const [questionId, c] = p.split(':'); const q = questions.find(x => x.id === questionId)!
    return { questionId, isCorrect: c === '1', selected: c === '1' ? q.answerKey : q.options[1] } }),
})
export const seedAttempts: Attempt[] = [
  seed('a1','s1','2026-08-10','bm','q5:1,q6:1,q7:0'), seed('a1m','s1','2026-08-10','mt','q10:1,q11:0,q12:0'),
  seed('a2','s1','2026-09-14','bm','q5:1,q6:1,q7:1'), seed('a2m','s1','2026-09-14','mt','q10:1,q11:1,q12:0'),
  seed('a3','s2','2026-08-12','mt','q13:0,q14:0,q15:0,q16:1'), seed('a4','s2','2026-09-16','mt','q13:1,q14:0,q15:0,q16:1'),
  seed('a5','s3','2026-09-16','mt','q13:1,q14:1,q15:1,q16:1'), seed('a6','s4','2026-09-16','mt','q13:0,q14:1,q15:0,q16:0'),
  seed('a7','s5','2026-09-16','mt','q13:1,q14:0,q15:1,q16:1'), seed('a8','s6','2026-09-16','mt','q13:0,q14:0,q15:0,q16:1'),
]
