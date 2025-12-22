// 全域變數
let examData = null;
let currentQuestion = 0;
let studentAnswers = [];
let startTime = null;

// 初始化
document.addEventListener('DOMContentLoaded', async () => {
    await loadExamData();
    initializeExam();
    setupEventListeners();
    startTimer();
});

// Fisher-Yates 洗牌演算法
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// 載入試題資料
async function loadExamData() {
    try {
        const response = await fetch('exam-data.json');
        const data = await response.json();

        // 隨機打亂題目順序
        examData = {
            ...data,
            questions: shuffleArray(data.questions)
        };

        // 重新編號題目ID
        examData.questions.forEach((q, index) => {
            q.id = index + 1;
        });

        studentAnswers = new Array(examData.questions.length).fill(null);

        console.log('✅ 題目已隨機化!每次測驗都會有不同的題目順序');
    } catch (error) {
        console.error('載入試題失敗:', error);
        alert('試題載入失敗,請重新整理頁面');
    }
}

// 初始化考試
function initializeExam() {
    document.getElementById('totalQuestions').textContent = examData.questions.length;
    createAnswerGrid();
    displayQuestion(0);
    loadSavedAnswers();
}

// 建立答案卡
function createAnswerGrid() {
    const grid = document.getElementById('answerGrid');
    examData.questions.forEach((_, index) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = index + 1;
        btn.onclick = () => goToQuestion(index);
        grid.appendChild(btn);
    });
}

// 顯示題目
function displayQuestion(index) {
    currentQuestion = index;
    const question = examData.questions[index];

    // 更新題號
    document.getElementById('questionNumber').textContent = `第 ${index + 1} 題`;

    // 顯示題目內容
    const contentDiv = document.getElementById('questionContent');
    contentDiv.innerHTML = `
        <span class="subject-tag subject-${question.subject}">${getSubjectName(question.subject)}</span>
        <p>${question.question}</p>
    `;

    // 顯示選項
    const optionsDiv = document.getElementById('optionsContainer');
    optionsDiv.innerHTML = '';
    question.options.forEach((option, i) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        if (studentAnswers[index] === i) {
            optionDiv.classList.add('selected');
        }
        optionDiv.innerHTML = `<strong>${String.fromCharCode(65 + i)}.</strong> ${option}`;
        optionDiv.onclick = () => selectAnswer(i);
        optionsDiv.appendChild(optionDiv);
    });

    // 更新導航按鈕
    document.getElementById('prevBtn').disabled = index === 0;
    document.getElementById('nextBtn').disabled = index === examData.questions.length - 1;

    // 更新答案卡
    updateAnswerGrid();
}

// 選擇答案
function selectAnswer(optionIndex) {
    studentAnswers[currentQuestion] = optionIndex;
    saveAnswers();
    displayQuestion(currentQuestion);
    updateProgress();
}

// 更新答案卡
function updateAnswerGrid() {
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach((btn, index) => {
        btn.classList.remove('current', 'answered');
        if (index === currentQuestion) {
            btn.classList.add('current');
        }
        if (studentAnswers[index] !== null) {
            btn.classList.add('answered');
        }
    });
}

// 更新進度
function updateProgress() {
    const answered = studentAnswers.filter(a => a !== null).length;
    const total = examData.questions.length;
    const percentage = (answered / total) * 100;

    document.getElementById('progressFill').style.width = `${percentage}%`;
    document.getElementById('progressText').textContent = `已作答: ${answered}/${total}`;
}

// 跳轉題目
function goToQuestion(index) {
    displayQuestion(index);
}

// 上一題
function prevQuestion() {
    if (currentQuestion > 0) {
        displayQuestion(currentQuestion - 1);
    }
}

// 下一題
function nextQuestion() {
    if (currentQuestion < examData.questions.length - 1) {
        displayQuestion(currentQuestion + 1);
    }
}

// 計時器
function startTimer() {
    startTime = Date.now();
    setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const hours = Math.floor(elapsed / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        const seconds = elapsed % 60;
        document.getElementById('timer').textContent =
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

// 儲存答案到localStorage
function saveAnswers() {
    localStorage.setItem('studentAnswers', JSON.stringify(studentAnswers));
}

// 載入已儲存的答案
function loadSavedAnswers() {
    const saved = localStorage.getItem('studentAnswers');
    if (saved) {
        studentAnswers = JSON.parse(saved);
        updateProgress();
        updateAnswerGrid();
    }
}

// 交卷
function submitExam() {
    const unanswered = studentAnswers.filter(a => a === null).length;
    const modal = document.getElementById('submitModal');
    const warning = document.getElementById('submitWarning');

    if (unanswered > 0) {
        warning.textContent = `您還有 ${unanswered} 題未作答,確定要交卷嗎?`;
    } else {
        warning.textContent = '確定要交卷嗎?';
    }

    modal.classList.add('active');
}

// 確認交卷
function confirmSubmit() {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const results = {
        answers: studentAnswers,
        timeSpent: timeSpent,
        timestamp: new Date().toISOString(),
        examData: examData  // 儲存隨機後的題目順序
    };

    localStorage.setItem('examResults', JSON.stringify(results));
    window.location.href = 'result.html';
}

// 取消交卷
function cancelSubmit() {
    document.getElementById('submitModal').classList.remove('active');
}

// 取得科目名稱
function getSubjectName(subject) {
    const names = {
        'physics': '物理',
        'chemistry': '化學',
        'biology': '生物',
        'earth': '地球科學'
    };
    return names[subject] || subject;
}

// 事件監聽器
function setupEventListeners() {
    document.getElementById('prevBtn').onclick = prevQuestion;
    document.getElementById('nextBtn').onclick = nextQuestion;
    document.getElementById('submitBtn').onclick = submitExam;
    document.getElementById('confirmSubmit').onclick = confirmSubmit;
    document.getElementById('cancelSubmit').onclick = cancelSubmit;

    // 鍵盤快捷鍵
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevQuestion();
        if (e.key === 'ArrowRight') nextQuestion();
        if (e.key >= '1' && e.key <= '5') {
            const optionIndex = parseInt(e.key) - 1;
            if (optionIndex < examData.questions[currentQuestion].options.length) {
                selectAnswer(optionIndex);
            }
        }
    });
}
