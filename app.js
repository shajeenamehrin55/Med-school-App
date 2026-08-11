/* -------------------------------------------------------------
   MEDPULSE SYNERGY - APPLICATION LOGIC & DATA ENGINE
------------------------------------------------------------- */

// Global Application State
const state = {
    persona: 'kerala_uae_usmle',
    stage: 'ms4',
    currentTab: 'tab-routine',
    streakDays: 14,
    cardsMastered: 1420,
    cardsDueToday: 48,
    mayoMatchScore: 92,
    owlResetDay: 4,
    strictModeActive: false,
    
    // Timer State
    timer: {
        secondsRemaining: 900,
        intervalId: null,
        isRunning: false,
        phase: 'pre'
    },
    
    // Lockdown Timer State
    lockdownTimer: {
        secondsRemaining: 2700,
        intervalId: null
    },

    // AuraFlash (Anki Engine) State
    anki: {
        currentDeck: 'usmle_step1_fa',
        currentTopic: 'cardiovascular',
        cards: [],
        currentIndex: 0,
        isFlipped: false
    }
};

// Database Presets for High Yield Decks, Schedules, Prayers, Quran & Match Roadmaps
const DATABASE = {
    schedules: {
        routine_uae_kerala: [
            { time: "05:00 AM", title: "Fajr Prayer & Morning Routine", sub: "5 Ayahs Quran Study + Brain Hydration", tag: "tag-emerald", cat: "islamic" },
            { time: "05:30 AM", title: "AuraFlash Anki Power Hour (FSRS)", sub: "48 Cards Due (USMLE Step 2 / Cardiology)", tag: "tag-cyan", cat: "anki" },
            { time: "06:45 AM", title: "Kerala/UAE High-Brain Breakfast", sub: "Appam & Egg Curry / Oats & Dates + Green Tea", tag: "tag-gold", cat: "diet" },
            { time: "07:30 AM", title: "Hospital Clinical Ward / Lecture Pre-Skim", sub: "Review Mayo Clinic Elective Objectives", tag: "tag-purple", cat: "study" },
            { time: "01:15 PM", title: "Dhuhr Prayer & Med Student Power Lunch", sub: "Grilled Chicken Salad + Hummus & Laban", tag: "tag-emerald", cat: "islamic" },
            { time: "02:00 PM", title: "UWorld / USMLE Step 2 CK Question Block", sub: "40 Questions Timed Mode (Target: >75%)", tag: "tag-cyan", cat: "study" },
            { time: "04:30 PM", title: "Asr Prayer & 15-Min Posture Workout", sub: "Cervical Spine & Ergonomics Reset", tag: "tag-gold", cat: "workout" },
            { time: "06:45 PM", title: "Maghrib Prayer & PubMed Research Block", sub: "Mayo Clinic Case Report Draft & Review", tag: "tag-purple", cat: "research" },
            { time: "08:15 PM", title: "Isha Prayer & Light Dinner", sub: "Steamed Kerala Fish Curry & Veggies", tag: "tag-emerald", cat: "islamic" },
            { time: "09:30 PM", title: "Post-Lecture Anki Conversion & Wind-down", sub: "Strict 0% Distraction Night Owl Sleep Protocol", tag: "tag-cyan", cat: "sleep" }
        ],
        routine_usmle_grind: [
            { time: "05:00 AM", title: "Fajr Prayer & First Aid High-Yield Skim", sub: "Cardiovascular Pathology & Buzzwords", tag: "tag-emerald", cat: "study" },
            { time: "06:00 AM", title: "Block 1: UWorld Step 1 (40 Random Questions)", sub: "Simulated Exam Conditions (Mayo Target)", tag: "tag-cyan", cat: "study" },
            { time: "08:00 AM", title: "Deep Review & Anki Card Creation", sub: "Convert Incorrects into AuraFlash Cards", tag: "tag-purple", cat: "anki" },
            { time: "11:00 AM", title: "Pathoma Lecture & Active Recall", sub: "Ch 3 Neoplasia & Organ System Pathology", tag: "tag-gold", cat: "study" },
            { time: "02:00 PM", title: "Block 2: UWorld / Amboss Question Bank", sub: "Focus on Weak Areas (Renal & Endocrine)", tag: "tag-cyan", cat: "study" },
            { time: "06:00 PM", title: "Spaced Repetition Review (100 Cards)", sub: "FSRS Mastered Retention Sweep", tag: "tag-emerald", cat: "anki" }
        ]
    },

    ankiDecks: {
        cardiovascular: [
            {
                q: "A 54-year-old male with long-standing hypertension presents with sudden tearing chest pain radiating to the back. CXR shows widened mediastinum. What is the initial diagnostic test and first-line medical therapy?",
                a: "<strong>Diagnosis:</strong> Aortic Dissection.<br><strong>Diagnostic Test:</strong> CT Angiography of Chest.<br><strong>First-line Medical Tx:</strong> IV Beta-Blockers (e.g. Esmolol / Labetalol) to decrease heart rate & shearing stress before vasodilators.",
                tip: "Mayo Tip: Lower Heart Rate FIRST before lowering blood pressure to prevent reflex tachycardia."
            },
            {
                q: "What murmur is characteristically heard as a crescendo-decrescendo systolic ejection murmur at the right upper sternal border, radiating to the carotids?",
                a: "<strong>Diagnosis:</strong> Aortic Stenosis.<br><strong>Classic Triad (SAD):</strong> Syncope, Angina, Dyspnea.<br><strong>Key Finding:</strong> Pulsus parvus et tardus (weak & delayed carotid pulse).",
                tip: "USMLE Step 1 Buzzword: Calcific degradation in elderly or bicuspid aortic valve in young adults."
            },
            {
                q: "Which antiarrhythmic drug causes pulmonary fibrosis, thyroid dysfunction (hypo/hyper), corneal microdeposits, and blue-gray skin discoloration?",
                a: "<strong>Drug:</strong> Amiodarone (Class III Antiarrhythmic).<br><strong>Mechanism:</strong> K+ channel blocker (prolongs phase 3 repolarization).<br><strong>Monitoring:</strong> PFTs, TSH, and LFTs required.",
                tip: "Very High Yield Pharmacology Question for USMLE Step 1 & Step 2 CK!"
            }
        ],
        pharmacology: [
            {
                q: "What is the antidote for Acetaminophen toxicity, and what is its mechanism of action?",
                a: "<strong>Antidote:</strong> N-acetylcysteine (NAC).<br><strong>Mechanism:</strong> Replenishes Glutathione stores to neutralize toxic metabolite NAPQI.",
                tip: "Must administer within 8 hours for maximum hepatoprotective effect!"
            },
            {
                q: "Which class of diabetes medications carries the risk of Euglycemic Diabetic Ketoacidosis (DKA) and mycotic genital infections?",
                a: "<strong>Class:</strong> SGLT2 Inhibitors (e.g., Empagliflozin, Dapagliflozin).<br><strong>Mechanism:</strong> Inhibits renal glucose reabsorption in PCT, promoting glucosuria.",
                tip: "Proven mortality reduction in Heart Failure with Reduced Ejection Fraction (HFrEF)."
            }
        ],
        high_yield_buzzwords: [
            {
                q: "USMLE Mayo Buzzwords: 'Aschoff bodies' with 'Anitschkow cells' (caterpillar nuclei) = ?",
                a: "<strong>Rheumatic Fever / Rheumatic Heart Disease</strong> (Post-Group A Strep infection).",
                tip: "Mitral valve stenosis is the most common long-term complication!"
            },
            {
                q: "USMLE Mayo Buzzwords: 'Apple-green birefringence' under polarized light with Congo Red stain = ?",
                a: "<strong>Amyloidosis</strong> (AL or AA amyloid deposition in tissues/kidneys).",
                tip: "Causes Restrictive Cardiomyopathy & Nephrotic Syndrome."
            }
        ]
    },

    prayers: {
        dubai_uae: [
            { name: "Fajr", time: "04:32 AM", status: "done" },
            { name: "Dhuhr", time: "12:24 PM", status: "done" },
            { name: "Asr", time: "03:48 PM", status: "next" },
            { name: "Maghrib", time: "07:05 PM", status: "pending" },
            { name: "Isha", time: "08:35 PM", status: "pending" }
        ],
        kerala_india: [
            { name: "Fajr", time: "04:52 AM", status: "done" },
            { name: "Dhuhr", time: "12:31 PM", status: "done" },
            { name: "Asr", time: "03:52 PM", status: "next" },
            { name: "Maghrib", time: "06:48 PM", status: "pending" },
            { name: "Isha", time: "08:02 PM", status: "pending" }
        ]
    },

    quranVerses: {
        surah_yasin: [
            { num: 1, ar: "يسٓ", en: "Ya-Seen." },
            { num: 2, ar: "وَٱلْقُرْءَانِ ٱلْحَكِيمِ", en: "By the wise Qur'an." },
            { num: 3, ar: "إِنَّكَ لَمِنَ ٱلْمُرْسَلِينَ", en: "Indeed, you, [O Muhammad], are from among the messengers," },
            { num: 4, ar: "عَلَىٰ صِرَٰطٍ مُّسْتَقِيمٍ", en: "On a straight path." },
            { num: 5, ar: "تَنزِيلَ ٱلْعَزِيزِ ٱلرَّحِيمِ", en: "[This is] a revelation of the Exalted in Might, the Merciful." }
        ]
    },

    meals: {
        kerala_uae_fusion: [
            { type: "Breakfast", title: "Kerala Style Oats Puttu / Appam & Eggs + UAE Dates", desc: "High sustained brain glucose, healthy fats & protein." },
            { type: "Lunch", title: "Middle-Eastern Grilled Chicken & Quinoa with Hummus & Laban", desc: "Lean protein, probiotic digestive support, zero brain fog." },
            { type: "Evening", title: "Spiced Kerala Black Tea (Kattan Chapi) & Roasted Almonds", desc: "Antioxidant focus boost for 4pm study block." },
            { type: "Dinner", title: "Steamed Kerala Fish Curry (Meen Veavichathu) & Veggie Salad", desc: "Omega-3 rich for neural plasticity & smooth sleep transition." }
        ]
    },

    workouts: {
        posture_cervical: {
            title: "Med Student Posture & Cervical Spine Saver",
            duration: "15 Minutes",
            exercises: [
                "Chin Tucks against wall (2 sets x 15 reps) - Fixes Forward Head Posture from microscopes/tablets.",
                "Doorway Pectoral Stretch (30s hold x 3) - Opens tight chest muscles from studying.",
                "Thoracic Spine Cat-Cow Extensions (12 reps) - Relieves upper back stiffness.",
                "Prone Y-T-W Dumbbell/Bodyweight raises (10 reps each) - Strengthens rhomboids and lower traps."
            ]
        }
    },

    residencyRoadmaps: {
        usmle_mayo: {
            stage1: [
                { text: "USMLE Step 1: Pass Score Completed", done: true },
                { text: "USMLE Step 2 CK: Score Goal > 260 (Targeted for Mayo Clinic)", done: false },
                { text: "OET (Occupational English Test) Medicine: Pass", done: true }
            ],
            stage2: [
                { text: "3 Months Hands-on USCE Clinical Electives (Mayo / Ivy League)", done: false },
                { text: "4 Strong Letters of Recommendation (LoRs) from US Chairs", done: false }
            ],
            stage3: [
                { text: "3 First-Author PubMed Indexed Publications (Case Reports / Meta-analysis)", done: true },
                { text: "Present Abstract at US National Medical Conference", done: false }
            ],
            stage4: [
                { text: "ERAS Application Submission & ECFMG Certification", done: false },
                { text: "Mayo Clinic Simulated Residency Interview Practice", done: false }
            ]
        }
    }
};

