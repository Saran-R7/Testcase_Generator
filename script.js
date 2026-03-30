let testCases = JSON.parse(localStorage.getItem("testCases")) || [];
let filteredCases = [...testCases];
let chart;

// DISPLAY
function displayTests(data = filteredCases) {
    let table = document.getElementById("testTable");
    table.innerHTML = "";

    data.forEach((test, index) => {
        let row = `
        <tr>
            <td>${index + 1}</td>
            <td>${test.feature}</td>
            <td>${test.scenario}</td>
            <td>${test.input}</td>
            <td>${test.expected}</td>
            <td class="${test.status.toLowerCase()}">${test.status}</td>
            <td><button onclick="deleteTest(${index})">Delete</button></td>
        </tr>`;
        table.innerHTML += row;
    });

    updateStats();
    updateChart();
}

// GENERATE
function generateTestCases(feature) {
    feature = feature.toLowerCase();

    if (feature.includes("login")) {
        return [
            {scenario:"Valid Login", input:"admin / 1234", expected:"Success", status:"Pass"},
            {scenario:"Invalid Password", input:"wrong", expected:"Error", status:"Fail"},
            {scenario:"Empty Fields", input:"''", expected:"Validation", status:"Fail"}
        ];
    }

    return [{scenario:"Basic Test", input:"sample", expected:"output", status:"Pass"}];
}

// SUBMIT
document.getElementById("testForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let feature = document.getElementById("feature").value;
    let newTests = generateTestCases(feature);

    newTests.forEach(t => testCases.push({...t, feature}));

    localStorage.setItem("testCases", JSON.stringify(testCases));
    filteredCases = [...testCases];

    this.reset();
    displayTests();
});

// DELETE
function deleteTest(index) {
    testCases.splice(index, 1);
    localStorage.setItem("testCases", JSON.stringify(testCases));
    filteredCases = [...testCases];
    displayTests();
}

// FILTER
function filterTests(type) {
    filteredCases = type === "All" ? [...testCases] : testCases.filter(t => t.status === type);
    displayTests(filteredCases);
}

// SEARCH
function searchTests() {
    let value = document.getElementById("searchBox").value.toLowerCase();

    filteredCases = testCases.filter(t =>
        t.feature.toLowerCase().includes(value) ||
        t.scenario.toLowerCase().includes(value)
    );

    displayTests(filteredCases);
}

// STATS
function updateStats() {
    document.getElementById("total").innerText = testCases.length;
    document.getElementById("passCount").innerText =
        testCases.filter(t => t.status === "Pass").length;
    document.getElementById("failCount").innerText =
        testCases.filter(t => t.status === "Fail").length;
}

// 📊 CHART
function updateChart() {
    let pass = filteredCases.filter(t => t.status === "Pass").length;
    let fail = filteredCases.filter(t => t.status === "Fail").length;

    if (chart) chart.destroy();

    chart = new Chart(document.getElementById("chart"), {
        type: "pie",
        data: {
            labels: ["Pass", "Fail"],
            datasets: [{
                data: [pass, fail],
                backgroundColor: ["#28a745", "#dc3545"]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// 📥 EXPORT CSV
function exportCSV() {
    let csv = "Feature,Scenario,Input,Expected,Status\n";

    testCases.forEach(t => {
        csv += `${t.feature},${t.scenario},${t.input},${t.expected},${t.status}\n`;
    });

    let blob = new Blob([csv], { type: "text/csv" });
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "testcases.csv";
    a.click();
}

// 🌙 DARK MODE
function toggleDarkMode() {
    document.body.classList.toggle("dark");
}

// CLEAR
function clearAll() {
    localStorage.clear();
    testCases = [];
    filteredCases = [];
    displayTests();
}

// LOAD
displayTests();