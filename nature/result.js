// 載入考試資料與結果
let examData = null;
let results = null;

document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    calculateScores();
    displayResults();
    analyzeWeaknesses();
    generateRecommendations();
    displayWrongQuestions();
});

// 載入資料
async function loadData() {
    // 載入試題資料
    const response = await fetch('exam-data.json');
    examData = await response.json();

    // 載入考試結果
    const savedResults = localStorage.getItem('examResults');
    if (!savedResults) {
        alert('找不到考試結果,將返回首頁');
        window.location.href = 'index.html';
        return;
    }
    results = JSON.parse(savedResults);
}

// 計算成績
function calculateScores() {
    let correct = 0;
    const subjectScores = {
        physics: { correct: 0, total: 0 },
        chemistry: { correct: 0, total: 0 },
        biology: { correct: 0, total: 0 },
        earth: { correct: 0, total: 0 }
    };

    examData.questions.forEach((question, index) => {
        const userAnswer = results.answers[index];
        const isCorrect = userAnswer === question.correctAnswer;

        if (isCorrect) {
            correct++;
            subjectScores[question.subject].correct++;
        }
        subjectScores[question.subject].total++;
    });

    results.correctCount = correct;
    results.totalCount = examData.questions.length;
    results.percentage = ((correct / examData.questions.length) * 100).toFixed(1);
    results.subjectScores = subjectScores;
}

// 顯示成績
function displayResults() {
    // 總分
    document.getElementById('totalScore').textContent = `${results.percentage}%`;
    document.getElementById('correctCount').textContent = results.correctCount;
    document.getElementById('totalCount').textContent = results.totalCount;

    // 作答時間
    const minutes = Math.floor(results.timeSpent / 60);
    const seconds = results.timeSpent % 60;
    document.getElementById('timeSpent').textContent = `${minutes}分${seconds}秒`;

    // 各科成績
    const subjectNames = {
        physics: '物理',
        chemistry: '化學',
        biology: '生物',
        earth: '地球科學'
    };

    const subjectScoresDiv = document.getElementById('subjectScores');
    Object.keys(results.subjectScores).forEach(subject => {
        const score = results.subjectScores[subject];
        const percentage = ((score.correct / score.total) * 100).toFixed(1);

        const card = document.createElement('div');
        card.className = 'subject-card';
        card.innerHTML = `
            <h3>${subjectNames[subject]}</h3>
            <div class="score-circle">${percentage}%</div>
            <p style="text-align: center; color: #666;">
                答對 ${score.correct} / ${score.total} 題
            </p>
        `;
        subjectScoresDiv.appendChild(card);
    });
}

// 分析學習盲點
function analyzeWeaknesses() {
    const weaknessDiv = document.getElementById('weaknessAnalysis');
    const weaknesses = [];

    // 1. 科別分析
    const subjectNames = {
        physics: '物理',
        chemistry: '化學',
        biology: '生物',
        earth: '地球科學'
    };

    Object.keys(results.subjectScores).forEach(subject => {
        const score = results.subjectScores[subject];
        const percentage = (score.correct / score.total) * 100;

        if (percentage < 60) {
            weaknesses.push({
                type: 'subject',
                subject: subjectNames[subject],
                percentage: percentage.toFixed(1),
                description: `${subjectNames[subject]}科表現較弱,答對率僅${percentage.toFixed(1)}%,需要加強基礎概念。`
            });
        }
    });

    // 2. 題型分析
    const topicErrors = {};
    examData.questions.forEach((question, index) => {
        if (results.answers[index] !== question.correctAnswer) {
            if (!topicErrors[question.topic]) {
                topicErrors[question.topic] = { count: 0, subject: question.subject };
            }
            topicErrors[question.topic].count++;
        }
    });

    // 找出錯誤最多的主題
    const sortedTopics = Object.entries(topicErrors)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 3);

    sortedTopics.forEach(([topic, data]) => {
        weaknesses.push({
            type: 'topic',
            topic: topic,
            count: data.count,
            description: `在「${topic}」單元錯誤${data.count}題,建議重點複習此單元。`
        });
    });

    // 3. 認知層次分析
    const cognitiveErrors = {};
    examData.questions.forEach((question, index) => {
        if (results.answers[index] !== question.correctAnswer) {
            const level = question.cognitiveLevel;
            cognitiveErrors[level] = (cognitiveErrors[level] || 0) + 1;
        }
    });

    if (cognitiveErrors.application > 5) {
        weaknesses.push({
            type: 'cognitive',
            description: '在「應用」層次的題目錯誤較多,建議多練習將概念應用於實際情境的題型。'
        });
    }

    // 顯示盲點
    if (weaknesses.length === 0) {
        weaknessDiv.innerHTML = '<p style="color: #4caf50; font-weight: bold;">🎉 表現優異!沒有明顯的學習盲點。</p>';
    } else {
        weaknesses.forEach(weakness => {
            const item = document.createElement('div');
            item.className = 'weakness-item';
            item.innerHTML = `<strong>⚠️ ${weakness.description}</strong>`;
            weaknessDiv.appendChild(item);
        });
    }
}

