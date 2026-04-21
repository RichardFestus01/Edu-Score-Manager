const resultForm = document.getElementById('result-form');
const resultsTableBody = document.querySelector('#results-table tbody');
const downloadBtn = document.getElementById('download-csv');
const downloadAllBtn = document.getElementById('download-all-csv');
const averageDisplay = document.getElementById('overall-average');
const subjectSelect = document.getElementById('subjectSelect');
const customSubjectInput = document.getElementById('customSubject');
const registerStudentBtn = document.getElementById('registerStudentBtn');
const clearNameBtn = document.getElementById('clearNameBtn');

let students = JSON.parse(localStorage.getItem('academicResults')) || [];
let editingId = null;

function saveData() {
    localStorage.setItem('academicResults', JSON.stringify(students));
    updateNameDatalist();
}

function updateNameDatalist() {
    const nameDatalist = document.getElementById('studentNamesList');
    if (!nameDatalist) return;
    nameDatalist.innerHTML = '';
    const currentClass = document.getElementById('schoolClass').value;
    const uniqueNames = [...new Set(students.filter(s => s.className === currentClass).map(s => s.name))];
    uniqueNames.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        nameDatalist.appendChild(option);
    });
}

clearNameBtn.addEventListener('click', () => {
    document.getElementById('studentName').value = '';
    document.getElementById('studentName').focus();
});

subjectSelect.addEventListener('change', () => {
    if (subjectSelect.value === 'Other') {
        customSubjectInput.style.display = 'block';
        customSubjectInput.setAttribute('required', 'required');
    } else {
        customSubjectInput.style.display = 'none';
        customSubjectInput.removeAttribute('required');
        customSubjectInput.value = '';
    }
});

resultForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('studentName').value;
    const className = document.getElementById('schoolClass').value;
    const regNo = document.getElementById('regNo').value;
    const gender = document.getElementById('gender').value;
    const age = document.getElementById('age').value;
    const state = document.getElementById('stateOfOrigin').value;
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;

    let subject = subjectSelect.value;
    if (subject === 'Other') {
        subject = customSubjectInput.value;
    }

    // Validation: Check for duplicate subject for this student in this class
    const isDuplicate = students.some(s => 
        s.name === name && 
        s.className === className && 
        s.subject === subject && 
        s.id !== editingId
    );

    if (isDuplicate) {
        alert(`Academic record for "${subject}" already exists for ${name} in ${className}. Please use the "Edit" button to modify existing scores.`);
        return;
    }

    const caInput = document.getElementById('caScore').value;
    const examInput = document.getElementById('examScore').value;
    const ca = parseFloat(caInput) || 0;
    const exam = parseFloat(examInput) || 0;
    const examAdded = examInput.trim() !== '';

    const total = ca + exam;
    const grade = calculateGrade(total);

    if (editingId) {
        const index = students.findIndex(s => s.id === editingId);
        if (index !== -1) {
            students[index] = { ...students[index], name, className, regNo, gender, age, state, height, weight, subject, ca, exam, total, grade, examAdded };
        }
        editingId = null;
        resultForm.querySelector('button[type="submit"]').textContent = 'Add Subject Score';
    } else {
        // Remove registration placeholder if it exists before adding actual score
        students = students.filter(s => !(s.name === name && s.className === className && s.subject === null));
        
        const student = { id: Date.now(), name, className, regNo, gender, age, state, height, weight, subject, ca, exam, total, grade, examAdded };
        students.push(student);
    }

    refreshTable();
    updateAverage();
    saveData();
    
    // Selective reset: Keep name, clear subject and scores
    subjectSelect.value = '';
    customSubjectInput.value = '';
    customSubjectInput.style.display = 'none';
    customSubjectInput.removeAttribute('required');
    document.getElementById('caScore').value = '';
    document.getElementById('examScore').value = '';
    subjectSelect.focus();
});

