
document.addEventListener("DOMContentLoaded", function () {
    const nameInput = document.getElementById("godparentName");
    const continueButton = document.getElementById("continueButton");

    if (!nameInput || !continueButton) {
        console.error("Name input or Continue button not found!");
        return;
    }

    continueButton.addEventListener("click", function () {
        const guestName = nameInput.value.trim();

        if (guestName === "") {
            alert("Please enter your name first, dear! ♡");
            nameInput.focus();
            return;
        }

        sessionStorage.setItem("godparentName", guestName);
        window.location.href = "invitation.html";
    });

    nameInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            continueButton.click();
        }
    });
});
