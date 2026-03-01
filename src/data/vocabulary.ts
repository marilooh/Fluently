export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type Category =
  | 'anatomy'
  | 'symptoms'
  | 'diagnoses'
  | 'emergency'
  | 'patient_history'
  | 'medications'
  | 'procedures'
  | 'vitals'
  | 'greetings'
  | 'specialties';

export interface VocabEntry {
  id: string;
  english: string;
  spanish: string;
  pronunciation: string;
  category: Category;
  difficulty: Difficulty;
  example?: { en: string; es: string };
  notes?: string;
  tags?: string[];
}

export const CATEGORY_LABELS: Record<Category, string> = {
  anatomy: 'Anatomy / Anatomía',
  symptoms: 'Symptoms / Síntomas',
  diagnoses: 'Diagnoses / Diagnósticos',
  emergency: 'Emergency / Emergencia',
  patient_history: 'Patient History / Historia del Paciente',
  medications: 'Medications / Medicamentos',
  procedures: 'Procedures / Procedimientos',
  vitals: 'Vital Signs / Signos Vitales',
  greetings: 'Greetings & Communication / Saludos',
  specialties: 'Medical Specialties / Especialidades',
};

export const CATEGORY_ICONS: Record<Category, string> = {
  anatomy: '🫀',
  symptoms: '🤒',
  diagnoses: '🔬',
  emergency: '🚑',
  patient_history: '📋',
  medications: '💊',
  procedures: '🩺',
  vitals: '❤️',
  greetings: '👋',
  specialties: '🏥',
};

