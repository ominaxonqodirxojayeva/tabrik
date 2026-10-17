const stages = [
    "step-access",
    "step-envelope",
    "step-letter",
    "step-plans",
    "step-date",
    "step-final",
].map((id) => document.getElementById(id));

const stepCounter = document.getElementById("step-counter");
const progressDots = [...document.querySelectorAll(".progress-dot")];
const secretWordInput = document.getElementById("secret-word");
const recipientInput = document.getElementById("recipient-name");
const accessError = document.getElementById("access-error");
const planOptions = [...document.querySelectorAll(".plan-option")];
const dateOptions = document.getElementById("date-options");
const toPlansButton = document.getElementById("to-plans");
const toDateButton = document.getElementById("to-date");
const toFinalButton = document.getElementById("to-final");

const planDetails = {
    walk: {
        title: "Ovqatlanishga boramiz",
        description: "Yoqimli taom va faqat ikkimiz.",
    },
    escape: {
        title: "Kechki sayrga chiqaylik",
        description: "Shahar chiroqlari ostida birga sayr qilamiz.",
    },
    dream: {
        title: "O‘zing xohlagan kun ko‘rishamiz",
        description: "Qaysi kun qulayligini o‘zing tanla.",
    },
    everything: {
        title: "Barchasini xohlayman",
        description: "Bu bayram bir kun bilan tugamaydi.",
    },
};

let recipientName = "";
let selectedPlan = "";
let selectedDate = "";

const monthNames = [
    "yanvar",
    "fevral",
    "mart",
    "aprel",
    "may",
    "iyun",
    "iyul",
    "avgust",
    "sentabr",
    "oktabr",
    "noyabr",
    "dekabr",
];
const weekdayNames = [
    "yakshanba",
    "dushanba",
    "seshanba",
    "chorshanba",
    "payshanba",
    "juma",
    "shanba",
];

function showStage(index) {
    stages.forEach((stage, stageIndex) => {
        stage.hidden = stageIndex !== index;
    });

    stepCounter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(stages.length).padStart(2, "0")}`;
    progressDots.forEach((dot, dotIndex) => {
        dot.classList.toggle("active", dotIndex === index);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function makeDateOptions() {
    const fragment = document.createDocumentFragment();
    const firstAvailableDate = new Date(2026, 10, 26);

    for (let dayOffset = 0; dayOffset < 4; dayOffset += 1) {
        const date = new Date(
            firstAvailableDate.getFullYear(),
            firstAvailableDate.getMonth(),
            firstAvailableDate.getDate() + dayOffset,
        );
        const button = document.createElement("button");
        button.className = "date-option";
        button.type = "button";
        button.setAttribute("aria-pressed", "false");

        const dateLabel = document.createElement("span");
        dateLabel.textContent = `${date.getDate()} ${monthNames[date.getMonth()]}`;
        const weekdayLabel = document.createElement("span");
        weekdayLabel.textContent = weekdayNames[date.getDay()];

        button.append(dateLabel, weekdayLabel);
        button.addEventListener("click", () => {
            selectedDate = date;
            dateOptions.querySelectorAll(".date-option").forEach((option) => {
                option.setAttribute("aria-pressed", String(option === button));
            });
            toFinalButton.disabled = false;
        });
        fragment.append(button);
    }

    dateOptions.append(fragment);
}

document.getElementById("access-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!secretWordInput.value.trim()) {
        accessError.textContent = "Maxfiy so‘zni kiriting.";
        secretWordInput.focus();
        return;
    }

    accessError.textContent = "";
    showStage(1);
    recipientInput.focus();
});

document.getElementById("name-form").addEventListener("submit", (event) => {
    event.preventDefault();
    recipientName = recipientInput.value.trim();
    if (!recipientName) {
        recipientInput.focus();
        return;
    }

    showStage(2);
});

toPlansButton.addEventListener("click", () => showStage(3));

planOptions.forEach((option) => {
    option.addEventListener("click", () => {
        selectedPlan = option.dataset.plan;
        planOptions.forEach((planOption) => {
            planOption.setAttribute("aria-pressed", String(planOption === option));
        });
        toDateButton.disabled = false;
    });
});

toDateButton.addEventListener("click", () => {
    makeDateOptions();
    showStage(4);
});

toFinalButton.addEventListener("click", () => {
    const date = selectedDate;
    const plan = planDetails[selectedPlan];

    document.getElementById("final-recipient").textContent = recipientName;
    document.getElementById("final-plan").textContent = plan.title;
    document.getElementById("final-description").textContent = plan.description;
    document.getElementById("final-date").textContent =
        `${weekdayNames[date.getDay()]}, ${date.getDate()} ${monthNames[date.getMonth()]}`;
    showStage(5);
});

document.getElementById("restart").addEventListener("click", () => {
    secretWordInput.value = "";
    recipientInput.value = "";
    recipientName = "";
    selectedPlan = "";
    selectedDate = "";
    dateOptions.replaceChildren();
    planOptions.forEach((option) => option.setAttribute("aria-pressed", "false"));
    toDateButton.disabled = true;
    toFinalButton.disabled = true;
    showStage(0);
    secretWordInput.focus();
});
