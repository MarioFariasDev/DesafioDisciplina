const tasks = [
    "🧘 5 minutos de silêncio intencional",
    "🙏 Orar por 5 minutos com intenção",
    "📖 Ler 1 capítulo da Bíblia",
    "🧠 Escrever 3 coisas pelas quais é grato",
    "🏃‍♀️ Fazer 30-60min de atividade física",
    "💧 Beber pelo menos 2L de água",
    "🍎 Comer limpo (sem açúcar/refri)",
    "📚 Estudar/ler por 30 minutos",
    "📝 Anotar 1 aprendizado ou versículo do dia",
    "📸 Postar 1 story com #DesafioDisciplina7D"
];

const taskList = document.getElementById("taskList");
const daySelect = document.getElementById("day");
const progressText = document.getElementById("progressText");
const barFill = document.getElementById("barFill");
const resetBtn = document.getElementById("resetBtn");

function loadTasks(day) {
    taskList.innerHTML = "";
    const saved = JSON.parse(localStorage.getItem(`day${day}`)) || Array(tasks.length).fill(false);

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.classList.toggle("checked", saved[index]);

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = saved[index];

        checkbox.addEventListener("change", async () => {
            saved[index] = checkbox.checked;
            localStorage.setItem(`day${day}`, JSON.stringify(saved));
            li.classList.toggle("checked", checkbox.checked);
            updateProgress(saved);

            if (checkIfDayCompleted(saved)) {
                const name = prompt("Parabéns! Você completou o dia inteiro! Digite seu nome para aparecer no ranking:");
                if (name) {
                    await registerDayCompletionOnline(name); // Agora o await está dentro de uma função async
                }
            }
        });


        li.appendChild(checkbox);
        li.appendChild(document.createTextNode(task));
        taskList.appendChild(li);
    });

    updateProgress(saved);
}

function updateProgress(arr) {
    const done = arr.filter(Boolean).length;
    progressText.textContent = `Progresso: ${done} / ${tasks.length}`;
    barFill.style.width = `${(done / tasks.length) * 100}%`;
}

daySelect.addEventListener("change", () => {
    loadTasks(daySelect.value);
});

resetBtn.addEventListener("click", () => {
    const day = daySelect.value;
    localStorage.removeItem(`day${day}`);
    loadTasks(day);
});

loadTasks(daySelect.value);

function checkIfDayCompleted(arr) {
    return arr.every(v => v === true);
}

window.firestoreHelpers = undefined;

async function registerDayCompletionOnline(name) {
    const {doc, setDoc, increment } = window.firestoreHelpers;
    const db = window.db;

    const userRef = doc(db, "ranking", name);
    try {
        await setDoc(userRef, { diasCompletos: increment(1) }, { merge: true });
        alert("Parabéns! Seu progresso foi registrado no ranking!");
    } catch (error) {
        console.error("Erro ao registrar no Firebase:", error);
    }
}