// Initialize Application on Page Load
document.addEventListener('DOMContentLoaded', () => {
    initTabSwitching();
    initPersonaSelection();
    initRoutineSchedule();
    initStudyTimer();
    initOwlResetGrid();
    initAuraFlashAnki();
    initPrayerTimes();
    initQuranReader();
    initResidencyRoadmap();
    initLifestyleTab();
    initResearchTab();
    initStrictLockdown();
});

/* -------------------------------------------------------------
   1. TAB SWITCHING LOGIC
------------------------------------------------------------- */
function initTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            state.currentTab = targetTab;
        });
    });
}

/* -------------------------------------------------------------
   2. PERSONA & STAGE SELECTION (0% TYPING)
------------------------------------------------------------- */
function initPersonaSelection() {
    const personaSelect = document.getElementById('personaSelect');
    const stageSelect = document.getElementById('stageSelect');

    personaSelect.addEventListener('change', (e) => {
        state.persona = e.target.value;
        // Auto update schedules & roadmaps according to persona
        renderScheduleTimeline();
        renderPrayerTimes();
    });

    stageSelect.addEventListener('change', (e) => {
        state.stage = e.target.value;
    });
}

/* -------------------------------------------------------------
   3. ROUTINE SCHEDULE & PRE/POST LECTURE TIMER
------------------------------------------------------------- */
function initRoutineSchedule() {
    const scheduleDropdown = document.getElementById('scheduleModeDropdown');
    scheduleDropdown.addEventListener('change', () => {
        renderScheduleTimeline();
    });
    renderScheduleTimeline();
}

