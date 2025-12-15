// Main Application Logic
class ExamApp {
    constructor() {
        this.currentQ = 1;
        this.answers = {};
        this.strikethroughs = {}; // 儲存劃掉狀態
        this.timeLeft = EXAM_DATA.time;
        this.timer = null;
        this.init();
    }

    init() {
        this.loadState();
        this.renderNav();
        this.renderQuestion();
        this.startTimer();
        this.bindEvents();
    }

    loadState() {
        const saved = localStorage.getItem('examState');
        if (saved) {
            const state = JSON.parse(saved);
            this.answers = state.answers || {};
            this.strikethroughs = state.strikethroughs || {}; // 載入劃掉狀態
            this.timeLeft = state.timeLeft || EXAM_DATA.time;
            this.currentQ = state.currentQ || 1;
        }
    }

    saveState() {
        localStorage.setItem('examState', JSON.stringify({
            answers: this.answers,
            strikethroughs: this.strikethroughs, // 儲存劃掉狀態
            timeLeft: this.timeLeft,
            currentQ: this.currentQ
        }));
    }

    renderNav() {
        const grid = document.getElementById('navGrid');
        grid.innerHTML = '';
        for (let i = 1; i <= 50; i++) {
            const btn = document.createElement('button');
            btn.className = 'nav-btn';
            btn.textContent = i;
            if (this.answers[i]) btn.classList.add('answered');
            if (i === this.currentQ) btn.classList.add('current');
            btn.onclick = () => this.goToQuestion(i);
            grid.appendChild(btn);
        }
        this.updateProgress();
    }

    updateProgress() {
        const answered = Object.keys(this.answers).length;
        document.getElementById('progress').textContent = `進度: ${answered}/50`;
    }

    // 取得第21題到第N-1題已選過的答案文字（用於第22-30題自動劃掉判斷）
    getSelectedAnswersFromQ21toN(currentQ) {
        const selectedAnswers = new Set();
        const sections = EXAM_DATA.sections;

        // 只處理第22-30題的情況
        if (currentQ < 22 || currentQ > 30) {
            return selectedAnswers;
        }

        // 檢查第21題到第(currentQ-1)題
        for (let i = 21; i < currentQ; i++) {
            if (this.answers[i] !== undefined) {
                const q = sections.fill.questions[i - 21];
                const selectedOptionText = sections.fill.options[this.answers[i]];
                selectedAnswers.add(selectedOptionText);
            }
        }

        return selectedAnswers;
    }

