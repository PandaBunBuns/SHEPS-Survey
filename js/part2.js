document.addEventListener("DOMContentLoaded", () => {

    const continueBtn = document.getElementById("start-survey-btn");

    continueBtn.addEventListener("click", () => {
        window.location.href = "loader.html";
    });

});