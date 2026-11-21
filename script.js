// FIFA STATS BOT
// Gestion des matchs et analyses statistiques

let matchs = [];

try {
    matchs = JSON.parse(
        localStorage.getItem("fifa_matchs")
    ) || [];
} catch (e) {
    matchs = [];
}

// Sécuriser l'affichage des noms
function securiser(texte) {
    return String(texte).replace(/[&<>"']/g, function(c) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[c];
    });
}

// Enregistrer un match
function enregistrerMatch() {

    const equipe1 = document.getElementById("equipe1").value.trim();
    const equipe2 = document.getElementById("equipe2").value.trim();

    const score1 = document.getElementById("score1").value;
    const score2 = document.getElementById("score2").value;

    if (!equipe1 || !equipe2 || score1 === "" || score2 === "") {
        alert("Veuillez remplir toutes les informations.");
        return;
    }

    const buts1 = Number(score1);
    const buts2 = Number(score2);

    if (
        equipe1.toLowerCase() === equipe2.toLowerCase() ||
        !Number.isInteger(buts1) ||
        !Number.isInteger(buts2) ||
        buts1 < 0 ||
        buts2 < 0
    ) {
        alert("Veuillez vérifier les équipes et les scores.");
        return;
    }

    const match = {
        equipe1: equipe1,
        equipe2: equipe2,
        score1: buts1,
        score2: buts2,
        date: new Date().toLocaleString("fr-FR")
    };

    matchs.push(match);

    sauvegarder();

    document.getElementById("equipe1").value = "";
    document.getElementById("equipe2").value = "";
    document.getElementById("score1").value = "";
    document.getElementById("score2").value = "";

    actualiser();

    alert("Match enregistré avec succès !");
}

// Sauvegarder les matchs
function sauvegarder() {
    localStorage.setItem("fifa_matchs", JSON.stringify(matchs));
}

// Calculer les statistiques
function statistiquesEquipe(nom) {

    const stats = {
        matchs: 0,
        victoires: 0,
        nuls: 0,
        defaites: 0,
        butsMarques: 0,
        butsEncaisses: 0,
        points: 0
    };

    matchs.forEach(match => {

        if (match.equipe1.toLowerCase() === nom.toLowerCase()) {

            stats.matchs++;
            stats.butsMarques += match.score1;
            stats.butsEncaisses += match.score2;

            if (match.score1 > match.score2) {
                stats.victoires++;
                stats.points += 3;
            } else if (match.score1 === match.score2) {
                stats.nuls++;
                stats.points++;
            } else {
                stats.defaites++;
            }
        }

        else if (match.equipe2.toLowerCase() === nom.toLowerCase()) {

            stats.matchs++;
            stats.butsMarques += match.score2;
            stats.butsEncaisses += match.score1;

            if (match.score2 > match.score1) {
                stats.victoires++;
                stats.points += 3;
            } else if (match.score1 === match.score2) {
                stats.nuls++;
                stats.points++;
            } else {
                stats.defaites++;
            }
        }
    });

    return stats;
}

// Afficher les statistiques
function afficherStatistiques() {

    const zone = document.getElementById("statistiques");

    if (matchs.length === 0) {
        zone.innerHTML = "<p>Aucun match enregistré.</p>";
        return;
    }

    const equipes = [...new Set(
        matchs.flatMap(m => [m.equipe1, m.equipe2])
    )];

    let html = `<h3>Total : ${matchs.length} matchs enregistrés</h3>`;

    equipes.forEach(equipe => {

        const s = statistiquesEquipe(equipe);

        html += `
            <div class="stats-equipe">
                <h3>${securiser(equipe)}</h3>
                <p>Matchs : ${s.matchs}</p>
                <p>Victoires : ${s.victoires}</p>
                <p>Nuls : ${s.nuls}</p>
                <p>Défaites : ${s.defaites}</p>
                <p>Buts marqués : ${s.butsMarques}</p>
                <p>Buts encaissés : ${s.butsEncaisses}</p>
                <p>Points : ${s.points}</p>
            </div>
            <hr>
        `;
    });

    zone.innerHTML = html;
}

// Comparer deux équipes
function comparerEquipes() {

    const nom1 = document.getElementById("comparaison1").value.trim();
    const nom2 = document.getElementById("comparaison2").value.trim();

    const zone = document.getElementById("resultatComparaison");

    if (!nom1 || !nom2) {
        alert("Entrez les deux noms des équipes.");
        return;
    }

    const a = statistiquesEquipe(nom1);
    const b = statistiquesEquipe(nom2);

    if (a.matchs === 0 || b.matchs === 0) {
        zone.innerHTML = "Une ou plusieurs équipes n'ont aucun match enregistré.";
        return;
    }

    let html = `
        <h3>Comparaison statistique</h3>

        <p><strong>${securiser(nom1)}</strong></p>
        <p>Matchs : ${a.matchs}</p>
        <p>Victoires : ${a.victoires}</p>
        <p>Buts marqués : ${a.butsMarques}</p>
        <p>Points : ${a.points}</p>

        <hr>

        <p><strong>${securiser(nom2)}</strong></p>
        <p>Matchs : ${b.matchs}</p>
        <p>Victoires : ${b.victoires}</p>
        <p>Buts marqués : ${b.butsMarques}</p>
        <p>Points : ${b.points}</p>
    `;

    if (a.points > b.points) {
        html += `<h3>Avantage statistique : ${securiser(nom1)}</h3>`;
    } else if (b.points > a.points) {
        html += `<h3>Avantage statistique : ${securiser(nom2)}</h3>`;
    } else {
        html += "<h3>Égalité statistique</h3>";
    }

    zone.innerHTML = html;
}

// Afficher l'historique
function afficherHistorique() {

    const zone = document.getElementById("historique");

    if (matchs.length === 0) {
        zone.innerHTML = "Aucun match enregistré.";
        return;
    }

    zone.innerHTML = [...matchs].reverse().map(match => `
        <div class="match">
            <p>
                <strong>${securiser(match.equipe1)}</strong>
                ${match.score1} - ${match.score2}
                <strong>${securiser(match.equipe2)}</strong>
            </p>
            <small>${securiser(match.date)}</small>
        </div>
        <hr>
    `).join("");
}

// Effacer l'historique
function effacerHistorique() {

    if (!confirm("Voulez-vous vraiment supprimer tous les matchs ?")) {
        return;
    }

    matchs = [];

    sauvegarder();
    actualiser();
}

// Actualiser toutes les données
function actualiser() {
    afficherStatistiques();
    afficherHistorique();
}

// Initialisation
document.addEventListener("DOMContentLoaded", actualiser);