// 生成補救建議
function generateRecommendations() {
    const recommendDiv = document.getElementById('recommendations');
    const recommendations = [];

    // 根據總分給建議
    if (results.percentage < 60) {
        recommendations.push({
            title: '基礎觀念加強',
            content: '建議從課本基礎概念開始複習,確實理解每個單元的核心原理,不要急著做題目。'
        });
    } else if (results.percentage < 80) {
        recommendations.push({
            title: '觀念應用練習',
            content: '基礎觀念掌握不錯,建議多練習情境題與跨章節整合題,提升應用能力。'
        });
    } else {
        recommendations.push({
            title: '精進提升',
            content: '表現優異!建議挑戰較難的題型,並注意細節與陷阱,力求滿分。'
        });
    }

    // 針對弱科給建議
    Object.keys(results.subjectScores).forEach(subject => {
        const score = results.subjectScores[subject];
        const percentage = (score.correct / score.total) * 100;

        if (percentage < 70) {
            const subjectNames = {
                physics: '物理',
                chemistry: '化學',
                biology: '生物',
                earth: '地球科學'
            };

            const tips = {
                physics: '建議重點複習力學、電磁學基本公式,多做計算練習,熟悉單位換算。',
                chemistry: '建議加強化學式、化學反應式的理解,多練習計量與平衡相關題型。',
                biology: '建議整理各系統的功能與關聯,善用圖表記憶,理解生命現象的因果關係。',
                earth: '建議多看圖表資料,理解地球系統的交互作用,注意時事與環境議題。'
            };

            recommendations.push({
                title: `${subjectNames[subject]}科加強`,
                content: tips[subject]
            });
        }
    });

    // 應考策略建議
    recommendations.push({
        title: '應考策略',
        content: '建議先快速瀏覽全卷,先做有把握的題目,遇到困難題目先跳過,最後再回來思考。注意時間分配,每題平均約1.6分鐘。'
    });

    // 顯示建議
    recommendations.forEach(rec => {
        const item = document.createElement('div');
        item.className = 'recommendation-item';
        item.innerHTML = `
            <strong>✅ ${rec.title}</strong>
            <p style="margin-top: 8px;">${rec.content}</p>
        `;
        recommendDiv.appendChild(item);
    });
}

// 顯示錯題
function displayWrongQuestions() {
    const wrongDiv = document.getElementById('wrongQuestions');
    const wrongQuestions = [];

    examData.questions.forEach((question, index) => {
        if (results.answers[index] !== question.correctAnswer) {
            wrongQuestions.push({ question, index, userAnswer: results.answers[index] });
        }
    });

    if (wrongQuestions.length === 0) {
        wrongDiv.innerHTML = '<p style="color: #4caf50; font-weight: bold;">🎉 全部答對!沒有錯題。</p>';
        return;
    }

    wrongQuestions.forEach(({ question, index, userAnswer }) => {
        const item = document.createElement('div');
        item.className = 'wrong-question-item';

        const userAnswerText = userAnswer !== null ? question.options[userAnswer] : '未作答';
        const correctAnswerText = question.options[question.correctAnswer];

        item.innerHTML = `
            <div class="question-header">第 ${index + 1} 題 - ${getSubjectName(question.subject)} - ${question.topic}</div>
            <p style="line-height: 1.8; margin: 15px 0;">${question.question}</p>
            
            <div class="answer-comparison">
                <div class="your-answer">
                    <strong>❌ 您的答案:</strong><br>
                    ${userAnswerText}
                </div>
                <div class="correct-answer">
                    <strong>✅ 正確答案:</strong><br>
                    ${correctAnswerText}
                </div>
            </div>
            
            <div class="explanation">
                <strong>📖 詳細解析:</strong><br>
                ${question.explanation}
                <br><br>
                <strong>🔑 關鍵概念:</strong> ${question.keyPoints.join('、')}
                <br>
                <strong>⚠️ 常見錯誤:</strong> ${question.commonErrors.join('、')}
            </div>
        `;

        wrongDiv.appendChild(item);
    });
}

// 取得科目名稱
function getSubjectName(subject) {
    const names = {
        physics: '物理',
        chemistry: '化學',
        biology: '生物',
        earth: '地球科學'
    };
    return names[subject] || subject;
}

// 重新測驗
function retakeExam() {
    localStorage.removeItem('studentAnswers');
    localStorage.removeItem('examResults');
    window.location.href = 'index.html';
}