function renderScheduleTimeline() {
    const container = document.getElementById('scheduleListContainer');
    const mode = document.getElementById('scheduleModeDropdown').value;
    const items = DATABASE.schedules[mode] || DATABASE.schedules.routine_uae_kerala;

    container.innerHTML = items.map((item, idx) => `
        <div class="timeline-item ${idx === 2 ? 'active-item' : ''}">
            <span class="timeline-time">${item.time}</span>
            <div class="timeline-info">
                <div class="timeline-title">${item.title}</div>
                <div class="timeline-sub">${item.sub}</div>
            </div>
            <span class="timeline-tag ${item.tag}">${item.cat}</span>
        </div>
    `).join('');
}

function initStudyTimer() {
    const display = document.getElementById('studyTimerDisplay');
    const startBtn = document.getElementById('startTimerBtn');
    const pauseBtn = document.getElementById('pauseTimerBtn');
    const resetBtn = document.getElementById('resetTimerBtn');
    const phaseSteps = document.querySelectorAll('.phase-step');

    function updateDisplay() {
        const mins = Math.floor(state.timer.secondsRemaining / 60);
        const secs = state.timer.secondsRemaining % 60;
        display.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    startBtn.addEventListener('click', () => {
        if (state.timer.isRunning) return;
        state.timer.isRunning = true;
        state.timer.intervalId = setInterval(() => {
            if (state.timer.secondsRemaining > 0) {
                state.timer.secondsRemaining--;
                updateDisplay();
            } else {
                clearInterval(state.timer.intervalId);
                state.timer.isRunning = false;
                alert("Phase Complete! Moving to next High-Yield study step.");
            }
        }, 1000);
    });

    pauseBtn.addEventListener('click', () => {
        clearInterval(state.timer.intervalId);
        state.timer.isRunning = false;
    });

    resetBtn.addEventListener('click', () => {
        clearInterval(state.timer.intervalId);
        state.timer.isRunning = false;
        state.timer.secondsRemaining = 900;
        updateDisplay();
    });

    phaseSteps.forEach(step => {
        step.addEventListener('click', () => {
            phaseSteps.forEach(s => s.classList.remove('active'));
            step.classList.add('active');
            const phase = step.getAttribute('data-phase');
            if (phase === 'pre') state.timer.secondsRemaining = 900;
            else if (phase === 'during') state.timer.secondsRemaining = 2700;
            else state.timer.secondsRemaining = 1800;
            updateDisplay();
        });
    });

    updateDisplay();
}

function initOwlResetGrid() {
    const grid = document.getElementById('owlResetDaysGrid');
    const days = [
        { day: "Day 1", shift: "3:00am -> 2:15am", status: "completed" },
        { day: "Day 2", shift: "2:15am -> 1:30am", status: "completed" },
        { day: "Day 3", shift: "1:30am -> 12:45am", status: "completed" },
        { day: "Day 4", shift: "12:45am -> 12:00am", status: "current" },
        { day: "Day 5", shift: "12:00am -> 11:15pm", status: "upcoming" },
        { day: "Day 6", shift: "11:15pm -> 10:30pm", status: "upcoming" },
        { day: "Day 7", shift: "10:30pm -> 10:00pm", status: "upcoming" }
    ];

    grid.innerHTML = days.map(d => `
        <div class="owl-day-card ${d.status}">
            <span class="owl-day-title">${d.day}</span>
            <span class="owl-day-shift">${d.shift}</span>
        </div>
    `).join('');
}

/* -------------------------------------------------------------
   4. AURAFLASH AUTOMATED ANKI ENGINE (FSRS)
------------------------------------------------------------- */
function initAuraFlashAnki() {
    const deckSourceSelect = document.getElementById('ankiDeckSourceSelect');
    const topicSelect = document.getElementById('ankiTopicSelect');
    const generateBtn = document.getElementById('generateCardsBtn');
    const flashcardContainer = document.getElementById('flashcardContainer');
    const ratingButtons = document.querySelectorAll('.rating-btn');
    const presetTextbookSelect = document.getElementById('presetTextbookSelect');

    loadTopicCards();

    deckSourceSelect.addEventListener('change', loadTopicCards);
    topicSelect.addEventListener('change', loadTopicCards);

    generateBtn.addEventListener('click', () => {
        loadTopicCards();
        alert("✨ Auto-generated 20 High-Yield Medical Flashcards!");
    });

    presetTextbookSelect.addEventListener('change', (e) => {
        if (e.target.value) {
            alert(`ingested textbook chapter [${e.target.value}]. Auto-extracted 15 Mayo Clinic High Yield cards!`);
            loadTopicCards();
        }
    });

    // Flip Card on Click or Spacebar
    flashcardContainer.addEventListener('click', flipCard);
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && state.currentTab === 'tab-anki') {
            e.preventDefault();
            flipCard();
        }
    });

    // Rating Buttons Scoring
    ratingButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            nextCard();
        });
    });
}