    renderQuestion() {
        const q = this.getQuestion(this.currentQ);
        const area = document.getElementById('questionArea');
        const section = document.getElementById('sectionTitle');
        const content = document.getElementById('questionContent');

        section.textContent = q.section;

        // Display passage if exists
        let passageHTML = '';
        if (q.passage) {
            passageHTML = `<div style="background:#e8f4f8;padding:1.5rem;margin:1rem 0;border-left:4px solid #3498db;line-height:1.8;white-space:pre-wrap;">${q.passage}</div>`;
        }

        if (q.type === 'choice') {
            // 判斷是否為第22-30題，需要自動劃掉已選過的答案（逐題向前比對）
            const isQ22to30 = this.currentQ >= 22 && this.currentQ <= 30;
            const selectedAnswers = isQ22to30 ? this.getSelectedAnswersFromQ21toN(this.currentQ) : new Set();

            content.innerHTML = `
                ${passageHTML}
                <div class="question-text">
                    <strong>${this.currentQ}. </strong>${q.question}
                </div>
                <div class="options">
                    ${q.options.map((opt, i) => {
                // 檢查是否需要預設劃掉（第22-30題且答案在第21到N-1題中已被選過）
                const shouldAutoStrike = isQ22to30 && selectedAnswers.has(opt);
                const strikeKey = `${this.currentQ}_${i}`;
                // 如果沒有手動設定過，則使用自動判斷；否則使用手動設定
                const isStrikethrough = this.strikethroughs[strikeKey] !== undefined
                    ? this.strikethroughs[strikeKey]
                    : shouldAutoStrike;

                return `
                        <div class="option">
                            <input type="radio" name="q${this.currentQ}" id="opt${i}" value="${i}" 
                                ${this.answers[this.currentQ] == i ? 'checked' : ''}>
                            <label for="opt${i}" class="${isStrikethrough ? 'strikethrough' : ''}" data-option-index="${i}">
                                (${String.fromCharCode(65 + i)}) ${opt}
                            </label>
                            <button class="strike-btn ${isStrikethrough ? 'active' : ''}" data-option-index="${i}" title="劃掉/取消劃掉">
                                ✕
                            </button>
                        </div>
                    `}).join('')}
                </div>
            `;

            // 綁定選項選擇事件
            content.querySelectorAll('input[type="radio"]').forEach(input => {
                input.onchange = () => this.saveAnswer(this.currentQ, parseInt(input.value));
            });

            // 綁定劃掉按鈕事件
            content.querySelectorAll('.strike-btn').forEach(btn => {
                btn.onclick = (e) => {
                    e.preventDefault();
                    const optionIndex = btn.getAttribute('data-option-index');
                    this.toggleStrikethrough(this.currentQ, optionIndex);
                };
            });

        } else if (q.type === 'multi') {
            content.innerHTML = `
                ${passageHTML}
                <div class="question-text">
                    <strong>${this.currentQ}. </strong>${q.question}
                </div>
                <div class="options">
                    ${q.options.map((opt, i) => {
                const strikeKey = `${this.currentQ}_${i}`;
                const isStrikethrough = this.strikethroughs[strikeKey] || false;

                return `
                        <div class="option">
                            <input type="checkbox" id="opt${i}" value="${i}" 
                                ${this.answers[this.currentQ]?.includes(i) ? 'checked' : ''}>
                            <label for="opt${i}" class="${isStrikethrough ? 'strikethrough' : ''}" data-option-index="${i}">
                                (${String.fromCharCode(65 + i)}) ${opt}
                            </label>
                            <button class="strike-btn ${isStrikethrough ? 'active' : ''}" data-option-index="${i}" title="劃掉/取消劃掉">
                                ✕
                            </button>
                        </div>
                    `}).join('')}
                </div>
            `;

            content.querySelectorAll('input[type="checkbox"]').forEach(input => {
                input.onchange = () => {
                    const checked = Array.from(content.querySelectorAll('input[type="checkbox"]:checked'))
                        .map(cb => parseInt(cb.value));
                    this.saveAnswer(this.currentQ, checked);
                };
            });

            // 綁定劃掉按鈕事件
            content.querySelectorAll('.strike-btn').forEach(btn => {
                btn.onclick = (e) => {
                    e.preventDefault();
                    const optionIndex = btn.getAttribute('data-option-index');
                    this.toggleStrikethrough(this.currentQ, optionIndex);
                };
            });

        } else if (q.type === 'fill') {
            content.innerHTML = `
                ${passageHTML}
                <div class="question-text">
                    <strong>${this.currentQ}. </strong>${q.question}
                </div>
                <input type="text" class="fill-input" placeholder="請輸入答案" 
                    value="${this.answers[this.currentQ] || ''}" style="width:100%;padding:0.75rem;font-size:1rem;border:2px solid #ddd;border-radius:4px;">
            `;
            const input = content.querySelector('.fill-input');
            input.oninput = () => this.saveAnswer(this.currentQ, input.value.trim());
        }

        document.getElementById('prevBtn').disabled = this.currentQ === 1;
        document.getElementById('nextBtn').disabled = this.currentQ === 50;
    }

    // 切換劃掉狀態
    toggleStrikethrough(qNum, optionIndex) {
        const strikeKey = `${qNum}_${optionIndex}`;
        this.strikethroughs[strikeKey] = !this.strikethroughs[strikeKey];

        // 更新UI
        const label = document.querySelector(`label[data-option-index="${optionIndex}"]`);
        const btn = document.querySelector(`.strike-btn[data-option-index="${optionIndex}"]`);

        if (this.strikethroughs[strikeKey]) {
            label.classList.add('strikethrough');
            btn.classList.add('active');
        } else {
            label.classList.remove('strikethrough');
            btn.classList.remove('active');
        }

        this.saveState();
    }

    getQuestion(num) {
        const sections = EXAM_DATA.sections;

        // Vocabulary (1-10)
        if (num <= 10) {
            const q = sections.vocab.questions[num - 1];
            return { section: sections.vocab.title, type: 'choice', question: q.q, options: q.o, answer: q.a };
        }
        // Cloze Test (11-20)
        else if (num <= 20) {
            const q = sections.cloze.questions[num - 11];
            const passage = q.passage === 1 ? sections.cloze.passage1 : sections.cloze.passage2;
            return { section: sections.cloze.title, type: 'choice', question: q.q, options: q.o, answer: q.a, passage: passage };
        }
        // Fill-in (21-30)
        else if (num <= 30) {
            const q = sections.fill.questions[num - 21];
            return { section: sections.fill.title, type: 'choice', question: q.q, options: sections.fill.options, answer: q.a, passage: sections.fill.passage };
        }
        // Discourse Structure (31-34)
        else if (num <= 34) {
            const q = sections.structure.questions[num - 31];
            return { section: sections.structure.title, type: 'choice', question: q.q, options: q.o, answer: q.a, passage: sections.structure.passage };
        }
        // Reading Comprehension (35-46)
        else if (num <= 46) {
            const q = sections.reading.questions[num - 35];
            const passage = sections.reading.passages[q.passage - 1];
            const passageText = `<strong>${passage.title}</strong>\n\n${passage.text}`;
            return { section: sections.reading.title, type: 'choice', question: q.q, options: q.o, answer: q.a, passage: passageText };
        }
        // Mixed Questions (47-50)
        else {
            const q = sections.mixed.questions[num - 47];
            const passage = sections.mixed.passage;
            if (q.type === 'fill') {
                return { section: sections.mixed.title, type: 'fill', question: q.q, answer: q.a, passage: passage };
            } else if (q.type === 'multi') {
                return { section: sections.mixed.title, type: 'multi', question: q.q, options: q.o, answer: q.a, passage: passage };
            } else {
                return { section: sections.mixed.title, type: 'fill', question: q.q, answer: q.a, passage: passage };
            }
        }
    }

