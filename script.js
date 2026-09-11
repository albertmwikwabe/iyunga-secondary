/* =========================================
   MUST BIOLOGICAL SPECIMEN MANAGEMENT SYSTEM
========================================= */


/* ================= DEFAULT DATA ================= */

let specimens = JSON.parse(
    localStorage.getItem("mustSpecimens")
) || [
    {
        id: "SP001",
        name: "Frog",
        category: "Animal",
        quantity: 5,
        location: "Biology Lab 1",
        status: "Available",
        description: "Used for biology practical studies"
    },
    {
        id: "SP002",
        name: "Maize Seed",
        category: "Plant",
        quantity: 20,
        location: "Biology Lab 2",
        status: "Available",
        description: "Used for seed experiments"
    },
    {
        id: "SP003",
        name: "Human Blood Slide",
        category: "Human Biology",
        quantity: 10,
        location: "Biology Lab 1",
        status: "Available",
        description: "Prepared microscope slide"
    }
];


let users = JSON.parse(
    localStorage.getItem("mustUsers")
) || [
    {
        id: "U001",
        name: "System Administrator",
        username: "admin",
        email: "admin@must.ac.tz",
        role: "Admin",
        password: "1234"
    },
    {
        id: "U002",
        name: "Laboratory Technician",
        username: "labtech",
        email: "lab@must.ac.tz",
        role: "Laboratory Technician",
        password: "1234"
    },
    {
        id: "U003",
        name: "Student User",
        username: "student",
        email: "student@must.ac.tz",
        role: "Student",
        password: "1234"
    },
    {
        id: "U004",
        name: "Biology Lecturer",
        username: "lecturer",
        email: "lecturer@must.ac.tz",
        role: "Lecturer",
        password: "1234"
    },
    {
        id: "U005",
        name: "Head of Department",
        username: "hod",
        email: "hod@must.ac.tz",
        role: "HOD",
        password: "1234"
    }
];


let requests = JSON.parse(
    localStorage.getItem("mustRequests")
) || [];


let currentUser = null;


/* ================= SAVE DATA ================= */

function saveData() {

    localStorage.setItem(
        "mustSpecimens",
        JSON.stringify(specimens)
    );

    localStorage.setItem(
        "mustUsers",
        JSON.stringify(users)
    );

    localStorage.setItem(
        "mustRequests",
        JSON.stringify(requests)
    );
}


/* ================= LOGIN ================= */

document.getElementById("loginForm").addEventListener(
    "submit",
    function(e) {

        e.preventDefault();

        const username =
            document.getElementById("loginUsername").value.trim();

        const password =
            document.getElementById("loginPassword").value;

        const role =
            document.getElementById("loginRole").value;

        const user = users.find(
            u =>
                u.username === username &&
                u.password === password &&
                u.role === role
        );

        if (!user) {

            document.getElementById("loginMessage").textContent =
                "Invalid username, password or role.";

            return;
        }

        currentUser = user;

        document.getElementById("loginPage")
            .classList.add("hidden");

        document.getElementById("systemPage")
            .classList.remove("hidden");

        document.getElementById("currentUser")
            .textContent = user.name;

        document.getElementById("currentRole")
            .textContent = user.role;

        document.querySelector(".avatar")
            .textContent = user.name.charAt(0).toUpperCase();

        initializeSystem();
    }
);


/* ================= LOGOUT ================= */

function logout() {

    currentUser = null;

    document.getElementById("systemPage")
        .classList.add("hidden");

    document.getElementById("loginPage")
        .classList.remove("hidden");

    document.getElementById("loginForm").reset();
}


/* ================= PAGE NAVIGATION ================= */

function showPage(pageName) {

    document.querySelectorAll(".page")
        .forEach(page => page.classList.add("hidden"));

    document.getElementById(pageName)
        .classList.remove("hidden");


    document.querySelectorAll(".nav-btn")
        .forEach(btn => btn.classList.remove("active"));

    const button = Array.from(
        document.querySelectorAll(".nav-btn")
    ).find(btn =>
        btn.getAttribute("onclick")
        ?.includes(pageName)
    );

    if (button) {
        button.classList.add("active");
    }


    const titles = {
        dashboard: "Dashboard",
        specimens: "Specimen Records",
        users: "System Users",
        requests: "Specimen Requests",
        reports: "Reports"
    };

    document.getElementById("pageTitle")
        .textContent = titles[pageName];


    if (pageName === "dashboard") {
        updateDashboard();
    }

    if (pageName === "specimens") {
        displaySpecimens();
    }

    if (pageName === "users") {
        displayUsers();
    }

    if (pageName === "requests") {
        displayRequests();
    }

    if (pageName === "reports") {
        generateReport();
    }
}


