// Wait for the main HTML page to load
document.addEventListener("DOMContentLoaded", () => {
    
    const contentContainer = document.getElementById("content-container");
    const buttonContainer = document.getElementById("button-container"); 
    
    // --- We are in NORMAL SURVEY MODE ---
    // Get State from localStorage
    const step = parseInt(localStorage.getItem("currentStep") || "0");
    const sequenceJSON = localStorage.getItem("orderSequence");

    if (!sequenceJSON) {
        // No state, go back to the start page
        window.location.href = "index.html"; 
        return;
    }
    
    const orderSequence = JSON.parse(sequenceJSON);

    // Determine current state
    const isPatienceTask = step >= 6; // true = 3min, false = 10s
    const showButton = isPatienceTask;
    const loaderName = orderSequence[step % 6];

    // --- 3. Load the Correct Loader Component ---
    if (loaderName === 'spinner') {
        loadComponent("partials/spinner.html", contentContainer);
    } else if (loaderName === 'progressbar') {
        loadProgressBar(contentContainer, isPatienceTask);
    } else if (loaderName === 'text') {
        loadComponent("partials/loadingtext.html", contentContainer);
    } else if (loaderName === 'dino') {
        loadComponent("partials/dinogame.html", contentContainer);
    } else if (loaderName === 'dvd') {
        loadDvdLoader(contentContainer); 
    } else if (loaderName === 'blank') {
        // Do nothing
    }

    // --- 4. Decide: Show button OR start timer ---
    if (showButton) {
        // Record the start time for the patience task
        localStorage.setItem('patienceStartTime', Date.now());

        // Normal mode: Load button that redirects to patience page
        loadButtonAndRedirect(`patience.html?loader=${loaderName}`, buttonContainer);
    } else {
        // No button: Set the 10s redirect to the survey page
        setTimeout(() => {
            window.location.href = `survey.html?loader=${loaderName}`;
        }, 10000); // 10,000 milliseconds = 10 seconds
    }
});


/**
 * Helper: Fetches and injects an HTML partial
 */
async function loadComponent(url, element) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const html = await response.text();
        element.innerHTML += html;
    } catch (error) {
        console.error('Failed to load component:', error);
    }
}

/**
 * Helper: Loads the 'DONE' button for NORMAL mode (redirects)
 */
async function loadButtonAndRedirect(redirectUrl, container) {
    try {
        const response = await fetch("partials/button.html");
        if (!response.ok) throw new Error('Failed to fetch button');
        const html = await response.text();
        container.innerHTML = html; 
        const doneButton = container.querySelector(".done-btn");
        if (doneButton) {
            doneButton.addEventListener("click", () => {
                // --- NEW LOGIC: Calculate duration immediately ---
                const startTime = localStorage.getItem('patienceStartTime');
                if (startTime) {
                    const duration = ((Date.now() - parseInt(startTime)) / 1000).toFixed(2);
                    
                    // Save this specific duration to use on the next page
                    localStorage.setItem('tempPatienceDuration', duration);
                    
                    // Clean up start time
                    localStorage.removeItem('patienceStartTime');
                }
                // -------------------------------------------------

                window.location.href = redirectUrl; 
            });
        }
    } catch (error) {
        console.error('Failed to load button component:', error);
    }
}

/**
 * Special function for the Progress Bar Loader
 */
async function loadProgressBar(container, isHourLong) {
    await loadComponent("partials/progressbar.html", container);
    const fillElement = container.querySelector(".progress-bar-fill");
    if (!fillElement) {
        console.error("Could not find '.progress-bar-fill' element!");
        return; 
    }
    const duration = isHourLong ? "180s" : "10s"; // 180s = 3 minutes
    fillElement.style.animation = `
        fillAnimation ${duration} linear 1 forwards
    `;
}


/**
 * Special function for the DVD Loader
 */
async function loadDvdLoader(container) {
    await loadComponent("partials/dvd.html", container);
    const logo = container.querySelector(".dvd-logo");
    const viewport = container; 
    if (!logo) {
        console.error("Could not find '.dvd-logo' element!");
        return;
    }
    logo.onload = () => {
        let x = 50, y = 50, vx = 1.5, vy = 1.5;
        let logoWidth = logo.clientWidth, logoHeight = logo.clientHeight;
        function animate() {
            let viewportWidth = viewport.clientWidth, viewportHeight = viewport.clientHeight;
            x += vx; y += vy;
            if (x + logoWidth >= viewportWidth || x <= 0) {
                x = Math.max(0, Math.min(x, viewportWidth - logoWidth));
                vx *= -1;
            }
            if (y + logoHeight >= viewportHeight || y <= 0) {
                y = Math.max(0, Math.min(y, viewportHeight - logoHeight));
                vy *= -1;
            }
            logo.style.left = x + 'px';
            logo.style.top = y + 'px';
            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
    };
    if (logo.complete) logo.onload();
}