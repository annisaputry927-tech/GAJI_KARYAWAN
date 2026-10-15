// Database Karyawan Awal (5 Karyawan)
let employees = [
    { id: 1, name: "Annisa", edu: "SMK", workYears: 6, children: 2, photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" },
    { id: 2, name: "Kayla", edu: "S1", workYears: 12, children: 3, photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150" },
    { id: 3, name: "Wanda", edu: "SMK", workYears: 18, children: 1, photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
    { id: 4, name: "Rezvan", edu: "S2", workYears: 8, children: 4, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" },
    { id: 5, name: "Budi Santoso", edu: "D3", workYears: 16, children: 2, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" }
];

let isUserLoggedIn = false;

// Navigasi Antar Halaman dengan Proteksi Kunci Navbar
function switchPage(pageId) {
    if (!isUserLoggedIn && pageId !== 'authPage') {
        alert('Akses ditolak! Silakan lakukan Login terlebih dahulu untuk membuka menu ini.');
        return;
    }

    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(pageId).classList.add('active');
    
    if (pageId === 'authPage') document.getElementById('navAuth').classList.add('active');
    if (pageId === 'homePage') document.getElementById('navHome').classList.add('active');
    if (pageId === 'companyPage') document.getElementById('navCompany').classList.add('active');
    if (pageId === 'employeePage') document.getElementById('navEmployee').classList.add('active');
    if (pageId === 'salaryPage') {
        document.getElementById('navSalary').classList.add('active');
        setTimeout(renderSalaryTable, 100);
    }
}

// Beralih Mode Tab Auth (Registrasi <-> Login)
function switchAuthMode(mode) {
    const regForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const tabReg = document.getElementById('tabReg');
    const tabLogin = document.getElementById('tabLogin');

    if (mode === 'reg') {
        regForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        tabReg.classList.add('active');
        tabLogin.classList.remove('active');
    } else {
        regForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        tabLogin.classList.add('active');
        tabReg.classList.remove('active');
    }
}

// Handler Registrasi (Mengarahkan ke menu Login dahulu)
function handleRegister(e) {
    e.preventDefault();
    alert('Registrasi berhasil! Silakan lakukan Login menggunakan akun Anda.');
    switchAuthMode('login');
}

// Handler Login (Membuka Kunci Navbar & Masuk ke Beranda)
function handleLogin(e) {
    e.preventDefault();
    isUserLoggedIn = true;
    alert('Login Berhasil! Akses menu utama perusahaan kini dibuka.');
    
    const navButtons = ['navHome', 'navCompany', 'navEmployee', 'navSalary'];
    navButtons.forEach(id => {
        let btn = document.getElementById(id);
        btn.classList.remove('locked');
    });

    switchPage('homePage');
}

// Kalkulasi Gaji, Tunjangan, & Pajak Sesuai Ketentuan
function calculateSalary(emp) {
    let baseSalary = 3000000;
    if (emp.workYears >= 16) baseSalary = 6000000;
    else if (emp.workYears >= 11) baseSalary = 4500000;

    let workAllowance = emp.workYears > 15 ? 300000 : 150000;
    let childAllowance = emp.children >= 3 ? 0.07 * baseSalary : 0;
    let premiAllowance = 0.03 * baseSalary;

    let netSalary = baseSalary + workAllowance + childAllowance + premiAllowance;
    let pphTax = 0.13 * netSalary;

    return { baseSalary, workAllowance, childAllowance, premiAllowance, netSalary, pphTax };
}

// Render Kelola Foto Profil Karyawan
function renderEmployeeProfiles() {
    const grid = document.getElementById('employeeProfileGrid');
    grid.innerHTML = '';

    employees.forEach((emp, index) => {
        let div = document.createElement('div');
        div.className = 'emp-card';
        div.innerHTML = `
            <img id="img-preview-${index}" src="${emp.photo}" alt="${emp.name}">
            <h4>${emp.name}</h4>
            <p>${emp.edu} | Masa Kerja: ${emp.workYears} Thn</p>
            <label style="font-size:11px; text-align:left;">Ubah URL Foto:</label>
            <input type="text" class="input-photo-change" value="${emp.photo}" onchange="updatePhoto(${index}, this.value)">
        `;
        grid.appendChild(div);
    });
}

function updatePhoto(index, newUrl) {
    if (newUrl.trim() !== '') {
        employees[index].photo = newUrl;
        document.getElementById(`img-preview-${index}`).src = newUrl;
        renderSalaryTable();
        alert(`Foto profil ${employees[index].name} berhasil diperbarui!`);
    }
}

// Render Tabel Gaji Interaktif dengan Event Keydown (Enter) & Blur
function renderSalaryTable() {
    const tbody = document.getElementById('salaryTableBody');
    const chartBox = document.getElementById('salaryChart');
    tbody.innerHTML = '';
    chartBox.innerHTML = '';

    employees.forEach((emp, index) => {
        const calc = calculateSalary(emp);

        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td contenteditable="true" class="editable-cell" data-index="${index}" data-field="name"><strong>${emp.name}</strong></td>
            <td contenteditable="true" class="editable-cell" data-index="${index}" data-field="edu">${emp.edu}</td>
            <td contenteditable="true" class="editable-cell" data-index="${index}" data-field="workYears" title="Ubah masa kerja & tekan Enter">${emp.workYears}</td>
            <td contenteditable="true" class="editable-cell" data-index="${index}" data-field="children" title="Ubah jumlah anak & tekan Enter" style="background: #E8F1F5; font-weight: bold; color: #2B4C7E;">${emp.children}</td>
            <td>Rp ${calc.baseSalary.toLocaleString('id-ID')}</td>
            <td>Rp ${calc.workAllowance.toLocaleString('id-ID')}</td>
            <td>Rp ${calc.childAllowance.toLocaleString('id-ID')}</td>
            <td>Rp ${calc.premiAllowance.toLocaleString('id-ID')}</td>
            <td><strong>Rp ${calc.netSalary.toLocaleString('id-ID')}</strong></td>
            <td>Rp ${calc.pphTax.toLocaleString('id-ID')} (13%)</td>
            <td><span style="color: #27AE60; font-weight:600;">Tgl 25 / Bln</span></td>
            <td><button class="btn-danger" onclick="deleteEmployee(${index})">🗑️ Hapus</button></td>
        `;
        tbody.appendChild(tr);

        // Grafik Batang Kombo Animasi
        let fillWidth = Math.min((calc.netSalary / 10000000) * 100, 100);
        let chartItem = document.createElement('div');
        chartItem.className = 'chart-bar-item';
        chartItem.innerHTML = `
            <span class="chart-label">${emp.name}</span>
            <div class="chart-bar-bg">
                <div class="chart-bar-fill" id="bar-${emp.id}" style="width: 0%;"></div>
            </div>
            <span style="font-size:11px; font-weight:600;">Rp ${(calc.netSalary / 1000000).toFixed(1)}Jt</span>
        `;
        chartBox.appendChild(chartItem);

        setTimeout(() => {
            const bar = document.getElementById(`bar-${emp.id}`);
            if (bar) bar.style.width = fillWidth + '%';
        }, 150);
    });

    // Pasang Event Listener untuk mendeteksi tombol Enter atau Blur pada sel yang bisa diedit
    document.querySelectorAll('.editable-cell').forEach(cell => {
        cell.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault(); // Mencegah enter membuat baris baru di dalam sel
                this.blur(); // Memicu event blur untuk menyimpan data
            }
        });

        cell.addEventListener('blur', function() {
            let idx = parseInt(this.getAttribute('data-index'));
            let field = this.getAttribute('data-field');
            let val = this.innerText.trim();
            updateEmployeeField(idx, field, val);
        });
    });
}

// Tambah Karyawan Baru
function addNewEmployee() {
    let newName = prompt("Masukkan Nama Karyawan Baru:", "Karyawan Baru");
    if (newName) {
        employees.push({
            id: Date.now(),
            name: newName,
            edu: "S1",
            workYears: 5,
            children: 1,
            photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
        });
        renderSalaryTable();
        renderEmployeeProfiles();
        alert("Karyawan baru berhasil ditambahkan!");
    }
}

// Hapus Karyawan
function deleteEmployee(index) {
    if (confirm(`Yakin ingin menghapus data ${employees[index].name}?`)) {
        employees.splice(index, 1);
        renderSalaryTable();
        renderEmployeeProfiles();
        alert("Data karyawan berhasil dihapus.");
    }
}

// Fungsi Update Field Karyawan secara Real-Time saat dienter atau blur
function updateEmployeeField(index, field, value) {
    if (field === 'workYears' || field === 'children') {
        let numVal = parseInt(value);
        if (!isNaN(numVal) && numVal >= 0) {
            employees[index][field] = numVal;
        } else {
            alert('Masukkan angka yang valid!');
        }
    } else {
        if (value !== '') {
            employees[index][field] = value;
        }
    }
    renderSalaryTable();
    renderEmployeeProfiles();
}

// Ekspor ke Excel (.xls) dengan Styling Tabel Bersih & Rapi
function exportToExcel() {
    let tableHtml = document.getElementById('salaryTable').outerHTML;
    
    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = tableHtml;
    let rows = tempDiv.querySelectorAll('tr');
    rows.forEach(row => {
        let lastCell = row.lastElementChild;
        if (lastCell) lastCell.remove();
    });

    let styledHtml = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head><meta charset="UTF-8"></head>
        <body>
            <h3 style="color: #2B4C7E; font-family: Arial;">DAFTAR GAJI KARYAWAN - PT NUSANTARA VELICIOUS BOGA</h3>
            <table border="1" style="border-collapse: collapse; font-family: Arial; font-size: 11px;">
                ${tempDiv.innerHTML}
            </table>
        </body>
        </html>
    `;

    let blob = new Blob(['\ufeff' + styledHtml], { type: 'application/vnd.ms-excel' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'Laporan_Gaji_PT_Nusantara_Velicious_Boga.xls';
    a.click();
}

// Inisialisasi
window.onload = function() {
    renderEmployeeProfiles();
    renderSalaryTable();
};