    saveAnswer(qNum, answer) {
        this.answers[qNum] = answer;
        this.saveState();
        this.renderNav();
    }

    goToQuestion(num) {
        this.currentQ = num;
        this.renderQuestion();
        this.renderNav();
        this.saveState();
    }

    startTimer() {
        this.updateTimer();
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimer();
            if (this.timeLeft <= 0) {
                this.submitExam();
            }
            if (this.timeLeft % 30 === 0) {
                this.saveState();
            }
        }, 1000);
    }

    updateTimer() {
        const mins = Math.floor(this.timeLeft / 60);
        const secs = this.timeLeft % 60;
        const display = `${mins}:${secs.toString().padStart(2, '0')}`;
        const timerEl = document.getElementById('timer');
        timerEl.textContent = display;
        if (this.timeLeft < 600) {
            timerEl.classList.add('warning');
        }
    }

    submitExam() {
        clearInterval(this.timer);
        const score = this.calculateScore();
        this.showResults(score);
    }

    calculateScore() {
        let total = 0;
        const sections = EXAM_DATA.sections;

        // Vocab (1-10): 1 point each
        for (let i = 1; i <= 10; i++) {
            if (this.answers[i] === sections.vocab.questions[i - 1].a) total += 1;
        }

        // Cloze (11-20): 1 point each
        for (let i = 11; i <= 20; i++) {
            if (this.answers[i] === sections.cloze.questions[i - 11].a) total += 1;
        }

        // Fill (21-30): 1 point each
        for (let i = 21; i <= 30; i++) {
            if (this.answers[i] === sections.fill.questions[i - 21].a) total += 1;
        }

        // Structure (31-34): 2 points each
        for (let i = 31; i <= 34; i++) {
            if (this.answers[i] === sections.structure.questions[i - 31].a) total += 2;
        }

        // Reading (35-46): 2 points each
        for (let i = 35; i <= 46; i++) {
            if (this.answers[i] === sections.reading.questions[i - 35].a) total += 2;
        }

        // Mixed Q49 (multi-choice): 4 points with partial credit
        const q49 = sections.mixed.questions[2];
        if (this.answers[49]) {
            const correct = q49.a;
            const user = this.answers[49];
            const n = q49.o.length;
            let wrong = 0;
            user.forEach(u => { if (!correct.includes(u)) wrong++; });
            correct.forEach(c => { if (!user.includes(c)) wrong++; });
            if (wrong === 0) total += 4;
            else {
                const partial = (2 * n - wrong) / n;
                total += Math.max(0, partial);
            }
        }

        return total;
    }

    showResults(score) {
        const modal = document.getElementById('resultsModal');
        const content = document.getElementById('resultsContent');
        content.innerHTML = `
            <div style="text-align:center;font-size:1.5rem;margin:2rem 0;">
                <div style="font-size:3rem;color:#3498db;font-weight:bold;">${score.toFixed(1)}</div>
                <div style="color:#7f8c8d;">/ 62 分 (客觀題)</div>
            </div>
            <p style="color:#e74c3c;margin-top:1rem;">
                ※ 翻譯 (8分) 與作文 (20分) 需教師或自我評量
            </p>
        `;
        modal.classList.add('active');
    }

    bindEvents() {
        document.getElementById('prevBtn').onclick = () => {
            if (this.currentQ > 1) this.goToQuestion(this.currentQ - 1);
        };
        document.getElementById('nextBtn').onclick = () => {
            if (this.currentQ < 50) this.goToQuestion(this.currentQ + 1);
        };
        document.getElementById('submitBtn').onclick = () => {
            if (confirm('確定要交卷嗎？')) this.submitExam();
        };
        document.getElementById('reviewBtn').onclick = () => {
            window.open('review-dynamic.html', '_blank');
        };
        document.getElementById('closeBtn').onclick = () => {
            document.getElementById('resultsModal').classList.remove('active');
        };
    }
}

// Initialize app when page loads
window.onload = () => new ExamApp();
