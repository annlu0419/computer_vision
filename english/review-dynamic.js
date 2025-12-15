// 動態生成答案詳解頁面
class ReviewGenerator {
    constructor() {
        this.userAnswers = {};
        this.loadUserAnswers();
        this.generateReview();
    }

    loadUserAnswers() {
        const saved = localStorage.getItem('examState');
        if (saved) {
            const state = JSON.parse(saved);
            this.userAnswers = state.answers || {};
        }
    }

    // 詞彙題選項中文翻譯
    getVocabTranslations() {
        return {
            1: {
                options: [
                    { en: "acquisition", zh: "獲得、取得" },
                    { en: "disruption", zh: "破壞、中斷" },
                    { en: "assurance", zh: "保證、確保" },
                    { en: "calculation", zh: "計算" }
                ]
            },
            2: {
                options: [
                    { en: "stimulation", zh: "刺激" },
                    { en: "prevention", zh: "預防" },
                    { en: "regulation", zh: "規範、調節" },
                    { en: "tolerance", zh: "容忍、耐受性" }
                ]
            },
            3: {
                options: [
                    { en: "sincerity", zh: "誠懇、真誠" },
                    { en: "elegance", zh: "優雅" },
                    { en: "diplomacy", zh: "外交手腕、圓融" },
                    { en: "liability", zh: "責任、負債" }
                ]
            },
            4: {
                options: [
                    { en: "permanent", zh: "永久的" },
                    { en: "accessible", zh: "可參觀的、可進入的" },
                    { en: "temporary", zh: "暫時的" },
                    { en: "subsequent", zh: "隨後的" }
                ]
            },
            5: {
                options: [
                    { en: "arbitrary", zh: "任意的、武斷的" },
                    { en: "persistent", zh: "堅持不懈的" },
                    { en: "moderate", zh: "適度的" },
                    { en: "fictional", zh: "虛構的" }
                ]
            },
            6: {
                options: [
                    { en: "suppress", zh: "抑制" },
                    { en: "fulfill", zh: "實現、履行" },
                    { en: "circulate", zh: "循環、流通" },
                    { en: "attribute", zh: "歸因於" }
                ]
            },
            7: {
                options: [
                    { en: "conceal", zh: "隱藏" },
                    { en: "retrieve", zh: "取回、檢索" },
                    { en: "manifest", zh: "表明、顯示" },
                    { en: "enforce", zh: "執行、強制" }
                ]
            },
            8: {
                options: [
                    { en: "validation", zh: "認可、肯定" },
                    { en: "compensation", zh: "補償" },
                    { en: "interference", zh: "干擾" },
                    { en: "obligation", zh: "義務" }
                ]
            },
            9: {
                options: [
                    { en: "luminous", zh: "發光的" },
                    { en: "voluntary", zh: "自願的" },
                    { en: "volatile", zh: "易揮發的、不穩定的" },
                    { en: "glorious", zh: "光榮的" }
                ]
            },
            10: {
                options: [
                    { en: "domestic", zh: "國內的、家庭的" },
                    { en: "prevailing", zh: "盛行的" },
                    { en: "abundant", zh: "豐富的" },
                    { en: "ripple", zh: "漣漪、連鎖效應" }
                ]
            }
        };
    }

    // 綜合測驗選項中文翻譯
    getClozeTranslations() {
        return {
            11: {
                options: [
                    { en: "while", zh: "同時、然而" },
                    { en: "despite", zh: "儘管" },
                    { en: "therefore", zh: "因此" },
                    { en: "unless", zh: "除非" }
                ]
            },
            12: {
                options: [
                    { en: "but", zh: "但是" },
                    { en: "where", zh: "在...的地方" },
                    { en: "which", zh: "這件事(關係代名詞)" },
                    { en: "than", zh: "比" }
                ]
            },
            13: {
                options: [
                    { en: "at the same time", zh: "同時" },
                    { en: "on the other hand", zh: "另一方面" },
                    { en: "in advance", zh: "提前" },
                    { en: "in comparison", zh: "相比之下" }
                ]
            },
            14: {
                options: [
                    { en: "Accordingly", zh: "因此、相應地" },
                    { en: "Nevertheless", zh: "然而" },
                    { en: "Moreover", zh: "此外、而且" },
                    { en: "Otherwise", zh: "否則" }
                ]
            },
            15: {
                options: [
                    { en: "mission", zh: "任務、使命" },
                    { en: "regulation", zh: "規範" },
                    { en: "negotiation", zh: "談判" },
                    { en: "fantasy", zh: "幻想" }
                ]
            },
            16: {
                options: [
                    { en: "Unlike", zh: "不像" },
                    { en: "Instead", zh: "反而" },
                    { en: "Primarily", zh: "主要地" },
                    { en: "Given", zh: "考慮到" }
                ]
            },
            17: {
                options: [
                    { en: "make", zh: "使得(原形)" },
                    { en: "to make", zh: "使得(不定詞)" },
                    { en: "making", zh: "使得(分詞)" },
                    { en: "makes", zh: "使得(第三人稱單數)" }
                ]
            },
            18: {
                options: [
                    { en: "In conclusion", zh: "總之" },
                    { en: "On the contrary", zh: "相反地" },
                    { en: "Additionally", zh: "此外" },
                    { en: "Such as", zh: "例如" }
                ]
            },
            19: {
                options: [
                    { en: "By no means", zh: "絕不" },
                    { en: "In other words", zh: "換句話說" },
                    { en: "At any rate", zh: "無論如何" },
                    { en: "As a result", zh: "因此" }
                ]
            },
            20: {
                options: [
                    { en: "which", zh: "哪一個(關係代名詞)" },
                    { en: "where", zh: "在...的地方(關係副詞)" },
                    { en: "that", zh: "那個(關係代名詞)" },
                    { en: "what", zh: "什麼" }
                ]
            }
        };
    }

