const resultForm = document.getElementById('result-form');
const resultsTableBody = document.querySelector('#results-table tbody');
const downloadBtn = document.getElementById('download-csv');
const downloadAllBtn = document.getElementById('download-all-csv');
const averageDisplay = document.getElementById('overall-average');
const subjectSelect = document.getElementById('subjectSelect');
const customSubjectInput = document.getElementById('customSubject');
const registerStudentBtn = document.getElementById('registerStudentBtn');
const clearNameBtn = document.getElementById('clearNameBtn');
const updateBioTraitsBtn = document.getElementById('updateBioTraitsBtn');
const updateTeacherRemarkBtn = document.getElementById('updateTeacherRemarkBtn');

// Teacher remark elements
const teacherRemarkToggle = document.getElementById('teacherRemarkToggle');
const teacherRemarkInput = document.getElementById('teacherRemark');

// State & LGA data
const nigeriaLGAs = {
    "Abia": ["Aba North", "Aba South", "Arochukwu", "Bende", "Ikwuano", "Isiala Ngwa North", "Isiala Ngwa South", "Isuikwuato", "Obi Ngwa", "Ohafia", "Ugwunagbo", "Ukwa East", "Ukwa West", "Umuahia North", "Umuahia South", "Umu Nneochi"],
    "Adamawa": ["Demsa", "Fufure", "Ganye", "Gayuk", "Gombi", "Grie", "Hong", "Jada", "Lamurde", "Madagali", "Maiha", "Michika", "Mubi North", "Mubi South", "Numan", "Shelleng", "Song", "Toungo", "Yola North", "Yola South"],
    "Akwa Ibom": ["Abak", "Eastern Obolo", "Eket", "Esit Eket", "Essien Udim", "Etim Ekpo", "Etinan", "Ibeno", "Ibesikpo Asutan", "Ibiono-Ibom", "Ika", "Ikono", "Ikot Abasi", "Ikot Ekpene", "Ini", "Itu", "Mbo", "Mkpat-Enin", "Nsit-Atai", "Nsit-Ibom", "Nsit-Ubium", "Obot Akara", "Okobo", "Onna", "Oron", "Oruk Anam", "Udung-Uko", "Ukanafun", "Uruan", "Urue-Offiong/Oruko", "Uyo"],
    "Anambra": ["Aguata", "Anambra East", "Anambra West", "Anaocha", "Awka North", "Awka South", "Ayamelum", "Bori", "Dunukofia", "Ekwusigo", "Idemili North", "Idemili South", "Ihiala", "Njikoka", "Nnewi North", "Nnewi South", "Ogbaru", "Onitsha North", "Onitsha South", "Orumba North", "Orumba South", "Oyi"],
    "Bauchi": ["Alkaleri", "Bauchi", "Bogoro", "Damban", "Darazo", "Dass", "Gamawa", "Ganjuwa", "Giade", "Itas/Gadau", "Jama'are", "Katagum", "Kirfi", "Misau", "Ningi", "Shira", "Tafawa Balewa", "Toro", "Warji", "Zaki"],
    "Bayelsa": ["Brass", "Ekeremor", "Kolokuma/Opokuma", "Nembe", "Ogbia", "Sagbama", "Southern Ijaw", "Yenagoa"],
    "Benue": ["Ado", "Agatu", "Apa", "Buruku", "Gboko", "Guma", "Gwer East", "Gwer West", "Katsina-Ala", "Konshisha", "Kwande", "Logo", "Makurdi", "Obi", "Ogbadibo", "Ohimini", "Oju", "Okpokwu", "Otukpo", "Tarka", "Ukum", "Ushongo", "Vandeikya"],
    "Borno": ["Abadam", "Askira/Uba", "Bama", "Bayo", "Biu", "Chibok", "Damboa", "Dikwa", "Gubio", "Guzamala", "Gwoza", "Hawul", "Jere", "Kaga", "Kala/Balge", "Konduga", "Kukawa", "Kwaya Kusar", "Mafa", "Magumeri", "Maiduguri", "Marte", "Mobbar", "Monguno", "Ngala", "Nganzai", "Shani"],
    "Cross River": ["Abi", "Akamkpa", "Akpabuyo", "Bakassi", "Bekwarra", "Biase", "Boki", "Calabar Municipal", "Calabar South", "Etung", "Ikom", "Obanliku", "Obubra", "Ogoja", "Ohaukwu", "Oyi", "Yakuur"],
    "Delta": ["Aniocha North", "Aniocha South", "Bomadi", "Burutu", "Ethiope East", "Ethiope West", "Ika North East", "Ika South", "Isoko North", "Isoko South", "Ndokwa East", "Ndokwa West", "Okpe", "Oshimili North", "Oshimili South", "Ovia North East", "Ovia South West", "Patani", "Sapele", "Udu", "Ughelli North", "Ughelli South", "Ukwuani", "Uvwie", "Warri North", "Warri South", "Warri South West"],
    "Ebonyi": ["Abakaliki", "Afikpo North", "Afikpo South", "Ezza North", "Ezza South", "Ikwo", "Ishielu", "Ivo", "Izzi", "Ohaozara", "Ohaukwu", "Onicha"],
    "Edo": ["Akoko-Edo", "Egor", "Esan Central", "Esan North East", "Esan South East", "Esan West", "Etsako Central", "Etsako East", "Etsako West", "Igueben", "Ikpoba-Okha", "Oredo", "Orhionmwon", "Ovia North East", "Ovia South West", "Udumwun-Ikpe", "Uhunmwun"],
    "Ekiti": ["Ado Ekiti", "Efon", "Ekiti East", "Ekiti West", "Emure", "Gbonyin", "Ido Osi", "Ijero", "Ikere", "Ikole", "Ilejemeje", "Irepodun/Ifelodun", "Ise/Orun", "Moba", "Oye"],
    "Enugu": ["Aninri", "Awgu", "Enugu East", "Enugu North", "Enugu South", "Ezeagu", "Igbo-Etiti", "Igbo-Eze North", "Igbo-Eze South", "Isi-Uzo", "Nkanu East", "Nkanu West", "Nsukka", "Oji-River", "Udenu", "Udi", "Uzo-Uwani"],
    "FCT": ["Abaji", "Bwari", "Gwagwalada", "Kuje", "Kwali", "Municipal Area Council"],
    "Gombe": ["Akko", "Balanga", "Billiri", "Dukku", "Funakaye", "Gombe", "Kaltungo", "Kwami", "Nafada", "Shongom", "Yamaltu/Deba"],
    "Imo": ["Aboh-Mbaise", "Ahiazu-Mbaise", "Ehime-Mbano", "Ezinihitte", "Ideato North", "Ideato South", "Ihitte-Uboma", "Ikedu", "Isiala-Mbano", "Isu", "Mbaitoli", "Ngor-Okpala", "Njaba", "Nkwerre", "Nwangele", "Obowo", "Oguta", "Ohaji/Egbema", "Orlu", "Orsu", "Oru East", "Oru West", "Owerri Municipal", "Owerri North", "Owerri West", "Unuimo"],
    "Jigawa": ["Auyo", "Babura", "Biriniwa", "Birnin Kudu", "Buji", "Dutse", "Gagarawa", "Garki", "Gumel", "Guri", "Gwaram", "Gwiwa", "Jahun", "Kafin Hausa", "Kaugama", "Kazaure", "Kiri Kasama", "Kiyawa", "Maigatari", "Malam Madori", "Miga", "Ringim", "Roni", "Sule Tankarkar", "Taura", "Yankwashi"],
    "Kaduna": ["Birnin Gwari", "Chikun", "Giwa", "Igabi", "Ikara", "Jaba", "Jema'a", "Kachia", "Kaduna North", "Kaduna South", "Kagarko", "Kajuru", "Kaura", "Kauru", "Kubau", "Kudan", "Lere", "Makarfi", "Sabon Gari", "Sanga", "Soba", "Zangon Kataf", "Zaria"],
    "Kano": ["Ajingi", "Albasu", "Bagwai", "Bebeji", "Bichi", "Bunkure", "Dala", "Dambatta", "Dawakin Kudu", "Dawakin Tofa", "Doguwa", "Fagge", "Gabasawa", "Garko", "Garun Mallam", "Gaya", "Gezawa", "Gwale", "Gwarzo", "Kabo", "Kano Municipal", "Karaye", "Kibiya", "Kiru", "Kumbotso", "Kunchi", "Kura", "Madobi", "Makoda", "Minjibir", "Nasarawa", "Rano", "Rimin Gado", "Rogo", "Shanono", "Sumaila", "Takai", "Tarauni", "Tofa", "Tsanyawa", "Tudun Wada", "Ungogo", "Warawa", "Wudil"],
    "Katsina": ["Bakori", "Batagarawa", "Batsari", "Baure", "Bindawa", "Charanchi", "Dandume", "Danja", "Dan Musa", "Daura", "Dutsi", "Dutsin-Ma", "Faskari", "Funtua", "Giwa", "Gusau", "Jibia", "Kafur", "Kaita", "Kankara", "Kankia", "Katsina", "Kurfi", "Kusada", "Mai'Adua", "Malumfashi", "Mani", "Mashi", "Matazu", "Musawa", "Rimi", "Sabuwa", "Safana", "Sandamu", "Zango"],
    "Kebbi": ["Aleiro", "Arewa Dandi", "Argungu", "Augie", "Bagudo", "Birnin Kebbi", "Bunza", "Dandi", "Fakai", "Gwandu", "Jega", "Kalgo", "Koko/Besse", "Maiyama", "Ngaski", "Sakaba", "Shanga", "Suru", "Wasagu/Danko", "Yauri", "Zuru"],
    "Kogi": ["Adavi", "Ajaokuta", "Akoko", "Ankpa", "Dekina", "Ibaji", "Idah", "Igalamela-Odolu", "Ijumu", "Kabba/Bunu", "Kogi", "Lokoja", "Mopa-Muro", "Ofu", "Ogori/Agatu", "Okehi", "Okene", "Olomaboro", "Ona", "Yagba East", "Yagba West"],
    "Kwara": ["Asa", "Baruten", "Edu", "Ekiti", "Ifelodun", "Ilorin East", "Ilorin South", "Ilorin West", "Irepodun", "Isin", "Kaiama", "Moro", "Offa", "Oke-Ero", "Oyun", "Pategi"],
    "Lagos": ["Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa", "Badagry", "Epe", "Eti-Osa", "Ibeju-Lekki", "Ifako-Ijaiye", "Ikeja", "Ikorodu", "Kosofe", "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo", "Somolu", "Surulere", "Victoria Island"],
    "Nasarawa": ["Akwanga", "Awe", "Doma", "Karu", "Keana", "Keffi", "Kokona", "Lafia", "Libo", "Nasarawa", "Nasarawa Egon", "Toto", "Wamba"],
    "Niger": ["Agaie", "Agwara", "Bida", "Borgu", "Bosso", "Chanchaga", "Edati", "Gbako", "Gurara", "Katcha", "Kontagora", "Lapai", "Lavun", "Magama", "Mariga", "Mashegu", "Mokwa", "Muya", "Pailoro", "Rafi", "Rijau", "Shiroro", "Suleja", "Tafa", "Wushishi"],
    "Ogun": ["Abeokuta North", "Abeokuta South", "Ado-Odo/Ota", "Egbado North", "Egbado South", "Ewekoro", "Ifo", "Ijebu East", "Ijebu North", "Ijebu North East", "Ijebu Ode", "Ikenne", "Imeko-Afon", "Ipokia", "Obafemi Owod", "Odeda", "Odogbolu", "Ogun Waterside", "Remo North", "Shagamu", "Yewa North", "Yewa South"],
    "Ondo": ["Akoko North East", "Akoko North West", "Akoko South Akoko", "Akure North", "Akure South", "Ese-Odo", "Idanre", "Ifedore", "Ilaje", "Ile-Oluji/Okeigbo", "Irele", "Odigbo", "Okitipupa", "Ondo East", "Ondo West", "Ose", "Owo"],
    "Osun": ["Atakumosa East", "Atakumosa West", "Ayedade", "Ayedire", "Boluwaduro", "Boripe", "Ede North", "Ede South", "Egbedore", "Ejigbo", "Ifedayo", "Ifelodun", "Ife Central", "Ife East", "Ife North", "Ife South", "Ila", "Ilesa East", "Ilesa West", "Irepodun", "Irewole", "Isokan", "Iwo", "Obokun", "Odo-Otin", "Ola-Oluwa", "Olorunda", "Oriade", "Orolu", "Osogbo", "Oxe", "Ede"],
    "Oyo": ["Afijio", "Akinyele", "Atiba", "Ayete", "Balogun", "Egbeda", "Ibadan North", "Ibadan South East", "Ibadan South West", "Ibarapa Central", "Ibarapa East", "Ibarapa North", "Ido", "Irepo", "Iseyin", "Itesiwaju", "Iwajowa", "Kajola", "Lagelu", "Ogbomoso North", "Ogbomoso South", "Ogo Oluwa", "Olorunsogo", "Oluyole", "Ona-Ara", "Orelope", "Ori Ire", "Oyo", "Oyo East", "Saki East", "Saki West", "Surulere"],
    "Plateau": ["Barkin Ladi", "Bassa", "Bokkos", "Jema'a", "Kanam", "Kanke", "Karu", "Langtang North", "Langtang South", "Mangu", "Mikang", "Pankshin", "Qua'an Pan", "Riyom", "Shendam", "Wase"],
    "Rivers": ["Abua/Odual", "Ahoada East", "Ahoada West", "Akuku-Toru", "Andoni", "Asari-Toru", "Bonny", "Degema", "Eleme", "Emuoha", "Etche", "Gokana", "Ikwerre", "Khana", "Obio/Akpor", "Ogba/Egbema/Ndoni", "Ogu/Bolo", "Okrika", "Omuma", "Opobo/Nkoro", "Oyigbo", "Port Harcourt", "Tai"],
    "Sokoto": ["Binji", "Bodinga", "Dange", "Gada", "Goronyo", "Gudu", "Illela", "Kebbe", "Kware", "Rabah", "Sabon Birni", "Shagari", "Silame", "Sokoto North", "Sokoto South", "Tambuwal", "Tangaza", "Tureta", "Wamako", "Wurno", "Yabo"],
    "Taraba": ["Ardo-Kola", "Bali", "Donga", "Gashaka", "Gassol", "Ibi", "Jalingo", "Karim-Lamido", "Kumi", "Lau", "Sardauna", "Takum", "Ussa", "Wukari", "Yorro", "Zing"],
    "Yobe": ["Bade", "Bursari", "Damboa", "Fika", "Fune", "Geidam", "Gujba", "Gulani", "Jakusko", "Karasuwa", "Machina", "Nangere", "Nguru", "Potiskum", "Shani", "Tarmuwa", "Yunusari", "Yusufari"],
    "Zamfara": ["Anka", "Bakura", "Birnin Magaji/Kiyaw", "Bukkuyum", "Bungudu", "Gummi", "Gusau", "Kafin Hausa", "Kaura Namoda", "Maradun", "Maru", "Shinkafi", "Talata Mafara", "Tsafe", "Zurmi"]
};


