let testCases = JSON.parse(localStorage.getItem("testCases")) || [];
let filteredCases = [...testCases];
let chart;
let editIndex = null;
// DISPLAY
function displayTests(data = filteredCases) {
    let table = document.getElementById("testTable");
    table.innerHTML = "";

    data.forEach((test, index) => {
        let row = `
        <tr>
            <td>TC-${(index+1).toString().padStart(3,'0')}</td>
            <td>${test.feature}</td>
            <td>${test.scenario}</td>
            <td>${test.input}</td>
            <td>${test.expected}</td>
            <td class="${test.status.toLowerCase()}">${test.status}</td>
            <td>
                <button onclick="editTest(${index})">Edit</button>
                <button onclick="deleteTest(${index})">Delete</button>
            </td>
        </tr>`;
        table.innerHTML += row;
    });

    updateStats();
    updateChart();
}

// GENERATE
function generateTestCases(feature) {
    feature = feature.toLowerCase();

    // 🔐 LOGIN FEATURE
    if (feature.includes("login")) {
        return [
            {scenario:"Valid Login",input:"admin / 1234",expected:"Login successful",status:"Pass"},
            {scenario:"Invalid Password",input:"admin / wrong",expected:"Error message",status:"Fail"},
            {scenario:"Invalid Username",input:"wrong / 1234",expected:"Error message",status:"Fail"},
            {scenario:"Empty Fields",input:"'' / ''",expected:"Validation error",status:"Fail"},
            {scenario:"Only Username",input:"admin / ''",expected:"Password required",status:"Fail"},
            {scenario:"Only Password",input:"'' / 1234",expected:"Username required",status:"Fail"},
            {scenario:"SQL Injection",input:"' OR 1=1 --",expected:"Access denied",status:"Fail"},
            {scenario:"Long Input",input:"very long username/password",expected:"Handled properly",status:"Pass"},
            {scenario:"Case Sensitivity",input:"ADMIN / 1234",expected:"Handled correctly",status:"Pass"},
            {scenario:"Special Characters",input:"admin@123",expected:"Handled properly",status:"Pass"}
        ];
    }

    // 📝 SIGNUP FEATURE
    else if (feature.includes("signup")) {
        return [
            {scenario:"Valid Signup",input:"valid data",expected:"Account created",status:"Pass"},
            {scenario:"Empty Fields",input:"''",expected:"Validation error",status:"Fail"},
            {scenario:"Invalid Email",input:"abc@",expected:"Invalid email error",status:"Fail"},
            {scenario:"Weak Password",input:"123",expected:"Weak password warning",status:"Fail"},
            {scenario:"Password Mismatch",input:"pass1 != pass2",expected:"Mismatch error",status:"Fail"},
            {scenario:"Existing User",input:"duplicate email",expected:"User exists error",status:"Fail"},
            {scenario:"Long Input",input:"very long data",expected:"Handled properly",status:"Pass"},
            {scenario:"Special Characters",input:"@#$%",expected:"Handled properly",status:"Pass"},
            {scenario:"Phone Number Invalid",input:"abc123",expected:"Invalid phone error",status:"Fail"},
            {scenario:"Mandatory Fields Missing",input:"partial data",expected:"Validation error",status:"Fail"}
        ];
    }

    // 🔍 SEARCH FEATURE
    else if (feature.includes("search")) {
        return [
            {scenario:"Valid Search",input:"laptop",expected:"Results displayed",status:"Pass"},
            {scenario:"No Results",input:"xyz123",expected:"No results found",status:"Fail"},
            {scenario:"Empty Search",input:"''",expected:"Show message",status:"Fail"},
            {scenario:"Special Characters",input:"@#$%",expected:"Handled properly",status:"Pass"},
            {scenario:"Case Sensitivity",input:"LAPTOP",expected:"Results displayed",status:"Pass"},
            {scenario:"Long Search Input",input:"very long keyword",expected:"Handled properly",status:"Pass"},
            {scenario:"Numeric Input",input:"12345",expected:"Handled properly",status:"Pass"},
            {scenario:"SQL Injection",input:"' OR 1=1",expected:"Blocked",status:"Fail"},
            {scenario:"Partial Match",input:"lap",expected:"Suggestions/results",status:"Pass"},
            {scenario:"Whitespace Input",input:"   ",expected:"Validation message",status:"Fail"}
        ];
    }
     else if (feature.includes("email")) {
        return [
            {scenario:"Valid Email", input:"user@gmail.com", expected:"Accepted", status:"Pass"},
            {scenario:"Missing @ Symbol", input:"usergmail.com", expected:"Invalid email", status:"Fail"},
            {scenario:"Missing Domain", input:"user@", expected:"Invalid email", status:"Fail"},
            {scenario:"Special Characters", input:"user@#$.com", expected:"Invalid email", status:"Fail"},
            {scenario:"Uppercase Email", input:"USER@MAIL.COM", expected:"Accepted", status:"Pass"},
            {scenario:"Long Email", input:"verylongemailaddress@gmail.com", expected:"Accepted", status:"Pass"},
            {scenario:"Empty Email", input:"''", expected:"Validation error", status:"Fail"}
        ];
    }

    // 🔄 DEFAULT FEATURE
    return [
        {scenario:"Basic Functionality",input:"sample input",expected:"Expected output",status:"Pass"},
        {scenario:"Empty Input",input:"''",expected:"Validation error",status:"Fail"},
        {scenario:"Invalid Input",input:"wrong data",expected:"Error handling",status:"Fail"},
        {scenario:"Boundary Value",input:"max/min values",expected:"Handled properly",status:"Pass"},
        {scenario:"Special Characters",input:"@#$%",expected:"Handled properly",status:"Pass"}
    ];
    displayTests();
}