registerStudentBtn.addEventListener('click', () => {
    const name = document.getElementById('studentName').value;
    const className = document.getElementById('schoolClass').value;
    
    if (!name) {
        alert("Please enter a student name to register.");
        return;
    }
    if (!className) {
        alert("Please select a class first.");
        return;
    }
    if (students.some(s => s.name === name && s.className === className)) {
        alert("Student is already registered in this class.");
        return;
    }
    const regNo = document.getElementById('regNo').value;
    const gender = document.getElementById('gender').value;
    const age = document.getElementById('age').value;
    const state = document.getElementById('stateOfOrigin').value;
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;

    const studentProfile = { id: Date.now(), name, className, regNo, gender, age, state, height, weight, subject: null, ca: 0, exam: 0, total: 0, grade: '', examAdded: false };
    students.push(studentProfile);
    
    refreshTable();
    saveData();
    
    // Clear biodata fields to allow for next registration
    document.getElementById('regNo').value = '';
    document.getElementById('gender').value = '';
    document.getElementById('age').value = '';
    document.getElementById('stateOfOrigin').value = '';
    document.getElementById('height').value = '';
    document.getElementById('weight').value = '';
    clearNameBtn.click();
});

function refreshTable() {
    resultsTableBody.innerHTML = '';
    const currentClass = document.getElementById('schoolClass').value;
    
    // Calculate Subject Positions
    const subjectRanks = {};
    const scoredEntries = students.filter(s => s.subject !== null && s.className === currentClass);
    const uniqueSubjects = [...new Set(scoredEntries.map(s => s.subject))];
    uniqueSubjects.forEach(sub => {
        const scores = scoredEntries
            .filter(s => s.subject === sub)
            .map(s => s.total)
            .sort((a, b) => b - a);
        subjectRanks[sub] = scores;
    });

    const getOrdinalPos = (subject, total) => {
        const scores = subjectRanks[subject];
        if (!scores) return 'N/A';
        const rank = scores.indexOf(total) + 1;
        let s = ["th", "st", "nd", "rd"],
            v = rank % 100;
        return rank + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    // Group entries by student name to calculate individual averages
    const groupedNames = [];
    const currentClassStudents = students.filter(s => s.className === currentClass);
    currentClassStudents.forEach(s => {
        if (!groupedNames.includes(s.name)) groupedNames.push(s.name);
    });

    groupedNames.forEach(name => {
        const studentEntries = currentClassStudents.filter(s => s.name === name);
        let studentSum = 0;

        // Add Student Header Row
        const headerRow = document.createElement('tr');
        headerRow.className = 'student-group-row';
        headerRow.innerHTML = `
            <td colspan="4">${name}</td>
            <td colspan="3" style="text-align: right;">
                <button class="btn-edit" style="background: var(--secondary-color); color: white;" onclick="selectStudent('${name.replace(/'/g, "\\'")}')">Select</button>
                <button class="btn-print" onclick="printStudentReport('${name.replace(/'/g, "\\'")}')">Print Report</button>
                <button class="btn-delete" onclick="deleteStudentGroup('${name.replace(/'/g, "\\'")}')">Delete All</button>
            </td>
        `;
        resultsTableBody.appendChild(headerRow);

        // Add Subject Rows
        studentEntries.forEach(s => {
            if (s.subject === null) return; // Skip placeholder entries
            
            studentSum += s.total;
            const row = document.createElement('tr');
            row.setAttribute('data-id', s.id);
            row.innerHTML = `
                <td>${s.subject}</td>
                <td>${s.ca}</td>
                <td>${s.examAdded ? s.exam : '-'}</td>
                <td>${s.examAdded ? s.total : '-'}</td>
                <td><span class="grade-pill ${s.examAdded ? 'grade-' + s.grade : ''}">${s.examAdded ? s.grade : '-'}</span></td>
                <td style="font-weight: bold; color: var(--primary-color);">${getOrdinalPos(s.subject, s.total)}</td>
                <td>
                    <button class="btn-edit" onclick="editEntry(${s.id})">Edit</button>
                    <button class="btn-delete" onclick="deleteEntry(${s.id})">Delete</button>
                </td>
            `;
            resultsTableBody.appendChild(row);
        });

        // Add Individual Student Average Row
        const validEntries = studentEntries.filter(s => s.subject !== null);
        if (validEntries.length > 0) {
            const studentAvg = (studentSum / validEntries.length).toFixed(2);
            const avgRow = document.createElement('tr');
            avgRow.className = 'student-average-row';
            avgRow.innerHTML = `
                <td colspan="4" style="text-align: right; font-weight: bold;">${name}'s Average:</td>
                <td colspan="3" style="font-weight: bold; color: var(--primary-color);">${studentAvg}%</td>
            `;
            resultsTableBody.appendChild(avgRow);
        }

        // Add Spacer Row for visual separation
        const spacerRow = document.createElement('tr');
        spacerRow.className = 'spacer-row';
        spacerRow.innerHTML = `<td colspan="7"></td>`;
        resultsTableBody.appendChild(spacerRow);
    });
}

function selectStudent(name) {
    const currentClass = document.getElementById('schoolClass').value;
    const bio = students.find(s => s.name === name && s.className === currentClass);
    if (bio) {
        document.getElementById('studentName').value = bio.name;
        document.getElementById('regNo').value = bio.regNo || '';
        document.getElementById('gender').value = bio.gender || '';
        document.getElementById('age').value = bio.age || '';
        document.getElementById('stateOfOrigin').value = bio.state || '';
        document.getElementById('height').value = bio.height || '';
        document.getElementById('weight').value = bio.weight || '';
    }
    subjectSelect.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function printStudentReport(name) {
    const getVal = (id) => document.getElementById(id).value || '---';
    const schoolName = getVal('schoolName');
    const schoolAddress = getVal('schoolAddress');
    const schoolMotto = document.getElementById('schoolMotto').value;
    const schoolClass = getVal('schoolClass');
    const term = getVal('currentTerm');
    const session = getVal('currentSession');
    const showOverallPos = document.getElementById('showOverallPos').checked;

    const currentClass = document.getElementById('schoolClass').value;
    const studentEntries = students.filter(s => s.name === name && s.className === currentClass && s.subject !== null);
    if (studentEntries.length === 0) return;
    const bio = studentEntries[0];

    // Overall Class Positioning Logic
    let overallPosHtml = '';
    if (showOverallPos) {
        const classStudents = [...new Set(students.filter(s => s.className === currentClass && s.subject !== null).map(s => s.name))];
        const averages = classStudents.map(stdName => {
            const entries = students.filter(s => s.name === stdName && s.className === currentClass && s.subject !== null);
            const sum = entries.reduce((acc, curr) => acc + curr.total, 0);
            return { name: stdName, avg: sum / entries.length };
        }).sort((a, b) => b.avg - a.avg);

        const currentAvg = studentEntries.reduce((acc, curr) => acc + curr.total, 0) / studentEntries.length;
        const rank = averages.findIndex(a => a.avg === currentAvg) + 1;
        
        const getOrdinal = (n) => {
            let s = ["th", "st", "nd", "rd"], v = n % 100;
            return n + (s[(v - 20) % 10] || s[v] || s[0]);
        };
        
        overallPosHtml = `<div class="info-item"><strong>CLASS POSITION:</strong> ${getOrdinal(rank)} out of ${averages.length}</div>`;
    }

    // Ranking Logic for Print
    const subjectRanks = {};
    const scoredEntries = students.filter(s => s.subject !== null && s.className === currentClass);
    const uniqueSubjects = [...new Set(scoredEntries.map(s => s.subject))];
    uniqueSubjects.forEach(sub => {
        const scores = scoredEntries.filter(s => s.subject === sub).map(s => s.total).sort((a, b) => b - a);
        subjectRanks[sub] = scores;
    });
    const getOrdinalPos = (subject, total) => {
        const scores = subjectRanks[subject];
        const rank = scores.indexOf(total) + 1;
        let s = ["th", "st", "nd", "rd"], v = rank % 100;
        return rank + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    let totalSum = 0;
    let rowsHtml = '';
    studentEntries.forEach(s => {
        totalSum += s.total;
        rowsHtml += `<tr>
            <td>${s.subject}</td>
            <td>${s.ca}</td>
            <td>${s.examAdded ? s.exam : '-'}</td>
            <td>${s.examAdded ? s.total : '-'}</td>
            <td>${s.examAdded ? s.grade : '-'}</td>
            <td>${getOrdinalPos(s.subject, s.total)}</td>
        </tr>`;
    });
    const avg = (totalSum / studentEntries.length).toFixed(2);

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Report Card - ${name}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
                    body { font-family: 'Inter', sans-serif; padding: 10px; color: #1a1a1a; background: #fff; font-size: 13px; }
                    .report-wrapper { border: 6px double #4f46e5; padding: 20px; max-width: 850px; margin: 0 auto; position: relative; overflow: hidden; box-sizing: border-box; }
                    
                    /* Watermark */
                    .report-wrapper::before {
                        content: '${schoolName}';
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%) rotate(-45deg);
                        font-size: 60px;
                        font-weight: bold;
                        color: rgba(79, 70, 229, 0.05);
                        white-space: nowrap;
                        z-index: 0;
                        pointer-events: none;
                    }

                    .header { text-align: center; border-bottom: 2px solid #4f46e5; padding-bottom: 8px; margin-bottom: 15px; position: relative; z-index: 1; }
                    .header h1 { color: #4f46e5; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 1.5px; }
                    .header p { margin: 3px 0; font-weight: 600; font-size: 14px; }
                    .motto { font-style: italic; color: #6b7280; font-size: 12px; margin-bottom: 5px; }
                    
                    .report-title { background: #4f46e5; color: white; padding: 6px; font-weight: bold; text-align: center; font-size: 16px; margin-bottom: 15px; border-radius: 4px; }
                    
                    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px 20px; margin-bottom: 15px; position: relative; z-index: 1; }
                    .info-item { border-bottom: 1px solid #e5e7eb; padding: 3px 0; font-size: 12px; }
                    .info-item strong { color: #4f46e5; display: inline-block; width: 120px; }

                    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; position: relative; z-index: 1; background: rgba(255,255,255,0.8); }
                    th { background: #4f46e5; color: white; padding: 8px 4px; font-size: 11px; text-transform: uppercase; border: 1px solid #4f46e5; }
                    td { border: 1px solid #cbd5e1; padding: 6px 4px; text-align: center; font-size: 12px; }
                    td:first-child { text-align: left; font-weight: 700; color: #334155; }

                    .bottom-section { display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px; margin-top: 15px; position: relative; z-index: 1; }
                    
                    .grading-key { font-size: 10px; border: 1px solid #e5e7eb; padding: 8px; border-radius: 4px; }
                    .grading-key h4 { margin: 0 0 5px 0; color: #4f46e5; text-transform: uppercase; }
                    .key-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; }
                    
                    .traits-section { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px; position: relative; z-index: 1; }
                    .traits-table h4 { margin: 0 0 5px 0; font-size: 11px; color: #4f46e5; text-transform: uppercase; border-bottom: 1px solid #4f46e5; }
                    .traits-table table td { padding: 3px; font-size: 10px; height: 16px; }
                    .rating-legend { margin-top: 8px; font-size: 9px; border-top: 1px solid #e5e7eb; padding-top: 4px; font-style: italic; color: #4b5563; text-align: center; }

                    .performance-box { border: 2px solid #4f46e5; padding: 10px; border-radius: 8px; text-align: center; }
                    .performance-box .avg-label { font-size: 11px; font-weight: bold; color: #64748b; margin-bottom: 3px; }
                    .performance-box .avg-value { font-size: 24px; font-weight: 800; color: #4f46e5; }
                    
                    .signatures { display: flex; justify-content: space-between; margin-top: 25px; position: relative; z-index: 1; }
                    .sig-block { text-align: center; width: 200px; }
                    .sig-line { border-top: 1px solid #1a1a1a; margin-bottom: 5px; }
                    .sig-block p { font-size: 11px; font-weight: bold; margin: 0; }

                    @media print { 
                        body { padding: 0; margin: 0; } 
                        .report-wrapper { border: 6px double #4f46e5 !important; width: 100%; max-width: none; }
                        @page { margin: 0.5cm; }
                    }
                </style>
            </head>
            <body>
                <div class="report-wrapper">
                    <div class="header">
                        <h1>${schoolName}</h1>
                        <p>${schoolAddress}</p>
                        ${schoolMotto ? `<p class="motto">"${schoolMotto}"</p>` : ''}
                    </div>

                    <div class="report-title">STUDENT ACADEMIC PROGRESS REPORT</div>

                    <div class="info-grid">
                        <div class="info-item"><strong>NAME:</strong> ${name}</div>
                        <div class="info-item"><strong>REG NO:</strong> ${bio.regNo || '---'}</div>
                        <div class="info-item"><strong>CLASS:</strong> ${schoolClass}</div>
                        <div class="info-item"><strong>TERM:</strong> ${term}</div>
                        <div class="info-item"><strong>SESSION:</strong> ${session}</div>
                        <div class="info-item"><strong>GENDER:</strong> ${bio.gender || '---'}</div>
                        <div class="info-item"><strong>AGE:</strong> ${bio.age || '---'}</div>
                        <div class="info-item"><strong>STATE:</strong> ${bio.state || '---'}</div>
                        ${overallPosHtml}
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Subject Name</th>
                                <th>CA (30)</th>
                                <th>Exam (70)</th>
                                <th>Total (100)</th>
                                <th>Grade</th>
                                <th>Position</th>
                            </tr>
                        </thead>
                        <tbody>${rowsHtml}</tbody>
                    </table>

                    <div class="bottom-section">
                        <div class="grading-key">
                            <h4>Grading Key</h4>
                            <div class="key-grid">
                                <span>75 - 100 : <strong>A</strong></span>
                                <span>65 - 74 : <strong>B</strong></span>
                                <span>50 - 64 : <strong>C</strong></span>
                                <span>45 - 49 : <strong>D</strong></span>
                                <span>40 - 44 : <strong>E</strong></span>
                                <span>00 - 39 : <strong>F</strong></span>
                            </div>
                        </div>
                        <div class="performance-box">
                            <div class="avg-label">ACADEMIC PERFORMANCE AVERAGE</div>
                            <div class="avg-value">${avg}%</div>
                        </div>
                    </div>

                    <div class="traits-section">
                        <div class="traits-table">
                            <h4>Affective Development</h4>
                            <table>
                                <tr><td style="text-align:left">Punctuality</td><td style="width:40px"></td></tr>
                                <tr><td style="text-align:left">Neatness</td><td></td></tr>
                                <tr><td style="text-align:left">Honesty</td><td></td></tr>
                                <tr><td style="text-align:left">Self Control</td><td></td></tr>
                                <tr><td style="text-align:left">Relationship with Others</td><td></td></tr>
                            </table>
                        </div>
                        <div class="traits-table">
                            <h4>Psychomotor Skills</h4>
                            <table>
                                <tr><td style="text-align:left">Handwriting</td><td style="width:40px"></td></tr>
                                <tr><td style="text-align:left">Fluency/Speech</td><td></td></tr>
                                <tr><td style="text-align:left">Games/Sports</td><td></td></tr>
                                <tr><td style="text-align:left">Crafts/Arts</td><td></td></tr>
                                <tr><td style="text-align:left">Musical Skills</td><td></td></tr>
                            </table>
                        </div>
                    </div>

                    <div class="rating-legend">
                        <strong>Rating Scale:</strong> 5 - Excellent, 4 - Very Good, 3 - Good, 2 - Fair, 1 - Poor
                    </div>

                    <div class="signatures">
                        <div class="sig-block">
                            <div class="sig-line"></div>
                            <p>CLASS TEACHER</p>
                        </div>
                        <div class="sig-block">
                            <div class="sig-line"></div>
                            <p>PRINCIPAL'S SIGNATURE</p>
                        </div>
                    </div>
                </div>
                <script>window.onload = function() { window.print(); window.close(); };</script>
            </body>
        </html>
    `);
    printWindow.document.close();
}

function editEntry(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;

    document.getElementById('studentName').value = student.name;
    document.getElementById('regNo').value = student.regNo || '';
    document.getElementById('gender').value = student.gender || '';
    document.getElementById('age').value = student.age || '';
    document.getElementById('stateOfOrigin').value = student.state || '';
    document.getElementById('height').value = student.height || '';
    document.getElementById('weight').value = student.weight || '';
    
    const options = Array.from(subjectSelect.options).map(opt => opt.value);
    if (options.includes(student.subject)) {
        subjectSelect.value = student.subject;
        customSubjectInput.style.display = 'none';
    } else {
        subjectSelect.value = 'Other';
        customSubjectInput.value = student.subject;
        customSubjectInput.style.display = 'block';
    }

    document.getElementById('caScore').value = student.ca || '';
    document.getElementById('examScore').value = student.examAdded ? student.exam : '';

    editingId = id;
    resultForm.querySelector('button[type="submit"]').textContent = 'Update Score';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteEntry(id) {
    if (editingId === id) {
        editingId = null;
        resultForm.reset();
        resultForm.querySelector('button[type="submit"]').textContent = 'Add Subject Score';
    }
    students = students.filter(s => s.id !== id);
    refreshTable();
    updateAverage();
    saveData();
}

function deleteStudentGroup(name) {
    if (editingId && students.find(s => s.id === editingId)?.name === name) {
        editingId = null;
        resultForm.reset();
        resultForm.querySelector('button[type="submit"]').textContent = 'Add Subject Score';
    }
    students = students.filter(s => s.name !== name);
    refreshTable();
    updateAverage();
    saveData();
}

function calculateGrade(score) {
    if (score >= 75) return 'A';
    if (score >= 65) return 'B';
    if (score >= 50) return 'C';
    if (score >= 45) return 'D';
    if (score >= 40) return 'E';
    return 'F';
}

function updateAverage() {
    if (students.length === 0) {
        averageDisplay.innerText = "0.00%";
        return;
    }
    const currentClass = document.getElementById('schoolClass').value;
    const scoredEntries = students.filter(s => s.subject !== null && s.className === currentClass);
    if (scoredEntries.length === 0) return;
    
    const sum = scoredEntries.reduce((acc, curr) => acc + curr.total, 0);
    const avg = (sum / scoredEntries.length).toFixed(2);
    averageDisplay.innerText = `${avg}%`;
}

downloadBtn.addEventListener('click', () => {
    if (students.length === 0) {
        alert("Please add at least one student first.");
        return;
    }

    const currentClass = document.getElementById('schoolClass').value;
    const fileName = prompt("Enter a name for your result file:", "Academic_Results");
    if (!fileName) return; // Cancel if no name is provided

    const headers = ["Name", "Subject", "CA", "Exam", "Total", "Grade"];
    const groupedNames = [];
    const filteredData = students.filter(s => s.className === currentClass);
    filteredData.forEach(s => {
        if (!groupedNames.includes(s.name)) groupedNames.push(s.name);
    });

    let csvRows = [headers.join(",")];
    groupedNames.forEach((name, index) => {
        const studentEntries = filteredData.filter(s => s.name === name && s.subject !== null);
        if (studentEntries.length === 0) return;

        if (csvRows.length > 1) csvRows.push(""); 
        let studentSum = 0;
        studentEntries.forEach(s => {
            studentSum += s.total;
            csvRows.push(`${s.name},${s.subject},${s.ca},${s.examAdded ? s.exam : '-'},${s.examAdded ? s.total : '-'},${s.examAdded ? s.grade : '-'}`);
        });
        const studentAvg = (studentSum / studentEntries.length).toFixed(2);
        csvRows.push(`,,,${name}'s Average:,${studentAvg}%,`);
    });

    const csvContent = csvRows.join("\n");
    downloadCSVFile(csvContent, `${fileName}.csv`);
});

downloadAllBtn.addEventListener('click', () => {
    const scoredEntries = students.filter(s => s.subject !== null);
    if (scoredEntries.length === 0) {
        alert("No academic results available to export.");
        return;
    }

    const fileName = prompt("Enter a name for the Overall School Report:", "Overall_Academic_Results");
    if (!fileName) return;

    const headers = ["Class", "Name", "Subject", "CA", "Exam", "Total", "Grade"];
    let csvRows = [headers.join(",")];

    // Get unique classes and sort them
    const classes = [...new Set(scoredEntries.map(s => s.className))].sort();

    classes.forEach((cls) => {
        // Add a clear class demarcation
        csvRows.push(""); 
        csvRows.push(`--- CLASS: ${cls} ---,,,,,,`);
        
        const classData = scoredEntries.filter(s => s.className === cls);
        const uniqueNamesInClass = [...new Set(classData.map(s => s.name))];

        uniqueNamesInClass.forEach((name) => {
            const studentEntries = classData.filter(s => s.name === name);
            let studentSum = 0;

            studentEntries.forEach(s => {
                studentSum += s.total;
                csvRows.push(`${cls},${s.name},${s.subject},${s.ca},${s.examAdded ? s.exam : '-'},${s.examAdded ? s.total : '-'},${s.examAdded ? s.grade : '-'}`);
            });

            // Add student average for clarity
            const studentAvg = (studentSum / studentEntries.length).toFixed(2);
            csvRows.push(`,,,${name}'s Average:,${studentAvg}%,`);
            csvRows.push(",,,,,,"); // Spacer between students
        });
        
        csvRows.push(",,,,,,"); // Extra spacer between classes
    });

    const csvContent = csvRows.join("\n");
    downloadCSVFile(csvContent, `${fileName}.csv`);
});

function downloadCSVFile(content, fileName) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Function to sync school settings (Name, Address, Class, etc.)
function setupSchoolSettings() {
    const settingsFields = ['schoolName', 'schoolAddress', 'schoolMotto', 'schoolClass', 'currentTerm', 'currentSession', 'showOverallPos'];
    
    settingsFields.forEach(id => {
        const element = document.getElementById(id);
        if (!element) return;

        // Load saved value from localStorage
        if (element.type === 'checkbox') {
            element.checked = localStorage.getItem(id) === 'true';
        } else {
            element.value = localStorage.getItem(id) || '';
        }

        // Save value and refresh UI on change
        const eventType = element.type === 'checkbox' || element.tagName === 'SELECT' ? 'change' : 'input';
        
        element.addEventListener(eventType, () => {
            const value = element.type === 'checkbox' ? element.checked : element.value;
            localStorage.setItem(id, value);
            
            // If we switch the class, we need to refresh the table and averages
            if (id === 'schoolClass') {
                editingId = null; // Cancel any active edits
                resultForm.reset(); // Clear the input form for the new "page"
                refreshTable();
                updateAverage();
                updateNameDatalist();
            }
        });
    });
}

// Initial load to render saved data
setupSchoolSettings();
refreshTable();
updateAverage();
updateNameDatalist();