function loadTopicCards() {
    const topic = document.getElementById('ankiTopicSelect').value;
    state.anki.cards = DATABASE.ankiDecks[topic] || DATABASE.ankiDecks.cardiovascular;
    state.anki.currentIndex = 0;
    renderCard();
}

function renderCard() {
    const card = state.anki.cards[state.anki.currentIndex];
    if (!card) return;

    document.getElementById('cardFrontText').innerHTML = card.q;
    document.getElementById('cardBackText').innerHTML = card.a;
    document.getElementById('cardProgressText').textContent = `Card ${state.anki.currentIndex + 1} of ${state.anki.cards.length}`;
    
    // Reset flip
    const container = document.getElementById('flashcardContainer');
    container.classList.remove('flipped');
    state.anki.isFlipped = false;
}

function flipCard() {
    const container = document.getElementById('flashcardContainer');
    container.classList.toggle('flipped');
    state.anki.isFlipped = !state.anki.isFlipped;
}

function nextCard() {
    if (state.anki.currentIndex < state.anki.cards.length - 1) {
        state.anki.currentIndex++;
        renderCard();
    } else {
        alert("🎉 Deck session complete! Spaced Repetition interval updated via FSRS.");
        state.anki.currentIndex = 0;
        renderCard();
    }
}

/* -------------------------------------------------------------
   5. PRAYER TIMES & QURAN READER ENGINE
------------------------------------------------------------- */
function initPrayerTimes() {
    const locationSelect = document.getElementById('prayerLocationSelect');
    locationSelect.addEventListener('change', renderPrayerTimes);
    renderPrayerTimes();
}

