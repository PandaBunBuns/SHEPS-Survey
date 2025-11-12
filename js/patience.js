document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Get All Elements ---
    const urlParams = new URLSearchParams(window.location.search);
    const form = document.getElementById("patience-form");
    const doneButton = document.getElementById("patience-done-btn");
    const titleElement = document.getElementById("question-title");

    // Get all the form elements we need to validate
    const q1Checkboxes = form.querySelectorAll('input[name="q1_why_stop"]');
    const q1OtherCheckbox = form.querySelector('input[name="q1_why_stop"][value="other"]');
    const q1OtherText = form.querySelector('input[name="q1_other_text"]');

    const q2Minutes = form.querySelector('input[name="q2_minutes"]');
    const q2Seconds = form.querySelector('input[name="q2_seconds"]');

    const q3Checkboxes = form.querySelectorAll('input[name="q3_why_wait"]');
    const q3OtherCheckbox = form.querySelector('input[name="q3_why_wait"][value="other"]');
    const q3OtherText = form.querySelector('input[name="q3_other_text"]');


    // --- 2. Set the Question Title Dynamically ---
    const loaderName = urlParams.get('loader') || 'QUESTIONS';
    let title = loaderName
        .replace('progressbar', 'progress bar')
        .replace('dvd', 'looping video')
        .replace('dino', 'interactive')
        .toUpperCase();
    titleElement.textContent = title;

    // --- 3. VALIDATION LOGIC ---

    // Disable the button by default
    doneButton.disabled = true;

    // This function will check all rules
    function checkFormValidity() {
        // Rule 1: Check Question 1
        // (At least one box must be checked)
        const q1CheckedCount = Array.from(q1Checkboxes).filter(cb => cb.checked).length;
        let isQ1Valid = q1CheckedCount > 0;
        
        // (If "Others" is checked, the text box must not be empty)
        if (q1OtherCheckbox.checked && q1OtherText.value.trim() === '') {
            isQ1Valid = false;
        }

        // Rule 2: Check Question 2
        // (Total time must be greater than 0)
        const totalSeconds = (parseInt(q2Minutes.value || 0) * 60) + parseInt(q2Seconds.value || 0);
        const isQ2Valid = totalSeconds > 0;

        // Rule 3: Check Question 3 (Same logic as Q1)
        const q3CheckedCount = Array.from(q3Checkboxes).filter(cb => cb.checked).length;
        let isQ3Valid = q3CheckedCount > 0;
        
        if (q3OtherCheckbox.checked && q3OtherText.value.trim() === '') {
            isQ3Valid = false;
        }

        // Final Check: Enable button only if all 3 rules are met
        if (isQ1Valid && isQ2Valid && isQ3Valid) {
            doneButton.disabled = false;
        } else {
            doneButton.disabled = true;
        }
    }

    // Run the check function every time the user types or clicks
    form.addEventListener('input', checkFormValidity);


    // --- 4. Add Logic to the Form on SUBMIT ---
    // This code only runs when the button is clicked AND enabled
    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Stop the page from reloading
        
        // --- Get the start time and calculate duration ---
        const startTime = localStorage.getItem('patienceStartTime');
        const durationInSeconds = ((Date.now() - parseInt(startTime)) / 1000).toFixed(2);
        localStorage.removeItem('patienceStartTime');

        // --- Get all the data from the form ---
        const formData = new FormData(form);

        // --- Format the "Why Stop" answers ---
        const whyStopValues = formData.getAll('q1_why_stop');
        let whyStopList = whyStopValues.map(value => {
            if (value === 'other') {
                return `Other: ${formData.get('q1_other_text')}`;
            }
            return value;
        });
        
        // --- Format the "Perceived Time" answer ---
        const minutes = formData.get('q2_minutes') || '0';
        const seconds = formData.get('q2_seconds') || '0';
        const perceivedTime = `${minutes} min, ${seconds} sec`;

        // --- Format the "Why Wait" answers ---
        const whyWaitValues = formData.getAll('q3_why_wait');
        let whyWaitList = whyWaitValues.map(value => {
            if (value === 'other') {
                return `Other: ${formData.get('q3_other_text')}`;
            }
            return value;
        });

        // --- Create an object to hold all the data ---
        const patienceData = {
            type: "patience",
            loader: loaderName,
            timestamp: new Date().toISOString(),
            actual_duration: `${durationInSeconds} seconds`,
            answers: {
                q1_why_stop: whyStopList.join(', '),
                q2_perceived_time: perceivedTime,
                q3_why_wait: whyWaitList.join(', ')
            }
        };

        // --- Get the master array, add this new data, and save it ---
        let allEvents = JSON.parse(localStorage.getItem('allSurveyEvents')) || [];
        allEvents.push(patienceData);
        localStorage.setItem('allSurveyEvents', JSON.stringify(allEvents));

        let currentStep = parseInt(localStorage.getItem("currentStep") || "0");
        currentStep++;
        localStorage.setItem("currentStep", currentStep);

        if (currentStep >= 12) {
            window.location.href = "thankyou.html";
        } else {
            window.location.href = "loader.html";
        }
    });
});