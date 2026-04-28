document.addEventListener("DOMContentLoaded", () => {

    /* --- TABS NAV LOGIC --- */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.getAttribute('data-target')).classList.add('active');
        });
    });

    const studentNameInput = document.getElementById('student-name');

    /* =========================================
       ACT 1: READ & PLOT (Interactive Chart)
    ========================================= */
    const ctxPlot = document.getElementById('plotChart').getContext('2d');
    const months = ['Jan', 'Mar', 'Jun', 'Oct', 'Dec'];
    
    // Original data based on PDF description
    const trueMaleData = [20, 18, 70, 70, 15];
    const trueFemaleData = [40, 60, 70, 62, 60];

    // Student interactive data arrays
    let studentMaleData = [0, 0, 0, 0, 0];
    let studentFemaleData = [0, 0, 0, 0, 0];

    let isRevealed = false;

    const plotChart = new Chart(ctxPlot, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Male (Your Plot)',
                    data: studentMaleData,
                    borderColor: '#3B82F6',
                    backgroundColor: '#3B82F6',
                    borderWidth: 3,
                    borderDash: [5, 5],
                    tension: 0.1
                },
                {
                    label: 'Female (Your Plot)',
                    data: studentFemaleData,
                    borderColor: '#EF4444',
                    backgroundColor: '#EF4444',
                    borderWidth: 3,
                    borderDash: [5, 5],
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { min: 0, max: 80, ticks: { stepSize: 10 } }
            },
            plugins: {
                legend: { position: 'top' }
            }
        }
    });

    // Slider Logic
    const maleSliders = ['m-jan', 'm-mar', 'm-jun', 'm-oct', 'm-dec'];
    const femaleSliders = ['f-jan', 'f-mar', 'f-jun', 'f-oct', 'f-dec'];

    function updatePlotChart() {
        maleSliders.forEach((id, idx) => {
            const val = document.getElementById(id).value;
            studentMaleData[idx] = parseInt(val);
            document.getElementById(id).nextElementSibling.textContent = val;
        });
        femaleSliders.forEach((id, idx) => {
            const val = document.getElementById(id).value;
            studentFemaleData[idx] = parseInt(val);
            document.getElementById(id).nextElementSibling.textContent = val;
        });
        plotChart.update();
    }

    [...maleSliders, ...femaleSliders].forEach(id => {
        document.getElementById(id).addEventListener('input', updatePlotChart);
    });

    // Reveal Logic
    document.getElementById('reveal-btn').addEventListener('click', function() {
        if (!isRevealed) {
            plotChart.data.datasets.push({
                label: 'Male (Original)',
                data: trueMaleData,
                borderColor: 'rgba(59, 130, 246, 0.3)',
                backgroundColor: 'rgba(59, 130, 246, 0.3)',
                borderWidth: 5,
                tension: 0.1,
                fill: false
            });
            plotChart.data.datasets.push({
                label: 'Female (Original)',
                data: trueFemaleData,
                borderColor: 'rgba(239, 68, 68, 0.3)',
                backgroundColor: 'rgba(239, 68, 68, 0.3)',
                borderWidth: 5,
                tension: 0.1,
                fill: false
            });
            plotChart.update();
            this.innerHTML = "Hide Original Graph <i class='fa-solid fa-eye-slash'></i>";
            isRevealed = true;
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        } else {
            plotChart.data.datasets.pop();
            plotChart.data.datasets.pop();
            plotChart.update();
            this.innerHTML = "Reveal Original Graph <i class='fa-solid fa-eye'></i>";
            isRevealed = false;
        }
    });

    /* =========================================
       ACT 2: ANALYZE & DESCRIBE
    ========================================= */
    // Static Chart
    const ctxAnalyze = document.getElementById('analyzeChart').getContext('2d');
    const analyzeChart = new Chart(ctxAnalyze, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Male',
                    data: [10, 15, 20, 25, 30, 50, 65, 70, 75, 75, 78, 80],
                    borderColor: '#3B82F6',
                    backgroundColor: '#3B82F6',
                    borderWidth: 3,
                    borderDash: [5, 5],
                    tension: 0.3
                },
                {
                    label: 'Female',
                    data: [70, 70, 65, 60, 60, 55, 50, 45, 40, 40, 30, 20],
                    borderColor: '#EF4444',
                    backgroundColor: '#EF4444',
                    borderWidth: 3,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { min: 0, max: 80, ticks: { stepSize: 10 } }
            },
            plugins: { legend: { position: 'top' } }
        }
    });

    // Vocabulary Tracker
    const targetVocab = [
        "lasting", "barely perceptible", "hugely significant", "entirely unnoticed",
        "noticeable", "a steady shift", "on the increase", "subtle", "ongoing",
        "a rapid rise", "gradually giving way", "on the way out", "taking hold", "grown substantially"
    ];

    const vocabListUI = document.getElementById('vocab-list');
    const vocabCounter = document.getElementById('vocab-counter');
    const reportText = document.getElementById('report-text');
    let wordsFound = 0;

    targetVocab.forEach((word, idx) => {
        const li = document.createElement('li');
        li.className = 'vocab-item';
        li.id = `vocab-${idx}`;
        li.innerHTML = `<span>${word}</span> <i class="fa-regular fa-circle"></i>`;
        vocabListUI.appendChild(li);
    });

    reportText.addEventListener('input', () => {
        const content = reportText.value.toLowerCase();
        wordsFound = 0;

        targetVocab.forEach((word, idx) => {
            const el = document.getElementById(`vocab-${idx}`);
            // Check if exact phrase exists in text
            if (content.includes(word.toLowerCase())) {
                el.classList.add('found');
                el.querySelector('i').className = 'fa-solid fa-circle-check';
                wordsFound++;
            } else {
                el.classList.remove('found');
                el.querySelector('i').className = 'fa-regular fa-circle';
            }
        });

        vocabCounter.textContent = `(${wordsFound}/5)`;
        if (wordsFound >= 5) {
            vocabCounter.classList.add('goal-met');
        } else {
            vocabCounter.classList.remove('goal-met');
        }
    });

    // Grammar Checker API Integration
    const grammarBtn = document.getElementById('check-grammar-btn');
    const grammarFeedback = document.getElementById('grammar-feedback');

    grammarBtn.addEventListener('click', async () => {
        const text = reportText.value.trim();
        if (!text) {
            grammarFeedback.textContent = "Please write your report first.";
            grammarFeedback.style.color = "var(--female-color)";
            return;
        }
        
        grammarFeedback.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i> Checking grammar...";
        grammarFeedback.style.color = "var(--text-muted)";

        try {
            const response = await fetch('https://api.languagetoolplus.com/v2/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ text: text, language: 'en-US' })
            });
            const data = await response.json();
            
            // Filter out minor punctuation/spacing issues if desired, or keep all
            const errors = data.matches.filter(match => !match.rule.id.includes('WHITESPACE'));

            if (errors.length > 0) {
                // Highlight the first significant error found
                const err = errors[0];
                const errorContext = err.context.text.substr(err.context.offset, err.context.length);
                grammarFeedback.innerHTML = `❌ <strong>Suggestion:</strong> ${err.message} <br><small>(Check this part: "<em>...${errorContext}...</em>")</small>`;
                grammarFeedback.style.color = "var(--female-color)";
            } else {
                grammarFeedback.innerHTML = "✅ Grammar is looking good! Ready to send.";
                grammarFeedback.style.color = "var(--success)";
                confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
            }
        } catch (err) {
            grammarFeedback.textContent = "⚠️ Could not connect to the grammar checker service.";
            grammarFeedback.style.color = "var(--warning)"; 
        }
    });

    // FormSubmit Integration
    const sendReportBtn = document.getElementById('send-report-btn');
    
    sendReportBtn.addEventListener('click', async () => {
        const studentName = studentNameInput.value.trim() || 'Anonymous Student';
        const reportContent = reportText.value.trim();

        if (!reportContent) {
            alert("Please write your report before sending.");
            return;
        }

        if (wordsFound < 5) {
            const proceed = confirm(`You have only used ${wordsFound} target expressions out of 5. Do you still want to send the report?`);
            if(!proceed) return;
        }

        const originalText = sendReportBtn.innerHTML;
        sendReportBtn.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i> Sending...";
        sendReportBtn.disabled = true;

        try {
            const response = await fetch("https://formsubmit.co/ajax/dirapozo@gmail.com", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    _subject: `Describing Changes Report - ${studentName}`,
                    Student_Name: studentName,
                    Target_Words_Used: wordsFound,
                    Report_Text: reportContent
                })
            });

            if (response.ok) {
                alert("Report sent to the teacher successfully!");
                sendReportBtn.innerHTML = "<i class='fa-solid fa-check'></i> Sent!";
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                setTimeout(() => {
                    sendReportBtn.innerHTML = originalText;
                    sendReportBtn.disabled = false;
                }, 3000);
            } else {
                throw new Error("API Error");
            }
        } catch (error) {
            alert("Error sending the report. Please check your connection.");
            sendReportBtn.innerHTML = originalText;
            sendReportBtn.disabled = false;
        }
    });

});