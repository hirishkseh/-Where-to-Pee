document.addEventListener("DOMContentLoaded", () => {
    const urinalForm = document.getElementById("urinal-form");
    const urinalsContainer = document.getElementById("urinals-container");
    const findPositionBtn = document.getElementById("find-position");
    const prompt = document.querySelector(".prompt");
    const wiseQuote = document.querySelector(".wise-quote");

    const scientists = ["Mr. Einstein", "Mr. Issac Newton", "Mr. Elon Musk"];
    const funnyQuotes = [
        "Flush away your doubts and make a move.",
        "If in doubt, just hold it.",
        "Remember, it's not a race... or is it?",
        "When in doubt, the sink isn't an option!"
    ];

    let urinals = [];

    urinalForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const numUrinals = parseInt(document.getElementById("num-urinals").value, 10);
        if (numUrinals > 11) {
            updatePrompt("11+ urinals? This isn't a football match. Try again", "error");
            return;
        }
        else if (numUrinals < 1){
            updatePrompt("What? Then Pee in your Pants 👖!", "error");
            return;
        }
        urinals = Array(numUrinals).fill(0);
        renderUrinals();
        findPositionBtn.disabled = false;
        updatePrompt("Urinals ready. Pee to mark as occupied!", "success");
        showRandomQuote();
    });

    function renderUrinals() {
        urinalsContainer.innerHTML = "";
        urinals.forEach((status, index) => {
            const urinalDiv = document.createElement("div");
            urinalDiv.className = `urinal ${status === 1 ? "occupied" : "free"}`;
            urinalDiv.dataset.index = index;
            urinalDiv.innerText = index + 1;
            urinalDiv.addEventListener("click", () => toggleUrinal(index));
            urinalsContainer.appendChild(urinalDiv);
        });
    }

    function toggleUrinal(index) {
        urinals[index] = urinals[index] === 1 ? 0 : 1;
        renderUrinals();
    }

    findPositionBtn.addEventListener("click", async () => {
        updatePrompt("Analyzing your questionable decision-making...", "loading");
        const response = await fetch("http://127.0.0.1:5000/get_optimal_position", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ urinals }),
        });
        const data = await response.json();
        if (data.position !== undefined) {
            const randomScientist = scientists[Math.floor(Math.random() * scientists.length)];
            updatePrompt(`Use urinal ${data.position + 1}, ${randomScientist}.`, "success");
        } else {
            updatePrompt("You're out of luck. Hold it or try the bushes 𓍊𓋼𓍊𖡼.𖤣𖥧𖡼.𖤣𖥧𓋼𓍊𓋼", "error");
        }
    });

    function updatePrompt(message, type) {
        prompt.textContent = message;
        prompt.className = `prompt ${type}`;
    }

    function showRandomQuote() {
        const randomIndex = Math.floor(Math.random() * funnyQuotes.length);
        wiseQuote.textContent = funnyQuotes[randomIndex];
    }
});