    // 文意選填選項中文翻譯
    getFillTranslations() {
        return [
            { en: "concern", zh: "擔憂、關切" },
            { en: "collaboration", zh: "協作、合作" },
            { en: "rights", zh: "權利" },
            { en: "access", zh: "使用、進入" },
            { en: "supplement", zh: "補充" },
            { en: "transformation", zh: "轉變、變革" },
            { en: "facilitate", zh: "促進、幫助" },
            { en: "creating", zh: "創造" },
            { en: "skepticism", zh: "懷疑" },
            { en: "previously", zh: "先前、以前" }
        ];
    }

    generateReview() {
        this.generateScoreSummary();
        this.generateVocabReview();
        this.generateClozeReview();
        this.generateFillReview();
    }

    generateScoreSummary() {
        const sections = EXAM_DATA.sections;
        let correct = 0;
        let total = 0;

        // Calculate score (simplified - only for first 30 questions)
        for (let i = 1; i <= 30; i++) {
            total++;
            if (i <= 10) {
                if (this.userAnswers[i] === sections.vocab.questions[i - 1].a) correct++;
            } else if (i <= 20) {
                if (this.userAnswers[i] === sections.cloze.questions[i - 11].a) correct++;
            } else if (i <= 30) {
                if (this.userAnswers[i] === sections.fill.questions[i - 21].a) correct++;
            }
        }

        const percentage = ((correct / total) * 100).toFixed(1);

        document.getElementById('scoreSummary').innerHTML = `
            <h2>${correct} / ${total}</h2>
            <p>答對率: ${percentage}%</p>
            <p>已完成前 30 題的詳解分析</p>
        `;
    }

