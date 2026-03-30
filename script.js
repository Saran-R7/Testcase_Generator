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

    // 🔐 LOGIN FEATURE (FULL SCENARIOS)
    if (feature.includes("login")) {
        return [
            {scenario:"Valid Login", input:"admin / 1234", expected:"Login successful", status:"Pass"},
            {scenario:"Invalid Password", input:"admin / wrong", expected:"Error message", status:"Fail"},
            {scenario:"Invalid Username", input:"wrong / 1234", expected:"Error message", status:"Fail"},
            {scenario:"Empty Fields", input:"'' / ''", expected:"Validation error", status:"Fail"},
            {scenario:"Only Username Entered", input:"admin / ''", expected:"Password required", status:"Fail"},
            {scenario:"Only Password Entered", input:"'' / 1234", expected:"Username required", status:"Fail"},
            {scenario:"SQL Injection Attempt", input:"' OR 1=1 --", expected:"Access denied", status:"Fail"},
            {scenario:"Very Long Input", input:"long username/password", expected:"Handled properly", status:"Pass"},
            {scenario:"Case Sensitivity", input:"ADMIN / 1234", expected:"Handled correctly", status:"Pass"},
            {scenario:"Special Characters", input:"admin@123", expected:"Handled properly", status:"Pass"},
            {scenario:"Session Timeout", input:"inactive user", expected:"Session expired", status:"Fail"},
            {scenario:"Multiple Failed Attempts", input:"wrong password multiple times", expected:"Account locked", status:"Fail"}
        ];
    }

    // 📝 SIGNUP FEATURE (FULL VALIDATION)
    else if (feature.includes("signup")) {
        return [
            {scenario:"Valid Signup", input:"valid details", expected:"Account created", status:"Pass"},
            {scenario:"Empty Fields", input:"''", expected:"Validation error", status:"Fail"},
            {scenario:"Invalid Email Format", input:"abc@", expected:"Invalid email error", status:"Fail"},
            {scenario:"Valid Email Format", input:"user@gmail.com", expected:"Accepted", status:"Pass"},
            {scenario:"Weak Password", input:"123", expected:"Weak password warning", status:"Fail"},
            {scenario:"Strong Password", input:"Admin@123", expected:"Accepted", status:"Pass"},
            {scenario:"Password Mismatch", input:"pass1 != pass2", expected:"Mismatch error", status:"Fail"},
            {scenario:"Existing User", input:"duplicate email", expected:"User exists error", status:"Fail"},
            {scenario:"Special Characters", input:"@#$%", expected:"Handled properly", status:"Pass"},
            {scenario:"Phone Number Invalid", input:"abc123", expected:"Invalid phone error", status:"Fail"},
            {scenario:"Phone Number Valid", input:"9876543210", expected:"Accepted", status:"Pass"},
            {scenario:"Mandatory Fields Missing", input:"partial data", expected:"Validation error", status:"Fail"}
        ];
    }

    // 🔍 SEARCH FEATURE (FULL CASES)
    else if (feature.includes("search")) {
        return [
            {scenario:"Valid Search", input:"laptop", expected:"Results displayed", status:"Pass"},
            {scenario:"No Results Found", input:"xyz123", expected:"No results message", status:"Fail"},
            {scenario:"Empty Search", input:"''", expected:"Validation message", status:"Fail"},
            {scenario:"Whitespace Input", input:"   ", expected:"Validation message", status:"Fail"},
            {scenario:"Special Characters", input:"@#$%", expected:"Handled properly", status:"Pass"},
            {scenario:"Case Sensitivity", input:"LAPTOP", expected:"Results displayed", status:"Pass"},
            {scenario:"Numeric Search", input:"12345", expected:"Handled properly", status:"Pass"},
            {scenario:"Very Long Search Input", input:"long keyword", expected:"Handled properly", status:"Pass"},
            {scenario:"SQL Injection", input:"' OR 1=1", expected:"Blocked", status:"Fail"},
            {scenario:"Partial Match", input:"lap", expected:"Suggestions/results", status:"Pass"}
        ];
    }

    // 📧 EMAIL VALIDATION FEATURE
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

    // 🔄 DEFAULT
    else {
        return [
            {scenario:"Basic Functionality", input:"sample input", expected:"Expected output", status:"Pass"},
            {scenario:"Invalid Input", input:"wrong data", expected:"Error handling", status:"Fail"},
            {scenario:"Boundary Values", input:"min/max", expected:"Handled properly", status:"Pass"},
            {scenario:"Special Characters", input:"@#$%", expected:"Handled properly", status:"Pass"}
        ];
    }
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