let students = JSON.parse(localStorage.getItem('academicResults')) || [];
let editingId = null;


// Toggle biodata fields on/off based on checkbox
document.querySelectorAll('.bio-toggle').forEach(toggle => {
    toggle.addEventListener('change', () => {
        const targetId = toggle.getAttribute('data-target');
        const field = document.getElementById(targetId);
        if (!field) return;

        if (toggle.checked) {
            field.disabled = false;
        } else {
            field.disabled = true;
            if (field.tagName === 'SELECT') {
                field.selectedIndex = 0;
            } else {
                field.value = '';
            }
        }
    });
});


// ---------- TEACHER REMARK TOGGLE ----------

if (teacherRemarkToggle && teacherRemarkInput) {
    teacherRemarkToggle.addEventListener('change', () => {
        if (teacherRemarkToggle.checked) {
            teacherRemarkInput.disabled = false;
            teacherRemarkInput.style.display = 'block';
        } else {
            teacherRemarkInput.disabled = true;
            teacherRemarkInput.style.display = 'none';
            teacherRemarkInput.value = '';
        }
    });
}


// ---------- UPDATE TEACHER REMARK BUTTON ----------

if (updateTeacherRemarkBtn) {
    updateTeacherRemarkBtn.addEventListener('click', () => {
        const name = document.getElementById('studentName').value.trim();
        const className = document.getElementById('schoolClass').value;

        if (!name) {
            alert("Please enter/select a student name first.");
            return;
        }
        if (!className) {
            alert("Please select a class first.");
            return;
        }

        const remark = teacherRemarkToggle?.checked ? (teacherRemarkInput?.value || '') : '';

        const indices = students
            .map((s, i) => (s.name === name && s.className === className) ? i : -1)
            .filter(i => i !== -1);

        if (indices.length === 0) {
            alert("No record found for this student in the selected class. Please register the student first.");
            return;
        }

        indices.forEach(i => {
            students[i].teacherRemark = remark;
        });

        saveData();
        alert("Teacher remark updated successfully for " + name + " (" + className + ").");
    });
}


