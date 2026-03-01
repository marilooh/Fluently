import { Category } from './vocabulary';

export type QuestionType =
  | 'translate_to_spanish'
  | 'translate_to_english'
  | 'multiple_choice'
  | 'fill_blank'
  | 'match_pairs';

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  correct: string;
  options?: string[];
  hint?: string;
  vocabId?: string;
}

export interface Lesson {
  id: string;
  title: string;
  titleEs: string;
  description: string;
  category: Category;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xpReward: number;
  coinReward: number;
  estimatedMinutes: number;
  vocabIds: string[];
  prerequisites?: string[];
  icon: string;
  color: string;
}

export const lessons: Lesson[] = [
  {
    id: 'lesson_greet_01',
    title: 'First Encounters',
    titleEs: 'Primeros Encuentros',
    description: 'Greet patients, introduce yourself, and establish rapport.',
    category: 'greetings',
    difficulty: 'beginner',
    xpReward: 15,
    coinReward: 10,
    estimatedMinutes: 5,
    icon: '👋',
    color: 'from-emerald-400 to-teal-500',
    vocabIds: ['g001', 'g002', 'g003', 'g004', 'g005', 'g006', 'g007', 'g008'],
  },
  {
    id: 'lesson_greet_02',
    title: 'Essential Phrases',
    titleEs: 'Frases Esenciales',
    description: 'Key phrases every provider needs when communicating with Spanish-speaking patients.',
    category: 'greetings',
    difficulty: 'beginner',
    xpReward: 15,
    coinReward: 10,
    estimatedMinutes: 5,
    icon: '💬',
    color: 'from-emerald-400 to-teal-500',
    vocabIds: ['g009', 'g010', 'g011', 'g012'],
    prerequisites: ['lesson_greet_01'],
  },
  {
    id: 'lesson_anatomy_01',
    title: 'Head to Toe — Part 1',
    titleEs: 'De Cabeza a Pies — Parte 1',
    description: 'Learn the most essential body parts to perform a complete physical exam.',
    category: 'anatomy',
    difficulty: 'beginner',
    xpReward: 20,
    coinReward: 15,
    estimatedMinutes: 7,
    icon: '🫀',
    color: 'from-rose-400 to-pink-500',
    vocabIds: ['a001', 'a002', 'a003', 'a004', 'a005', 'a006', 'a007', 'a008', 'a009', 'a010'],
  },
  {
    id: 'lesson_anatomy_02',
    title: 'Head to Toe — Part 2',
    titleEs: 'De Cabeza a Pies — Parte 2',
    description: 'Expand your anatomical vocabulary: joints, organs, and sensory structures.',
    category: 'anatomy',
    difficulty: 'beginner',
    xpReward: 20,
    coinReward: 15,
    estimatedMinutes: 8,
    icon: '🦴',
    color: 'from-rose-400 to-pink-500',
    vocabIds: ['a011', 'a012', 'a013', 'a014', 'a015', 'a016', 'a017', 'a018', 'a019', 'a020'],
    prerequisites: ['lesson_anatomy_01'],
  },
  {
    id: 'lesson_anatomy_03',
    title: 'Internal Organs',
    titleEs: 'Órganos Internos',
    description: 'Advanced internal anatomy — GI tract, reproductive organs, and glands.',
    category: 'anatomy',
    difficulty: 'intermediate',
    xpReward: 25,
    coinReward: 20,
    estimatedMinutes: 8,
    icon: '🫁',
    color: 'from-rose-400 to-pink-500',
    vocabIds: ['a021', 'a022', 'a023', 'a024', 'a025', 'a026', 'a027', 'a028', 'a029', 'a030'],
    prerequisites: ['lesson_anatomy_02'],
  },
  {
    id: 'lesson_symptoms_01',
    title: 'Common Complaints',
    titleEs: 'Quejas Comunes',
    description: 'Pain, fever, nausea — the most frequent symptoms you will encounter.',
    category: 'symptoms',
    difficulty: 'beginner',
    xpReward: 20,
    coinReward: 15,
    estimatedMinutes: 6,
    icon: '🤒',
    color: 'from-orange-400 to-amber-500',
    vocabIds: ['s001', 's002', 's003', 's004', 's005', 's006', 's007', 's008'],
  },
  {
    id: 'lesson_symptoms_02',
    title: 'Neurological & Cardiac Symptoms',
    titleEs: 'Síntomas Neuro y Cardíacos',
    description: 'Headaches, palpitations, seizures, and chest pain.',
    category: 'symptoms',
    difficulty: 'intermediate',
    xpReward: 25,
    coinReward: 20,
    estimatedMinutes: 8,
    icon: '🧠',
    color: 'from-orange-400 to-amber-500',
    vocabIds: ['s009', 's010', 's011', 's012', 's013', 's014', 's021', 's022', 's023'],
    prerequisites: ['lesson_symptoms_01'],
  },
  {
    id: 'lesson_emergency_01',
    title: 'Emergency Basics',
    titleEs: 'Emergencias: Lo Básico',
    description: 'Critical language for emergency situations — allergies, breathing, and consciousness.',
    category: 'emergency',
    difficulty: 'beginner',
    xpReward: 30,
    coinReward: 25,
    estimatedMinutes: 7,
    icon: '🚑',
    color: 'from-red-500 to-rose-600',
    vocabIds: ['e001', 'e002', 'e003', 'e004', 'e005', 'e006', 'e007'],
  },
  {
    id: 'lesson_emergency_02',
    title: 'Advanced Emergency Care',
    titleEs: 'Cuidado de Emergencia Avanzado',
    description: 'CPR, cardiac arrest, anaphylaxis, and critical interventions.',
    category: 'emergency',
    difficulty: 'advanced',
    xpReward: 35,
    coinReward: 30,
    estimatedMinutes: 10,
    icon: '❤️‍🔥',
    color: 'from-red-500 to-rose-600',
    vocabIds: ['e008', 'e009', 'e010', 'e011', 'e012', 'e013', 'e014', 'e015'],
    prerequisites: ['lesson_emergency_01'],
  },
  {
    id: 'lesson_history_01',
    title: 'Taking the History',
    titleEs: 'Tomando la Historia Clínica',
    description: 'Ask about medical history, medications, and habits.',
    category: 'patient_history',
    difficulty: 'beginner',
    xpReward: 20,
    coinReward: 15,
    estimatedMinutes: 7,
    icon: '📋',
    color: 'from-violet-400 to-purple-500',
    vocabIds: ['ph001', 'ph002', 'ph003', 'ph004', 'ph005', 'ph006', 'ph007', 'ph008'],
  },
  {
    id: 'lesson_history_02',
    title: 'Advanced History',
    titleEs: 'Historia Clínica Avanzada',
    description: 'Reproductive health, chief complaint, and review of systems.',
    category: 'patient_history',
    difficulty: 'intermediate',
    xpReward: 25,
    coinReward: 20,
    estimatedMinutes: 8,
    icon: '🩺',
    color: 'from-violet-400 to-purple-500',
    vocabIds: ['ph009', 'ph010', 'ph011', 'ph012', 'ph013', 'ph014', 'ph015'],
    prerequisites: ['lesson_history_01'],
  },
  {
    id: 'lesson_vitals_01',
    title: 'Vital Signs',
    titleEs: 'Signos Vitales',
    description: 'Blood pressure, heart rate, O₂ sat, temperature, and pain score.',
    category: 'vitals',
    difficulty: 'beginner',
    xpReward: 20,
    coinReward: 15,
    estimatedMinutes: 6,
    icon: '❤️',
    color: 'from-cyan-400 to-blue-500',
    vocabIds: ['v001', 'v002', 'v003', 'v004', 'v005', 'v006', 'v007', 'v008', 'v009'],
  },
  {
    id: 'lesson_meds_01',
    title: 'Common Medications',
    titleEs: 'Medicamentos Comunes',
    description: 'Antibiotics, pain relievers, insulin, and essential medications.',
    category: 'medications',
    difficulty: 'intermediate',
    xpReward: 25,
    coinReward: 20,
    estimatedMinutes: 8,
    icon: '💊',
    color: 'from-lime-400 to-green-500',
    vocabIds: ['m001', 'm002', 'm003', 'm004', 'm005', 'm006', 'm007', 'm008'],
  },
  {
    id: 'lesson_diagnoses_01',
    title: 'Common Diagnoses',
    titleEs: 'Diagnósticos Comunes',
    description: 'Hypertension, diabetes, asthma — the most prevalent conditions.',
    category: 'diagnoses',
    difficulty: 'intermediate',
    xpReward: 25,
    coinReward: 20,
    estimatedMinutes: 8,
    icon: '🔬',
    color: 'from-indigo-400 to-blue-600',
    vocabIds: ['d001', 'd002', 'd003', 'd004', 'd005', 'd006', 'd007', 'd008'],
  },
  {
    id: 'lesson_diagnoses_02',
    title: 'Critical Diagnoses',
    titleEs: 'Diagnósticos Críticos',
    description: 'Sepsis, PE, DVT, and other life-threatening conditions.',
    category: 'diagnoses',
    difficulty: 'advanced',
    xpReward: 35,
    coinReward: 30,
    estimatedMinutes: 10,
    icon: '⚠️',
    color: 'from-indigo-400 to-blue-600',
    vocabIds: ['d009', 'd010', 'd011', 'd012', 'd013', 'd014', 'd015', 'd016'],
    prerequisites: ['lesson_diagnoses_01'],
  },
  {
    id: 'lesson_procedures_01',
    title: 'Common Procedures',
    titleEs: 'Procedimientos Comunes',
    description: 'Explain blood draws, imaging, and consent to your patients.',
    category: 'procedures',
    difficulty: 'intermediate',
    xpReward: 25,
    coinReward: 20,
    estimatedMinutes: 8,
    icon: '🩻',
    color: 'from-sky-400 to-cyan-500',
    vocabIds: ['pr001', 'pr002', 'pr003', 'pr004', 'pr005', 'pr006', 'pr007', 'pr008'],
  },
];

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id);
}

export function getLessonsByCategory(category: Category): Lesson[] {
  return lessons.filter((l) => l.category === category);
}

export function isLessonUnlocked(lessonId: string, completedLessons: string[]): boolean {
  const lesson = getLessonById(lessonId);
  if (!lesson) return false;
  if (!lesson.prerequisites) return true;
  return lesson.prerequisites.every((prereq) => completedLessons.includes(prereq));
}
