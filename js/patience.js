document.addEventListener("DOMContentLoaded", () => {
    
    const urlParams = new URLSearchParams(window.location.search);
    
    // --- 1. Set the Question Title Dynamically ---
    const titleElement = document.getElementById("question-title");
    const loaderName = urlParams.get('loader') || 'QUESTIONS';

    let title = loaderName
        .replace('progressbar', 'progress bar')
        .replace('dvd', 'looping video')
        .replace('dino', 'interactive')
        .toUpperCase();
    titleElement.textContent = title;

    // --- 2. Add Logic to the DONE Button ---
    const doneButton = document.getElementById("patience-done-btn");
    
    doneButton.addEventListener("click", () => {
        // 1. Get the start time and calculate duration
        const startTime = localStorage.getItem('patienceStartTime');
        const durationInSeconds = ((Date.now() - parseInt(startTime)) / 1000).toFixed(2);
        localStorage.removeItem('patienceStartTime'); // Clean up this item

        // 2. Create an object to hold the data
        const patienceData = {
            type: "patience",
            loader: loaderName,
            timestamp: new Date().toISOString(),
            duration: `${durationInSeconds} seconds`
            // NOTE: Add form fields to patience.html to save question answers
        };

        // 3. Get the master array, add this new data, and save it
        let allEvents = JSON.parse(localStorage.getItem('allSurveyEvents')) || [];
        allEvents.push(patienceData);
        localStorage.setItem('allSurveyEvents', JSON.stringify(allEvents));

        // 4. Increment current step and decide where to go next
        let currentStep = parseInt(localStorage.getItem("currentStep") || "0");
        currentStep++;
        localStorage.setItem("currentStep", currentStep);

        if (currentStep >= 12) {
            // We are done. Go to the Thank You page.
            // NOTICE: We no longer call localStorage.clear() here.
            window.location.href = "thankyou.html";
        } else {
            // Go to the next loader page
            window.location.href = "loader.html";
        }
    });
});