// ---------- LGA, HEIGHT, WEIGHT "OTHER" HANDLING ----------

const lgaSelect = document.getElementById('lgaSelect');
const lgaInput = document.getElementById('lgaOfOrigin');
const heightSelect = document.getElementById('heightSelect');
const heightInput = document.getElementById('height');
const heightDisplay = document.getElementById('heightDisplay');
const weightSelect = document.getElementById('weightSelect');
const weightInput = document.getElementById('weight');

function updateHeightDisplay(cmValue) {
    if (!heightDisplay) return;
    if (!cmValue || cmValue === 'Other' || isNaN(Number(cmValue))) {
        heightDisplay.style.display = 'none';
        return;
    }
    const cm = Number(cmValue);
    const m = (cm / 100).toFixed(2);
    heightDisplay.textContent = `${cm} cm / ${m} m`;
    heightDisplay.style.display = 'block';
}

if (lgaSelect && lgaInput) {
    lgaSelect.addEventListener('change', () => {
        if (lgaSelect.value === 'Other') {
            lgaInput.style.display = 'block';
            lgaInput.disabled = false;
            lgaInput.focus();
        } else {
            lgaInput.style.display = 'none';
            lgaInput.disabled = true;
            lgaInput.value = '';
        }
    });
}

if (heightSelect && heightInput) {
    heightSelect.addEventListener('change', () => {
        if (heightSelect.value === 'Other') {
            heightInput.style.display = 'block';
            heightInput.disabled = false;
            heightInput.focus();
            heightDisplay.style.display = 'none';
        } else {
            heightInput.style.display = 'none';
            heightInput.disabled = true;
            heightInput.value = '';
            updateHeightDisplay(heightSelect.value);
        }
    });
}

