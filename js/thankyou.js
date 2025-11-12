document.addEventListener("DOMContentLoaded", () => {

    // Helper function to trigger the download
    function download(filename, text) {
        // 1. Create a blob with the text content
        const blob = new Blob([text], { type: 'text/plain' });
        
        // 2. Create a temporary <a> element
        const element = document.createElement('a');
        element.href = URL.createObjectURL(blob);
        element.download = filename; // The default filename
        
        // 3. Programmatically click the link to start the download
        document.body.appendChild(element); // Required for Firefox
        element.click();
        
        // 4. Clean up
        document.body.removeChild(element);
        URL.revokeObjectURL(element.href);
    }

    // --- Main Logic ---

    // 1. Get all the data from localStorage
    const allEvents = JSON.parse(localStorage.getItem('allSurveyEvents')) || [];
    
    // 2. Get the survey order
    const orderId = localStorage.getItem('currentOrder') || 'Unknown';

    // 3. Format the data into a user-friendly text string
    let fileContent = `SHEPS Survey Results\n`;
    fileContent += `Order ID: ${orderId}\n`;
    fileContent += `Total Events: ${allEvents.length}\n`;
    fileContent += `===================================\n\n`;

    // 4. Loop through each event and add it to the file
    allEvents.forEach((event, index) => {
        fileContent += `--- Event ${index + 1}: ${event.type.toUpperCase()} (${event.loader}) ---\n`;
        fileContent += `Timestamp: ${event.timestamp}\n`;

        if (event.type === 'survey') {
            fileContent += "Answers:\n";
            for (let [question, answer] of Object.entries(event.answers)) {
                fileContent += `  - ${question}: ${answer}\n`;
            }
        
        } else if (event.type === 'patience') {
            
            fileContent += `Duration Waited: ${event.actual_duration}\n`;
            
            fileContent += "Answers:\n";
            if (event.answers) {
                for (let [question, answer] of Object.entries(event.answers)) {
                    // Use 'N/A' as a fallback if an answer is empty
                    fileContent += `  - ${question}: ${answer || 'N/A'}\n`;
                }
            }
        }
        
        fileContent += `\n`; // Add a space before the next event
    });

    // 5. Trigger the download
    if (allEvents.length > 0) {
        const timestamp = new Date().toISOString().replace(/:/g, '-').slice(0, 19);
        const filename = `survey_results_${orderId}_${timestamp}.txt`;
        download(filename, fileContent);
    }

    // 6. Clear localStorage
    localStorage.clear();

});