// SUBMIT
document.getElementById("testForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let feature = document.getElementById("feature").value;

    let newTests = generateTestCases(feature);

    newTests.forEach(t => {
        testCases.push({
            feature,
            scenario: t.scenario,
            input: t.input,
            expected: t.expected,
            status: t.status
        });
    });

    localStorage.setItem("testCases", JSON.stringify(testCases));
    filteredCases = [...testCases];

    displayTests();
});

// EDIT
function editTest(index) {
    let newFeature = prompt("Edit Feature:", testCases[index].feature);
    let newScenario = prompt("Edit Scenario:", testCases[index].scenario);
    let newInput = prompt("Edit Input:", testCases[index].input);
    let newExpected = prompt("Edit Expected Output:", testCases[index].expected);
    let newStatus = prompt("Edit Status (Pass/Fail):", testCases[index].status);

    if (newFeature) testCases[index].feature = newFeature;
    if (newScenario) testCases[index].scenario = newScenario;
    if (newInput) testCases[index].input = newInput;
    if (newExpected) testCases[index].expected = newExpected;
    if (newStatus) testCases[index].status = newStatus;

    localStorage.setItem("testCases", JSON.stringify(testCases));
    filteredCases = [...testCases];
    displayTests();
}
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
// SAVE




// SEARCH
function searchTests() {
    let val = document.getElementById("searchBox").value.toLowerCase();

    filteredCases = testCases.filter(t =>
        t.feature.toLowerCase().includes(val) ||
        t.scenario.toLowerCase().includes(val)
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

// CHART
function updateChart() {
    let pass = filteredCases.filter(t => t.status === "Pass").length;
    let fail = filteredCases.filter(t => t.status === "Fail").length;

    if (chart) chart.destroy();

    chart = new Chart(document.getElementById("chart"), {
        type: "pie",
        data: {
            labels: ["Pass","Fail"],
            datasets: [{
                data: [pass, fail],
                backgroundColor: ["green","red"]
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

// EXPORT CSV
function exportCSV() {
    let csv = "Feature,Scenario,Status,Priority\n";
    testCases.forEach(t => {
        csv += `${t.feature},${t.scenario},${t.status},${t.priority}\n`;
    });

    let blob = new Blob([csv]);
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "testcases.csv";
    a.click();
}

// EXPORT PDF
function exportPDF() {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();

    let y = 10;

    // Title
    doc.setFontSize(14);
    doc.text("Test Case Report", 10, y);

    y += 10;

    doc.setFontSize(8); // smaller text to fit all columns

    // Header
    doc.text("ID", 10, y);
    doc.text("Feature", 25, y);
    doc.text("Scenario", 60, y);
    doc.text("Input", 110, y);
    doc.text("Expected", 140, y);
    doc.text("Status", 180, y);

    y += 8;

    // Data
    testCases.forEach((t, i) => {
        doc.text("TC-" + (i + 1), 10, y);
        doc.text(String(t.feature), 25, y);
        doc.text(String(t.scenario), 60, y);
        doc.text(String(t.input), 110, y);
        doc.text(String(t.expected), 140, y);
        doc.text(String(t.status), 180, y);

        y += 8;

        // New page if overflow
        if (y > 280) {
            doc.addPage();
            y = 10;
        }
    });

    doc.save("testcases.pdf");
}
// DARK MODE
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
