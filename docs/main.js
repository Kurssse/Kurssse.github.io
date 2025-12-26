const cycleHives = {
    1: ["mini_lung"],
    2: ["lodge_lung_1", "lodge_lung_2", "lodge_lung_4", "lodge_lung_5", "lodge_lung_6"],
    3: ["lodge_lung_1", "lodge_lung_2", "lodge_lung_4", "lodge_lung_5", "lodge_lung_6"],
    4: ["lodge_lung_1", "lodge_lung_2", "lodge_lung_4", "lodge_lung_5", "lodge_lung_6"],
    5: ["lodge_lung_3"],
    6: ["city_lung_1", "city_lung_2", "city_lung_3", "city_lung_4"],
    7: ["city_lung_1", "city_lung_2", "city_lung_3", "city_lung_4"],
    8: ["city_lung_1", "city_lung_2", "city_lung_3", "city_lung_4"],
    9: ["city_lung_5"],
    10: ["lake_lung_1", "lake_lung_2", "lake_lung_3", "lake_lung_4", "lake_lung_6"],
    11: ["lake_lung_1", "lake_lung_2", "lake_lung_3", "lake_lung_4", "lake_lung_6"],
    12: ["lake_lung_1", "lake_lung_2", "lake_lung_3", "lake_lung_4", "lake_lung_6"],
    13: ["lake_lung_1", "lake_lung_2", "lake_lung_3", "lake_lung_4", "lake_lung_6"],
    14: ["crater_lung"]
};

let challenges = [];

/* LOAD JSON DATA */
function loadChallenges(map, difficulty) {
    const path = `challenges/${map}_${difficulty}.json`;
    return fetch(path)
        .then(r => r.json())
        .then(data => challenges = data.challenges)
        .catch(err => {
            console.error("Failed to load JSON:", err);
            challenges = [];
        });
}
/* BUTTON CLICK */
document.getElementById("run").addEventListener("click", () => {
    const cycle = Number(document.getElementById("cycle").value);
    const difficulty = document.getElementById("difficulty").value;
    const playerCount = Number(document.getElementById("players").value);

    loadChallenges("point_of_contact", difficulty).then(() => {
        const grouped = getChallengesByHive(challenges, cycle, playerCount);
        renderTable(grouped);
    });
});

/* FILTERING LOGIC */
function getChallengesByHive(challenges, cycle, playerCount) {
    const result = {}; // hive -> array of challenges
    const allowedHives = cycleHives[cycle] || [];

    for (const c of challenges) {
        // Skip if challenge is not allowed in solo and only 1 player
        if (playerCount === 1 && !c.allowedinsolo) continue;

        // Skip if challenge does not include this cycle
        if (!c.allowed_cycles.includes(cycle)) continue;

        // Only include hives that exist in this cycle
        for (const hive of c.allowed_hives) {
            if (!allowedHives.includes(hive)) continue;

            if (!result[hive]) result[hive] = [];
            result[hive].push(c.ref);
        }
    }

    return result;
}

/* DISPLAY RESULTS */
function renderTable(challengesByHive) {
    const container = document.getElementById("output");
    container.innerHTML = ""; // clear previous results

    const table = document.createElement("table");
    table.border = 1;
    const header = table.insertRow();
    header.insertCell().textContent = "Hive";
    header.insertCell().textContent = "Challenges";

    for (const [hive, chList] of Object.entries(challengesByHive)) {
        const row = table.insertRow();
        row.insertCell().textContent = hive;
        row.insertCell().textContent = chList.join(", ");
    }

    container.appendChild(table);
}