if (weightSelect && weightInput) {
    weightSelect.addEventListener('change', () => {
        if (weightSelect.value === 'Other') {
            weightInput.style.display = 'block';
            weightInput.disabled = false;
            weightInput.focus();
        } else {
            weightInput.style.display = 'none';
            weightInput.disabled = true;
            weightInput.value = '';
        }
    });
}


// ---------- STATE → LGA POPULATION ----------

const stateSelect = document.getElementById('stateOfOrigin');

if (stateSelect && lgaSelect) {
    stateSelect.addEventListener('change', () => {
        const state = stateSelect.value;
        const toggle = document.querySelector('.bio-toggle[data-target="lgaOfOrigin"]');

        lgaSelect.innerHTML = '<option value="" disabled selected>LGA</option>';

        if (state && nigeriaLGAs[state]) {
            nigeriaLGAs[state].forEach(lga => {
                const opt = document.createElement('option');
                opt.value = lga;
                opt.textContent = lga;
                lgaSelect.appendChild(opt);
            });
        }

        const otherOpt = document.createElement('option');
        otherOpt.value = 'Other';
        otherOpt.textContent = 'Other...';
        lgaSelect.appendChild(otherOpt);

        lgaSelect.disabled = !toggle?.checked;
        lgaInput.disabled = true;
        lgaInput.style.display = 'none';
        lgaInput.value = '';
    });
}


// ---------- TRAIT ROWS ----------

function createTraitRow(containerId, name = '', rating = '') {
    const container = document.getElementById(containerId);
    if (!container) return;
    const row = document.createElement('div');
    row.className = 'trait-row';
    row.style = 'display: flex; justify-content: space-between; align-items: center; gap: 5px;';
    row.innerHTML = `
        <input type="text" class="trait-name" value="${name}" placeholder="Skill Name" style="flex: 1; font-size: 12px; padding: 4px; border: 1px solid #ddd; border-radius: 4px;">
        <input type="number" class="trait-rating" min="1" max="5" value="${rating}" style="width: 45px; padding: 4px; border: 1px solid #ddd; border-radius: 4px;" placeholder="1-5">
        <button type="button" onclick="this.parentElement.remove()" style="background:none; border:none; color: #ef4444; cursor:pointer; font-weight:bold; padding: 0 5px; font-size: 18px;">&times;</button>
    `;
    container.appendChild(row);
}


window.addTraitRow = function(containerId) {
    createTraitRow(containerId);
};


function getTraitValues() {
    const traits = { affective: [], psychomotor: [] };
    document.querySelectorAll('#affective-list .trait-row').forEach(row => {
        const name = row.querySelector('.trait-name').value.trim();
        const rating = row.querySelector('.trait-rating').value;
        if (name) traits.affective.push({ name, rating });
    });
    document.querySelectorAll('#psychomotor-list .trait-row').forEach(row => {
        const name = row.querySelector('.trait-name').value.trim();
        const rating = row.querySelector('.trait-rating').value;
        if (name) traits.psychomotor.push({ name, rating });
    });
    return traits;
}


function setTraitValues(traits = {}) {
    const affList = document.getElementById('affective-list');
    const psyList = document.getElementById('psychomotor-list');
    if (!affList || !psyList) return;

    affList.innerHTML = '';
    psyList.innerHTML = '';

    const defaultAff = ['Punctuality', 'Neatness', 'Honesty', 'Self Control', 'Relationship'];
    const defaultPsy = ['Handwriting', 'Fluency/Speech', 'Games/Sports', 'Crafts/Arts', 'Musical Skills'];

    let affData = traits.affective;
    let psyData = traits.psychomotor;

    if (!Array.isArray(affData)) {
        affData = defaultAff.map(n => ({ name: n, rating: traits[n.toLowerCase().replace(/\s+/g, '')] || '' }));
    }
    if (!Array.isArray(psyData)) {
        psyData = defaultPsy.map(n => ({ name: n, rating: traits[n.toLowerCase().replace(/\s+/g, '').replace('/', '')] || '' }));
    }

    affData.forEach(t => createTraitRow('affective-list', t.name, t.rating));
    psyData.forEach(t => createTraitRow('psychomotor-list', t.name, t.rating));
}


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
    setTraitValues({});
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


// ---------- BIODATA HELPERS ----------

