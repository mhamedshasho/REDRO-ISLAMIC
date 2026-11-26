// ==================== Redro Islamic App ====================
// Pure Frontend Islamic App - No Auth Required

const KAABA = { lat: 21.4225, lng: 39.8262 };
const DEFAULT_LOC = { lat: 36.2021, lng: 37.1343, name: 'حلب، سوريا' };

// State
let state = {
  location: { ...DEFAULT_LOC },
  prayerTimes: null,
  nextPrayer: null,
  countdownInterval: null,
  currentSection: 'home',
  sebha: { count: 0, index: 0, target: 33 },
  qiblaAngle: 0,
  deviceHeading: 0,
  deeds: [],
  azkarProgress: {},
  azkarViewMode: 'full',
  azkarCategory: null,
  azkarReaderIndex: 0,
  favorites: [],
  settings: null,
  showTranslation: false,
  currentSurah: null,
  currentAyahs: [],
  audio: null,
  fastingDays: {}
};

// ==================== Data ====================
const SEBHA_PHRASES = [
  { text: 'سُبْحَانَ اللَّهِ', target: 33, hadith: 'عن أبي هريرة رضي الله عنه قال: قال رسول الله ﷺ: «من قال سبحان الله وبحمده في يوم مائة مرة حطت خطاياه وإن كانت مثل زبد البحر»' },
  { text: 'الْحَمْدُ لِلَّهِ', target: 33, hadith: 'الحمد لله تملأ الميزان، وسبحان الله والحمد لله تملآن ما بين السماء والأرض.' },
  { text: 'اللَّهُ أَكْبَرُ', target: 33, hadith: 'أفضل الكلام: سبحان الله، والحمد لله، ولا إله إلا الله، والله أكبر.' },
  { text: 'لَا إِلَٰهَ إِلَّا اللَّهُ', target: 33, hadith: 'أفضل الذكر لا إله إلا الله.' },
  { text: 'أَسْتَغْفِرُ اللَّهَ', target: 100, hadith: 'عن أبي هريرة قال: قال رسول الله ﷺ: «إني لأستغفر الله في اليوم مائة مرة»' },
  { text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', target: 100, hadith: 'من قال سبحان الله وبحمده مائة مرة غفرت خطاياه وإن كانت مثل زبد البحر.' }
];

const AZKAR_DATA = {
  morning: {
    title: 'أذكار الصباح',
    icon: 'fa-sun',
    items: [
      { text: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ', count: 1 },
      { text: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ', count: 1 },
      { text: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ', count: 1, ref: 'سورة البقرة، الآية 255' },
      { text: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', count: 3 },
      { text: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ ۝ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ', count: 3 },
      { text: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ', count: 3 },
      { text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', count: 100 },
      { text: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا', count: 3 },
      { text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعِلْمَ النَّافِعَ، وَالرِّزْقَ الطَّيِّبَ، وَالْعَمَلَ الْمُتَقَبَّلَ', count: 1 },
      { text: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ', count: 3 }
    ]
  },
  evening: {
    title: 'أذكار المساء',
    icon: 'fa-moon',
    items: [
      { text: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ', count: 1 },
      { text: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ', count: 1 },
      { text: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ', count: 1, ref: 'سورة البقرة، الآية 255' },
      { text: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ', count: 3, ref: 'سورة الإخلاص' },
      { text: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِنْ شَرِّ مَا خَلَقَ ۝ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ', count: 3, ref: 'سورة الفلق' },
      { text: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ', count: 3, ref: 'سورة الناس' },
      { text: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ', count: 3 },
      { text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', count: 100 }
    ]
  },
  sleep: {
    title: 'أذكار النوم',
    icon: 'fa-bed',
    items: [
      { text: 'بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، إِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ', count: 1 },
      { text: 'اللَّهُمَّ إِنَّكَ خَلَقْتَ نَفْسِي وَأَنْتَ تَوَفَّاهَا، لَكَ مَمَاتُهَا وَمَحْيَاهَا، إِنْ أَحْيَيْتَهَا فَاحْفَظْهَا، وَإِنْ أَمَتَّهَا فَاغْفِرْ لَهَا', count: 1 },
      { text: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ', count: 3 },
      { text: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', count: 1 },
      { text: 'سُبْحَانَ اللَّهِ (33) الْحَمْدُ لِلَّهِ (33) اللَّهُ أَكْبَرُ (34)', count: 1 }
    ]
  },
  afterPrayer: {
    title: 'أذكار بعد الصلاة',
    icon: 'fa-pray',
    items: [
      { text: 'أَسْتَغْفِرُ اللَّهَ (ثلاث مرات) اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ', count: 1 },
      { text: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ', count: 1 },
      { text: 'اللَّهُمَّ أَعِنِّي عَلَىٰ ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ', count: 1 },
      { text: 'سُبْحَانَ اللَّهِ (33) الْحَمْدُ لِلَّهِ (33) اللَّهُ أَكْبَرُ (33) ثم: لَا إِلَٰهَ إِلَّا اللَّهُ...', count: 1 },
      { text: 'آية الكرسي', count: 1 }
    ]
  },
  general: {
    title: 'أذكار عامة',
    icon: 'fa-heart',
    items: [
      { text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ', count: 1, ref: 'متفق عليه' },
      { text: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', count: 1, ref: 'صحيح البخاري' },
      { text: 'حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ', count: 7, ref: 'أبو داود' },
      { text: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَىٰ نَبِيِّنَا مُحَمَّدٍ', count: 10, ref: 'فضل الصلاة على النبي' }
    ]
  },
  kunuz: {
    title: 'كنوز من الذكر',
    icon: 'fa-gem',
    items: [
      { text: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ', count: 10, ref: 'أسعد الناس بشفاعته من صلى عليه أكثر' },
      { text: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ', count: 3, ref: 'غفران الذنوب - الترمذي' },
      { text: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ', count: 3, ref: 'حرز من الشيطان - مسلم' },
      { text: 'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَٰهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ', count: 1, ref: 'الباقيات الصالحات' },
      { text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ', count: 1, ref: 'ثقيلتان في الميزان حبيبتان إلى الرحمن' },
      { text: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ', count: 10, ref: 'غراس الجنة' },
      { text: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ', count: 10, ref: 'كلمات تفتح لها أبواب السماء' },
      { text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', count: 100, ref: 'خير من جبل ذهب - مسلم' },
      { text: 'لَا إِلَٰهَ إِلَّا اللَّهُ', count: 100, ref: 'من أعظم الأذكار أجراً' },
      { text: 'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَٰهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', count: 1, ref: 'زيادة الحسنات' },
      { text: 'اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ', count: 3, ref: 'النجاة من النار' }
    ]
  }
};

// المصدر المعتمد للأذكار: بيانات حصن المسلم كما ينشرها مشروع Islamic Pro.
// لا نعيد صياغة النص أو ننسب تخريجاً من عندنا؛ نعرض النص والعدد كما وردا في المصدر.
const AZKAR_API_SOURCE = 'حصن المسلم — الشيخ سعيد بن علي بن وهف القحطاني';
const AZKAR_API_SOURCE_URL = 'https://hisnmuslim.com/';

function useTrustedAdhkarApiData() {
  if (!Array.isArray(window.REDRO_ADHKAR_API) || !window.REDRO_ADHKAR_API.length) return;
  const mapped = {};
  window.REDRO_ADHKAR_API.forEach(category => {
    const key = `api_${category.id}`;
    mapped[key] = {
      title: category.category,
      icon: category.id === 27 ? 'fa-sun' : category.id === 28 ? 'fa-bed' : category.id === 25 ? 'fa-pray' : 'fa-book-quran',
      source: AZKAR_API_SOURCE,
      sourceUrl: AZKAR_API_SOURCE_URL,
      items: (category.array || []).map(item => ({
        text: item.text,
        count: Number(item.count) || 1,
        audio: item.audio,
        source: AZKAR_API_SOURCE,
        sourceUrl: AZKAR_API_SOURCE_URL,
        ref: `المصدر: ${AZKAR_API_SOURCE} — باب «${category.category}». النص والعدد من ملف البيانات العربي للمصدر.`,
        apiId: item.id
      }))
    };
  });
  Object.keys(AZKAR_DATA).forEach(key => delete AZKAR_DATA[key]);
  Object.assign(AZKAR_DATA, mapped);
}

const DEEDS_LIST = [
  'صلاة الفجر في جماعة أو في وقتها',
  'قراءة أذكار الصباح كاملة',
  'قراءة جزء من القرآن أو صفحة على الأقل',
  'صلاة الضحى (ركعتين أو أكثر)',
  'الصدقة ولو بالقليل',
  'صلة الرحم أو الاتصال بأحد الأقارب',
  'الاستغفار 100 مرة',
  'الصلاة على النبي ﷺ 10 مرات',
  'قراءة أذكار المساء',
  'صلاة الوتر قبل النوم',
  'قراءة أذكار النوم',
  'الدعاء لنفسك ولأمتك'
];

const SURAH_NAMES = [
  { number: 1, name: 'الفاتحة', english: 'Al-Fatiha', ayahs: 7, type: 'مكية' },
  { number: 2, name: 'البقرة', english: 'Al-Baqarah', ayahs: 286, type: 'مدنية' },
  { number: 3, name: 'آل عمران', english: 'Aal-Imran', ayahs: 200, type: 'مدنية' },
  { number: 4, name: 'النساء', english: 'An-Nisa', ayahs: 176, type: 'مدنية' },
  { number: 5, name: 'المائدة', english: 'Al-Maidah', ayahs: 120, type: 'مدنية' },
  { number: 6, name: 'الأنعام', english: 'Al-Anam', ayahs: 165, type: 'مكية' },
  { number: 7, name: 'الأعراف', english: 'Al-Araf', ayahs: 206, type: 'مكية' },
  { number: 8, name: 'الأنفال', english: 'Al-Anfal', ayahs: 75, type: 'مدنية' },
  { number: 9, name: 'التوبة', english: 'At-Tawbah', ayahs: 129, type: 'مدنية' },
  { number: 10, name: 'يونس', english: 'Yunus', ayahs: 109, type: 'مكية' },
  { number: 11, name: 'هود', english: 'Hud', ayahs: 123, type: 'مكية' },
  { number: 12, name: 'يوسف', english: 'Yusuf', ayahs: 111, type: 'مكية' },
  { number: 13, name: 'الرعد', english: 'Ar-Rad', ayahs: 43, type: 'مدنية' },
  { number: 14, name: 'إبراهيم', english: 'Ibrahim', ayahs: 52, type: 'مكية' },
  { number: 15, name: 'الحجر', english: 'Al-Hijr', ayahs: 99, type: 'مكية' },
  { number: 16, name: 'النحل', english: 'An-Nahl', ayahs: 128, type: 'مكية' },
  { number: 17, name: 'الإسراء', english: 'Al-Isra', ayahs: 111, type: 'مكية' },
  { number: 18, name: 'الكهف', english: 'Al-Kahf', ayahs: 110, type: 'مكية' },
  { number: 19, name: 'مريم', english: 'Maryam', ayahs: 98, type: 'مكية' },
  { number: 20, name: 'طه', english: 'Ta-Ha', ayahs: 135, type: 'مكية' },
  { number: 21, name: 'الأنبياء', english: 'Al-Anbiya', ayahs: 112, type: 'مكية' },
  { number: 22, name: 'الحج', english: 'Al-Hajj', ayahs: 78, type: 'مدنية' },
  { number: 23, name: 'المؤمنون', english: 'Al-Muminun', ayahs: 118, type: 'مكية' },
  { number: 24, name: 'النور', english: 'An-Nur', ayahs: 64, type: 'مدنية' },
  { number: 25, name: 'الفرقان', english: 'Al-Furqan', ayahs: 77, type: 'مكية' },
  { number: 26, name: 'الشعراء', english: 'Ash-Shuara', ayahs: 227, type: 'مكية' },
  { number: 27, name: 'النمل', english: 'An-Naml', ayahs: 93, type: 'مكية' },
  { number: 28, name: 'القصص', english: 'Al-Qasas', ayahs: 88, type: 'مكية' },
  { number: 29, name: 'العنكبوت', english: 'Al-Ankabut', ayahs: 69, type: 'مكية' },
  { number: 30, name: 'الروم', english: 'Ar-Rum', ayahs: 60, type: 'مكية' },
  { number: 31, name: 'لقمان', english: 'Luqman', ayahs: 34, type: 'مكية' },
  { number: 32, name: 'السجدة', english: 'As-Sajdah', ayahs: 30, type: 'مكية' },
  { number: 33, name: 'الأحزاب', english: 'Al-Ahzab', ayahs: 73, type: 'مدنية' },
  { number: 34, name: 'سبأ', english: 'Saba', ayahs: 54, type: 'مكية' },
  { number: 35, name: 'فاطر', english: 'Fatir', ayahs: 45, type: 'مكية' },
  { number: 36, name: 'يس', english: 'Ya-Sin', ayahs: 83, type: 'مكية' },
  { number: 37, name: 'الصافات', english: 'As-Saffat', ayahs: 182, type: 'مكية' },
  { number: 38, name: 'ص', english: 'Sad', ayahs: 88, type: 'مكية' },
  { number: 39, name: 'الزمر', english: 'Az-Zumar', ayahs: 75, type: 'مكية' },
  { number: 40, name: 'غافر', english: 'Ghafir', ayahs: 85, type: 'مكية' },
  { number: 41, name: 'فصلت', english: 'Fussilat', ayahs: 54, type: 'مكية' },
  { number: 42, name: 'الشورى', english: 'Ash-Shura', ayahs: 53, type: 'مكية' },
  { number: 43, name: 'الزخرف', english: 'Az-Zukhruf', ayahs: 89, type: 'مكية' },
  { number: 44, name: 'الدخان', english: 'Ad-Dukhan', ayahs: 59, type: 'مكية' },
  { number: 45, name: 'الجاثية', english: 'Al-Jathiyah', ayahs: 37, type: 'مكية' },
  { number: 46, name: 'الأحقاف', english: 'Al-Ahqaf', ayahs: 35, type: 'مكية' },
  { number: 47, name: 'محمد', english: 'Muhammad', ayahs: 38, type: 'مدنية' },
  { number: 48, name: 'الفتح', english: 'Al-Fath', ayahs: 29, type: 'مدنية' },
  { number: 49, name: 'الحجرات', english: 'Al-Hujurat', ayahs: 18, type: 'مدنية' },
  { number: 50, name: 'ق', english: 'Qaf', ayahs: 45, type: 'مكية' },
  { number: 51, name: 'الذاريات', english: 'Adh-Dhariyat', ayahs: 60, type: 'مكية' },
  { number: 52, name: 'الطور', english: 'At-Tur', ayahs: 49, type: 'مكية' },
  { number: 53, name: 'النجم', english: 'An-Najm', ayahs: 62, type: 'مكية' },
  { number: 54, name: 'القمر', english: 'Al-Qamar', ayahs: 55, type: 'مكية' },
  { number: 55, name: 'الرحمن', english: 'Ar-Rahman', ayahs: 78, type: 'مدنية' },
  { number: 56, name: 'الواقعة', english: 'Al-Waqiah', ayahs: 96, type: 'مكية' },
  { number: 57, name: 'الحديد', english: 'Al-Hadid', ayahs: 29, type: 'مدنية' },
  { number: 58, name: 'المجادلة', english: 'Al-Mujadila', ayahs: 22, type: 'مدنية' },
  { number: 59, name: 'الحشر', english: 'Al-Hashr', ayahs: 24, type: 'مدنية' },
  { number: 60, name: 'الممتحنة', english: 'Al-Mumtahanah', ayahs: 13, type: 'مدنية' },
  { number: 61, name: 'الصف', english: 'As-Saff', ayahs: 14, type: 'مدنية' },
  { number: 62, name: 'الجمعة', english: 'Al-Jumuah', ayahs: 11, type: 'مدنية' },
  { number: 63, name: 'المنافقون', english: 'Al-Munafiqun', ayahs: 11, type: 'مدنية' },
  { number: 64, name: 'التغابن', english: 'At-Taghabun', ayahs: 18, type: 'مدنية' },
  { number: 65, name: 'الطلاق', english: 'At-Talaq', ayahs: 12, type: 'مدنية' },
  { number: 66, name: 'التحريم', english: 'At-Tahrim', ayahs: 12, type: 'مدنية' },
  { number: 67, name: 'الملك', english: 'Al-Mulk', ayahs: 30, type: 'مكية' },
  { number: 68, name: 'القلم', english: 'Al-Qalam', ayahs: 52, type: 'مكية' },
  { number: 69, name: 'الحاقة', english: 'Al-Haqqah', ayahs: 52, type: 'مكية' },
  { number: 70, name: 'المعارج', english: 'Al-Maarij', ayahs: 44, type: 'مكية' },
  { number: 71, name: 'نوح', english: 'Nuh', ayahs: 28, type: 'مكية' },
  { number: 72, name: 'الجن', english: 'Al-Jinn', ayahs: 28, type: 'مكية' },
  { number: 73, name: 'المزمل', english: 'Al-Muzzammil', ayahs: 20, type: 'مكية' },
  { number: 74, name: 'المدثر', english: 'Al-Muddaththir', ayahs: 56, type: 'مكية' },
  { number: 75, name: 'القيامة', english: 'Al-Qiyamah', ayahs: 40, type: 'مكية' },
  { number: 76, name: 'الإنسان', english: 'Al-Insan', ayahs: 31, type: 'مدنية' },
  { number: 77, name: 'المرسلات', english: 'Al-Mursalat', ayahs: 50, type: 'مكية' },
  { number: 78, name: 'النبأ', english: 'An-Naba', ayahs: 40, type: 'مكية' },
  { number: 79, name: 'النازعات', english: 'An-Naziat', ayahs: 46, type: 'مكية' },
  { number: 80, name: 'عبس', english: 'Abasa', ayahs: 42, type: 'مكية' },
  { number: 81, name: 'التكوير', english: 'At-Takwir', ayahs: 29, type: 'مكية' },
  { number: 82, name: 'الانفطار', english: 'Al-Infitar', ayahs: 19, type: 'مكية' },
  { number: 83, name: 'المطففين', english: 'Al-Mutaffifin', ayahs: 36, type: 'مكية' },
  { number: 84, name: 'الانشقاق', english: 'Al-Inshiqaq', ayahs: 25, type: 'مكية' },
  { number: 85, name: 'البروج', english: 'Al-Buruj', ayahs: 22, type: 'مكية' },
  { number: 86, name: 'الطارق', english: 'At-Tariq', ayahs: 17, type: 'مكية' },
  { number: 87, name: 'الأعلى', english: 'Al-Ala', ayahs: 19, type: 'مكية' },
  { number: 88, name: 'الغاشية', english: 'Al-Ghashiyah', ayahs: 26, type: 'مكية' },
  { number: 89, name: 'الفجر', english: 'Al-Fajr', ayahs: 30, type: 'مكية' },
  { number: 90, name: 'البلد', english: 'Al-Balad', ayahs: 20, type: 'مكية' },
  { number: 91, name: 'الشمس', english: 'Ash-Shams', ayahs: 15, type: 'مكية' },
  { number: 92, name: 'الليل', english: 'Al-Layl', ayahs: 21, type: 'مكية' },
  { number: 93, name: 'الضحى', english: 'Ad-Duha', ayahs: 11, type: 'مكية' },
  { number: 94, name: 'الشرح', english: 'Ash-Sharh', ayahs: 8, type: 'مكية' },
  { number: 95, name: 'التين', english: 'At-Tin', ayahs: 8, type: 'مكية' },
  { number: 96, name: 'العلق', english: 'Al-Alaq', ayahs: 19, type: 'مكية' },
  { number: 97, name: 'القدر', english: 'Al-Qadr', ayahs: 5, type: 'مكية' },
  { number: 98, name: 'البينة', english: 'Al-Bayyinah', ayahs: 8, type: 'مدنية' },
  { number: 99, name: 'الزلزلة', english: 'Az-Zalzalah', ayahs: 8, type: 'مدنية' },
  { number: 100, name: 'العاديات', english: 'Al-Adiyat', ayahs: 11, type: 'مكية' },
  { number: 101, name: 'القارعة', english: 'Al-Qariah', ayahs: 11, type: 'مكية' },
  { number: 102, name: 'التكاثر', english: 'At-Takathur', ayahs: 8, type: 'مكية' },
  { number: 103, name: 'العصر', english: 'Al-Asr', ayahs: 3, type: 'مكية' },
  { number: 104, name: 'الهمزة', english: 'Al-Humazah', ayahs: 9, type: 'مكية' },
  { number: 105, name: 'الفيل', english: 'Al-Fil', ayahs: 5, type: 'مكية' },
  { number: 106, name: 'قريش', english: 'Quraysh', ayahs: 4, type: 'مكية' },
  { number: 107, name: 'الماعون', english: 'Al-Maun', ayahs: 7, type: 'مكية' },
  { number: 108, name: 'الكوثر', english: 'Al-Kawthar', ayahs: 3, type: 'مكية' },
  { number: 109, name: 'الكافرون', english: 'Al-Kafirun', ayahs: 6, type: 'مكية' },
  { number: 110, name: 'النصر', english: 'An-Nasr', ayahs: 3, type: 'مدنية' },
  { number: 111, name: 'المسد', english: 'Al-Masad', ayahs: 5, type: 'مكية' },
  { number: 112, name: 'الإخلاص', english: 'Al-Ikhlas', ayahs: 4, type: 'مكية' },
  { number: 113, name: 'الفلق', english: 'Al-Falaq', ayahs: 5, type: 'مكية' },
  { number: 114, name: 'الناس', english: 'An-Nas', ayahs: 6, type: 'مكية' }
];

// ==================== Utils ====================
function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }

function saveState() {
  localStorage.setItem('redro_deeds', JSON.stringify(state.deeds));
  localStorage.setItem('redro_sebha', JSON.stringify(state.sebha));
  localStorage.setItem('redro_azkar', JSON.stringify(state.azkarProgress));
  localStorage.setItem('redro_favorites', JSON.stringify(state.favorites));
  localStorage.setItem('redro_fasting', JSON.stringify(state.fastingDays));
  localStorage.setItem('redro_settings', JSON.stringify(state.settings || {}));
}

function loadState() {
  try {
    const deeds = localStorage.getItem('redro_deeds');
    if (deeds) state.deeds = JSON.parse(deeds);
    else state.deeds = DEEDS_LIST.map(() => false);

    const sebha = localStorage.getItem('redro_sebha');
    if (sebha) state.sebha = JSON.parse(sebha);

    const azkar = localStorage.getItem('redro_azkar');
    if (azkar) state.azkarProgress = JSON.parse(azkar);

    const favs = localStorage.getItem('redro_favorites');
    if (favs) state.favorites = JSON.parse(favs);

    const fasting = localStorage.getItem('redro_fasting');
    if (fasting) state.fastingDays = JSON.parse(fasting);
    const savedSettings = localStorage.getItem('redro_settings');
    if (savedSettings) state.settings = { ...(state.settings || {}), ...JSON.parse(savedSettings) };
  } catch (e) {
    state.deeds = DEEDS_LIST.map(() => false);
  }
}

function toRad(d) { return d * Math.PI / 180; }
function toDeg(r) { return r * 180 / Math.PI; }

function calculateQibla(lat, lng) {
  const φ1 = toRad(lat);
  const φ2 = toRad(KAABA.lat);
  const Δλ = toRad(KAABA.lng - lng);
  const y = Math.sin(Δλ);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  let θ = toDeg(Math.atan2(y, x));
  return (θ + 360) % 360;
}

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function formatTime(t) {
  if (!t) return '--:--';
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'م' : 'ص';
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2,'0')} ${period}`;
}

// ==================== Prayer Times ====================
async function fetchPrayerTimes() {
  const { lat, lng } = state.location;
  const date = new Date();
  const dateStr = `${date.getDate().toString().padStart(2,'0')}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getFullYear()}`;
  try {
    const res = await fetch(`https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lng}&method=4`);
    const data = await res.json();
    if (data.code === 200) {
      state.prayerTimes = data.data.timings;
      const hijri = data.data.date.hijri;
      $('#hijriDate').textContent = `${hijri.day} ${hijri.month.ar} ${hijri.year} هـ`;
      $('#gregorianDate').textContent = data.data.date.readable;
      applySeasonalTheme(hijri);
      renderPrayerTimes();
      startCountdown();
      if (state.settings?.notifications) schedulePrayerNotifications();
    }
  } catch (e) {
    console.error('Prayer times error', e);
    // Fallback approximate for Aleppo
    state.prayerTimes = {
      Fajr: '05:37', Sunrise: '07:15', Dhuhr: '12:18', Asr: '15:01', Maghrib: '17:20', Isha: '18:48'
    };
    renderPrayerTimes();
    startCountdown();
    if (state.settings?.notifications) schedulePrayerNotifications();
  }
}

function renderPrayerTimes() {
  const names = {
    Fajr: { ar: 'الفجر', icon: 'fa-moon' },
    Sunrise: { ar: 'الشروق', icon: 'fa-sun' },
    Dhuhr: { ar: 'الظهر', icon: 'fa-sun' },
    Asr: { ar: 'العصر', icon: 'fa-cloud-sun' },
    Maghrib: { ar: 'المغرب', icon: 'fa-sunset' },
    Isha: { ar: 'العشاء', icon: 'fa-moon' }
  };
  const order = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const grid = $('#prayerTimesGrid');
  grid.innerHTML = '';
  const now = new Date();
  let nextKey = null;
  let minDiff = Infinity;

  order.forEach(key => {
    const t = state.prayerTimes[key];
    if (!t) return;
    const [h, m] = t.split(':').map(Number);
    const prayerDate = new Date(now);
    prayerDate.setHours(h, m, 0, 0);
    if (prayerDate < now) prayerDate.setDate(prayerDate.getDate() + 1);
    const diff = prayerDate - now;
    if (diff < minDiff && key !== 'Sunrise') {
      minDiff = diff;
      nextKey = key;
    }
  });

  state.nextPrayer = nextKey;

  order.forEach(key => {
    const info = names[key];
    const t = state.prayerTimes[key];
    const card = document.createElement('div');
    card.className = 'prayer-card' + (key === nextKey ? ' next' : '');
    card.innerHTML = `
      <div class="icon"><i class="fas ${info.icon}"></i></div>
      <div class="name">${info.ar}</div>
      <div class="time">${formatTime(t)}</div>
    `;
    grid.appendChild(card);
  });

  if (nextKey) {
    $('#nextPrayerName').textContent = names[nextKey].ar;
  }
}

function startCountdown() {
  if (state.countdownInterval) clearInterval(state.countdownInterval);
  state.countdownInterval = setInterval(() => {
    if (!state.nextPrayer || !state.prayerTimes) return;
    const t = state.prayerTimes[state.nextPrayer];
    const [h, m] = t.split(':').map(Number);
    const now = new Date();
    let target = new Date(now);
    target.setHours(h, m, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);
    const diff = target - now;
    if (diff <= 0) {
      fetchPrayerTimes();
      return;
    }
    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    $('#countdown').textContent = `${hrs.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
  }, 1000);
}

// ==================== Navigation ====================
function showSection(id) {
  $$('.section').forEach(s => s.classList.remove('active'));
  const sec = $(`#${id}`);
  if (sec) {
    sec.classList.add('active');
    state.currentSection = id;
  }
  $$('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.section === id || (id === 'more' && n.dataset.section === 'more'));
  });
  // Reset nested views
  if (id === 'quran') {
    $('#ayahView').classList.add('hidden');
    $('#surahList').classList.remove('hidden');
  }
  if (id === 'azkar') {
    $('#azkarListView').classList.add('hidden');
    $('#azkarCategories').classList.remove('hidden');
  }
  if (id === 'qibla') initQibla();
  if (id === 'ramadan') initRamadan();
  window.scrollTo(0, 0);
}

// ==================== Quran ====================
const QURAN_RECITERS = [
  { id: 'ar.alafasy', name: 'مشاري راشد العفاسي' },
  { id: 'ar.abdulbasitmurattal', name: 'عبد الباسط عبد الصمد' },
  { id: 'ar.husary', name: 'محمود خليل الحصري' },
  { id: 'ar.minshawi', name: 'محمد صديق المنشاوي' },
  { id: 'ar.sudais', name: 'عبد الرحمن السديس' }
];
function setOfflineProgress(percent, message) {
  const bar = document.getElementById('offlineProgressBar');
  const status = document.getElementById('offlineStatus');
  if (bar) bar.style.width = `${Math.max(0, Math.min(100, percent))}%`;
  if (status && message) status.textContent = message;
}
function surahAyahsFromApi(arData, enData) {
  return arData.data.ayahs.map((a, i) => ({
    numberInSurah: a.numberInSurah,
    number: a.number,
    text: a.text,
    translation: enData && enData.code === 200 && enData.data.ayahs[i] ? enData.data.ayahs[i].text : ''
  }));
}
async function downloadQuranText() {
  if (!window.RedroOffline) return setOfflineProgress(0, 'التخزين غير المتصل غير متاح على هذا المتصفح.');
  if (!window.confirm('سيتم تنزيل نص المصحف كاملًا باستخدام الإنترنت. هل تريد المتابعة؟')) return;
  try {
    for (let i = 0; i < SURAH_NAMES.length; i += 1) {
      const num = SURAH_NAMES[i].number;
      const [arRes, enRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${num}/quran-uthmani`),
        fetch(`https://api.alquran.cloud/v1/surah/${num}/en.sahih`)
      ]);
      const arData = await arRes.json();
      const enData = await enRes.json();
      if (arData.code !== 200) throw new Error('quran-download-failed');
      await RedroOffline.putSurah({ number: num, name: SURAH_NAMES[i].name, ayahs: surahAyahsFromApi(arData, enData), downloadedAt: Date.now() });
      setOfflineProgress(((i + 1) / SURAH_NAMES.length) * 100, `تم تنزيل ${i + 1} من ${SURAH_NAMES.length} سورة`);
    }
    setOfflineProgress(100, 'تم تنزيل المصحف النصي كاملًا ويمكن استخدامه دون إنترنت.');
  } catch (error) {
    console.error('Offline Quran download error', error);
    setOfflineProgress(0, 'توقف التنزيل. تحقق من الإنترنت ثم أعد المحاولة.');
  }
}
async function refreshOfflineStatus() {
  if (!window.RedroOffline) return;
  try {
    const surahs = await RedroOffline.getAllSurahs();
    if (surahs.length) setOfflineProgress((surahs.length / SURAH_NAMES.length) * 100, `المصحف محفوظ دون إنترنت: ${surahs.length} من ${SURAH_NAMES.length} سورة.`);
  } catch (_) {}
}
async function downloadInterfaceAssets() {
  if (!window.RedroOffline) { setOfflineProgress(0, 'التخزين غير المتصل غير متاح على هذا الجهاز.'); return; }
  if (!window.confirm('سيتم تنزيل خطوط Cairo وAmiri وأيقونات التطبيق لاستخدامها دون إنترنت. هل تريد المتابعة؟')) return;
  const cssUrls = ['https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800&family=Amiri:wght@400;700&display=swap', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'];
  try {
    const resources = cssUrls.slice();
    for (let i = 0; i < cssUrls.length; i += 1) {
      const response = await fetch(cssUrls[i]);
      if (!response.ok) throw new Error('stylesheet-download-failed');
      const css = await response.text();
      const matches = css.match(/url\(([^)]+)\)/g) || [];
      matches.forEach(value => { const raw = value.slice(4, -1).replace(/["']/g, ''); try { resources.push(new URL(raw, cssUrls[i]).href); } catch (_) {} });
    }
    await RedroOffline.cacheInterfaceAssets(resources);
    setOfflineProgress(100, `تم تنزيل الخطوط والأيقونات (${resources.length} ملفًا). أعد فتح التطبيق لتعمل دون إنترنت.`);
  } catch (error) { console.error('Interface assets download error', error); setOfflineProgress(0, 'تعذر تنزيل الخطوط والأيقونات. تحقق من الإنترنت ثم أعد المحاولة.'); }
}
async function refreshInterfaceAssetsStatus() {
  if (!window.RedroOffline || !RedroOffline.getInterfaceAssetCount) return;
  const count = await RedroOffline.getInterfaceAssetCount().catch(() => 0);
  if (count) setOfflineProgress(100, `الخطوط والأيقونات محفوظة دون إنترنت (${count} ملفًا).`);
}
function setupQuranReciter() {
  const select = document.getElementById('quranReciter');
  if (!select) return;
  select.innerHTML = QURAN_RECITERS.map(r => `<option value="${r.id}">${r.name}</option>`).join('');
  select.value = state.settings.quranReciter || 'ar.alafasy';
  select.onchange = () => {
    state.settings.quranReciter = select.value;
    persistSettings();
    if (state.audio) { stopAudio(); updateAudioStatus('تم اختيار القارئ الجديد. اضغط استماع للبدء.'); }
  };
}
function updateAudioStatus(message) {
  const status = document.getElementById('audioStatus');
  if (status) { status.classList.remove('hidden'); status.textContent = message; }
}

function renderSurahList(filter = '') {
  const list = $('#surahList');
  list.innerHTML = '';
  const filtered = SURAH_NAMES.filter(s => 
    s.name.includes(filter) || s.english.toLowerCase().includes(filter.toLowerCase()) || s.number.toString() === filter
  );
  filtered.forEach(s => {
    const btn = document.createElement('button');
    btn.className = 'surah-item';
    btn.innerHTML = `
      <div class="surah-number">${s.number}</div>
      <div class="surah-info">
        <div class="surah-name">${s.name}</div>
        <div class="surah-meta">${s.english} • ${s.type}</div>
      </div>
      <div class="surah-ayahs">${s.ayahs} آية</div>
    `;
    btn.onclick = () => loadSurah(s.number, s.name);
    list.appendChild(btn);
  });
}

async function loadSurah(num, name) {
  state.currentSurah = num;
  state.showTranslation = false;
  $('#tafsirBox').classList.add('hidden');
  $('#currentSurahName').textContent = `سورة ${name}`;
  $('#surahList').classList.add('hidden');
  $('#ayahView').classList.remove('hidden');
  updateFavButton();
  const container = $('#ayahsContainer');
  container.innerHTML = '<p style="text-align:center;padding:40px;">جاري التحميل...</p>';

  try {
    const cached = window.RedroOffline ? await RedroOffline.getSurah(num).catch(() => null) : null;
    if (cached && cached.ayahs) {
      state.currentAyahs = cached.ayahs;
      renderAyahs();
      return;
    }
    // Fetch Arabic + English translation together
    const [arRes, enRes] = await Promise.all([
      fetch(`https://api.alquran.cloud/v1/surah/${num}/quran-uthmani`),
      fetch(`https://api.alquran.cloud/v1/surah/${num}/en.sahih`)
    ]);
    const arData = await arRes.json();
    const enData = await enRes.json();

    if (arData.code === 200) {
      state.currentAyahs = surahAyahsFromApi(arData, enData);
      if (window.RedroOffline) RedroOffline.putSurah({ number: num, name: name, ayahs: state.currentAyahs, downloadedAt: Date.now() }).catch(() => {});
      renderAyahs();
    } else {
      container.innerHTML = '<p>تعذر تحميل السورة</p>';
    }
  } catch (e) {
    container.innerHTML = '<p>خطأ في الاتصال. تحقق من الإنترنت.</p>';
  }
}

function renderAyahs() {
  const container = $('#ayahsContainer');
  let html = '';
  const num = state.currentSurah;
  if (num !== 1 && num !== 9) {
    html += `<div class="bismillah">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>`;
  }
  state.currentAyahs.forEach(a => {
    html += `<div class="ayah" data-ayah="${a.numberInSurah}">
      <span class="ayah-number">${a.numberInSurah}</span> ${a.text}
      ${state.showTranslation && a.translation ? `<span class="ayah-trans">${a.translation}</span>` : ''}
    </div>`;
  });
  container.innerHTML = html;
  container.querySelectorAll('.ayah').forEach((element, index) => {
    element.onclick = () => {
      stopAudio();
      currentAudioIndex = index;
      $('#playAudio').classList.add('hidden');
      $('#stopAudio').classList.remove('hidden');
      playNextAyah();
    };
  });
}

function updateFavButton() {
  const btn = $('#favSurahBtn');
  if (!btn) return;
  const isFav = state.favorites.includes(state.currentSurah);
  btn.innerHTML = isFav ? '<i class="fas fa-star" style="color:#f59e0b"></i>' : '<i class="far fa-star"></i>';
}

function toggleFavorite() {
  if (!state.currentSurah) return;
  const idx = state.favorites.indexOf(state.currentSurah);
  if (idx >= 0) state.favorites.splice(idx, 1);
  else state.favorites.push(state.currentSurah);
  saveState();
  updateFavButton();
}

let currentAudioIndex = 0;
async function downloadCurrentAudio() {
  if (!state.currentAyahs.length) { setOfflineProgress(0, 'افتح سورة أولًا ثم اختر تنزيل صوت السورة.'); return; }
  if (!window.RedroOffline) { setOfflineProgress(0, 'التخزين الصوتي غير متاح على هذا الجهاز.'); return; }
  if (!window.confirm('سيتم تنزيل صوت السورة الحالية للقارئ المختار. هل تريد المتابعة؟')) return;
  const reader = (state.settings && state.settings.quranReciter) || 'ar.alafasy';
  try {
    for (let i = 0; i < state.currentAyahs.length; i += 1) {
      const url = `https://cdn.islamic.network/quran/audio/128/${reader}/${state.currentAyahs[i].number}.mp3`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('audio-download-failed');
      await RedroOffline.cacheAudio(url, response);
      setOfflineProgress(((i + 1) / state.currentAyahs.length) * 100, `تم تنزيل صوت الآية ${i + 1} من ${state.currentAyahs.length}`);
    }
    setOfflineProgress(100, 'تم تنزيل صوت السورة للقارئ المختار.');
  } catch (error) { console.error('Offline audio download error', error); setOfflineProgress(0, 'تعذر تنزيل الصوت. تحقق من الإنترنت ثم أعد المحاولة.'); }
}
async function exportOfflineBackup() {
  const surahs = window.RedroOffline ? await RedroOffline.getAllSurahs() : [];
  const backup = { version: 1, exportedAt: new Date().toISOString(), localStorage: {}, surahs: surahs };
  for (let i = 0; i < localStorage.length; i += 1) { const key = localStorage.key(i); backup.localStorage[key] = localStorage.getItem(key); }
  const blob = new Blob([JSON.stringify(backup)], { type: 'application/json' }); const link = document.createElement('a');
  link.href = URL.createObjectURL(blob); link.download = `redro-islamic-backup-${Date.now()}.json`; link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000); setOfflineProgress(100, 'تم تصدير النسخة الاحتياطية. الصوت لا يُضمّن لصغر حجم الملف.');
}
async function importOfflineBackup(file) {
  try {
    const text = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsText(file); });
    const backup = JSON.parse(text);
    Object.keys(backup.localStorage || {}).forEach(key => localStorage.setItem(key, backup.localStorage[key]));
    if (window.RedroOffline) for (let i = 0; i < (backup.surahs || []).length; i += 1) await RedroOffline.putSurah(backup.surahs[i]);
    loadState(); setupQuranReciter(); refreshOfflineStatus(); setOfflineProgress(100, 'تم استيراد النسخة الاحتياطية.');
  } catch (error) { console.error('Backup import error', error); setOfflineProgress(0, 'ملف النسخة الاحتياطية غير صالح.'); }
}
function playSurahAudio() {
  if (!state.currentAyahs.length) return;
  stopAudio();
  currentAudioIndex = 0;
  $('#playAudio').classList.add('hidden');
  $('#stopAudio').classList.remove('hidden');
  $('#audioStatus').classList.remove('hidden');
  playNextAyah();
}

async function playNextAyah() {
  if (currentAudioIndex >= state.currentAyahs.length) {
    stopAudio();
    return;
  }
  const ayah = state.currentAyahs[currentAudioIndex];
  const reader = (state.settings && state.settings.quranReciter) || 'ar.alafasy';
  const audioUrl = `https://cdn.islamic.network/quran/audio/128/${reader}/${ayah.number}.mp3`;
  const audioIndex = currentAudioIndex;
  let playableUrl = audioUrl;
  if (window.RedroOffline) {
    const cachedUrl = await RedroOffline.getCachedAudio(audioUrl).catch(() => null);
    if (cachedUrl) { playableUrl = cachedUrl; state.audioObjectUrl = cachedUrl; }
  }
  if (audioIndex !== currentAudioIndex) return;
  state.audio = new Audio(playableUrl);
  $('#audioStatus').textContent = `جاري تشغيل الآية ${ayah.numberInSurah}...`;
  state.audio.play().catch(() => {
    $('#audioStatus').textContent = 'تعذر تشغيل الصوت';
  });
  state.audio.onended = () => {
    currentAudioIndex++;
    playNextAyah();
  };
}

function stopAudio() {
  if (state.audio) {
    state.audio.pause();
    state.audio = null;
  }
  if (state.audioObjectUrl) { URL.revokeObjectURL(state.audioObjectUrl); state.audioObjectUrl = null; }
  $('#playAudio').classList.remove('hidden');
  $('#stopAudio').classList.add('hidden');
  $('#audioStatus').classList.add('hidden');
}

async function showTafsir() {
  const box = $('#tafsirBox');
  if (!box || !state.currentSurah) return;
  const modal = document.getElementById('tafsirModal');
  const list = document.getElementById('tafsirFullList');
  const search = document.getElementById('tafsirSearch');
  const surah = SURAH_NAMES.find(s => s.number === state.currentSurah);
  if (!modal || !list) return;
  modal.classList.remove('hidden');
  document.getElementById('tafsirSurahName').textContent = surah ? surah.name : '';
  list.innerHTML = '<p class="tafsir-loading">جاري تحميل تفسير جميع الآيات...</p>';
  if (search) search.value = '';
  try {
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${state.currentSurah}/ar.muyassar`, { cache: 'no-store' });
    const data = await res.json();
    if (data.code === 200) {
      const records = data.data.ayahs.map(a => ({ number: a.numberInSurah, text: a.text }));
      const render = term => {
        const q = (term || '').trim().toLowerCase();
        const filtered = records.filter(a => !q || String(a.number).indexOf(q) >= 0 || a.text.toLowerCase().indexOf(q) >= 0);
        list.innerHTML = filtered.length ? filtered.map(a => `<article class="tafsir-ayah"><div class="tafsir-ayah-number">آية ${a.number}</div><p>${a.text}</p></article>`).join('') : '<p class="tafsir-empty">لا توجد نتائج مطابقة.</p>';
      };
      render('');
      if (search) search.oninput = () => render(search.value);
    } else {
      list.innerHTML = '<p>تعذر تحميل التفسير حالياً. تحقق من اتصال الإنترنت ثم اضغط الزر مرة أخرى.</p>';
    }
  } catch (error) {
    console.error('Tafsir loading error', error);
    list.innerHTML = '<p>تعذر الاتصال بخدمة التفسير. جرّب لاحقاً.</p>';
  }
}

// ==================== Azkar ====================
function renderAzkarCategories() {
  const cont = $('#azkarCategories');
  cont.innerHTML = '';
  const keys = Object.keys(AZKAR_DATA);
  const featuredKeys = ['api_27', 'api_28', 'api_1', 'api_25'].filter(key => AZKAR_DATA[key]);
  cont.innerHTML = `
    <div class="azkar-landing-hero">
      <div class="azkar-hero-icon"><i class="fas fa-book-open"></i></div>
      <div><h3>حصن المسلم</h3><p>أذكار صحيحة من الكتاب والسنة، مرتبة وسهلة القراءة</p></div>
      <div class="azkar-source-badge"><i class="fas fa-shield-halved"></i> مصدر موثوق</div>
    </div>
    <div class="azkar-landing-tools">
      <label class="azkar-search"><i class="fas fa-search"></i><input id="azkarCategorySearch" type="search" placeholder="ابحث في أبواب الأذكار..." aria-label="البحث في أبواب الأذكار"></label>
      <button class="azkar-complete-all" id="completeAllAzkar"><i class="fas fa-list-check"></i> إكمال الكل</button>
    </div>
    <div class="azkar-section-label"><span>الأذكار اليومية</span><small>الأكثر استخدامًا</small></div>
    <div class="azkar-featured-grid" id="azkarFeaturedGrid"></div>
    <div class="azkar-section-label all"><span>جميع أبواب حصن المسلم</span><small>${keys.length} بابًا</small></div>
    <div class="azkar-all-list" id="azkarAllList"></div>
  `;
  const featured = $('#azkarFeaturedGrid');
  const all = $('#azkarAllList');
  const makeButton = (key, featuredMode) => {
    const cat = AZKAR_DATA[key];
    const btn = document.createElement('button');
    btn.className = featuredMode ? 'azkar-featured-card' : 'azkar-list-row';
    btn.dataset.search = cat.title.toLowerCase();
    btn.innerHTML = featuredMode
      ? `<span class="azkar-featured-icon"><i class="fas ${cat.icon}"></i></span><span class="azkar-card-copy"><strong>${cat.title}</strong><small>${cat.items.length} أذكار</small></span><i class="fas fa-chevron-left azkar-arrow"></i>`
      : `<span class="azkar-list-icon"><i class="fas ${cat.icon}"></i></span><span><strong>${cat.title}</strong><small>${cat.items.length} أذكار</small></span><i class="fas fa-chevron-left azkar-arrow"></i>`;
    btn.onclick = () => showAzkarList(key);
    return btn;
  };
  featuredKeys.forEach(key => featured.appendChild(makeButton(key, true)));
  keys.filter(key => !featuredKeys.includes(key)).forEach(key => all.appendChild(makeButton(key, false)));
  $('#completeAllAzkar').onclick = () => {
    if (!window.confirm('تحديد جميع الأذكار في كل الأقسام كمكتملة؟')) return;
    keys.forEach(key => AZKAR_DATA[key].items.forEach((item, idx) => { state.azkarProgress[`${key}_${idx}`] = item.count; }));
    saveState(); updateDailyProgress(); renderAzkarCategories();
  };
  $('#azkarCategorySearch').oninput = (event) => {
    const query = event.target.value.trim().toLowerCase();
    [featured, all].forEach(list => list.querySelectorAll('button').forEach(btn => { btn.classList.toggle('hidden', query && !btn.dataset.search.includes(query)); }));
  };
}

function showAzkarList(key) {
  const cat = AZKAR_DATA[key];
  state.azkarCategory = key;
  if (!Number.isInteger(state.azkarReaderIndex)) state.azkarReaderIndex = 0;
  $('#azkarCatTitle').textContent = cat.title;
  $('#azkarCategories').classList.add('hidden');
  $('#azkarListView').classList.remove('hidden');
  $('#azkar').classList.add('azkar-reading-active');
  const items = $('#azkarItems');
  items.innerHTML = '';
  const visibleItems = state.azkarViewMode === 'short'
    ? cat.items.filter((item, idx) => item.short === true || idx < Math.min(5, cat.items.length))
    : cat.items;
  state.azkarReaderIndex = Math.max(0, Math.min(visibleItems.length - 1, state.azkarReaderIndex));
  const item = visibleItems[state.azkarReaderIndex];
  const idx = cat.items.indexOf(item);
  const progKey = `${key}_${idx}`;
  const current = state.azkarProgress[progKey] || 0;
  const completed = cat.items.filter((entry, entryIdx) => (state.azkarProgress[`${key}_${entryIdx}`] || 0) >= entry.count).length;
  const evidence = item.ref || getAzkarEvidence(key, idx, item);
  const sourceLink = item.sourceUrl ? `<a class="azkar-source-link" href="${item.sourceUrl}" target="_blank" rel="noopener">فتح المصدر الأصلي</a>` : '';
  const div = document.createElement('article');
  div.className = 'azkar-reader-card';
  div.innerHTML = `
    <div class="azkar-reader-progress">${state.azkarReaderIndex + 1} / ${visibleItems.length}</div>
    <div class="azkar-text">${item.text}</div>
    <button class="evidence-toggle" type="button" aria-expanded="true"><i class="fas fa-chevron-up"></i> إخفاء الدليل</button>
    <div class="azkar-evidence"><i class="fas fa-book-open"></i> ${evidence}<br>${sourceLink}</div>
    <div class="azkar-count-area">
      <div class="azkar-total"><span>إجمالي الأذكار</span><strong>${completed}/${cat.items.length}</strong></div>
      <button class="reader-count-btn" aria-label="تسبيح الذكر" data-key="${progKey}" data-max="${item.count}">${current}<small> / ${item.count}</small></button>
      <div class="azkar-repeat"><span>عدد مرات الذكر</span><strong>${item.count}</strong></div>
    </div>
    <div class="azkar-reader-actions">
      <button class="reader-action" data-action="prev"><i class="fas fa-chevron-right"></i><span>السابق</span></button>
      <button class="reader-action primary" data-action="next"><i class="fas fa-chevron-left"></i><span>التالي</span></button>
      <button class="reader-action" data-action="reset"><i class="fas fa-rotate-left"></i><span>إعادة</span></button>
      <button class="reader-action" data-action="complete"><i class="fas fa-check"></i><span>إكمال</span></button>
    </div>
  `;
  items.appendChild(div);

  const evidenceBtn = div.querySelector('.evidence-toggle');
  evidenceBtn.onclick = () => {
    const box = div.querySelector('.azkar-evidence');
    const hidden = box.classList.toggle('hidden');
    evidenceBtn.innerHTML = hidden ? '<i class="fas fa-chevron-down"></i> إظهار الدليل' : '<i class="fas fa-chevron-up"></i> إخفاء الدليل';
  };
  div.querySelector('.reader-count-btn').onclick = () => {
    state.azkarProgress[progKey] = Math.min((state.azkarProgress[progKey] || 0) + 1, item.count);
    saveState(); updateDailyProgress(); showAzkarList(key);
  };
  div.querySelectorAll('.reader-action').forEach(btn => btn.onclick = () => {
    const action = btn.dataset.action;
    if (action === 'prev') state.azkarReaderIndex = Math.max(0, state.azkarReaderIndex - 1);
    if (action === 'next') state.azkarReaderIndex = Math.min(visibleItems.length - 1, state.azkarReaderIndex + 1);
    if (action === 'reset') state.azkarProgress[progKey] = 0;
    if (action === 'complete') state.azkarProgress[progKey] = item.count;
    saveState(); updateDailyProgress(); showAzkarList(key);
  });

  let startX = null;
  items.ontouchstart = (e) => { if (e.touches.length === 1) startX = e.touches[0].clientX; };
  items.ontouchend = (e) => {
    if (startX === null) return;
    const delta = e.changedTouches[0].clientX - startX;
    startX = null;
    if (Math.abs(delta) < 45) return;
    state.azkarReaderIndex = Math.max(0, Math.min(visibleItems.length - 1, state.azkarReaderIndex + (delta < 0 ? 1 : -1)));
    showAzkarList(key);
  };
}

function getAzkarEvidence(category, index, item) {
  if (category === 'morning' && index === 0) return 'دعاء الصباح الثابت في صحيح مسلم، كتاب الذكر والدعاء.';
  if (category === 'morning' && index >= 3 && index <= 5) return 'سور الإخلاص والفلق والناس؛ وهي من القرآن الكريم، وتُقرأ في أذكار الصباح والمساء.';
  if (category === 'evening' && index === 0) return 'دعاء المساء الوارد في أذكار اليوم والليلة؛ راجع صحيح مسلم في أذكار الصباح والمساء.';
  if (category === 'sleep') return 'من أذكار النوم الواردة في كتب السنة الصحيحة؛ راجع حصن المسلم وتخريجه.';
  if (category === 'afterPrayer') return 'من الأذكار الثابتة بعد الصلاة؛ راجع صحيح مسلم، كتاب المساجد ومواضع الصلاة.';
  if (item.text.indexOf('آية الكرسي') !== -1) return 'سورة البقرة، الآية 255.';
  return 'ذكر من الأذكار المأثورة. يظهر التخريج التفصيلي عندما يكون مثبتًا في بيانات الذكر.';
}

// ==================== Sebha ====================
function updateSebhaUI() {
  const p = SEBHA_PHRASES[state.sebha.index];
  $('#sebhaPhrase').textContent = p.text;
  $('#sebhaCount').textContent = state.sebha.count;
  $('#sebhaTarget').textContent = p.target;
  const progressText = $('#sebhaProgressText');
  if (progressText) progressText.textContent = `${Math.min(state.sebha.count, p.target)} من ${p.target}`;
  const goalMessage = $('#sebhaGoalMessage');
  if (goalMessage) goalMessage.classList.toggle('hidden', state.sebha.count < p.target);
  const ring = $('#sebhaRing');
  if (ring) ring.style.setProperty('--progress', `${Math.min(100, (state.sebha.count / p.target) * 100)}%`);
  $('#sebhaHadith').innerHTML = `<p>${p.hadith}</p>`;
}

function resetAppSettings() {
  if (!window.confirm('إعادة الإعدادات الافتراضية؟ لن يتم حذف المصحف أو البيانات المنزلة.')) return;
  state.settings = { theme: 'dark', sound: true, vibration: true, notifications: false, reciter: 'mishary', quranReciter: 'ar.alafasy', prayerNotifications: { ...DEFAULT_PRAYER_NOTIFICATIONS } };
  persistSettings(); applyTheme(); openSettings(); updateNotificationStatus('تمت إعادة الإعدادات الافتراضية.');
}

function sebhaTap() {
  state.sebha.count++;
  const p = SEBHA_PHRASES[state.sebha.index];
  if (state.sebha.count >= p.target) {
    // Vibrate if available
    if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
  }
  updateSebhaUI();
  saveState();
}

// ==================== Qibla ====================
function initQibla() {
  const angle = calculateQibla(state.location.lat, state.location.lng);
  state.qiblaAngle = angle;
  $('#qiblaAngle').textContent = angle.toFixed(1) + '°';
  const dist = haversine(state.location.lat, state.location.lng, KAABA.lat, KAABA.lng);
  $('#qiblaDistance').textContent = Math.round(dist) + ' كم';

  // Try device orientation
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    window.addEventListener('deviceorientation', handleOrientation, true);
  }
  updateCompass(0);
}

function handleOrientation(e) {
  let heading = e.absolute ? e.alpha : (e.webkitCompassHeading || e.alpha);
  if (heading == null) return;
  state.deviceHeading = heading;
  updateCompass(heading);
}

function updateCompass(heading) {
  // Needle points to north relative to device, we rotate so that qibla is up when facing it
  const rotation = state.qiblaAngle - heading;
  $('#needle').style.transform = `translate(-50%, -100%) rotate(${rotation}deg)`;
  $('#kaabaMarker').style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
}

// ==================== Zakat ====================
function renderZakatFields(type) {
  const fields = $('#zakatFields');
  const nisab = $('#nisabInfo');
  let html = '';
  if (type === 'money' || type === 'trade' || type === 'stocks') {
    html = `
      <div class="form-group">
        <label>${type === 'money' ? 'المبلغ النقدي' : type === 'trade' ? 'قيمة عروض التجارة' : 'قيمة الأسهم / الصناديق'}</label>
        <input type="number" id="zakatAmount" placeholder="أدخل القيمة" min="0">
      </div>`;
    nisab.textContent = 'النصاب ≈ قيمة 85 جرام ذهب عيار 24 (حوالي 2.5% بعد حولان الحول)';
  } else if (type === 'gold') {
    html = `
      <div class="form-group">
        <label>وزن الذهب (جرام)</label>
        <input type="number" id="zakatAmount" placeholder="الوزن بالجرام" min="0">
      </div>
      <div class="form-group">
        <label>عيار الذهب</label>
        <select id="goldKarat">
          <option value="24">24 قيراط (خالص)</option>
          <option value="22">22 قيراط</option>
          <option value="21">21 قيراط</option>
          <option value="18">18 قيراط</option>
        </select>
      </div>`;
    nisab.textContent = 'نصاب الذهب = 85 جرام عيار 24 (أو ما يعادله من العيارات الأخرى)';
  } else if (type === 'silver') {
    html = `
      <div class="form-group">
        <label>وزن الفضة (جرام)</label>
        <input type="number" id="zakatAmount" placeholder="الوزن بالجرام" min="0">
      </div>`;
    nisab.textContent = 'نصاب الفضة = 595 جرام تقريباً';
  } else if (type === 'livestock') {
    html = `
      <div class="form-group">
        <label>نوع الأنعام</label>
        <select id="livestockType">
          <option value="sheep">الغنم (شياه)</option>
          <option value="cows">البقر</option>
          <option value="camels">الإبل</option>
        </select>
      </div>
      <div class="form-group">
        <label>العدد</label>
        <input type="number" id="zakatAmount" placeholder="عدد الرؤوس" min="0">
      </div>`;
    nisab.textContent = 'للغنم: النصاب 40. للبقر: 30. للإبل: 5. (جداول مفصلة حسب العدد)';
  } else if (type === 'crops') {
    html = `
      <div class="form-group">
        <label>نوع الري</label>
        <select id="irrigationType">
          <option value="natural">بعلاً (مطر / أنهار) - 10%</option>
          <option value="irrigated">مسقي (آلات) - 5%</option>
        </select>
      </div>
      <div class="form-group">
        <label>كمية المحصول (كجم أو قيمة)</label>
        <input type="number" id="zakatAmount" placeholder="الكمية أو القيمة" min="0">
      </div>`;
    nisab.textContent = 'نصاب الزروع والثمار ≈ 653 كجم (5 أوسق). العشر أو نصف العشر حسب الري.';
  }
  fields.innerHTML = html;
}

function calcZakat() {
  const type = document.querySelector('.zakat-tab.active')?.dataset.type || 'money';
  const amount = parseFloat($('#zakatAmount')?.value) || 0;
  let zakat = 0;
  let extra = '';
  let label = 'الزكاة المستحقة';

  if (type === 'money' || type === 'trade' || type === 'stocks') {
    zakat = amount * 0.025;
    label = 'الزكاة (2.5%)';
  } else if (type === 'gold') {
    const karat = parseInt($('#goldKarat')?.value) || 24;
    const pureGrams = amount * (karat / 24);
    if (pureGrams >= 85) {
      zakat = pureGrams * 0.025; // in grams of pure gold
      extra = `≈ ${(pureGrams * 0.025).toFixed(2)} جرام ذهب خالص`;
      label = 'الزكاة بالذهب';
    } else {
      extra = 'لم يبلغ النصاب (85 جرام عيار 24)';
    }
  } else if (type === 'silver') {
    if (amount >= 595) {
      zakat = amount * 0.025;
      extra = `≈ ${(amount * 0.025).toFixed(1)} جرام فضة`;
      label = 'الزكاة بالفضة';
    } else {
      extra = 'لم يبلغ النصاب (595 جرام تقريباً)';
    }
  } else if (type === 'livestock') {
    const kind = $('#livestockType')?.value || 'sheep';
    const n = amount;
    if (kind === 'sheep') {
      if (n < 40) extra = 'أقل من النصاب (40)';
      else if (n < 121) { zakat = 1; extra = 'شاة واحدة'; }
      else if (n < 201) { zakat = 2; extra = 'شاتان'; }
      else if (n < 401) { zakat = 3; extra = 'ثلاث شياه'; }
      else { zakat = Math.floor(n / 100); extra = `${zakat} شياه (تقريبي)`; }
      label = 'الزكاة';
    } else if (kind === 'cows') {
      if (n < 30) extra = 'أقل من النصاب (30)';
      else if (n < 40) { zakat = 1; extra = 'تبيع (عجل)'; }
      else if (n < 60) { zakat = 1; extra = 'مسنة'; }
      else { zakat = Math.floor(n / 30); extra = `تقريباً ${zakat} من الأبقار`; }
      label = 'الزكاة';
    } else { // camels
      if (n < 5) extra = 'أقل من النصاب (5)';
      else if (n < 10) { zakat = 1; extra = 'شاة'; }
      else if (n < 15) { zakat = 2; extra = 'شاتان'; }
      else if (n < 20) { zakat = 3; extra = 'ثلاث شياه'; }
      else if (n < 25) { zakat = 4; extra = 'أربع شياه'; }
      else { extra = 'جدول مفصل حسب العدد (استشر عالماً)'; }
      label = 'الزكاة';
    }
  } else if (type === 'crops') {
    const rate = $('#irrigationType')?.value === 'natural' ? 0.1 : 0.05;
    zakat = amount * rate;
    label = `الزكاة (${rate * 100}%)`;
    extra = rate === 0.1 ? 'عشر المحصول (ري طبيعي)' : 'نصف العشر (ري بالآلات)';
  }

  $('#zakatValue').textContent = typeof zakat === 'number' && zakat % 1 !== 0 ? zakat.toFixed(2) : zakat;
  $('#zakatLabel').textContent = label;
  $('#zakatExtra').textContent = extra;
}

// ==================== Deeds ====================
function renderDeeds() {
  const list = $('#deedsList');
  list.innerHTML = '';
  DEEDS_LIST.forEach((text, i) => {
    const done = state.deeds[i];
    const div = document.createElement('div');
    div.className = 'deed-item' + (done ? ' done' : '');
    div.innerHTML = `
      <div class="deed-check">${done ? '<i class="fas fa-check"></i>' : ''}</div>
      <div class="deed-text">${text}</div>
    `;
    div.onclick = () => {
      state.deeds[i] = !state.deeds[i];
      saveState();
      renderDeeds();
  renderKunuzList();
      updateDailyProgress();
    };
    list.appendChild(div);
  });
  updateDailyProgress();
}

function updateDailyProgress() {
  const done = state.deeds.filter(Boolean).length;
  const total = DEEDS_LIST.length;
  const pct = Math.round((done / total) * 100);
  $('#deedsPercent').textContent = pct + '%';
  $('#deedsCountText').textContent = `${done} من ${total} مهمة`;
  $('#dailyProgress').style.width = pct + '%';
  $('#progressText').textContent = `${done} / ${total} مهام مكتملة`;
}

// ==================== Location ====================
function nativeGeolocation() { return window.Capacitor?.Plugins?.Geolocation || null; }
async function applyLocationCoordinates(latitude, longitude) {
  state.location.lat = latitude;
  state.location.lng = longitude;
  try {
    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=ar`);
    const data = await res.json();
    state.location.name = `${data.city || data.locality || ''}, ${data.countryName || ''}`.trim() || 'موقعك الحالي';
  } catch {
    state.location.name = 'موقعك الحالي';
  }
  $('#locationName').textContent = state.location.name;
  localStorage.setItem('redro_location', JSON.stringify(state.location));
  await fetchPrayerTimes();
  if (state.settings?.notifications) await schedulePrayerNotifications();
  if (state.currentSection === 'qibla') initQibla();
}
async function getLocation() {
  const native = nativeGeolocation();
  try {
    if (native) {
      let permissions = await native.checkPermissions();
      if (permissions.location !== 'granted' && permissions.coarseLocation !== 'granted') {
        permissions = await native.requestPermissions();
      }
      if (permissions.location !== 'granted' && permissions.coarseLocation !== 'granted') {
        alert('لم يتم السماح بالوصول إلى الموقع. فعّل إذن الموقع من إعدادات التطبيق.');
        return;
      }
      const position = await native.getCurrentPosition({ enableHighAccuracy: true, timeout: 15000, maximumAge: 300000 });
      await applyLocationCoordinates(position.coords.latitude, position.coords.longitude);
      return;
    }
    if (!navigator.geolocation) throw new Error('geolocation-unavailable');
    navigator.geolocation.getCurrentPosition(
      position => applyLocationCoordinates(position.coords.latitude, position.coords.longitude),
      () => alert('تعذر الحصول على الموقع. تحقق من صلاحية الموقع وفعّل GPS، وسيتم استخدام حلب افتراضياً.'),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 300000 }
    );
  } catch (error) {
    console.error('Location error', error);
    alert('تعذر الحصول على الموقع. افتح إعدادات التطبيق واسمح بالموقع ثم أعد المحاولة.');
  }
}

// ==================== Init ====================
function init() {
  const savedLocation = localStorage.getItem('redro_location');
  if (savedLocation) { try { state.location = { ...state.location, ...JSON.parse(savedLocation) }; } catch (_) {} }
  loadState();
  useTrustedAdhkarApiData();
  renderSurahList();
  renderAzkarCategories();
  renderDeeds();
  renderKunuzList();
  setupQuranReciter();
  updateSebhaUI();

  // Events
  $$('.nav-item').forEach(btn => {
    btn.onclick = () => {
      const sec = btn.dataset.section;
      if (sec === 'more') {
        $('#moreMenu').classList.remove('hidden');
      } else {
        showSection(sec);
      }
    };
  });

  $$('.action-card').forEach(btn => {
    btn.onclick = () => showSection(btn.dataset.section);
  });

  $$('.back-btn').forEach(btn => {
    if (btn.dataset.back) {
      btn.onclick = () => showSection(btn.dataset.back);
    }
  });

  $('#backToSurahs').onclick = () => {
    $('#ayahView').classList.add('hidden');
    $('#surahList').classList.remove('hidden');
  };

  $('#backToAzkarCats').onclick = () => {
    $('#azkarListView').classList.add('hidden');
    $('#azkarCategories').classList.remove('hidden');
    $('#azkar').classList.remove('azkar-reading-active');
  };

  $('#azkarFullTab').onclick = () => {
    state.azkarViewMode = 'full';
    $('#azkarFullTab').classList.add('active');
    $('#azkarShortTab').classList.remove('active');
    if (state.azkarCategory) showAzkarList(state.azkarCategory);
  };
  $('#azkarShortTab').onclick = () => {
    state.azkarViewMode = 'short';
    $('#azkarShortTab').classList.add('active');
    $('#azkarFullTab').classList.remove('active');
    if (state.azkarCategory) showAzkarList(state.azkarCategory);
  };

  $('#surahSearch').oninput = (e) => renderSurahList(e.target.value);

  $('#sebhaTap').onclick = sebhaTap;
  $('#sebhaReset').onclick = () => {
    if (!window.confirm('إعادة عداد المسبحة إلى صفر؟')) return;
    state.sebha.count = 0;
    updateSebhaUI();
    saveState();
  };
  $('#sebhaChange').onclick = () => {
    state.sebha.index = (state.sebha.index + 1) % SEBHA_PHRASES.length;
    state.sebha.count = 0;
    updateSebhaUI();
    saveState();
  };

  // Zakat tabs
  $$('.zakat-tab').forEach(tab => {
    tab.onclick = () => {
      $$('.zakat-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderZakatFields(tab.dataset.type);
    };
  });
  renderZakatFields('money');
  $('#calcZakat').onclick = calcZakat;

  // Quran controls
  $('#playAudio')?.addEventListener('click', playSurahAudio);
  $('#stopAudio')?.addEventListener('click', stopAudio);
  $('#toggleTranslation')?.addEventListener('click', () => {
    state.showTranslation = !state.showTranslation;
    renderAyahs();
  });
  $('#showTafsir')?.addEventListener('click', showTafsir);
  $('#favSurahBtn')?.addEventListener('click', toggleFavorite);

  $('#changeLocBtn').onclick = getLocation;

  // Top header buttons
  const menuBtn = document.getElementById("menuBtn");
  const profileBtn = document.getElementById("profileBtn");
  if (menuBtn) menuBtn.onclick = () => $("#moreMenu").classList.remove("hidden");
  if (profileBtn) profileBtn.onclick = () => {
    $("#aboutModal").classList.remove("hidden");
  };


  $('#closeMore').onclick = () => $('#moreMenu').classList.add('hidden');
  $('#closeAbout').onclick = () => $('#aboutModal').classList.add('hidden');
  $('#aboutBtn').onclick = () => {
    $('#moreMenu').classList.add('hidden');
    $('#aboutModal').classList.remove('hidden');
  };
  $('#settingsBtn').onclick = () => {
    $('#moreMenu').classList.add('hidden');
    openSettings();
  };

  $$('.more-item[data-section]').forEach(btn => {
    btn.onclick = () => {
      $('#moreMenu').classList.add('hidden');
      showSection(btn.dataset.section);
      if (btn.dataset.section === 'ramadan') initRamadan();
    };
  });

  // Start
  $('#locationName').textContent = state.location.name;
  fetchPrayerTimes();

  // Hide loading
  setTimeout(() => {
    if (window.redroLoadingDone) window.redroLoadingDone();
    $('#loading').classList.add('hidden');
    $('#app').classList.remove('hidden');
  }, 800);
}

// ==================== Ramadan ====================
function initRamadan() {
  if (state.prayerTimes) {
    $('#suhoorTime').textContent = formatTime(state.prayerTimes.Fajr);
    $('#iftarTime').textContent = formatTime(state.prayerTimes.Maghrib);
  }
  // Simple 30-day tracker
  const tracker = $('#fastingTracker');
  if (!tracker) return;
  tracker.innerHTML = '';
  for (let d = 1; d <= 30; d++) {
    const day = document.createElement('div');
    day.className = 'fast-day' + (state.fastingDays[d] ? ' done' : '');
    day.textContent = d;
    day.onclick = () => {
      state.fastingDays[d] = !state.fastingDays[d];
      day.classList.toggle('done');
      saveState();
    };
    tracker.appendChild(day);
  }
}



document.addEventListener('DOMContentLoaded', init);

// ==================== Settings, Adhan & Notifications ====================
const ADHAN_RECITERS = [
  { id: 'mishary', name: 'مشاري راشد العفاسي', url: 'https://cdn.aladhan.com/audio/adhans/a9.mp3' },
  { id: 'ahmad', name: 'أحمد النفيس', url: 'https://cdn.aladhan.com/audio/adhans/a1.mp3' },
  { id: 'mustafa', name: 'حافظ مصطفى أوزجان', url: 'https://cdn.aladhan.com/audio/adhans/a2.mp3' },
  { id: 'mansour', name: 'منصور الزهراني', url: 'https://cdn.aladhan.com/audio/adhans/a11-mansour-al-zahrani.mp3' },
  { id: 'dubai', name: 'مشاري راشد - أذان دبي', url: 'https://cdn.aladhan.com/audio/adhans/a4.mp3' }
];
const PRAYER_LABELS = { Fajr: 'الفجر', Dhuhr: 'الظهر', Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء' };
const PRAYER_CHANNEL_ID = 'prayer-times-v3-adhan';
const DEFAULT_PRAYER_NOTIFICATIONS = { Fajr: true, Dhuhr: true, Asr: true, Maghrib: true, Isha: true };
state.settings = {
  theme: localStorage.getItem('redro_theme') || 'dark',
  sound: localStorage.getItem('redro_sound') !== 'false',
  vibration: localStorage.getItem('redro_vibration') !== 'false',
  notifications: localStorage.getItem('redro_notifications') === 'true',
  reciter: localStorage.getItem('redro_reciter') || 'mishary',
  quranReciter: localStorage.getItem('redro_quran_reciter') || 'ar.alafasy',
  prayerNotifications: { ...DEFAULT_PRAYER_NOTIFICATIONS }
};
try { state.settings = { ...state.settings, ...JSON.parse(localStorage.getItem('redro_settings') || '{}') }; } catch (_) {}
state.settings.prayerNotifications = { ...DEFAULT_PRAYER_NOTIFICATIONS, ...(state.settings.prayerNotifications || {}) };

function persistSettings() {
  localStorage.setItem('redro_settings', JSON.stringify(state.settings));
  localStorage.setItem('redro_theme', state.settings.theme);
  localStorage.setItem('redro_sound', String(state.settings.sound));
  localStorage.setItem('redro_vibration', String(state.settings.vibration));
  localStorage.setItem('redro_notifications', String(state.settings.notifications));
  localStorage.setItem('redro_reciter', state.settings.reciter);
  localStorage.setItem('redro_quran_reciter', state.settings.quranReciter || 'ar.alafasy');
}
function applyTheme() { document.documentElement.setAttribute('data-theme', state.settings.theme); persistSettings(); }
function isNativeAndroid() { return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()); }
function nativeLocalNotifications() { return window.Capacitor?.Plugins?.LocalNotifications || null; }
function renderPrayerNotificationToggles() {
  const box = document.getElementById('prayerNotificationToggles'); if (!box) return;
  box.innerHTML = Object.entries(PRAYER_LABELS).map(([key, label]) => `<label class="mini-toggle"><span>${label}</span><input type="checkbox" data-prayer="${key}" ${state.settings.prayerNotifications[key] ? 'checked' : ''}><span class="toggle-ui"></span></label>`).join('');
  box.querySelectorAll('input[data-prayer]').forEach(input => input.onchange = () => { state.settings.prayerNotifications[input.dataset.prayer] = input.checked; persistSettings(); if (state.settings.notifications) schedulePrayerNotifications(); });
}
function openSettings() {
  const modal = document.getElementById('settingsModal'); if (!modal) return;
  modal.classList.remove('hidden');
  const settingsSearch = document.getElementById('settingsSearch');
  if (settingsSearch) { settingsSearch.value = ''; document.querySelectorAll('#settingsModal .settings-section').forEach(section => section.classList.remove('hidden')); }
  document.getElementById('notificationsEnabled').checked = !!state.settings.notifications;
  document.getElementById('vibrationEnabled').checked = !!state.settings.vibration;
  document.getElementById('soundEnabled').checked = !!state.settings.sound;
  const select = document.getElementById('adhanReciter');
  select.innerHTML = ADHAN_RECITERS.map(r => `<option value="${r.id}">${r.name}</option>`).join(''); select.value = state.settings.reciter;
  updateSelectedAdhanReciter();
  renderPrayerNotificationToggles(); updateNotificationStatus();
}
function updateSelectedAdhanReciter() {
  const select = document.getElementById('adhanReciter');
  const label = document.getElementById('selectedAdhanReciter');
  if (!select || !label) return;
  const selected = ADHAN_RECITERS.find(r => r.id === select.value) || ADHAN_RECITERS[0];
  label.innerHTML = `<i class="fas fa-check-circle"></i> المؤذن المختار: <strong>${selected.name}</strong>`;
}
function updateNotificationStatus(message) {
  const el = document.getElementById('notificationStatus'); if (!el) return;
  el.textContent = message || (isNativeAndroid() ? 'سيتم جدولة الإشعارات محلياً على الهاتف.' : 'في نسخة الويب يلزم إبقاء الصفحة مفتوحة؛ APK يدعم الجدولة بالخلفية.');
}
async function requestNotificationPermission() {
  const plugin = nativeLocalNotifications();
  if (plugin) {
    let permission = await plugin.checkPermissions();
    if (permission.display !== 'granted') permission = await plugin.requestPermissions();
    return permission.display === 'granted';
  }
  if ('Notification' in window) { const p = await Notification.requestPermission(); return p === 'granted'; }
  return false;
}
async function updatePermissionSetupUI() {
  const notificationStatus = document.getElementById('notificationPermissionStatus');
  const locationStatus = document.getElementById('locationPermissionStatus');
  const plugin = nativeLocalNotifications();
  if (notificationStatus && plugin) {
    const permission = await plugin.checkPermissions().catch(() => ({ display: 'prompt' }));
    notificationStatus.textContent = permission.display === 'granted' ? 'تم السماح بالإشعارات.' : 'مطلوب لإظهار إشعار الأذان وتشغيل صوته.';
  } else if (notificationStatus && 'Notification' in window) {
    notificationStatus.textContent = Notification.permission === 'granted' ? 'تم السماح بإشعارات المتصفح.' : 'مطلوب لإظهار إشعار الأذان.';
  }
  if (locationStatus) locationStatus.textContent = localStorage.getItem('redro_location') ? 'تم حفظ موقعك ومواقيت الصلاة.' : 'مطلوب لحساب مواقيت الصلاة حسب موقعك.';
}
function showPermissionSetup() {
  if (!isNativeAndroid() || localStorage.getItem('redro_permission_setup_done') === 'true') return;
  const modal = document.getElementById('permissionSetupModal');
  if (!modal) return;
  modal.classList.remove('hidden'); updatePermissionSetupUI();
}
async function setupNotificationsFromPrompt() {
  const ok = await requestNotificationPermission();
  state.settings.notifications = ok; persistSettings();
  const status = document.getElementById('permissionSetupStatus');
  if (status) status.textContent = ok ? 'تم تفعيل الإشعارات. اضغط تفعيل الموقع لإكمال الإعداد.' : 'لم يتم منح الإشعارات. يمكنك تفعيلها لاحقًا من إعدادات الهاتف.';
  updatePermissionSetupUI();
  if (ok && state.prayerTimes) await schedulePrayerNotifications();
}
async function setupLocationFromPrompt() {
  const status = document.getElementById('permissionSetupStatus');
  await getLocation();
  updatePermissionSetupUI();
  if (status) status.textContent = localStorage.getItem('redro_location') ? 'تم تفعيل الموقع وتحديث مواقيت الصلاة.' : 'لم يتم منح الموقع. يمكنك تفعيله لاحقًا من الإعدادات.';
}
function finishPermissionSetup() {
  localStorage.setItem('redro_permission_setup_done', 'true');
  document.getElementById('permissionSetupModal')?.classList.add('hidden');
  if (state.settings.notifications && state.prayerTimes) schedulePrayerNotifications();
}
function prayerDate(date, time) { const [h, m] = time.split(':').map(Number); const d = new Date(date); d.setHours(h, m, 0, 0); return d; }
async function schedulePrayerNotifications() {
  const plugin = nativeLocalNotifications();
  if (!plugin || !state.prayerTimes || !state.settings.notifications) { updateNotificationStatus('الإشعارات مفعلة. افتح التطبيق دورياً على الويب، أو استخدم APK للجدولة بالخلفية.'); return; }
  try {
    // قناة جديدة ضرورية لأن Android لا يغيّر صوت القناة بعد إنشائها.
    if (plugin.deleteChannel) { for (const oldId of ['prayer-times', 'prayer-times-v2']) { try { await plugin.deleteChannel({ id: oldId }); } catch (_) {} } }
    await plugin.createChannel({ id: PRAYER_CHANNEL_ID, name: 'مواقيت الصلاة والأذان', description: 'إشعارات الأذان ومواقيت الصلاة', importance: 5, sound: 'adhan', vibration: true, lights: true });
    await plugin.cancel({ notifications: Array.from({ length: 35 }, (_, i) => ({ id: 2100 + Math.floor(i / 5) * 10 + (i % 5) })) });
    const now = new Date(); const notifications = [];
    for (let day = 0; day < 7; day++) {
      const date = new Date(now); date.setDate(now.getDate() + day);
      let times = state.prayerTimes;
      if (day > 0) {
        try { const ds = `${String(date.getDate()).padStart(2,'0')}-${String(date.getMonth()+1).padStart(2,'0')}-${date.getFullYear()}`; const res = await fetch(`https://api.aladhan.com/v1/timings/${ds}?latitude=${state.location.lat}&longitude=${state.location.lng}&method=4`); const json = await res.json(); if (json.code === 200) times = json.data.timings; } catch (_) {}
      }
      Object.entries(PRAYER_LABELS).forEach(([key, label], index) => { if (state.settings.prayerNotifications[key] && times[key]) { const at = prayerDate(date, times[key]); if (at > new Date()) notifications.push({ id: 2100 + day * 10 + index, title: `حان الآن موعد صلاة ${label}`, body: `حي على الصلاة — ${state.location.name}`, schedule: { at, allowWhileIdle: true }, channelId: PRAYER_CHANNEL_ID, sound: 'adhan', extra: { prayer: key, reciter: state.settings.reciter } }); } });
    }
    await plugin.schedule({ notifications });
    updateNotificationStatus(`تمت جدولة ${notifications.length} إشعاراً للأيام السبعة القادمة.`);
  } catch (error) { console.error('Notification schedule error', error); updateNotificationStatus('تعذر الجدولة. تحقق من صلاحية الإشعارات والمنبهات الدقيقة من إعدادات Android.'); }
}
function playSelectedAdhan() { const reciter = ADHAN_RECITERS.find(r => r.id === state.settings.reciter) || ADHAN_RECITERS[0]; const audio = document.getElementById('adhanAudio'); audio.src = reciter.url; audio.play().catch(() => updateNotificationStatus('اضغط معاينة الأذان مرة أخرى للسماح بتشغيل الصوت.')); }
function playSebhaSound() { if (!state.settings.sound) return; try { const ctx = new (window.AudioContext || window.webkitAudioContext)(); const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.connect(gain); gain.connect(ctx.destination); osc.frequency.value = 800; gain.gain.setValueAtTime(.15, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .1); osc.start(); osc.stop(ctx.currentTime + .1); } catch (_) {} }
function setupSettingsUI() {
  document.getElementById('closeSettings')?.addEventListener('click', () => document.getElementById('settingsModal').classList.add('hidden'));
  document.getElementById('closePermissionSetup')?.addEventListener('click', finishPermissionSetup);
  document.getElementById('setupNotificationsBtn')?.addEventListener('click', setupNotificationsFromPrompt);
  document.getElementById('setupLocationBtn')?.addEventListener('click', setupLocationFromPrompt);
  document.getElementById('finishPermissionSetup')?.addEventListener('click', finishPermissionSetup);
  document.getElementById('closeTafsir')?.addEventListener('click', () => document.getElementById('tafsirModal').classList.add('hidden'));
  document.getElementById('settingsSearch')?.addEventListener('input', e => {
    const query = e.target.value.trim().toLowerCase();
    const sections = document.querySelectorAll('#settingsModal .settings-section');
    let visible = 0;
    sections.forEach(section => {
      section.classList.toggle('hidden', !!query && section.textContent.toLowerCase().indexOf(query) < 0);
      if (!section.classList.contains('hidden')) visible += 1;
    });
    document.getElementById('settingsNoResults')?.classList.toggle('hidden', visible !== 0 || !query);
  });
  document.getElementById('resetSettingsBtn')?.addEventListener('click', resetAppSettings);
  document.getElementById('notificationsEnabled')?.addEventListener('change', async e => { if (e.target.checked) { const ok = await requestNotificationPermission(); state.settings.notifications = ok; e.target.checked = ok; if (ok) await schedulePrayerNotifications(); else updateNotificationStatus('لم يتم منح صلاحية الإشعارات.'); } else { state.settings.notifications = false; const plugin = nativeLocalNotifications(); if (plugin) await plugin.cancelAll(); updateNotificationStatus('الإشعارات متوقفة.'); } persistSettings(); });
  document.getElementById('requestNotifications')?.addEventListener('click', async () => { const ok = await requestNotificationPermission(); state.settings.notifications = ok; document.getElementById('notificationsEnabled').checked = ok; if (ok) await schedulePrayerNotifications(); else updateNotificationStatus('لم يتم منح صلاحية الإشعارات.'); persistSettings(); });
  document.getElementById('testNotification')?.addEventListener('click', async () => {
    const ok = await requestNotificationPermission();
    if (!ok) { updateNotificationStatus('اسمح بالإشعارات أولاً ثم أعد المحاولة.'); return; }
    const plugin = nativeLocalNotifications();
    if (plugin) {
      await plugin.createChannel({ id: PRAYER_CHANNEL_ID, name: 'مواقيت الصلاة والأذان', importance: 5, sound: 'adhan', vibration: true });
      const at = new Date(Date.now() + 60 * 1000);
      await plugin.schedule({ notifications: [{ id: 2999, title: 'إشعار تجريبي — Redro Islamic', body: 'إذا ظهر هذا التنبيه فالإشعارات وصوت الأذان يعملان.', schedule: { at, allowWhileIdle: true }, channelId: PRAYER_CHANNEL_ID, sound: 'adhan' }] });
      updateNotificationStatus('سيصل الإشعار التجريبي خلال دقيقة. لا تغلق صلاحية الإشعارات من النظام.');
    } else if ('Notification' in window) {
      new Notification('إشعار تجريبي — Redro Islamic', { body: 'الإشعارات تعمل في المتصفح.' });
      updateNotificationStatus('ظهر الإشعار التجريبي في المتصفح.');
    }
  });
  document.getElementById('adhanReciter')?.addEventListener('change', e => { state.settings.reciter = e.target.value; updateSelectedAdhanReciter(); persistSettings(); playSelectedAdhan(); if (state.settings.notifications) schedulePrayerNotifications(); updateNotificationStatus('تم اختيار المؤذن وتشغيل المعاينة وإعادة جدولة الإشعارات.'); });
  document.getElementById('previewAdhan')?.addEventListener('click', playSelectedAdhan);
  document.getElementById('vibrationEnabled')?.addEventListener('change', e => { state.settings.vibration = e.target.checked; persistSettings(); });
  document.getElementById('soundEnabled')?.addEventListener('change', e => { state.settings.sound = e.target.checked; persistSettings(); });
  document.getElementById('downloadQuranBtn')?.addEventListener('click', downloadQuranText);
  document.getElementById('downloadInterfaceAssetsBtn')?.addEventListener('click', downloadInterfaceAssets);
  document.getElementById('downloadAudioBtn')?.addEventListener('click', downloadCurrentAudio);
  document.getElementById('clearOfflineBtn')?.addEventListener('click', async () => {
    if (!window.RedroOffline || !window.confirm('حذف المصحف والأصوات المحفوظة على هذا الجهاز؟')) return;
    await RedroOffline.clearOffline(); setOfflineProgress(0, 'تم حذف البيانات المنزّلة.');
  });
  document.getElementById('exportBackupBtn')?.addEventListener('click', exportOfflineBackup);
  document.getElementById('importBackupBtn')?.addEventListener('click', () => document.getElementById('importBackupInput')?.click());
  document.getElementById('importBackupInput')?.addEventListener('change', e => { if (e.target.files[0]) importOfflineBackup(e.target.files[0]); e.target.value = ''; });
  refreshOfflineStatus();
  refreshInterfaceAssetsStatus();
  setTimeout(showPermissionSetup, 700);
}
setupSettingsUI();
applyTheme();
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && state.settings?.notifications && state.prayerTimes) schedulePrayerNotifications();
});

// ==================== Seasonal Themes (Ramadan, Eids...) ====================
function applySeasonalTheme(hijri) {
  if (!hijri) return;
  const month = parseInt(hijri.month.number);
  const day = parseInt(hijri.day);
  let season = 'normal';

  // رمضان (شهر 9)
  if (month === 9) {
    season = 'ramadan';
  }
  // عيد الفطر (1-3 شوال)
  else if (month === 10 && day <= 3) {
    season = 'eid-fitr';
  }
  // عيد الأضحى (10-13 ذو الحجة)
  else if (month === 12 && day >= 10 && day <= 13) {
    season = 'eid-adha';
  }
  // محرم
  else if (month === 1) {
    season = 'muharram';
  }
  // ربيع الأول - المولد
  else if (month === 3 && day >= 11 && day <= 13) {
    season = 'mawlid';
  }

  // Apply to html element
  document.documentElement.setAttribute('data-season', season);

  // Optional: show a small banner on home
  let banner = document.getElementById('seasonBanner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'seasonBanner';
    banner.className = 'season-banner';
    const home = document.getElementById('home');
    if (home) home.insertBefore(banner, home.firstChild);
  }

  const messages = {
    ramadan: '🌙 رمضان كريم — تقبل الله صيامكم وقيامكم',
    'eid-fitr': '🎉 عيد فطر مبارك — تقبل الله طاعاتكم',
    'eid-adha': '🐑 عيد أضحى مبارك — تقبل الله منكم',
    muharram: '🖤 شهر الله المحرم',
    mawlid: '💚 ذكرى المولد النبوي الشريف',
    normal: ''
  };

  if (messages[season]) {
    banner.textContent = messages[season];
    banner.classList.remove('hidden');
  } else {
    banner.classList.add('hidden');
  }
}

// ==================== Enhanced Sound System ====================
const Sound = {
  ctx: null,
  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch(e) {}
  },
  play(freq = 600, duration = 0.08, type = 'sine', volume = 0.12) {
    if (!state.settings?.sound) return;
    try {
      if (!this.ctx) this.init();
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.frequency.value = freq;
      osc.type = type;
      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + duration);
    } catch(e) {}
  },
  click()   { this.play(700, 0.05, 'sine', 0.08); },
  success() { this.play(880, 0.12, 'triangle', 0.1); this.play(1100, 0.15, 'sine', 0.07); },
  sebha()   { this.play(750, 0.07, 'sine', 0.11); },
  complete(){ this.play(523, 0.1); setTimeout(() => this.play(659, 0.1), 80); setTimeout(() => this.play(784, 0.15), 160); },
  nav()     { this.play(500, 0.04, 'triangle', 0.06); }
};

// Enhance sebha with better feedback
const _sebhaOriginal = sebhaTap;
sebhaTap = function() {
  state.sebha.count++;
  const p = SEBHA_PHRASES[state.sebha.index];
  
  Sound.sebha();
  
  // Visual bounce
  const btn = document.getElementById('sebhaTap');
  const countEl = document.getElementById('sebhaCount');
  if (btn) {
    btn.classList.remove('bounce');
    void btn.offsetWidth;
    btn.classList.add('bounce');
  }
  if (countEl) {
    countEl.classList.remove('pop');
    void countEl.offsetWidth;
    countEl.classList.add('pop');
  }

  if (state.sebha.count >= p.target) {
    Sound.complete();
    if (state.settings?.vibration && navigator.vibrate) {
      navigator.vibrate([30, 40, 30, 40, 50]);
    }
  } else if (state.settings?.vibration && navigator.vibrate) {
    navigator.vibrate(12);
  }

  updateSebhaUI();
  saveState();
};

// Add click sounds to navigation and important buttons
document.addEventListener('click', (e) => {
  const t = e.target.closest('button, .action-card, .nav-item, .surah-item, .azkar-cat, .deed-item, .more-item, .zakat-tab');
  if (t && !t.id?.includes('sebha')) {
    Sound.click();
  }
}, true);

// Nav sound
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => Sound.nav());
});

console.log('%cRedro Islamic', 'color:#dc2626;font-size:16px;font-weight:bold', '- Sounds & Animations ready');

// ==================== Kunuz (Treasures of Dhikr) ====================
const KUNUZ_LIST = [
  {
    id: 'shafaa',
    title: 'أسعد الناس بشفاعة النبي ﷺ',
    emoji: '🌙',
    items: [
      { text: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ', count: 10, ref: 'الصلاة الإبراهيمية - متفق عليه' }
    ]
  },
  {
    id: 'ghufran',
    title: 'غفران الذنوب',
    emoji: '❤️',
    items: [
      { text: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ', count: 3, ref: 'الترمذي - حسن' },
      { text: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ', count: 100, ref: 'أبو داود' }
    ]
  },
  {
    id: 'hirz',
    title: 'حرز من الشيطان',
    emoji: '🛡️',
    items: [
      { text: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ', count: 3, ref: 'صحيح مسلم' },
      { text: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ', count: 3, ref: 'أبو داود والترمذي' }
    ]
  },
  {
    id: 'baqiyat',
    title: 'الباقيات الصالحات',
    emoji: '🌱',
    items: [
      { text: 'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَٰهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ', count: 1, ref: 'الباقيات الصالحات - ابن عباس' }
    ]
  },
  {
    id: 'thaqilatan',
    title: 'ثقيلتان وحبيبتان',
    emoji: '⚖️',
    items: [
      { text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ', count: 1, ref: 'كلمتان خفيفتان على اللسان ثقيلتان في الميزان حبيبتان إلى الرحمن - متفق عليه' }
    ]
  },
  {
    id: 'jannah',
    title: 'بناء الجنة وغراسها',
    emoji: '🌴',
    items: [
      { text: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ', count: 10, ref: 'غراس الجنة - الترمذي' },
      { text: 'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَٰهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ', count: 1, ref: 'من قالهن غُرست له نخلة في الجنة' }
    ]
  },
  {
    id: 'abwab',
    title: 'كلمات تفتح لها أبواب السماء',
    emoji: '🚪',
    items: [
      { text: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ', count: 10, ref: 'تفتح لها أبواب السماء - النسائي' }
    ]
  },
  {
    id: 'dhahab',
    title: 'خير من جبل ذهب',
    emoji: '🏔️',
    items: [
      { text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', count: 100, ref: 'من قالها مائة مرة حطت خطاياه وإن كانت مثل زبد البحر - مسلم' }
    ]
  },
  {
    id: 'azam',
    title: 'من أعظم الأذكار أجراً',
    emoji: '✊',
    items: [
      { text: 'لَا إِلَٰهَ إِلَّا اللَّهُ', count: 100, ref: 'أفضل الذكر لا إله إلا الله - الترمذي' }
    ]
  },
  {
    id: 'hasanat',
    title: 'زيادة الحسنات وتكثيرها',
    emoji: '📈',
    items: [
      { text: 'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَٰهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', count: 1, ref: 'من الباقيات الصالحات' }
    ]
  },
  {
    id: 'nar',
    title: 'النجاة من النار',
    emoji: '🔥',
    items: [
      { text: 'اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ', count: 3, ref: 'كان يقولها بعد المغرب - أبو داود' },
      { text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَأَعُوذُ بِكَ مِنَ النَّارِ', count: 3, ref: 'الترمذي' }
    ]
  }
];

function renderKunuzList() {
  const list = document.getElementById('kunuzList');
  if (!list) return;
  list.innerHTML = '';
  KUNUZ_LIST.forEach(k => {
    const btn = document.createElement('button');
    btn.className = 'kunuz-item';
    btn.innerHTML = `
      <span class="emoji">${k.emoji}</span>
      <span class="title">${k.title}</span>
      <span class="arrow"><i class="fas fa-chevron-left"></i></span>
    `;
    btn.onclick = () => showKunuzDetail(k);
    list.appendChild(btn);
  });
}

function showKunuzDetail(k) {
  document.getElementById('kunuzList').classList.add('hidden');
  const detail = document.getElementById('kunuzDetail');
  detail.classList.remove('hidden');
  document.getElementById('kunuzDetailTitle').textContent = k.title;
  const content = document.getElementById('kunuzDetailContent');
  content.innerHTML = '';
  k.items.forEach((item, idx) => {
    const progKey = `kunuz_${k.id}_${idx}`;
    const current = state.azkarProgress[progKey] || 0;
    const div = document.createElement('div');
    div.className = 'dhikr-card';
    div.innerHTML = `
      <div class="dhikr-text">${item.text}</div>
      <div class="dhikr-ref">${item.ref || ''}</div>
      <div class="count-row">
        <button class="count-btn" data-key="${progKey}" data-max="${item.count}">+</button>
        <span class="count-display" id="cnt_${progKey}">${current} / ${item.count}</span>
        <button class="count-btn reset" data-key="${progKey}">↺</button>
      </div>
    `;
    content.appendChild(div);
  });
  content.querySelectorAll('.count-btn').forEach(btn => {
    btn.onclick = () => {
      const key = btn.dataset.key;
      if (btn.classList.contains('reset')) {
        state.azkarProgress[key] = 0;
      } else {
        const max = parseInt(btn.dataset.max);
        state.azkarProgress[key] = Math.min((state.azkarProgress[key] || 0) + 1, max);
        if (state.azkarProgress[key] === max) Sound.complete();
        else Sound.sebha();
      }
      const el = document.getElementById(`cnt_${key}`);
      if (el) el.textContent = `${state.azkarProgress[key] || 0} / ${btn.dataset.max || ''}`;
      saveState();
    };
  });
}

document.getElementById('backToKunuz')?.addEventListener('click', () => {
  document.getElementById('kunuzDetail').classList.add('hidden');
  document.getElementById('kunuzList').classList.remove('hidden');
});

// Call on init
if (typeof renderKunuzList === 'function') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(renderKunuzList, 100);
  });
}
// Also call now if already loaded
try { renderKunuzList(); } catch(e) {}

// Theme Toggle Button
(function() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  function updateIcon() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    btn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  }
  updateIcon();
  btn.onclick = () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    state.settings = state.settings || {};
    state.settings.theme = next;
    localStorage.setItem('redro_theme', next);
    updateIcon();
    Sound.click();
  };
})();
