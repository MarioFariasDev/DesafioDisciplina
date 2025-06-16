const tbody = document.getElementById("rankingBody");

(async () => {
    const { collection, getDocs } = window.firestoreHelpers;
    const db = window.db;

    const querySnapshot = await getDocs(collection(db, "ranking"));

    const entries = [];
    querySnapshot.forEach((doc) => {
        entries.push({ nome: doc.id, dias: doc.data().diasCompletos || 0 });
    });

    entries.sort((a, b) => b.dias - a.dias);

    entries.forEach((entry, index) => {
        const tr = document.createElement("tr");

        const pos = document.createElement("td");
        pos.textContent = index + 1;

        const nome = document.createElement("td");
        nome.textContent = entry.nome;

        const pontos = document.createElement("td");
        pontos.textContent = `${entry.dias}/7`;

        tr.appendChild(pos);
        tr.appendChild(nome);
        tr.appendChild(pontos);
        tbody.appendChild(tr);
    });
})();