/* ================= INITIALIZE ================= */

function initializeSystem() {

    updateDashboard();
    displaySpecimens();
    displayUsers();
    displayRequests();
    generateReport();
}


/* ================= DASHBOARD ================= */

function updateDashboard() {

    document.getElementById("totalSpecimens")
        .textContent = specimens.length;

    document.getElementById("availableSpecimens")
        .textContent =
        specimens.filter(
            s => s.status === "Available"
        ).length;

    document.getElementById("lowStock")
        .textContent =
        specimens.filter(
            s => Number(s.quantity) <= 5
        ).length;

    document.getElementById("totalUsers")
        .textContent = users.length;


    const recent =
        document.getElementById("recentSpecimens");

    recent.innerHTML = "";

    specimens.slice(-5).reverse().forEach(s => {

        recent.innerHTML += `
            <tr>
                <td>${s.id}</td>
                <td>${s.name}</td>
                <td>${s.category}</td>
                <td>${s.quantity}</td>
                <td>
                    <span class="status ${
                        s.status === "Available"
                        ? "available"
                        : "unavailable"
                    }">
                        ${s.status}
                    </span>
                </td>
            </tr>
        `;
    });
}


/* ================= SPECIMEN CRUD ================= */

function openSpecimenForm(id = null) {

    document.getElementById("specimenModal")
        .classList.remove("hidden");

    if (id) {

        const specimen =
            specimens.find(s => s.id === id);

        document.getElementById("specimenModalTitle")
            .textContent = "Edit Specimen";

        document.getElementById("specimenId")
            .value = specimen.id;

        document.getElementById("specimenName")
            .value = specimen.name;

        document.getElementById("specimenCategory")
            .value = specimen.category;

        document.getElementById("specimenQuantity")
            .value = specimen.quantity;

        document.getElementById("specimenLocation")
            .value = specimen.location;

        document.getElementById("specimenStatus")
            .value = specimen.status;

        document.getElementById("specimenDescription")
            .value = specimen.description;

    } else {

        document.getElementById("specimenModalTitle")
            .textContent = "Add Specimen";

        document.getElementById("specimenForm")
            .reset();

        document.getElementById("specimenId")
            .value = "";
    }
}


document.getElementById("specimenForm")
.addEventListener("submit", function(e) {

    e.preventDefault();

    const id =
        document.getElementById("specimenId").value;

    const data = {

        id: id || "SP" +
            String(specimens.length + 1)
            .padStart(3, "0"),

        name:
            document.getElementById("specimenName").value,

        category:
            document.getElementById("specimenCategory").value,

        quantity:
            Number(
                document.getElementById("specimenQuantity").value
            ),

        location:
            document.getElementById("specimenLocation").value,

        status:
            document.getElementById("specimenStatus").value,

        description:
            document.getElementById("specimenDescription").value
    };


    if (id) {

        const index =
            specimens.findIndex(s => s.id === id);

        specimens[index] = data;

    } else {

        specimens.push(data);
    }


    saveData();

    closeModal("specimenModal");

    displaySpecimens();
    updateDashboard();
    generateReport();
});


function displaySpecimens() {

    const search =
        document.getElementById("specimenSearch")
        ?.value.toLowerCase() || "";

    const category =
        document.getElementById("categoryFilter")
        ?.value || "";


    const table =
        document.getElementById("specimenTable");

    if (!table) return;

    table.innerHTML = "";


    specimens
        .filter(s =>
            s.name.toLowerCase().includes(search) &&
            (category === "" || s.category === category)
        )
        .forEach(s => {

            table.innerHTML += `

                <tr>

                    <td>${s.id}</td>

                    <td>
                        <strong>${s.name}</strong>
                    </td>

                    <td>${s.category}</td>

                    <td>${s.quantity}</td>

                    <td>${s.location}</td>

                    <td>
                        <span class="status ${
                            s.status === "Available"
                            ? "available"
                            : "unavailable"
                        }">
                            ${s.status}
                        </span>
                    </td>

                    <td>

                        <button
                            class="edit-btn"
                            onclick="editSpecimen('${s.id}')">
                            Edit
                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteSpecimen('${s.id}')">
                            Delete
                        </button>

                    </td>

                </tr>

            `;
        });
}


