document.addEventListener("DOMContentLoaded", () => {
    
    const urlParams = new URLSearchParams(window.location.search);
    
    // --- 1. Set the Survey Title Dynamically ---
    const titleElement = document.getElementById("survey-title");
    const loaderName = urlParams.get('loader') || 'SURVEY';

    let title = loaderName
        .replace('progressbar', 'progress bar')
        .replace('dvd', 'looping video')
        .replace('dino', 'interactive')
        .toUpperCase();
    titleElement.textContent = title;

    // --- 2. Handle Form Completion and Button State ---
    const surveyForm = document.querySelector(".survey-card");
    const doneButton = document.getElementById("survey-done-btn"); 
    
    const allQuestionNames = new Set();
    surveyForm.querySelectorAll('input[type="radio"]').forEach(radio => {
        allQuestionNames.add(radio.name);
    });
    const totalQuestions = allQuestionNames.size; 

    if (doneButton) {
        doneButton.disabled = true;
    }

    function checkFormCompletion() {
        const formData = new FormData(surveyForm);
        const answeredQuestions = [...formData.keys()].length;

        if (doneButton) {
            if (answeredQuestions === totalQuestions) {
                doneButton.disabled = false;
            } else {
                doneButton.disabled = true;
            }
        }
    }
    surveyForm.addEventListener("change", checkFormCompletion);

    // --- 3. Add Logic to the DONE Button (Submission) ---
    surveyForm.addEventListener("submit", (event) => {
        event.preventDefault(); 
        
        // 1. Create an object to hold the data
        const surveyData = {
            type: "survey",
            loader: loaderName,
            timestamp: new Date().toISOString(),
            answers: {}
        };

        // 2. Get all the form data
        const formData = new FormData(surveyForm);
        for (let [question, answer] of formData.entries()) {
            surveyData.answers[question] = answer;
        }

        // 3. Get the master array, add this new data, and save it
        let allEvents = JSON.parse(localStorage.getItem('allSurveyEvents')) || [];
        allEvents.push(surveyData);
        localStorage.setItem('allSurveyEvents', JSON.stringify(allEvents));

        // 4. Increment current step and decide where to go next
        let currentStep = parseInt(localStorage.getItem("currentStep") || "0");
        currentStep++;
        localStorage.setItem("currentStep", currentStep);

        if (currentStep >= 12) {
            // We are done. Go to the Thank You page (where download happens).
            window.location.href = "thankyou.html";
        } else {
            // Not the last step, just go to the next loader.
            window.location.href = "loader.html";
        }
    });
});