function renderPrayerTimes() {
    const container = document.getElementById('prayerTimesGrid');
    const loc = document.getElementById('prayerLocationSelect').value;
    const times = DATABASE.prayers[loc] || DATABASE.prayers.dubai_uae;

    container.innerHTML = times.map(p => `
        <div class="prayer-card ${p.status === 'next' ? 'next-prayer' : ''} ${p.status === 'done' ? 'done-prayer' : ''}">
            <span class="prayer-name">${p.name}</span>
            <span class="prayer-time">${p.time}</span>
        </div>
    `).join('');
}

function initQuranReader() {
    const surahSelect = document.getElementById('quranSurahSelect');
    surahSelect.addEventListener('change', renderQuranVerses);
    
    document.getElementById('quranAudioSimBtn').addEventListener('click', () => {
        alert("▶️ Recitation audio playing: Sheikh Mishary Rashid Alafasy");
    });

    renderQuranVerses();
}

function renderQuranVerses() {
    const container = document.getElementById('quranVersesContainer');
    const surahKey = document.getElementById('quranSurahSelect').value;
    const verses = DATABASE.quranVerses[surahKey] || DATABASE.quranVerses.surah_yasin;

    container.innerHTML = verses.map(v => `
        <div class="verse-block">
            <div class="arabic-text">${v.ar} ﴿${v.num}﴾</div>
            <div class="translation-text"><strong>Ayah ${v.num}:</strong> ${v.en}</div>
        </div>
    `).join('');
}

/* -------------------------------------------------------------
   6. RESIDENCY MATCH ROADMAP
------------------------------------------------------------- */
function initResidencyRoadmap() {
    const pathwaySelect = document.getElementById('targetPathwaySelect');
    pathwaySelect.addEventListener('change', renderResidencyRoadmap);
    renderResidencyRoadmap();
}

function renderResidencyRoadmap() {
    const data = DATABASE.residencyRoadmaps.usmle_mayo;

    document.getElementById('stage1List').innerHTML = renderMilestoneItems(data.stage1);
    document.getElementById('stage2List').innerHTML = renderMilestoneItems(data.stage2);
    document.getElementById('stage3List').innerHTML = renderMilestoneItems(data.stage3);
    document.getElementById('stage4List').innerHTML = renderMilestoneItems(data.stage4);
}