function getBioValues() {
    const bio = {};
    const fields = [
        { id: 'regNo', toggle: 'regNo' },
        { id: 'gender', toggle: 'gender' },
        { id: 'age', toggle: 'age' },
        { id: 'stateOfOrigin', toggle: 'stateOfOrigin' }
    ];

    fields.forEach(({ id, toggle }) => {
        const isChecked = document.querySelector(`.bio-toggle[data-target="${toggle}"]`)?.checked;
        if (isChecked) {
            bio[id] = document.getElementById(id).value;
        } else {
            bio[id] = '';
        }
    });

    // LGA
    const lgaToggle = document.querySelector('.bio-toggle[data-target="lgaOfOrigin"]')?.checked;
    if (lgaToggle) {
        if (lgaSelect.value === 'Other') {
            bio.lga = lgaInput.value.trim();
        } else {
            bio.lga = lgaSelect.value;
        }
    } else {
        bio.lga = '';
    }

    // Height
    const heightToggle = document.querySelector('.bio-toggle[data-target="height"]')?.checked;
    if (heightToggle) {
        if (heightSelect.value === 'Other') {
            bio.height = heightInput.value.trim();
        } else {
            bio.height = heightSelect.value;
        }
    } else {
        bio.height = '';
    }

    // Weight
    const weightToggle = document.querySelector('.bio-toggle[data-target="weight"]')?.checked;
    if (weightToggle) {
        if (weightSelect.value === 'Other') {
            bio.weight = weightInput.value.trim();
        } else {
            bio.weight = weightSelect.value;
        }
    } else {
        bio.weight = '';
    }

    // Teacher remark
    bio.teacherRemark = teacherRemarkToggle?.checked ? (teacherRemarkInput?.value || '') : '';

    return bio;
}


function setBioFields(bio) {
    const setIfPresent = (fieldId, value) => {
        const toggle = document.querySelector(`.bio-toggle[data-target="${fieldId}"]`);
        const field = document.getElementById(fieldId);
        if (!toggle || !field) return;

        if (value) {
            toggle.checked = true;
            field.disabled = false;
            field.value = value;
        } else {
            toggle.checked = false;
            field.disabled = true;
            if (field.tagName === 'SELECT') {
                field.selectedIndex = 0;
            } else {
                field.value = '';
            }
        }
    };

    setIfPresent('regNo', bio.regNo);
    setIfPresent('gender', bio.gender);
    setIfPresent('age', bio.age);
    setIfPresent('stateOfOrigin', bio.state);

    // LGA
    const lgaToggle = document.querySelector('.bio-toggle[data-target="lgaOfOrigin"]');
    if (bio.lga) {
        lgaToggle.checked = true;
        lgaSelect.disabled = false;

        const exists = Array.from(lgaSelect.options).some(o => o.value === bio.lga);
        if (exists) {
            lgaSelect.value = bio.lga;
            lgaInput.style.display = 'none';
            lgaInput.disabled = true;
            lgaInput.value = '';
        } else {
            lgaSelect.value = 'Other';
            lgaInput.style.display = 'block';
            lgaInput.disabled = false;
            lgaInput.value = bio.lga;
        }
    } else {
        lgaToggle.checked = false;
        lgaSelect.disabled = true;
        lgaSelect.selectedIndex = 0;
        lgaInput.disabled = true;
        lgaInput.style.display = 'none';
        lgaInput.value = '';
    }

    // Height
    const heightToggle = document.querySelector('.bio-toggle[data-target="height"]');
    if (bio.height) {
        heightToggle.checked = true;
        heightSelect.disabled = false;

        const exists = Array.from(heightSelect.options).some(o => o.value === bio.height);
        if (exists) {
            heightSelect.value = bio.height;
            heightInput.style.display = 'none';
            heightInput.disabled = true;
            heightInput.value = '';
            updateHeightDisplay(bio.height);
        } else {
            heightSelect.value = 'Other';
            heightInput.style.display = 'block';
            heightInput.disabled = false;
            heightInput.value = bio.height;
            heightDisplay.style.display = 'none';
        }
    } else {
        heightToggle.checked = false;
        heightSelect.disabled = true;
        heightSelect.selectedIndex = 0;
        heightInput.disabled = true;
        heightInput.style.display = 'none';
        heightInput.value = '';
        heightDisplay.style.display = 'none';
    }

    // Weight
    const weightToggle = document.querySelector('.bio-toggle[data-target="weight"]');
    if (bio.weight) {
        weightToggle.checked = true;
        weightSelect.disabled = false;

        const exists = Array.from(weightSelect.options).some(o => o.value === bio.weight);
        if (exists) {
            weightSelect.value = bio.weight;
            weightInput.style.display = 'none';
            weightInput.disabled = true;
            weightInput.value = '';
        } else {
            weightSelect.value = 'Other';
            weightInput.style.display = 'block';
            weightInput.disabled = false;
            weightInput.value = bio.weight;
        }
    } else {
        weightToggle.checked = false;
        weightSelect.disabled = true;
        weightSelect.selectedIndex = 0;
        weightInput.disabled = true;
        weightInput.style.display = 'none';
        weightInput.value = '';
    }

    // Teacher remark
    if (teacherRemarkToggle && teacherRemarkInput) {
        if (bio.teacherRemark) {
            teacherRemarkToggle.checked = true;
            teacherRemarkInput.disabled = false;
            teacherRemarkInput.style.display = 'block';
            teacherRemarkInput.value = bio.teacherRemark;
        } else {
            teacherRemarkToggle.checked = false;
            teacherRemarkInput.disabled = true;
            teacherRemarkInput.style.display = 'none';
            teacherRemarkInput.value = '';
        }
    }
}


// ---------- FORM SUBMIT ----------

resultForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('studentName').value;
    const className = document.getElementById('schoolClass').value;
    const bio = getBioValues();
    const traits = getTraitValues();

    let subject = subjectSelect.value;
    if (subject === 'Other') {
        subject = customSubjectInput.value;
    }

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
            students[index] = { 
                ...students[index], 
                name, className,
                regNo: bio.regNo,
                gender: bio.gender,
                age: bio.age,
                state: bio.stateOfOrigin,
                lga: bio.lga,
                height: bio.height,
                weight: bio.weight,
                teacherRemark: bio.teacherRemark,
                subject, ca, exam, total, grade, examAdded, traits 
            };
        }
        editingId = null;
        resultForm.querySelector('button[type="submit"]').textContent = 'Add Subject Score';
    } else {
        students = students.filter(s => !(s.name === name && s.className === className && s.subject === null));
        
        const student = { 
            id: Date.now(), 
            name, className,
            regNo: bio.regNo,
            gender: bio.gender,
            age: bio.age,
            state: bio.stateOfOrigin,
            lga: bio.lga,
            height: bio.height,
            weight: bio.weight,
            teacherRemark: bio.teacherRemark,
            subject, ca, exam, total, grade, examAdded, traits 
        };
        students.push(student);
    }

    students.forEach(s => {
        if (s.name === name && s.className === className) {
            s.traits = traits;
            s.teacherRemark = bio.teacherRemark;
        }
    });

    refreshTable();
    updateAverage();
    saveData();
    
    subjectSelect.value = '';
    customSubjectInput.value = '';
    customSubjectInput.style.display = 'none';
    customSubjectInput.removeAttribute('required');
    document.getElementById('caScore').value = '';
    document.getElementById('examScore').value = '';
    subjectSelect.focus();
});


// ---------- REGISTER STUDENT ONLY ----------

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

    const bio = getBioValues();
    const traits = getTraitValues();

    const studentProfile = { 
        id: Date.now(), 
        name, className,
        regNo: bio.regNo,
        gender: bio.gender,
        age: bio.age,
        state: bio.stateOfOrigin,
        lga: bio.lga,
        height: bio.height,
        weight: bio.weight,
        teacherRemark: bio.teacherRemark,
        subject: null, ca: 0, exam: 0, total: 0, grade: '', examAdded: false,
        traits
    };
    
    students.push(studentProfile);
    
    refreshTable();
    saveData();
    
    // Clear biodata toggles & fields
    document.querySelectorAll('.bio-toggle').forEach(t => {
        t.checked = false;
        const field = document.getElementById(t.getAttribute('data-target'));
        if (!field) return;
        field.disabled = true;
        if (field.tagName === 'SELECT') {
            field.selectedIndex = 0;
        } else {
            field.value = '';
        }
    });

    // Reset LGA/Height/Weight selects & inputs
    if (lgaSelect) {
        lgaSelect.innerHTML = '<option value="" disabled selected>LGA</option><option value="Other">Other...</option>';
        lgaInput.style.display = 'none';
        lgaInput.disabled = true;
        lgaInput.value = '';
    }
    if (heightSelect) {
        heightSelect.selectedIndex = 0;
        heightInput.style.display = 'none';
        heightInput.disabled = true;
        heightInput.value = '';
        if (heightDisplay) heightDisplay.style.display = 'none';
    }
    if (weightSelect) {
        weightSelect.selectedIndex = 0;
        weightInput.style.display = 'none';
        weightInput.disabled = true;
        weightInput.value = '';
    }

    // Clear teacher remark
    if (teacherRemarkToggle && teacherRemarkInput) {
        teacherRemarkToggle.checked = false;
        teacherRemarkInput.disabled = true;
        teacherRemarkInput.style.display = 'none';
        teacherRemarkInput.value = '';
    }

    setTraitValues({});
    clearNameBtn.click();
});


// ---------- UPDATE BIO & TRAITS ONLY ----------

updateBioTraitsBtn.addEventListener('click', () => {
    const name = document.getElementById('studentName').value.trim();
    const className = document.getElementById('schoolClass').value;

    if (!name) {
        alert("Please enter/select a student name first.");
        return;
    }
    if (!className) {
        alert("Please select a class first.");
        return;
    }

    const bio = getBioValues();
    const traits = getTraitValues();

    const indices = students
        .map((s, i) => (s.name === name && s.className === className) ? i : -1)
        .filter(i => i !== -1);

    if (indices.length === 0) {
        alert("No record found for this student in the selected class. Please register the student first.");
        return;
    }

    indices.forEach(i => {
        if (bio.regNo !== '') students[i].regNo = bio.regNo;
        if (bio.gender !== '') students[i].gender = bio.gender;
        if (bio.age !== '') students[i].age = bio.age;
        if (bio.stateOfOrigin !== '') students[i].state = bio.stateOfOrigin;
        if (bio.lga !== '') students[i].lga = bio.lga;
        if (bio.height !== '') students[i].height = bio.height;
        if (bio.weight !== '') students[i].weight = bio.weight;
        if (bio.teacherRemark !== '') students[i].teacherRemark = bio.teacherRemark;
        students[i].traits = traits;
    });

    saveData();
    alert("Selected biodata, teacher remark and domain ratings updated successfully for " + name + " (" + className + ").");
});


// ---------- TABLE & REPORT FUNCTIONS ----------