function editSpecimen(id) {

    openSpecimenForm(id);
}


function deleteSpecimen(id) {

    if (!confirm(
        "Are you sure you want to delete this specimen?"
    )) return;

    specimens =
        specimens.filter(s => s.id !== id);

    saveData();

    displaySpecimens();
    updateDashboard();
    generateReport();
}


/* ================= USERS CRUD ================= */

function openUserForm(id = null) {

    document.getElementById("userModal")
        .classList.remove("hidden");

    if (id) {

        const user =
            users.find(u => u.id === id);

        document.getElementById("userModalTitle")
            .textContent = "Edit User";

        document.getElementById("userId")
            .value = user.id;

        document.getElementById("userName")
            .value = user.name;

        document.getElementById("userUsername")
            .value = user.username;

        document.getElementById("userEmail")
            .value = user.email;

        document.getElementById("userRole")
            .value = user.role;

        document.getElementById("userPassword")
            .value = user.password;

    } else {

        document.getElementById("userModalTitle")
            .textContent = "Add User";

        document.getElementById("userForm")
            .reset();

        document.getElementById("userId")
            .value = "";
    }
}


document.getElementById("userForm")
.addEventListener("submit", function(e) {

    e.preventDefault();

    const id =
        document.getElementById("userId").value;


    const data = {

        id: id || "U" +
            String(users.length + 1)
            .padStart(3, "0"),

        name:
            document.getElementById("userName").value,

        username:
            document.getElementById("userUsername").value,

        email:
            document.getElementById("userEmail").value,

        role:
            document.getElementById("userRole").value,

        password:
            document.getElementById("userPassword").value
    };


    if (id) {

        const index =
            users.findIndex(u => u.id === id);

        users[index] = data;

    } else {

        users.push(data);
    }


    saveData();

    closeModal("userModal");

    displayUsers();
    updateDashboard();
});


function displayUsers() {

    const table =
        document.getElementById("userTable");

    table.innerHTML = "";


    users.forEach(u => {

        table.innerHTML += `

            <tr>

                <td>${u.id}</td>

                <td>${u.name}</td>

                <td>${u.username}</td>

                <td>
                    <span class="status available">
                        ${u.role}
                    </span>
                </td>

                <td>${u.email}</td>

                <td>

                    <button
                        class="edit-btn"
                        onclick="editUser('${u.id}')">
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteUser('${u.id}')">
                        Delete
                    </button>

                </td>

            </tr>
        `;
    });
}


function editUser(id) {

    openUserForm(id);
}


function deleteUser(id) {

    if (id === currentUser?.id) {

        alert("You cannot delete the currently logged-in user.");

        return;
    }

    if (!confirm(
        "Are you sure you want to delete this user?"
    )) return;

    users =
        users.filter(u => u.id !== id);

    saveData();

    displayUsers();
    updateDashboard();
}


/* ================= REQUESTS ================= */

function openRequestForm() {

    document.getElementById("requestModal")
        .classList.remove("hidden");


    const select =
        document.getElementById("requestSpecimen");

    select.innerHTML =
        `<option value="">Select Specimen</option>`;

    specimens.forEach(s => {

        select.innerHTML += `
            <option value="${s.name}">
                ${s.name}
            </option>
        `;
    });
}


document.getElementById("requestForm")
.addEventListener("submit", function(e) {

    e.preventDefault();

    const request = {

        id:
            "REQ" +
            String(requests.length + 1)
            .padStart(3, "0"),

        student:
            document.getElementById("requestStudent").value,

        specimen:
            document.getElementById("requestSpecimen").value,

        quantity:
            Number(
                document.getElementById("requestQuantity").value
            ),

        practical:
            document.getElementById("requestPractical").value,

        status: "Pending"
    };


    requests.push(request);

    saveData();

    closeModal("requestModal");

    displayRequests();

    document.getElementById("requestForm").reset();
});


