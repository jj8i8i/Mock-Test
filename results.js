document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'index.html';
        return;
    }

    const resultsData = JSON.parse(localStorage.getItem('testResults'));

    if (!resultsData) {
        document.body.innerHTML = '<div class="container mt-5"><h1>No results found.</h1><a href="test.html">Go back to test selection</a></div>';
        return;
    }

    const { userAnswers, questions, score } = resultsData;
    const totalQuestions = questions.length;
    const percentage = totalQuestions > 0 ? ((score / totalQuestions) * 100).toFixed(2) : 0;

    document.getElementById('score-text').innerText = `${score} / ${totalQuestions}`;
    document.getElementById('score-percentage').innerText = `(${percentage}%)`;
    
    const reviewContainer = document.getElementById('review-container');
    reviewContainer.innerHTML = '';

    questions.forEach((q, index) => {
        const userAnswer = userAnswers[index];
        let reviewContent = '';

        if (q.type === 'mcq') {
            let optionsHtml = '';
            q.options.forEach((option, optIndex) => {
                let itemClass = 'list-group-item';
                let icon = '';
                if (optIndex === q.correctAnswer) {
                    itemClass += ' list-group-item-success';
                    icon = '<i class="bi bi-check-circle-fill text-success"></i>';
                }
                if (userAnswer === optIndex && userAnswer !== q.correctAnswer) {
                    itemClass += ' list-group-item-danger';
                    icon = '<i class="bi bi-x-circle-fill text-danger"></i>';
                }
                optionsHtml += `<li class="${itemClass}">${option} ${icon}</li>`;
            });
            reviewContent = `<ul class="list-group list-group-flush">${optionsHtml}</ul>`;

        } else if (q.type === 'text') {
            const isCorrect = typeof userAnswer === 'string' && userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
            const icon = isCorrect 
                ? '<i class="bi bi-check-circle-fill text-success"></i>' 
                : '<i class="bi bi-x-circle-fill text-danger"></i>';

            reviewContent = `
                <div class="card-body">
                    <p><strong>Your Answer:</strong> ${userAnswer || '<i>(No answer)</i>'} ${icon}</p>
                    ${!isCorrect ? `<p><strong>Correct Answer:</strong> ${q.correctAnswer}</p>` : ''}
                </div>
            `;
        }

        const reviewCard = `
            <div class="card mb-3">
                <div class="card-header">
                    <strong>Question ${index + 1}:</strong> ${q.question}
                </div>
                ${reviewContent}
            </div>
        `;
        reviewContainer.innerHTML += reviewCard;
    });

    // Render math in the review section
    renderMathInElement(document.body);
    localStorage.removeItem('testResults');
});
