document.addEventListener("DOMContentLoaded", () => {
    
    // Define all 6 orders
    // NOTE: 'loading bar' is 'progressbar', 'looping video' is 'dvd', 'interactive' is 'dino'
    const ORDERS = {
        "1": ["spinner", "dino", "progressbar", "dvd", "text", "blank"],
        "2": ["dino", "progressbar", "dvd", "text", "blank", "spinner"],
        "3": ["progressbar", "dvd", "text", "blank", "spinner", "dino"],
        "4": ["dvd", "text", "blank", "spinner", "dino", "progressbar"],
        "5": ["text", "blank", "spinner", "dino", "progressbar", "dvd"],
        "6": ["blank", "spinner", "dino", "progressbar", "dvd", "text"]
    };

    const startButton = document.getElementById("start-survey-btn");
    const orderSelect = document.getElementById("order-select"); // Get the dropdown

    startButton.addEventListener("click", () => {
        
        // 1. Get the chosen order from the dropdown
        const selectedOrder = orderSelect.value; // This will be a string: "1", "2", etc.

        // 2. Get the chosen order sequence
        const sequence = ORDERS[selectedOrder]; 
        if (!sequence) {
            alert("Error: Invalid order selected.");
            return;
        }

        // 3. Clear any old data and set up the new participant
        localStorage.clear(); // Clear all old data
        localStorage.setItem("currentOrder", selectedOrder); // Use the selected value
        localStorage.setItem("currentStep", "0"); // Start at step 0
        localStorage.setItem("orderSequence", JSON.stringify(sequence));

        // 4. Redirect to the first loader
        window.location.href = "loader.html";
    });
});