function displayRequests() {

    const table =
        document.getElementById("requestTable");

    table.innerHTML = "";


    requests.forEach(r => {

        table.innerHTML += `

            <tr>

                <td>${r.id}</td>

                <td>${r.student}</td>

                <td>${r.specimen}</td>

                <td>${r.quantity}</td>

                <td>${r.practical}</td>

                <td>

                    <span class="status ${
                        r.status === "Pending"
                        ? "pending"
                        : r.status === "Approved"
                        ? "approved"
                        : "rejected"
                    }">
                        ${r.status}
                    </span>

                </td>

                <td>

                    ${
                        r.status === "Pending"
                        ? `
                        <button
                            class="edit-btn"
                            onclick="approveRequest('${r.id}')">
                            Approve
                        </button>

                        <button
                            class="delete-btn"
                            onclick="rejectRequest('${r.id}')">
                            Reject
                        </button>
                        `
                        :
                        `
                        <button
                            class="delete-btn"
                            onclick="deleteRequest('${r.id}')">
                            Delete
                        </button>
                        `
                    }

                </td>

            </tr>

        `;
    });
}


function approveRequest(id) {

    const request =
        requests.find(r => r.id === id);

    if (!request) return;

    const specimen =
        specimens.find(
            s => s.name === request.specimen
        );

    if (!specimen) {

        alert("Specimen not found.");

        return;
    }


    if (specimen.quantity < request.quantity) {

        alert("Not enough specimen quantity available.");

        return;
    }


    specimen.quantity -= request.quantity;

    if (specimen.quantity === 0) {
        specimen.status = "Unavailable";
    }


    request.status = "Approved";

    saveData();

    displayRequests();
    displaySpecimens();
    updateDashboard();
    generateReport();
}


function rejectRequest(id) {

    const request =
        requests.find(r => r.id === id);

    if (!request) return;

    request.status = "Rejected";

    saveData();

    displayRequests();
}


function deleteRequest(id) {

    requests =
        requests.filter(r => r.id !== id);

    saveData();

    displayRequests();
}


/* ================= REPORT ================= */

function generateReport() {

    const total =
        specimens.length;

    const available =
        specimens.filter(
            s => s.status === "Available"
        ).length;

    const unavailable =
        specimens.filter(
            s => s.status === "Unavailable"
        ).length;

    const quantity =
        specimens.reduce(
            (sum, s) => sum + Number(s.quantity),
            0
        );


    document.getElementById("reportTotal")
        .textContent = total;

    document.getElementById("reportAvailable")
        .textContent = available;

    document.getElementById("reportUnavailable")
        .textContent = unavailable;

    document.getElementById("reportQuantity")
        .textContent = quantity;


    const table =
        document.getElementById("reportTable");

    table.innerHTML = "";


    specimens.forEach(s => {

        table.innerHTML += `

            <tr>

                <td>${s.id}</td>

                <td>${s.name}</td>

                <td>${s.category}</td>

                <td>${s.quantity}</td>

                <td>${s.location}</td>

                <td>${s.status}</td>

            </tr>

        `;
    });
}


/* ================= DOWNLOAD CSV REPORT ================= */

function downloadReport() {

    let csv =
        "MUST Biological Specimen Management System\n";

    csv +=
        "Biological Specimen Inventory Report\n\n";

    csv +=
        "ID,Specimen,Category,Quantity,Location,Status\n";


    specimens.forEach(s => {

        csv +=
            `"${s.id}","${s.name}","${s.category}",` +
            `"${s.quantity}","${s.location}","${s.status}"\n`;
    });


    const blob =
        new Blob([csv], {
            type: "text/csv;charset=utf-8;"
        });


    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "MUST_Biological_Specimen_Report.csv";

    link.click();

    URL.revokeObjectURL(url);
}


/* ================= PRINT REPORT ================= */

function printReport() {

    const report =
        document.querySelector(".report-area")
        .innerHTML;


    const win =
        window.open("", "", "width=1000,height=700");


    win.document.write(`

        <html>

        <head>

            <title>MUST Specimen Report</title>

            <style>

                body {
                    font-family: Arial;
                    padding: 30px;
                }

                h2 {
                    color: #063b65;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }

                th, td {
                    border: 1px solid #ddd;
                    padding: 10px;
                    text-align: left;
                }

                th {
                    background: #f1f5f9;
                }

            </style>

        </head>

        <body>

            ${report}

        </body>

        </html>

    `);

    win.document.close();

    win.print();
}


/* ================= MODAL ================= */

function closeModal(id) {

    document.getElementById(id)
        .classList.add("hidden");
}