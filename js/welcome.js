document.addEventListener("DOMContentLoaded", () => {
    
    // --- Define All Content ---
    const ORDERS = {
        "1": ["spinner", "dino", "progressbar", "dvd", "text", "blank"],
        "2": ["dino", "progressbar", "dvd", "text", "blank", "spinner"],
        "3": ["progressbar", "dvd", "text", "blank", "spinner", "dino"],
        "4": ["dvd", "text", "blank", "spinner", "dino", "progressbar"],
        "5": ["text", "blank", "spinner", "dino", "progressbar", "dvd"],
        "6": ["blank", "spinner", "dino", "progressbar", "dvd", "text"]
    };

    // --- Get All Elements ---
    const card = document.querySelector(".welcome-card");
    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");
    const step3 = document.getElementById("step3");
    
    const orderSelect = document.getElementById("order-select");
    const startBtn = document.getElementById("start-survey-btn");
    const continueBtn1 = document.getElementById("continue-btn-1");
    const continueBtn2 = document.getElementById("continue-btn-2");

    let selectedOrder = "1"; // Default to 1

    // --- Function to Show a Step ---
    function showStep(stepNumber) {
        card.dataset.step = stepNumber; // Update the data-step attribute
        
        // Hide all steps
        step1.style.display = "none";
        step2.style.display = "none";
        step3.style.display = "none";

        // Show the active one
        if (stepNumber === 1) {
            step1.style.display = "flex";
        } else if (stepNumber === 2) {
            step2.style.display = "flex";
        } else if (stepNumber === 3) {
            step3.style.display = "flex";
        }
    }

    // --- Event Listeners ---
    
    // 1. Start Button (from Step 1)
    startBtn.addEventListener("click", () => {
        selectedOrder = orderSelect.value; // Save the selected order
        showStep(2); // Go to Step 2 (Instructions)
    });

    // 2. Continue Button 1 (from Step 2)
    continueBtn1.addEventListener("click", () => {
        showStep(3); // Go to Step 3 (Part 1 Intro)
    });

    // 3. Continue Button 2 (from Step 3)
    continueBtn2.addEventListener("click", () => {
        // This is the FINAL step. Now we set up localStorage and redirect.
        const sequence = ORDERS[selectedOrder];
        if (!sequence) {
            alert("Error: Invalid order selected.");
            return;
        }

        // Clear any old data and set up the new participant
        localStorage.clear(); 
        localStorage.setItem("currentOrder", selectedOrder); 
        localStorage.setItem("currentStep", "0"); // Start at step 0
        localStorage.setItem("orderSequence", JSON.stringify(sequence));
        
        // Redirect to the first loader
        window.location.href = "loader.html";
    });

    // --- Show the first step on page load ---
    showStep(1);
});