export const vocabulary: VocabEntry[] = [
  // ── GREETINGS & COMMUNICATION ──────────────────────────────────────────
  { id: 'g001', english: 'Good morning', spanish: 'Buenos días', pronunciation: 'BWEH-nos DEE-as', category: 'greetings', difficulty: 'beginner', example: { en: 'Good morning, how are you feeling?', es: '¿Buenos días, cómo se siente?' } },
  { id: 'g002', english: 'Good afternoon', spanish: 'Buenas tardes', pronunciation: 'BWEH-nas TAR-des', category: 'greetings', difficulty: 'beginner' },
  { id: 'g003', english: 'My name is…', spanish: 'Me llamo…', pronunciation: 'meh YAH-mo', category: 'greetings', difficulty: 'beginner', example: { en: 'My name is Dr. Smith.', es: 'Me llamo la Dra. Smith.' } },
  { id: 'g004', english: 'I am your doctor/nurse', spanish: 'Soy su médico/enfermero(a)', pronunciation: 'soy soo MED-ee-ko', category: 'greetings', difficulty: 'beginner' },
  { id: 'g005', english: 'Do you speak English?', spanish: '¿Habla inglés?', pronunciation: 'AH-bla een-GLES', category: 'greetings', difficulty: 'beginner' },
  { id: 'g006', english: 'Do you understand?', spanish: '¿Entiende usted?', pronunciation: 'en-TYEH-ndeh oos-TED', category: 'greetings', difficulty: 'beginner' },
  { id: 'g007', english: 'Please', spanish: 'Por favor', pronunciation: 'por fah-VOR', category: 'greetings', difficulty: 'beginner' },
  { id: 'g008', english: 'Thank you', spanish: 'Gracias', pronunciation: 'GRAH-syahs', category: 'greetings', difficulty: 'beginner' },
  { id: 'g009', english: 'Where does it hurt?', spanish: '¿Dónde le duele?', pronunciation: 'DON-deh leh DWEH-leh', category: 'greetings', difficulty: 'beginner', example: { en: 'Where does it hurt?', es: '¿Dónde le duele?' } },
  { id: 'g010', english: 'On a scale of 1 to 10', spanish: 'En una escala del 1 al 10', pronunciation: 'en OO-na es-KAH-la del OO-no al DYEH-s', category: 'greetings', difficulty: 'beginner' },
  { id: 'g011', english: 'I need an interpreter', spanish: 'Necesito un intérprete', pronunciation: 'neh-seh-SEE-toh oon een-TER-preh-teh', category: 'greetings', difficulty: 'beginner' },
  { id: 'g012', english: 'Please sign here', spanish: 'Por favor firme aquí', pronunciation: 'por fah-VOR FEER-meh ah-KEE', category: 'greetings', difficulty: 'beginner' },

  // ── ANATOMY ───────────────────────────────────────────────────────────
  { id: 'a001', english: 'Head', spanish: 'Cabeza', pronunciation: 'kah-BEH-sah', category: 'anatomy', difficulty: 'beginner', tags: ['head', 'neuro'] },
  { id: 'a002', english: 'Neck', spanish: 'Cuello', pronunciation: 'KWEH-yoh', category: 'anatomy', difficulty: 'beginner' },
  { id: 'a003', english: 'Chest', spanish: 'Pecho / Tórax', pronunciation: 'PEH-cho / TOH-raks', category: 'anatomy', difficulty: 'beginner' },
  { id: 'a004', english: 'Abdomen', spanish: 'Abdomen', pronunciation: 'ab-DOH-men', category: 'anatomy', difficulty: 'beginner' },
  { id: 'a005', english: 'Back', spanish: 'Espalda', pronunciation: 'es-PAL-dah', category: 'anatomy', difficulty: 'beginner' },
  { id: 'a006', english: 'Arm', spanish: 'Brazo', pronunciation: 'BRAH-so', category: 'anatomy', difficulty: 'beginner' },
  { id: 'a007', english: 'Hand', spanish: 'Mano', pronunciation: 'MAH-no', category: 'anatomy', difficulty: 'beginner' },
  { id: 'a008', english: 'Leg', spanish: 'Pierna', pronunciation: 'PYEHR-nah', category: 'anatomy', difficulty: 'beginner' },
  { id: 'a009', english: 'Foot', spanish: 'Pie', pronunciation: 'pyeh', category: 'anatomy', difficulty: 'beginner' },
  { id: 'a010', english: 'Heart', spanish: 'Corazón', pronunciation: 'koh-rah-SON', category: 'anatomy', difficulty: 'beginner', tags: ['cardio'] },
  { id: 'a011', english: 'Lung', spanish: 'Pulmón', pronunciation: 'pool-MON', category: 'anatomy', difficulty: 'beginner', tags: ['pulmonary', 'respiratory'] },
  { id: 'a012', english: 'Liver', spanish: 'Hígado', pronunciation: 'EE-gah-doh', category: 'anatomy', difficulty: 'beginner', tags: ['GI', 'hepatic'] },
  { id: 'a013', english: 'Kidney', spanish: 'Riñón', pronunciation: 'ree-NYON', category: 'anatomy', difficulty: 'beginner', tags: ['renal', 'nephro'] },
  { id: 'a014', english: 'Stomach', spanish: 'Estómago', pronunciation: 'es-TOH-mah-goh', category: 'anatomy', difficulty: 'beginner', tags: ['GI'] },
  { id: 'a015', english: 'Brain', spanish: 'Cerebro', pronunciation: 'seh-REH-broh', category: 'anatomy', difficulty: 'beginner', tags: ['neuro'] },
  { id: 'a016', english: 'Spine / Vertebral column', spanish: 'Columna vertebral', pronunciation: 'koh-LOOM-nah ver-teh-BRAL', category: 'anatomy', difficulty: 'intermediate' },
  { id: 'a017', english: 'Shoulder', spanish: 'Hombro', pronunciation: 'OM-broh', category: 'anatomy', difficulty: 'beginner' },
  { id: 'a018', english: 'Elbow', spanish: 'Codo', pronunciation: 'KOH-doh', category: 'anatomy', difficulty: 'beginner' },
  { id: 'a019', english: 'Wrist', spanish: 'Muñeca', pronunciation: 'moo-NYEH-kah', category: 'anatomy', difficulty: 'beginner' },
  { id: 'a020', english: 'Hip', spanish: 'Cadera', pronunciation: 'kah-DEH-rah', category: 'anatomy', difficulty: 'beginner' },
  { id: 'a021', english: 'Knee', spanish: 'Rodilla', pronunciation: 'roh-DEE-yah', category: 'anatomy', difficulty: 'beginner' },
  { id: 'a022', english: 'Ankle', spanish: 'Tobillo', pronunciation: 'toh-BEE-yoh', category: 'anatomy', difficulty: 'beginner' },
  { id: 'a023', english: 'Eye', spanish: 'Ojo', pronunciation: 'OH-ho', category: 'anatomy', difficulty: 'beginner', tags: ['ophthalmology'] },
  { id: 'a024', english: 'Ear', spanish: 'Oído / Oreja', pronunciation: 'oh-EE-doh / oh-REH-ha', category: 'anatomy', difficulty: 'beginner', tags: ['ENT'] },
  { id: 'a025', english: 'Nose', spanish: 'Nariz', pronunciation: 'nah-REES', category: 'anatomy', difficulty: 'beginner', tags: ['ENT'] },
  { id: 'a026', english: 'Throat', spanish: 'Garganta', pronunciation: 'gar-GAN-tah', category: 'anatomy', difficulty: 'beginner', tags: ['ENT'] },
  { id: 'a027', english: 'Gallbladder', spanish: 'Vesícula biliar', pronunciation: 'veh-SEE-koo-la bee-LYAR', category: 'anatomy', difficulty: 'intermediate', tags: ['GI', 'surgery'] },
  { id: 'a028', english: 'Pancreas', spanish: 'Páncreas', pronunciation: 'PAN-kreh-as', category: 'anatomy', difficulty: 'intermediate', tags: ['GI', 'endocrine'] },
  { id: 'a029', english: 'Spleen', spanish: 'Bazo', pronunciation: 'BAH-soh', category: 'anatomy', difficulty: 'intermediate' },
  { id: 'a030', english: 'Appendix', spanish: 'Apéndice', pronunciation: 'ah-PEN-dee-seh', category: 'anatomy', difficulty: 'intermediate', tags: ['GI', 'surgery'] },
  { id: 'a031', english: 'Colon', spanish: 'Colon', pronunciation: 'KOH-lon', category: 'anatomy', difficulty: 'intermediate', tags: ['GI'] },
  { id: 'a032', english: 'Uterus', spanish: 'Útero', pronunciation: 'OO-teh-roh', category: 'anatomy', difficulty: 'intermediate', tags: ['OB/GYN'] },
  { id: 'a033', english: 'Ovary', spanish: 'Ovario', pronunciation: 'oh-VAH-ryoh', category: 'anatomy', difficulty: 'intermediate', tags: ['OB/GYN'] },
  { id: 'a034', english: 'Prostate', spanish: 'Próstata', pronunciation: 'PROS-tah-tah', category: 'anatomy', difficulty: 'intermediate', tags: ['urology'] },
  { id: 'a035', english: 'Bladder', spanish: 'Vejiga', pronunciation: 'veh-HEE-gah', category: 'anatomy', difficulty: 'intermediate', tags: ['urology', 'renal'] },
  { id: 'a036', english: 'Artery', spanish: 'Arteria', pronunciation: 'ar-TEH-ryah', category: 'anatomy', difficulty: 'intermediate', tags: ['cardio', 'vascular'] },
  { id: 'a037', english: 'Vein', spanish: 'Vena', pronunciation: 'VEH-nah', category: 'anatomy', difficulty: 'beginner', tags: ['cardio', 'vascular'] },
  { id: 'a038', english: 'Lymph node', spanish: 'Ganglio linfático', pronunciation: 'GAN-glyoh lin-FAH-tee-koh', category: 'anatomy', difficulty: 'advanced', tags: ['hematology', 'oncology'] },
  { id: 'a039', english: 'Diaphragm', spanish: 'Diafragma', pronunciation: 'dyah-FRAG-mah', category: 'anatomy', difficulty: 'advanced', tags: ['pulmonary'] },
  { id: 'a040', english: 'Thyroid', spanish: 'Tiroides', pronunciation: 'tee-ROY-des', category: 'anatomy', difficulty: 'intermediate', tags: ['endocrine'] },
  { id: 'a041', english: 'Adrenal gland', spanish: 'Glándula suprarrenal', pronunciation: 'GLAN-doo-la soo-prah-reh-NAL', category: 'anatomy', difficulty: 'advanced', tags: ['endocrine'] },
  { id: 'a042', english: 'Aorta', spanish: 'Aorta', pronunciation: 'ah-OR-tah', category: 'anatomy', difficulty: 'intermediate', tags: ['cardio', 'vascular'] },
  { id: 'a043', english: 'Trachea', spanish: 'Tráquea', pronunciation: 'TRAH-keh-ah', category: 'anatomy', difficulty: 'intermediate', tags: ['pulmonary', 'airway'] },
  { id: 'a044', english: 'Esophagus', spanish: 'Esófago', pronunciation: 'eh-SOH-fah-goh', category: 'anatomy', difficulty: 'intermediate', tags: ['GI'] },
  { id: 'a045', english: 'Small intestine', spanish: 'Intestino delgado', pronunciation: 'een-tes-TEE-noh del-GAH-doh', category: 'anatomy', difficulty: 'intermediate', tags: ['GI'] },

  // ── SYMPTOMS ──────────────────────────────────────────────────────────
  { id: 's001', english: 'Pain', spanish: 'Dolor', pronunciation: 'doh-LOR', category: 'symptoms', difficulty: 'beginner', example: { en: 'Do you have pain?', es: '¿Tiene dolor?' } },
  { id: 's002', english: 'Fever', spanish: 'Fiebre', pronunciation: 'FYEH-breh', category: 'symptoms', difficulty: 'beginner' },
  { id: 's003', english: 'Nausea', spanish: 'Náuseas', pronunciation: 'NOW-seh-as', category: 'symptoms', difficulty: 'beginner' },
  { id: 's004', english: 'Vomiting', spanish: 'Vómitos', pronunciation: 'VOH-mee-tohs', category: 'symptoms', difficulty: 'beginner' },
  { id: 's005', english: 'Diarrhea', spanish: 'Diarrea', pronunciation: 'dyah-REH-ah', category: 'symptoms', difficulty: 'beginner' },
  { id: 's006', english: 'Cough', spanish: 'Tos', pronunciation: 'tohs', category: 'symptoms', difficulty: 'beginner' },
  { id: 's007', english: 'Shortness of breath', spanish: 'Falta de aire / Disnea', pronunciation: 'FAL-ta de AY-reh', category: 'symptoms', difficulty: 'beginner', tags: ['pulmonary', 'cardio'] },
  { id: 's008', english: 'Dizziness', spanish: 'Mareo', pronunciation: 'mah-REH-oh', category: 'symptoms', difficulty: 'beginner' },
  { id: 's009', english: 'Headache', spanish: 'Dolor de cabeza', pronunciation: 'doh-LOR de kah-BEH-sah', category: 'symptoms', difficulty: 'beginner', tags: ['neuro'] },
  { id: 's010', english: 'Chest pain', spanish: 'Dolor en el pecho', pronunciation: 'doh-LOR en el PEH-cho', category: 'symptoms', difficulty: 'beginner', tags: ['cardio', 'emergency'] },
  { id: 's011', english: 'Fatigue / Tiredness', spanish: 'Cansancio / Fatiga', pronunciation: 'kan-SAN-syoh / fah-TEE-gah', category: 'symptoms', difficulty: 'beginner' },
  { id: 's012', english: 'Swelling', spanish: 'Hinchazón / Edema', pronunciation: 'een-cha-SON', category: 'symptoms', difficulty: 'intermediate' },
  { id: 's013', english: 'Numbness', spanish: 'Adormecimiento / Entumecimiento', pronunciation: 'ah-dor-meh-see-MYEN-toh', category: 'symptoms', difficulty: 'intermediate', tags: ['neuro'] },
  { id: 's014', english: 'Weakness', spanish: 'Debilidad', pronunciation: 'deh-bee-lee-DAD', category: 'symptoms', difficulty: 'intermediate' },
  { id: 's015', english: 'Loss of appetite', spanish: 'Pérdida de apetito', pronunciation: 'PER-dee-dah de ah-peh-TEE-toh', category: 'symptoms', difficulty: 'beginner' },
  { id: 's016', english: 'Weight loss', spanish: 'Pérdida de peso', pronunciation: 'PER-dee-dah de PEH-soh', category: 'symptoms', difficulty: 'beginner' },
  { id: 's017', english: 'Night sweats', spanish: 'Sudores nocturnos', pronunciation: 'soo-DOH-res nok-TOOR-nos', category: 'symptoms', difficulty: 'intermediate', tags: ['infectious', 'oncology'] },
  { id: 's018', english: 'Rash', spanish: 'Sarpullido / Erupción', pronunciation: 'sar-poo-YEE-doh', category: 'symptoms', difficulty: 'beginner', tags: ['dermatology'] },
  { id: 's019', english: 'Itching', spanish: 'Picazón / Comezón', pronunciation: 'pee-kah-SON', category: 'symptoms', difficulty: 'beginner', tags: ['dermatology'] },
  { id: 's020', english: 'Burning sensation', spanish: 'Sensación de ardor', pronunciation: 'sen-sah-SYON de ar-DOR', category: 'symptoms', difficulty: 'intermediate' },
  { id: 's021', english: 'Palpitations', spanish: 'Palpitaciones', pronunciation: 'pal-pee-tah-SYON-es', category: 'symptoms', difficulty: 'intermediate', tags: ['cardio'] },
  { id: 's022', english: 'Confusion', spanish: 'Confusión', pronunciation: 'kon-foo-SYON', category: 'symptoms', difficulty: 'beginner', tags: ['neuro', 'psych'] },
  { id: 's023', english: 'Seizure', spanish: 'Convulsión / Crisis epiléptica', pronunciation: 'kon-vool-SYON', category: 'symptoms', difficulty: 'intermediate', tags: ['neuro', 'emergency'] },
  { id: 's024', english: 'Bloody stool', spanish: 'Heces con sangre', pronunciation: 'EH-ses kon SAN-greh', category: 'symptoms', difficulty: 'intermediate', tags: ['GI', 'emergency'] },
  { id: 's025', english: 'Difficulty swallowing', spanish: 'Dificultad para tragar / Disfagia', pronunciation: 'dees-fah-HEE-ah', category: 'symptoms', difficulty: 'intermediate', tags: ['GI', 'ENT'] },

  // ── DIAGNOSES ─────────────────────────────────────────────────────────
  { id: 'd001', english: 'Hypertension', spanish: 'Hipertensión', pronunciation: 'ee-per-ten-SYON', category: 'diagnoses', difficulty: 'intermediate', notes: 'High blood pressure — la presión alta', tags: ['cardio'] },
  { id: 'd002', english: 'Diabetes', spanish: 'Diabetes', pronunciation: 'dyah-BEH-tes', category: 'diagnoses', difficulty: 'beginner', tags: ['endocrine'] },
  { id: 'd003', english: 'Asthma', spanish: 'Asma', pronunciation: 'AZ-mah', category: 'diagnoses', difficulty: 'beginner', tags: ['pulmonary'] },
  { id: 'd004', english: 'Pneumonia', spanish: 'Neumonía', pronunciation: 'neh-oo-moh-NEE-ah', category: 'diagnoses', difficulty: 'intermediate', tags: ['pulmonary', 'infectious'] },
  { id: 'd005', english: 'Heart attack / Myocardial infarction', spanish: 'Infarto / Ataque al corazón', pronunciation: 'een-FAR-toh', category: 'diagnoses', difficulty: 'intermediate', tags: ['cardio', 'emergency'] },
  { id: 'd006', english: 'Stroke / CVA', spanish: 'Derrame cerebral / Accidente cerebrovascular', pronunciation: 'deh-RAH-meh seh-reh-BRAL', category: 'diagnoses', difficulty: 'intermediate', tags: ['neuro', 'emergency'] },
  { id: 'd007', english: 'Appendicitis', spanish: 'Apendicitis', pronunciation: 'ah-pen-dee-SEE-tees', category: 'diagnoses', difficulty: 'intermediate', tags: ['GI', 'surgery', 'emergency'] },
  { id: 'd008', english: 'Urinary tract infection', spanish: 'Infección urinaria', pronunciation: 'een-fek-SYON oo-ree-NAH-ryah', category: 'diagnoses', difficulty: 'intermediate', tags: ['urology', 'infectious'] },
  { id: 'd009', english: 'Kidney stones', spanish: 'Cálculos renales / Piedras en los riñones', pronunciation: 'KAL-koo-los reh-NAH-les', category: 'diagnoses', difficulty: 'intermediate', tags: ['urology', 'nephro'] },
  { id: 'd010', english: 'Fracture', spanish: 'Fractura', pronunciation: 'frak-TOO-rah', category: 'diagnoses', difficulty: 'beginner', tags: ['orthopedics', 'emergency'] },
  { id: 'd011', english: 'Sepsis', spanish: 'Sepsis', pronunciation: 'SEP-sees', category: 'diagnoses', difficulty: 'advanced', tags: ['emergency', 'infectious', 'critical care'] },
  { id: 'd012', english: 'Deep vein thrombosis (DVT)', spanish: 'Trombosis venosa profunda', pronunciation: 'trom-BOH-sees veh-NOH-sah proh-FOON-dah', category: 'diagnoses', difficulty: 'advanced', tags: ['vascular', 'hematology'] },
  { id: 'd013', english: 'Pulmonary embolism', spanish: 'Embolia pulmonar', pronunciation: 'em-BOH-lyah pool-moh-NAR', category: 'diagnoses', difficulty: 'advanced', tags: ['pulmonary', 'emergency'] },
  { id: 'd014', english: 'Anemia', spanish: 'Anemia', pronunciation: 'ah-NEH-myah', category: 'diagnoses', difficulty: 'beginner', tags: ['hematology'] },
  { id: 'd015', english: 'COPD', spanish: 'EPOC (Enfermedad pulmonar obstructiva crónica)', pronunciation: 'eh-POK', category: 'diagnoses', difficulty: 'advanced', tags: ['pulmonary'] },
  { id: 'd016', english: 'Atrial fibrillation', spanish: 'Fibrilación auricular', pronunciation: 'fee-bree-lah-SYON ow-ree-koo-LAR', category: 'diagnoses', difficulty: 'advanced', tags: ['cardio'] },
  { id: 'd017', english: 'Pancreatitis', spanish: 'Pancreatitis', pronunciation: 'pan-kreh-ah-TEE-tees', category: 'diagnoses', difficulty: 'intermediate', tags: ['GI'] },
  { id: 'd018', english: 'Cirrhosis', spanish: 'Cirrosis', pronunciation: 'see-ROH-sees', category: 'diagnoses', difficulty: 'advanced', tags: ['GI', 'hepatic'] },
  { id: 'd019', english: 'Tuberculosis', spanish: 'Tuberculosis', pronunciation: 'too-ber-koo-LOH-sees', category: 'diagnoses', difficulty: 'intermediate', tags: ['pulmonary', 'infectious'] },
  { id: 'd020', english: 'Depression', spanish: 'Depresión', pronunciation: 'deh-preh-SYON', category: 'diagnoses', difficulty: 'beginner', tags: ['psych'] },
  { id: 'd021', english: 'Anxiety', spanish: 'Ansiedad', pronunciation: 'an-syeh-DAD', category: 'diagnoses', difficulty: 'beginner', tags: ['psych'] },
  { id: 'd022', english: 'Hypothyroidism', spanish: 'Hipotiroidismo', pronunciation: 'ee-po-tee-roy-DEES-moh', category: 'diagnoses', difficulty: 'advanced', tags: ['endocrine'] },
  { id: 'd023', english: 'Osteoporosis', spanish: 'Osteoporosis', pronunciation: 'os-teh-oh-poh-ROH-sees', category: 'diagnoses', difficulty: 'intermediate', tags: ['orthopedics', 'endocrine'] },
  { id: 'd024', english: 'Preeclampsia', spanish: 'Preeclampsia', pronunciation: 'preh-eh-KLAMP-syah', category: 'diagnoses', difficulty: 'advanced', tags: ['OB/GYN', 'emergency'] },
  { id: 'd025', english: 'Appendicitis', spanish: 'Apendicitis', pronunciation: 'ah-pen-dee-SEE-tees', category: 'diagnoses', difficulty: 'intermediate', tags: ['GI', 'surgery'] },

  // ── EMERGENCY ─────────────────────────────────────────────────────────
  { id: 'e001', english: 'Call 911', spanish: 'Llame al 911', pronunciation: 'YAH-meh al nweh-veh OO-no OO-no', category: 'emergency', difficulty: 'beginner' },
  { id: 'e002', english: 'Are you allergic to any medications?', spanish: '¿Es alérgico(a) a algún medicamento?', pronunciation: 'es ah-LER-hee-koh ah al-GOON', category: 'emergency', difficulty: 'beginner' },
  { id: 'e003', english: 'Do not move', spanish: 'No se mueva', pronunciation: 'no seh MWEH-vah', category: 'emergency', difficulty: 'beginner' },
  { id: 'e004', english: 'Stay calm', spanish: 'Cálmese', pronunciation: 'KAL-meh-seh', category: 'emergency', difficulty: 'beginner' },
  { id: 'e005', english: 'I need to take your blood pressure', spanish: 'Necesito tomarle la presión', pronunciation: 'neh-seh-SEE-toh toh-MAR-leh la preh-SYON', category: 'emergency', difficulty: 'beginner' },
  { id: 'e006', english: 'Are you having trouble breathing?', spanish: '¿Tiene dificultad para respirar?', pronunciation: 'TYEH-neh dee-fee-kool-TAD', category: 'emergency', difficulty: 'beginner', tags: ['pulmonary'] },
  { id: 'e007', english: 'Are you conscious?', spanish: '¿Está consciente?', pronunciation: 'es-TAH kon-SYEN-teh', category: 'emergency', difficulty: 'beginner' },
  { id: 'e008', english: 'CPR', spanish: 'Resucitación cardiopulmonar (RCP)', pronunciation: 'reh-soo-see-tah-SYON', category: 'emergency', difficulty: 'intermediate', tags: ['cardio', 'critical care'] },
  { id: 'e009', english: 'Cardiac arrest', spanish: 'Paro cardíaco', pronunciation: 'PAH-roh kar-DEE-ah-koh', category: 'emergency', difficulty: 'intermediate', tags: ['cardio'] },
  { id: 'e010', english: 'Anaphylaxis', spanish: 'Anafilaxia', pronunciation: 'ah-nah-fee-LAK-syah', category: 'emergency', difficulty: 'advanced', tags: ['allergy', 'emergency'] },
  { id: 'e011', english: 'Epinephrine / Adrenaline', spanish: 'Epinefrina / Adrenalina', pronunciation: 'eh-pee-neh-FREE-nah', category: 'emergency', difficulty: 'intermediate', tags: ['medications', 'emergency'] },
  { id: 'e012', english: 'Intubation', spanish: 'Intubación', pronunciation: 'een-too-bah-SYON', category: 'emergency', difficulty: 'advanced', tags: ['airway', 'critical care'] },
  { id: 'e013', english: 'IV access / intravenous line', spanish: 'Acceso intravenoso / vía IV', pronunciation: 'ak-SEH-soh een-trah-veh-NOH-soh', category: 'emergency', difficulty: 'intermediate', tags: ['procedures'] },
  { id: 'e014', english: 'Trauma', spanish: 'Trauma', pronunciation: 'TROW-mah', category: 'emergency', difficulty: 'beginner' },
  { id: 'e015', english: 'Blood transfusion', spanish: 'Transfusión de sangre', pronunciation: 'trans-foo-SYON de SAN-greh', category: 'emergency', difficulty: 'intermediate', tags: ['hematology'] },

  // ── PATIENT HISTORY ───────────────────────────────────────────────────
  { id: 'ph001', english: 'Do you have any medical conditions?', spanish: '¿Tiene alguna condición médica?', pronunciation: 'TYEH-neh al-GOO-nah kon-dee-SYON', category: 'patient_history', difficulty: 'beginner' },
  { id: 'ph002', english: 'Do you smoke?', spanish: '¿Fuma usted?', pronunciation: 'FOO-mah oos-TED', category: 'patient_history', difficulty: 'beginner' },
  { id: 'ph003', english: 'Do you drink alcohol?', spanish: '¿Toma bebidas alcohólicas?', pronunciation: 'TOH-mah beh-BEE-das', category: 'patient_history', difficulty: 'beginner' },
  { id: 'ph004', english: 'Do you use drugs?', spanish: '¿Usa drogas?', pronunciation: 'OO-sah DROH-gas', category: 'patient_history', difficulty: 'beginner' },
  { id: 'ph005', english: 'What medications do you take?', spanish: '¿Qué medicamentos toma?', pronunciation: 'keh meh-dee-kah-MEN-tohs TOH-mah', category: 'patient_history', difficulty: 'beginner' },
  { id: 'ph006', english: 'Are you pregnant?', spanish: '¿Está embarazada?', pronunciation: 'es-TAH em-bah-rah-SAH-dah', category: 'patient_history', difficulty: 'beginner', tags: ['OB/GYN'] },
  { id: 'ph007', english: 'When did the pain start?', spanish: '¿Cuándo empezó el dolor?', pronunciation: 'KWAN-doh em-peh-SOH', category: 'patient_history', difficulty: 'beginner' },
  { id: 'ph008', english: 'Have you had surgery before?', spanish: '¿Ha tenido cirugías antes?', pronunciation: 'ah teh-NEE-doh see-roo-HEE-as', category: 'patient_history', difficulty: 'beginner' },
  { id: 'ph009', english: 'Family history', spanish: 'Historia familiar', pronunciation: 'ees-TOH-ryah fah-mee-LYAR', category: 'patient_history', difficulty: 'beginner' },
  { id: 'ph010', english: 'Last menstrual period', spanish: 'Última menstruación / Última regla', pronunciation: 'OOL-tee-mah mens-trwah-SYON', category: 'patient_history', difficulty: 'intermediate', tags: ['OB/GYN'] },
  { id: 'ph011', english: 'Review of systems', spanish: 'Revisión por sistemas', pronunciation: 'reh-vee-SYON por sees-TEH-mahs', category: 'patient_history', difficulty: 'advanced' },
  { id: 'ph012', english: 'Chief complaint', spanish: 'Motivo de consulta / Queja principal', pronunciation: 'moh-TEE-voh de kon-SOOL-tah', category: 'patient_history', difficulty: 'intermediate' },
  { id: 'ph013', english: 'Allergy', spanish: 'Alergia', pronunciation: 'ah-LER-hyah', category: 'patient_history', difficulty: 'beginner' },
  { id: 'ph014', english: 'Vaccination history', spanish: 'Historial de vacunas', pronunciation: 'ees-toh-RYAHL de vah-KOO-nas', category: 'patient_history', difficulty: 'intermediate' },
  { id: 'ph015', english: 'Is the pain constant or comes and goes?', spanish: '¿El dolor es constante o va y viene?', pronunciation: 'el doh-LOR es kon-STAN-teh', category: 'patient_history', difficulty: 'beginner' },

  // ── MEDICATIONS ───────────────────────────────────────────────────────
  { id: 'm001', english: 'Antibiotic', spanish: 'Antibiótico', pronunciation: 'an-tee-byoh-TEE-koh', category: 'medications', difficulty: 'beginner' },
  { id: 'm002', english: 'Pain reliever / Analgesic', spanish: 'Analgésico / Calmante', pronunciation: 'ah-nal-HEH-see-koh', category: 'medications', difficulty: 'beginner' },
  { id: 'm003', english: 'Blood pressure medication', spanish: 'Medicamento para la presión', pronunciation: 'meh-dee-kah-MEN-toh PAH-rah la preh-SYON', category: 'medications', difficulty: 'beginner' },
  { id: 'm004', english: 'Insulin', spanish: 'Insulina', pronunciation: 'een-soo-LEE-nah', category: 'medications', difficulty: 'beginner', tags: ['endocrine', 'diabetes'] },
  { id: 'm005', english: 'Blood thinner / Anticoagulant', spanish: 'Anticoagulante', pronunciation: 'an-tee-koh-ah-goo-LAN-teh', category: 'medications', difficulty: 'intermediate', tags: ['hematology', 'cardio'] },
  { id: 'm006', english: 'Steroid', spanish: 'Esteroide', pronunciation: 'es-teh-ROY-deh', category: 'medications', difficulty: 'intermediate' },
  { id: 'm007', english: 'Diuretic', spanish: 'Diurético', pronunciation: 'dyoo-REH-tee-koh', category: 'medications', difficulty: 'intermediate', tags: ['cardio', 'nephro'] },
  { id: 'm008', english: 'Antacid', spanish: 'Antiácido', pronunciation: 'an-tee-AH-see-doh', category: 'medications', difficulty: 'beginner', tags: ['GI'] },
  { id: 'm009', english: 'Vaccine', spanish: 'Vacuna', pronunciation: 'vah-KOO-nah', category: 'medications', difficulty: 'beginner' },
  { id: 'm010', english: 'Chemotherapy', spanish: 'Quimioterapia', pronunciation: 'kee-myoh-teh-RAH-pyah', category: 'medications', difficulty: 'advanced', tags: ['oncology'] },
  { id: 'm011', english: 'Inhaler / Bronchodilator', spanish: 'Inhalador / Broncodilatador', pronunciation: 'een-ah-lah-DOR', category: 'medications', difficulty: 'intermediate', tags: ['pulmonary', 'asthma'] },
  { id: 'm012', english: 'Antidepressant', spanish: 'Antidepresivo', pronunciation: 'an-tee-deh-preh-SEE-voh', category: 'medications', difficulty: 'intermediate', tags: ['psych'] },
  { id: 'm013', english: 'Morphine / Opioid', spanish: 'Morfina / Opioide', pronunciation: 'mor-FEE-nah', category: 'medications', difficulty: 'intermediate', tags: ['pain', 'emergency'] },
  { id: 'm014', english: 'Statin', spanish: 'Estatina', pronunciation: 'es-tah-TEE-nah', category: 'medications', difficulty: 'advanced', tags: ['cardio', 'lipids'] },
  { id: 'm015', english: 'Prenatal vitamin', spanish: 'Vitamina prenatal', pronunciation: 'vee-tah-MEE-nah preh-nah-TAL', category: 'medications', difficulty: 'beginner', tags: ['OB/GYN'] },

  // ── PROCEDURES ────────────────────────────────────────────────────────
  { id: 'pr001', english: 'Blood draw / Venipuncture', spanish: 'Extracción de sangre', pronunciation: 'eks-trak-SYON de SAN-greh', category: 'procedures', difficulty: 'beginner' },
  { id: 'pr002', english: 'X-ray', spanish: 'Radiografía', pronunciation: 'rah-dyoh-grah-FEE-ah', category: 'procedures', difficulty: 'beginner' },
  { id: 'pr003', english: 'MRI', spanish: 'Resonancia magnética', pronunciation: 'reh-soh-NAN-syah mag-NEH-tee-kah', category: 'procedures', difficulty: 'intermediate' },
  { id: 'pr004', english: 'CT scan', spanish: 'Tomografía computarizada (TAC)', pronunciation: 'toh-moh-grah-FEE-ah', category: 'procedures', difficulty: 'intermediate' },
  { id: 'pr005', english: 'Ultrasound', spanish: 'Ultrasonido / Ecografía', pronunciation: 'ool-trah-soh-NEE-doh', category: 'procedures', difficulty: 'beginner' },
  { id: 'pr006', english: 'EKG / Electrocardiogram', spanish: 'Electrocardiograma (ECG)', pronunciation: 'eh-lek-troh-kar-dyoh-GRA-mah', category: 'procedures', difficulty: 'intermediate', tags: ['cardio'] },
  { id: 'pr007', english: 'Biopsy', spanish: 'Biopsia', pronunciation: 'byop-SYAH', category: 'procedures', difficulty: 'intermediate', tags: ['oncology'] },
  { id: 'pr008', english: 'Surgery / Operation', spanish: 'Cirugía / Operación', pronunciation: 'see-roo-HEE-ah', category: 'procedures', difficulty: 'beginner' },
  { id: 'pr009', english: 'Colonoscopy', spanish: 'Colonoscopía', pronunciation: 'koh-loh-nos-koh-PEE-ah', category: 'procedures', difficulty: 'intermediate', tags: ['GI'] },
  { id: 'pr010', english: 'Lumbar puncture / Spinal tap', spanish: 'Punción lumbar', pronunciation: 'poon-SYON loom-BAR', category: 'procedures', difficulty: 'advanced', tags: ['neuro'] },
  { id: 'pr011', english: 'Catheter', spanish: 'Catéter / Sonda', pronunciation: 'kah-TEH-ter', category: 'procedures', difficulty: 'intermediate', tags: ['urology'] },
  { id: 'pr012', english: 'Physical examination', spanish: 'Examen físico', pronunciation: 'ek-SAH-men FEE-see-koh', category: 'procedures', difficulty: 'beginner' },
  { id: 'pr013', english: 'Informed consent', spanish: 'Consentimiento informado', pronunciation: 'kon-sen-tee-MYEN-toh', category: 'procedures', difficulty: 'intermediate' },
  { id: 'pr014', english: 'Discharge instructions', spanish: 'Instrucciones de alta', pronunciation: 'ees-trook-SYON-es de AL-tah', category: 'procedures', difficulty: 'beginner' },
  { id: 'pr015', english: 'Follow-up appointment', spanish: 'Cita de seguimiento', pronunciation: 'SEE-tah de seh-gee-MYEN-toh', category: 'procedures', difficulty: 'beginner' },

  // ── VITAL SIGNS ───────────────────────────────────────────────────────
  { id: 'v001', english: 'Blood pressure', spanish: 'Presión arterial', pronunciation: 'preh-SYON ar-teh-RYAHL', category: 'vitals', difficulty: 'beginner' },
  { id: 'v002', english: 'Heart rate / Pulse', spanish: 'Frecuencia cardíaca / Pulso', pronunciation: 'freh-KWEN-syah kar-DEE-ah-kah', category: 'vitals', difficulty: 'beginner' },
  { id: 'v003', english: 'Respiratory rate', spanish: 'Frecuencia respiratoria', pronunciation: 'freh-KWEN-syah res-pee-rah-TOH-ryah', category: 'vitals', difficulty: 'intermediate' },
  { id: 'v004', english: 'Temperature', spanish: 'Temperatura', pronunciation: 'tem-peh-rah-TOO-rah', category: 'vitals', difficulty: 'beginner' },
  { id: 'v005', english: 'Oxygen saturation', spanish: 'Saturación de oxígeno', pronunciation: 'sah-too-rah-SYON de ok-SEE-heh-no', category: 'vitals', difficulty: 'intermediate', tags: ['pulmonary'] },
  { id: 'v006', english: 'Weight', spanish: 'Peso', pronunciation: 'PEH-soh', category: 'vitals', difficulty: 'beginner' },
  { id: 'v007', english: 'Height', spanish: 'Estatura / Talla', pronunciation: 'es-tah-TOO-rah', category: 'vitals', difficulty: 'beginner' },
  { id: 'v008', english: 'Blood glucose / Blood sugar', spanish: 'Glucosa en sangre / Azúcar en sangre', pronunciation: 'gloo-KOH-sah en SAN-greh', category: 'vitals', difficulty: 'intermediate', tags: ['endocrine', 'diabetes'] },
  { id: 'v009', english: 'Pain score', spanish: 'Escala de dolor', pronunciation: 'es-KAH-lah de doh-LOR', category: 'vitals', difficulty: 'beginner' },
  { id: 'v010', english: 'GCS (Glasgow Coma Scale)', spanish: 'Escala de Coma de Glasgow', pronunciation: 'es-KAH-lah de KOH-mah', category: 'vitals', difficulty: 'advanced', tags: ['neuro', 'emergency', 'critical care'] },

  // ── SPECIALTIES ───────────────────────────────────────────────────────
  { id: 'sp001', english: 'Cardiology', spanish: 'Cardiología', pronunciation: 'kar-dyoh-loh-HEE-ah', category: 'specialties', difficulty: 'beginner' },
  { id: 'sp002', english: 'Neurology', spanish: 'Neurología', pronunciation: 'neh-oo-roh-loh-HEE-ah', category: 'specialties', difficulty: 'beginner' },
  { id: 'sp003', english: 'Orthopedics', spanish: 'Ortopedia', pronunciation: 'or-toh-PEH-dyah', category: 'specialties', difficulty: 'beginner' },
  { id: 'sp004', english: 'Obstetrics & Gynecology', spanish: 'Obstetricia y Ginecología', pronunciation: 'obs-teh-TREE-syah', category: 'specialties', difficulty: 'intermediate' },
  { id: 'sp005', english: 'Oncology', spanish: 'Oncología', pronunciation: 'on-koh-loh-HEE-ah', category: 'specialties', difficulty: 'beginner' },
  { id: 'sp006', english: 'Psychiatry', spanish: 'Psiquiatría', pronunciation: 'see-kyah-TREE-ah', category: 'specialties', difficulty: 'beginner' },
  { id: 'sp007', english: 'Dermatology', spanish: 'Dermatología', pronunciation: 'der-mah-toh-loh-HEE-ah', category: 'specialties', difficulty: 'beginner' },
  { id: 'sp008', english: 'Pulmonology', spanish: 'Neumología / Pulmonología', pronunciation: 'neh-oo-moh-loh-HEE-ah', category: 'specialties', difficulty: 'intermediate' },
  { id: 'sp009', english: 'Gastroenterology', spanish: 'Gastroenterología', pronunciation: 'gas-troh-en-teh-roh-loh-HEE-ah', category: 'specialties', difficulty: 'intermediate' },
  { id: 'sp010', english: 'Nephrology', spanish: 'Nefrología', pronunciation: 'neh-froh-loh-HEE-ah', category: 'specialties', difficulty: 'intermediate' },
  { id: 'sp011', english: 'Endocrinology', spanish: 'Endocrinología', pronunciation: 'en-doh-kree-noh-loh-HEE-ah', category: 'specialties', difficulty: 'intermediate' },
  { id: 'sp012', english: 'Radiology', spanish: 'Radiología', pronunciation: 'rah-dyoh-loh-HEE-ah', category: 'specialties', difficulty: 'beginner' },
  { id: 'sp013', english: 'Anesthesiology', spanish: 'Anestesiología', pronunciation: 'ah-nes-teh-syoh-loh-HEE-ah', category: 'specialties', difficulty: 'intermediate' },
  { id: 'sp014', english: 'Hematology', spanish: 'Hematología', pronunciation: 'eh-mah-toh-loh-HEE-ah', category: 'specialties', difficulty: 'intermediate' },
  { id: 'sp015', english: 'Rheumatology', spanish: 'Reumatología', pronunciation: 'reh-oo-mah-toh-loh-HEE-ah', category: 'specialties', difficulty: 'advanced' },
];

export function searchVocabulary(query: string): VocabEntry[] {
  if (!query.trim()) return vocabulary;
  const q = query.toLowerCase();
  return vocabulary.filter(
    (v) =>
      v.english.toLowerCase().includes(q) ||
      v.spanish.toLowerCase().includes(q) ||
      v.pronunciation.toLowerCase().includes(q) ||
      v.notes?.toLowerCase().includes(q) ||
      v.tags?.some((t) => t.toLowerCase().includes(q)) ||
      v.category.toLowerCase().includes(q)
  );
}

export function getByCategory(category: Category): VocabEntry[] {
  return vocabulary.filter((v) => v.category === category);
}

export const CATEGORIES: Category[] = [
  'greetings',
  'anatomy',
  'symptoms',
  'diagnoses',
  'emergency',
  'patient_history',
  'medications',
  'procedures',
  'vitals',
  'specialties',
];
