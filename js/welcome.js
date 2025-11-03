// EDIT FILE FOR ORDER SELECTION
// ---------------------------------
// Change this number from 1 to 6 to set the active order
// for the participant.
// ---------------------------------
const ACTIVE_ORDER_ID = 1;

// --- Do not edit below this line ---

document.addEventListener("DOMContentLoaded", () => {
    
    // Define all 6 orders
    // NOTE: 'loading bar' is 'progressbar', 'looping video' is 'dvd', 'interactive' is 'dino'
    const ORDERS = {
        1: ["spinner", "dino", "progressbar", "dvd", "text", "blank"],
        2: ["dino", "progressbar", "dvd", "text", "blank", "spinner"],
        3: ["progressbar", "dvd", "text", "blank", "spinner", "dino"],
        4: ["dvd", "text", "blank", "spinner", "dino", "progressbar"],
        5: ["text", "blank", "spinner", "dino", "progressbar", "dvd"],
        6: ["blank", "spinner", "dino", "progressbar", "dvd", "text"]
    };

    const startButton = document.getElementById("start-survey-btn");

    startButton.addEventListener("click", () => {
        
        // 1. Get the chosen order sequence
        const sequence = ORDERS[ACTIVE_ORDER_ID];
        if (!sequence) {
            alert("Error: Invalid ACTIVE_ORDER_ID set.");
            return;
        }

        // 2. Clear any old data and set up the new participant
        localStorage.clear(); // Clear all old data
        localStorage.setItem("currentOrder", ACTIVE_ORDER_ID);
        localStorage.setItem("currentStep", "0"); // Start at step 0
        localStorage.setItem("orderSequence", JSON.stringify(sequence));

        // 3. Redirect to the first loader
        window.location.href = "loader.html";
    });
});