function refreshTable() {
    resultsTableBody.innerHTML = '';
    const currentClass = document.getElementById('schoolClass').value;
    
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

    const groupedNames = [];
    const currentClassStudents = students.filter(s => s.className === currentClass);
    currentClassStudents.forEach(s => {
        if (!groupedNames.includes(s.name)) groupedNames.push(s.name);
    });

    groupedNames.forEach(name => {
        const studentEntries = currentClassStudents.filter(s => s.name === name);
        let studentSum = 0;

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

        studentEntries.forEach(s => {
            if (s.subject === null) return;
            
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

        setBioFields({
            regNo: bio.regNo,
            gender: bio.gender,
            age: bio.age,
            state: bio.state,
            lga: bio.lga,
            height: bio.height,
            weight: bio.weight,
            teacherRemark: bio.teacherRemark || ''
        });

        setTraitValues(bio.traits || {});
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
    const schoolLogo = localStorage.getItem('schoolLogo');

    const currentClass = document.getElementById('schoolClass').value;
    const studentEntries = students.filter(s => s.name === name && s.className === currentClass && s.subject !== null);
    if (studentEntries.length === 0) return;
    const bio = studentEntries[0];
    const traits = bio.traits || { affective: [], psychomotor: [] };

    const getTraitRowsHtml = (traitList) => {
        const entries = Array.isArray(traitList) ? traitList : [];
        if (entries.length === 0) return '';
        
        let html = '';
        entries.forEach(t => {
            html += `<tr><td style="text-align:left">${t.name}</td><td style="width:40px">${t.rating || ''}</td></tr>`;
        });
        for (let i = entries.length; i < 5; i++) {
            html += '<tr><td style="text-align:left">&nbsp;</td><td></td></tr>';
        }
        return html;
    };

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

    // Height display in cm / m
    let heightDisplayText = '---';
    if (bio.height) {
        const cm = Number(bio.height);
        if (!isNaN(cm)) {
            const m = (cm / 100).toFixed(2);
            heightDisplayText = `${cm} cm / ${m} m`;
        } else {
            heightDisplayText = bio.height;
        }
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Report Card - ${name}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
                    @page { size: A4 portrait; margin: 8mm; }
                    * { box-sizing: border-box; }
                    html, body { margin: 0; padding: 0; }
                    body { font-family: 'Inter', sans-serif; color: #1a1a1a; background: #fff; font-size: 13px; }

                    /* Fixed single-page area; content is auto-scaled to fit inside it */
                    #page {
                        width: 194mm;
                        height: 281mm;
                        overflow: hidden;
                        position: relative;
                    }
                    #scale-wrapper {
                        transform-origin: top left;
                    }

                    .report-wrapper { border: 6px double #4f46e5; padding: 20px; position: relative; overflow: hidden; box-sizing: border-box; }
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
                    .header { display: flex; align-items: center; justify-content: center; gap: 15px; border-bottom: 3px solid #4f46e5; padding-bottom: 12px; margin-bottom: 20px; position: relative; z-index: 1; }
                    .logo-img { width: 90px; height: 90px; border-radius: 50%; object-fit: cover; border: 2px solid #4f46e5; flex-shrink: 0; background: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                    .header-text { text-align: center; }
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

                    /* Teacher remark box positioned at bottom-left */
                    .teacher-remark-section {
                        margin-top: 15px;
                        display: grid;
                        grid-template-columns: 1.5fr 1fr;
                        gap: 20px;
                        position: relative;
                        z-index: 1;
                    }
                    .teacher-remark-box {
                        border: 1px solid #4f46e5;
                        border-radius: 6px;
                        padding: 10px;
                        background: #f5f3ff;
                        font-size: 12px;
                        color: #334155;
                        min-height: 60px;
                    }
                    .teacher-remark-box h4 {
                        margin: 0 0 6px 0;
                        font-size: 12px;
                        color: #4f46e5;
                        text-transform: uppercase;
                    }
                    .teacher-remark-box p {
                        margin: 0;
                        white-space: pre-wrap;
                    }

                    .signatures {
                        display: flex;
                        justify-content: flex-end;
                        margin-top: 10px;
                        position: relative;
                        z-index: 1;
                    }
                    .sig-block {
                        text-align: center;
                        width: 200px;
                    }
                    .sig-line {
                        border-top: 1px solid #1a1a1a;
                        margin-bottom: 5px;
                    }
                    .sig-block p {
                        font-size: 11px;
                        font-weight: bold;
                        margin: 0;
                    }

                    @media print { 
                        body { padding: 0; margin: 0; } 
                        .report-wrapper { border: 6px double #4f46e5 !important; }
                    }
                </style>
            </head>
            <body>
                <div id="page">
                    <div id="scale-wrapper">
                        <div class="report-wrapper">
                            <div class="header">
                                ${schoolLogo ? `<img src="${schoolLogo}" class="logo-img">` : ''}
                                <div class="header-text">
                                    <h1>${schoolName}</h1>
                                    <p>${schoolAddress}</p>
                                    ${schoolMotto ? `<p class="motto">"${schoolMotto}"</p>` : ''}
                                </div>
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
                                <div class="info-item"><strong>LGA:</strong> ${bio.lga || '---'}</div>
                                <div class="info-item"><strong>HEIGHT:</strong> ${heightDisplayText}</div>
                                <div class="info-item"><strong>WEIGHT:</strong> ${bio.weight ? bio.weight + ' kg' : '---'}</div>
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
                                        ${getTraitRowsHtml(traits.affective)}
                                    </table>
                                </div>
                                <div class="traits-table">
                                    <h4>Psychomotor Skills</h4>
                                    <table>
                                        ${getTraitRowsHtml(traits.psychomotor)}
                                    </table>
                                </div>
                            </div>

                            <!-- New layout: Teacher remark on left, Principal signature on right -->
                            <div class="teacher-remark-section">
                                <div class="teacher-remark-box">
                                    <h4>Class Teacher Remark</h4>
                                    <p>${bio.teacherRemark || ''}</p>
                                </div>

                                <div class="signatures">
                                    <div class="sig-block">
                                        <div class="sig-line"></div>
                                        <p>PRINCIPAL'S SIGNATURE</p>
                                    </div>
                                </div>
                            </div>

                            <div class="rating-legend">
                                <strong>Rating Scale:</strong> 5 - Excellent, 4 - Very Good, 3 - Good, 2 - Fair, 1 - Poor
                            </div>
                        </div>
                    </div>
                </div>
                <script>
                    window.onload = function() {
                        var page = document.getElementById('page');
                        var wrap = document.getElementById('scale-wrapper');

                        var pageHeight = page.clientHeight;
                        var pageWidth = page.clientWidth;
                        var contentHeight = wrap.scrollHeight;
                        var contentWidth = wrap.scrollWidth;

                        var scale = Math.min(pageHeight / contentHeight, pageWidth / contentWidth, 1);

                        if (scale < 1) {
                            wrap.style.transform = 'scale(' + scale + ')';
                            wrap.style.width = (100 / scale) + '%';
                        }

                        setTimeout(function () {
                            window.print();
                            window.close();
                        }, 50);
                    };
                </script>
            </body>
        </html>
    `);
    printWindow.document.close();
}


function editEntry(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;

    document.getElementById('studentName').value = student.name;

    setBioFields({
        regNo: student.regNo,
        gender: student.gender,
        age: student.age,
        state: student.state,
        lga: student.lga,
        height: student.height,
        weight: student.weight,
        teacherRemark: student.teacherRemark || ''
    });

    setTraitValues(student.traits || {});
    
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


// ---------- CSV DOWNLOADS ----------

downloadBtn.addEventListener('click', () => {
    if (students.length === 0) {
        alert("Please add at least one student first.");
        return;
    }

    const currentClass = document.getElementById('schoolClass').value;
    const fileName = prompt("Enter a name for your result file:", `Academic_Results_${currentClass}`);
    if (!fileName) return;

    const scoredEntries = students.filter(s => s.className === currentClass && s.subject !== null);
    if (scoredEntries.length === 0) {
        alert("No academic results available for this class.");
        return;
    }

    const uniqueNames = [...new Set(scoredEntries.map(s => s.name))];
    const uniqueSubjects = [...new Set(scoredEntries.map(s => s.subject))].sort();

    const headers = ["Name"];
    uniqueSubjects.forEach(sub => {
        headers.push(`${sub}_CA`);
        headers.push(`${sub}_Exam`);
        headers.push(`${sub}_Total`);
    });
    headers.push("Average", "GrandTotal", "Position");

    const studentStats = {};
    uniqueNames.forEach(name => {
        const entries = scoredEntries.filter(s => s.name === name);
        const sum = entries.reduce((acc, curr) => acc + curr.total, 0);
        const avg = entries.length ? (sum / entries.length) : 0;
        studentStats[name] = { sum, avg };
    });

    const ranked = [...uniqueNames].sort(
        (a, b) => studentStats[b].avg - studentStats[a].avg
    );
    const positionMap = {};
    ranked.forEach((name, idx) => {
        positionMap[name] = idx + 1;
    });

    const csvRows = [headers.join(",")];

    uniqueNames.forEach(name => {
        const entries = scoredEntries.filter(s => s.name === name);
        const row = [name];

        uniqueSubjects.forEach(sub => {
            const entry = entries.find(e => e.subject === sub);
            if (entry) {
                row.push(entry.ca);
                row.push(entry.examAdded ? entry.exam : "-");
                row.push(entry.examAdded ? entry.total : "-");
            } else {
                row.push("", "", "");
            }
        });

        const stats = studentStats[name];
        row.push(stats.avg.toFixed(2), stats.sum, positionMap[name]);

        csvRows.push(row.join(","));
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

    const classes = [...new Set(scoredEntries.map(s => s.className))].sort();
    let allCsvContent = "";

    classes.forEach((cls, clsIndex) => {
        const classData = scoredEntries.filter(s => s.className === cls);
        const uniqueNames = [...new Set(classData.map(s => s.name))];
        const uniqueSubjects = [...new Set(classData.map(s => s.subject))].sort();

        const headers = ["Name"];
        uniqueSubjects.forEach(sub => {
            headers.push(`${sub}_CA`);
            headers.push(`${sub}_Exam`);
            headers.push(`${sub}_Total`);
        });
        headers.push("Average", "GrandTotal", "Position");

        const studentStats = {};
        uniqueNames.forEach(name => {
            const entries = classData.filter(s => s.name === name);
            const sum = entries.reduce((acc, curr) => acc + curr.total, 0);
            const avg = entries.length ? (sum / entries.length) : 0;
            studentStats[name] = { sum, avg };
        });

        const ranked = [...uniqueNames].sort(
            (a, b) => studentStats[b].avg - studentStats[a].avg
        );
        const positionMap = {};
        ranked.forEach((name, idx) => {
            positionMap[name] = idx + 1;
        });

        const csvRows = [headers.join(",")];

        uniqueNames.forEach(name => {
            const entries = classData.filter(s => s.name === name);
            const row = [name];

            uniqueSubjects.forEach(sub => {
                const entry = entries.find(e => e.subject === sub);
                if (entry) {
                    row.push(entry.ca);
                    row.push(entry.examAdded ? entry.exam : "-");
                    row.push(entry.examAdded ? entry.total : "-");
                } else {
                    row.push("", "", "");
                }
            });

            const stats = studentStats[name];
            row.push(stats.avg.toFixed(2), stats.sum, positionMap[name]);

            csvRows.push(row.join(","));
        });

        const classCsv = `--- CLASS: ${cls} ---\n` + csvRows.join("\n");

        if (clsIndex > 0) {
            allCsvContent += "\n\n";
        }
        allCsvContent += classCsv;
    });

    downloadCSVFile(allCsvContent, `${fileName}.csv`);
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


// ---------- SCHOOL SETTINGS ----------

function setupSchoolSettings() {
    const settingsFields = ['schoolName', 'schoolAddress', 'schoolMotto', 'schoolClass', 'currentTerm', 'currentSession', 'showOverallPos'];
    
    settingsFields.forEach(id => {
        const element = document.getElementById(id);
        if (!element) return;

        if (element.type === 'checkbox') {
            element.checked = localStorage.getItem(id) === 'true';
        } else {
            element.value = localStorage.getItem(id) || '';
        }

        const eventType = element.type === 'checkbox' || element.tagName === 'SELECT' ? 'change' : 'input';
        
        element.addEventListener(eventType, () => {
            const value = element.type === 'checkbox' ? element.checked : element.value;
            localStorage.setItem(id, value);
            
            if (id === 'schoolClass') {
                editingId = null;
                resultForm.reset();
                refreshTable();
                updateAverage();
                updateNameDatalist();
                setTraitValues({});
            }
        });
    });

    const logoInput = document.getElementById('schoolLogo');
    if (logoInput) {
        logoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    localStorage.setItem('schoolLogo', event.target.result);
                    alert("School logo uploaded and saved successfully!");
                };
                reader.readAsDataURL(file);
            }
        });
    }
}


// ---------- INITIAL LOAD ----------

setupSchoolSettings();
refreshTable();
updateAverage();
updateNameDatalist();
setTraitValues({});