function renderMilestoneItems(items) {
    return items.map(i => `
        <div class="milestone-item ${i.done ? 'checked' : ''}">
            <input type="checkbox" ${i.done ? 'checked' : ''}>
            <span>${i.text}</span>
        </div>
    `).join('');
}

/* -------------------------------------------------------------
   7. LIFESTYLE (DIETS & WORKOUTS)
------------------------------------------------------------- */
function initLifestyleTab() {
    const dietSelect = document.getElementById('dietPresetSelect');
    const workoutSelect = document.getElementById('workoutPresetSelect');

    dietSelect.addEventListener('change', renderMeals);
    workoutSelect.addEventListener('change', renderWorkout);

    renderMeals();
    renderWorkout();
}

function renderMeals() {
    const container = document.getElementById('mealPlanGrid');
    const meals = DATABASE.meals.kerala_uae_fusion;

    container.innerHTML = meals.map(m => `
        <div class="meal-card">
            <div class="meal-badge">${m.type}</div>
            <div class="meal-details">
                <h4>${m.title}</h4>
                <p>${m.desc}</p>
            </div>
        </div>
    `).join('');
}

function renderWorkout() {
    const container = document.getElementById('workoutRoutineCard');
    const w = DATABASE.workouts.posture_cervical;

    container.innerHTML = `
        <h3>${w.title} (${w.duration})</h3>
        <ul style="padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.6rem;">
            ${w.exercises.map(e => `<li style="font-size:0.88rem; color: var(--text-secondary);">${e}</li>`).join('')}
        </ul>
    `;
}

/* -------------------------------------------------------------
   8. RESEARCH & PUBMED TRACKER
------------------------------------------------------------- */
function initResearchTab() {
    const pipeline = document.getElementById('researchPipeline');
    const checklist = document.getElementById('researchChecklist');

    const steps = [
        { title: "Project 1: Cardiology Transcatheter Aortic Valve Meta-Analysis", status: "Manuscript Drafted & Peer-Review Submitted" },
        { title: "Project 2: Case Report on Rare Pulmonary Arteriovenous Malformation", status: "Accepted in Cureus Medical Journal (PubMed Indexed)" }
    ];

    pipeline.innerHTML = steps.map(s => `
        <div class="pipeline-step">
            <div>
                <strong>${s.title}</strong>
                <p style="font-size:0.78rem; color: var(--accent-emerald);">${s.status}</p>
            </div>
            <span class="timeline-tag tag-purple">PubMed</span>
        </div>
    `).join('');

    const checkItems = [
        "Mayo Clinic Matching Requirement: Min 2 First-Author Papers",
        "Formulate PICO Question & Register Systematic Review on PROSPERO",
        "Identify Mayo Faculty Mentor via LinkedIn / ResearchGate",
        "Submit IRB Exemption for Retrospective Case Series"
    ];

    checklist.innerHTML = checkItems.map(c => `
        <label class="checkbox-container">
            <input type="checkbox" checked>
            <span class="checkmark"></span>
            <span style="font-size:0.85rem;">${c}</span>
        </label>
    `).join('');
}

/* -------------------------------------------------------------
   9. STRICT LOCKDOWN MODE (OVER-APP OVERLAY SIMULATOR)
------------------------------------------------------------- */
function initStrictLockdown() {
    const lockBtn = document.getElementById('strictLockdownBtn');
    const exitBtn = document.getElementById('exitLockdownBtn');
    const overlay = document.getElementById('strictLockdownOverlay');
    const display = document.getElementById('lockdownTimerDisplay');
    const soundChips = document.querySelectorAll('.sound-chip');

    lockBtn.addEventListener('click', () => {
        overlay.classList.remove('hidden');
        startLockdownTimer();
    });

    exitBtn.addEventListener('click', () => {
        overlay.classList.add('hidden');
        clearInterval(state.lockdownTimer.intervalId);
    });

    soundChips.forEach(chip => {
        chip.addEventListener('click', () => {
            soundChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
        });
    });

    function startLockdownTimer() {
        state.lockdownTimer.secondsRemaining = 2700; // 45 min
        state.lockdownTimer.intervalId = setInterval(() => {
            if (state.lockdownTimer.secondsRemaining > 0) {
                state.lockdownTimer.secondsRemaining--;
                const mins = Math.floor(state.lockdownTimer.secondsRemaining / 60);
                const secs = state.lockdownTimer.secondsRemaining % 60;
                display.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            } else {
                clearInterval(state.lockdownTimer.intervalId);
                alert("🎉 Lockdown Block Complete! 0% Distraction Achieved.");
            }
        }, 1000);
    }
}