    generateVocabReview() {
        const sections = EXAM_DATA.sections;
        const translations = this.getVocabTranslations();
        const container = document.getElementById('vocabReview');
        let html = '';

        for (let i = 1; i <= 10; i++) {
            const q = sections.vocab.questions[i - 1];
            const userAnswer = this.userAnswers[i];
            const correctAnswer = q.a;
            const isCorrect = userAnswer === correctAnswer;
            const trans = translations[i];

            html += `
                <div class="question-review ${isCorrect ? 'correct' : (userAnswer !== undefined ? 'incorrect' : '')}">
                    <div class="qnum">${i}. 正確答案：(${String.fromCharCode(65 + correctAnswer)}) ${q.o[correctAnswer]}</div>
                    <div class="qtext">${q.q}</div>
                    
                    ${userAnswer !== undefined ? `
                        <div class="user-answer-box ${isCorrect ? 'correct' : 'incorrect'}">
                            <span class="label">${isCorrect ? '✓ 你的答案正確！' : '✗ 你的答案'}</span>
                            (${String.fromCharCode(65 + userAnswer)}) ${q.o[userAnswer]} - ${trans.options[userAnswer].zh}
                        </div>
                    ` : `
                        <div class="user-answer-box">
                            <span class="label">➤ 你未作答此題</span>
                        </div>
                    `}
                    
                    <div class="answer-box">
                        <span class="label">✓ 正確答案解析</span>
                        ${q.o[correctAnswer]} - ${trans.options[correctAnswer].zh}
                    </div>
                    
                    <div class="options-explanation">
                        <span class="label">📝 所有選項中文翻譯</span>
                        ${trans.options.map((opt, idx) => `
                            <div class="option-item ${idx === correctAnswer ? 'correct-answer' : ''} ${idx === userAnswer && idx !== correctAnswer ? 'user-selected incorrect' : ''}">
                                (${String.fromCharCode(65 + idx)}) <strong>${opt.en}</strong> - ${opt.zh}
                                ${idx === correctAnswer ? ' ✓ 正確答案' : ''}
                                ${idx === userAnswer && idx !== correctAnswer ? ' ✗ 你的選擇' : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;
    }

    generateClozeReview() {
        const sections = EXAM_DATA.sections;
        const translations = this.getClozeTranslations();
        const container = document.getElementById('clozeReview');
        let html = '';

        for (let i = 11; i <= 20; i++) {
            const q = sections.cloze.questions[i - 11];
            const userAnswer = this.userAnswers[i];
            const correctAnswer = q.a;
            const isCorrect = userAnswer === correctAnswer;
            const trans = translations[i];

            html += `
                <div class="question-review ${isCorrect ? 'correct' : (userAnswer !== undefined ? 'incorrect' : '')}">
                    <div class="qnum">${i}. 正確答案：(${String.fromCharCode(65 + correctAnswer)}) ${q.o[correctAnswer]}</div>
                    <div class="qtext">${q.q}</div>
                    
                    ${userAnswer !== undefined ? `
                        <div class="user-answer-box ${isCorrect ? 'correct' : 'incorrect'}">
                            <span class="label">${isCorrect ? '✓ 你的答案正確！' : '✗ 你的答案'}</span>
                            (${String.fromCharCode(65 + userAnswer)}) ${q.o[userAnswer]} - ${trans.options[userAnswer].zh}
                        </div>
                    ` : `
                        <div class="user-answer-box">
                            <span class="label">➤ 你未作答此題</span>
                        </div>
                    `}
                    
                    <div class="answer-box">
                        <span class="label">✓ 正確答案解析</span>
                        ${q.o[correctAnswer]} - ${trans.options[correctAnswer].zh}
                    </div>
                    
                    <div class="options-explanation">
                        <span class="label">📝 所有選項中文翻譯</span>
                        ${trans.options.map((opt, idx) => `
                            <div class="option-item ${idx === correctAnswer ? 'correct-answer' : ''} ${idx === userAnswer && idx !== correctAnswer ? 'user-selected incorrect' : ''}">
                                (${String.fromCharCode(65 + idx)}) <strong>${opt.en}</strong> - ${opt.zh}
                                ${idx === correctAnswer ? ' ✓ 正確答案' : ''}
                                ${idx === userAnswer && idx !== correctAnswer ? ' ✗ 你的選擇' : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;
    }

    generateFillReview() {
        const sections = EXAM_DATA.sections;
        const translations = this.getFillTranslations();
        const container = document.getElementById('fillReview');
        let html = '';

        for (let i = 21; i <= 30; i++) {
            const q = sections.fill.questions[i - 21];
            const userAnswer = this.userAnswers[i];
            const correctAnswer = q.a;
            const isCorrect = userAnswer === correctAnswer;
            const allOptions = sections.fill.options;

            html += `
                <div class="question-review ${isCorrect ? 'correct' : (userAnswer !== undefined ? 'incorrect' : '')}">
                    <div class="qnum">${i}. 正確答案：(${String.fromCharCode(65 + correctAnswer)}) ${allOptions[correctAnswer]}</div>
                    <div class="qtext">${q.q}</div>
                    
                    ${userAnswer !== undefined ? `
                        <div class="user-answer-box ${isCorrect ? 'correct' : 'incorrect'}">
                            <span class="label">${isCorrect ? '✓ 你的答案正確！' : '✗ 你的答案'}</span>
                            (${String.fromCharCode(65 + userAnswer)}) ${allOptions[userAnswer]} - ${translations[userAnswer].zh}
                        </div>
                    ` : `
                        <div class="user-answer-box">
                            <span class="label">➤ 你未作答此題</span>
                        </div>
                    `}
                    
                    <div class="answer-box">
                        <span class="label">✓ 正確答案解析</span>
                        ${allOptions[correctAnswer]} - ${translations[correctAnswer].zh}
                    </div>
                    
                    <div class="options-explanation">
                        <span class="label">📝 所有選項中文翻譯</span>
                        ${translations.map((opt, idx) => `
                            <div class="option-item ${idx === correctAnswer ? 'correct-answer' : ''} ${idx === userAnswer && idx !== correctAnswer ? 'user-selected incorrect' : ''}">
                                (${String.fromCharCode(65 + idx)}) <strong>${opt.en}</strong> - ${opt.zh}
                                ${idx === correctAnswer ? ' ✓ 正確答案' : ''}
                                ${idx === userAnswer && idx !== correctAnswer ? ' ✗ 你的選擇' : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;
    }
}

// Initialize review when page loads
window.onload = () => new ReviewGenerator();
