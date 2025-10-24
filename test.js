document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'index.html';
        return;
    }

    const testSelectionView = document.getElementById('test-selection-view');
    const testView = document.getElementById('test-view');
    const testList = document.getElementById('test-list');
    
    MOCK_TESTS.forEach((test, index) => {
        const timeInMinutes = test.timeLimit / 60;
        const testCard = `
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${test.title}</h5>
                        <p class="card-text">${test.questions.length} Questions | ${timeInMinutes} Mins</p>
                        <button class="btn btn-primary start-btn" data-index="${index}">Start Test</button>
                    </div>
                </div>
            </div>
        `;
        testList.innerHTML += testCard;
    });

    let currentTest, currentQuestionIndex = 0, userAnswers, timerInterval;
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const progressBar = document.getElementById('progress-bar');

    document.querySelectorAll('.start-btn').forEach(button => {
        button.addEventListener('click', (e) => startTest(e.target.dataset.index));
    });

    function startTest(testIndex) {
        currentTest = MOCK_TESTS[testIndex];
        currentQuestionIndex = 0;
        userAnswers = new Array(currentTest.questions.length).fill(null);
        
        testSelectionView.classList.add('d-none');
        testView.classList.remove('d-none');
        document.getElementById('test-title').innerText = currentTest.title;
        
        displayQuestion();
        startTimer(currentTest.timeLimit);
    }

    function displayQuestion() {
        const question = currentTest.questions[currentQuestionIndex];
        questionText.innerHTML = `${currentQuestionIndex + 1}. ${question.question}`;
        optionsContainer.innerHTML = '';

        if (question.type === 'mcq') {
            const optionsHtml = document.createElement('div');
            optionsHtml.className = 'list-group';
            question.options.forEach((option, index) => {
                const isSelected = userAnswers[currentQuestionIndex] === index;
                const selectedClass = isSelected ? 'active' : '';
                optionsHtml.innerHTML += `
                    <button type="button" class="list-group-item list-group-item-action option-btn ${selectedClass}" data-index="${index}">
                        ${option}
                    </button>
                `;
            });
            optionsContainer.appendChild(optionsHtml);

            document.querySelectorAll('.option-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const selectedIndex = parseInt(e.target.dataset.index);
                    userAnswers[currentQuestionIndex] = selectedIndex;
                    document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                });
            });

        } else if (question.type === 'text') {
            const answer = userAnswers[currentQuestionIndex] || '';
            optionsContainer.innerHTML = `
                <textarea class="form-control" id="text-answer" rows="3" placeholder="Type your answer here...">${answer}</textarea>
            `;
            document.getElementById('text-answer').addEventListener('input', (e) => {
                userAnswers[currentQuestionIndex] = e.target.value;
            });
        }
        
        // Render Math equations
        renderMathInElement(document.body);
        updateNavigation();
        updateProgressBar();
    }
    
    function updateNavigation() {
        prevBtn.disabled = currentQuestionIndex === 0;
        if (currentQuestionIndex === currentTest.questions.length - 1) {
            nextBtn.innerHTML = 'Submit <i class="bi bi-check-circle"></i>';
        } else {
            nextBtn.innerHTML = 'Next <i class="bi bi-arrow-right"></i>';
        }
    }

    function updateProgressBar() {
        const progress = ((currentQuestionIndex + 1) / currentTest.questions.length) * 100;
        progressBar.style.width = `${progress}%`;
        progressBar.innerText = `${currentQuestionIndex + 1} / ${currentTest.questions.length}`;
    }

    function startTimer(duration) {
        let timer = duration;
        const timerEl = document.getElementById('timer');
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            const minutes = Math.floor(timer / 60);
            let seconds = timer % 60;
            seconds = seconds < 10 ? '0' + seconds : seconds;
            timerEl.textContent = `${minutes}:${seconds}`;
            if (--timer < 0) {
                clearInterval(timerInterval);
                submitTest();
            }
        }, 1000);
    }

    function submitTest() {
        clearInterval(timerInterval);
        const results = {
            testTitle: currentTest.title,
            userAnswers: userAnswers,
            questions: currentTest.questions,
            score: calculateScore()
        };
        localStorage.setItem('testResults', JSON.stringify(results));
        window.location.href = 'results.html';
    }

    function calculateScore() {
        let score = 0;
        currentTest.questions.forEach((q, index) => {
            const userAnswer = userAnswers[index];
            if (userAnswer === null || userAnswer === undefined) return;

            if (q.type === 'mcq' && userAnswer === q.correctAnswer) {
                score++;
            } else if (q.type === 'text') {
                // Case-insensitive and trims whitespace
                if (typeof userAnswer === 'string' && userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
                    score++;
                }
            }
        });
        return score;
    }

    nextBtn.addEventListener('click', () => {
        if (currentQuestionIndex < currentTest.questions.length - 1) {
            currentQuestionIndex++;
            displayQuestion();
        } else {
            submitTest();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            displayQuestion();
        }
    });
});
