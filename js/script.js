// Mengambil data akun dari localStorage
let keranjang = [];

function getUsers() {
    return JSON.parse(
        localStorage.getItem("rynobookUsers")
    ) || [];
}

// Fungsi Login
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const users = getUsers();

        const user = users.find(function(item) {
            return item.email === email &&
                   item.password === password;
        });

        if (user) {
            localStorage.setItem(
                "currentUser",
                JSON.stringify(user)
            );

            alert("Login berhasil! Selamat datang " + user.nama);

            window.location.href = "dashboard.html";
        } else {
            alert("Email atau password salah!");
        }
    });
}

// Fungsi Daftar Akun
const registerLink = document.getElementById("registerLink");

if (registerLink) {
    registerLink.addEventListener("click", function(event) {
        event.preventDefault();

        const nama = prompt("Masukkan nama Anda:");
        if (!nama) return;

        const email = prompt("Masukkan email:");
        if (!email) return;

        const password = prompt("Buat password:");
        if (!password) return;

        const users = getUsers();

        const sudahAda = users.some(function(user) {
            return user.email === email;
        });

        if (sudahAda) {
            alert("Email sudah terdaftar!");
            return;
        }

        users.push({
            nama: nama,
            email: email,
            password: password
        });

        localStorage.setItem(
            "rynobookUsers",
            JSON.stringify(users)
        );

        alert("Pendaftaran berhasil!");
    });
}

// Fungsi Lupa Password
const forgotPassword = document.getElementById("forgotPassword");

if (forgotPassword) {
    forgotPassword.addEventListener("click", function(event) {
        event.preventDefault();

        const email = prompt("Masukkan email akun Anda:");
        if (!email) return;

        const users = getUsers();

        const user = users.find(function(item) {
            return item.email === email;
        });

        if (!user) {
            alert("Email tidak ditemukan!");
            return;
        }

        const passwordBaru = prompt("Masukkan password baru:");

        if (!passwordBaru) return;

        user.password = passwordBaru;

        localStorage.setItem(
            "rynobookUsers",
            JSON.stringify(users)
        );

        alert("Password berhasil diperbarui!");
    });
}

// DASHBOARD

const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
);

// Tampilkan nama pengguna
const userNameElement = document.getElementById("userName");

if (userNameElement) {
    if (!currentUser) {
        window.location.href = "login.html";
    } else {
        userNameElement.textContent =
            "Halo, " + currentUser.nama +
            "! Selamat berbelanja di RynoBook Store.";
    }
}

// Sapaan berdasarkan waktu
const greetingElement = document.getElementById("greeting");

if (greetingElement) {
    const jam = new Date().getHours();

    if (jam >= 5 && jam < 11) {
        greetingElement.textContent = "Selamat Pagi!";
    } else if (jam >= 11 && jam < 15) {
        greetingElement.textContent = "Selamat Siang!";
    } else if (jam >= 15 && jam < 18) {
        greetingElement.textContent = "Selamat Sore!";
    } else {
        greetingElement.textContent = "Selamat Malam!";
    }
}

// Fungsi Logout
function logout() {
    const yakin = confirm("Apakah kamu yakin ingin keluar?");

    if (yakin) {
        localStorage.removeItem("currentUser");
        window.location.href = "login.html";
    }
}

// ==================================
// KATALOG DAN MANAJEMEN STOK BUKU
// ==================================

function getBooks() {
    return JSON.parse(
        localStorage.getItem("rynobookBooks")
    ) || [];
}

// Menampilkan daftar buku
function tampilkanBuku(keyword = "") {

    const bookTable = document.getElementById("bookTable");

    if (!bookTable) return;

    const books = getBooks();

    const hasil = books.filter(function(buku) {
        return buku.judul.toLowerCase()
            .includes(keyword.toLowerCase());
    });

    bookTable.innerHTML = "";

    hasil.forEach(function(buku, index) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${buku.judul}</td>
            <td>${buku.penulis}</td>
            <td>Rp ${buku.harga.toLocaleString("id-ID")}</td>
            <td>${buku.stok}</td>
            <td>
                <button class="action-button add-stock"
                    onclick="tambahStok(${buku.id})">
                    + Stok
                </button>

                <button class="action-button delete-book"
                    onclick="hapusBuku(${buku.id})">
                    Hapus
                </button>
            </td>
        `;

        bookTable.appendChild(row);
    });

    // Menghitung jumlah jenis buku dan stok
    const totalBuku = document.getElementById("totalBuku");
    const totalStok = document.getElementById("totalStok");

    if (totalBuku) {
        totalBuku.textContent = books.length;
    }

    if (totalStok) {
        totalStok.textContent = books.reduce(
            (total, buku) => total + Number(buku.stok), 0
        );
    }
}

// Menambahkan buku baru
const bookForm = document.getElementById("bookForm");

if (bookForm) {

    bookForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const books = getBooks();

        const bukuBaru = {
            id: Date.now(),
            judul: document.getElementById("judul").value.trim(),
            penulis: document.getElementById("penulis").value.trim(),
            harga: Number(document.getElementById("harga").value),
            stok: Number(document.getElementById("stok").value)
        };

        books.push(bukuBaru);

        localStorage.setItem(
            "rynobookBooks",
            JSON.stringify(books)
        );

        alert("Buku berhasil ditambahkan!");

        bookForm.reset();

        tampilkanBuku();
    });
}

// Menambah jumlah stok
function tambahStok(id) {

    const books = getBooks();

    const buku = books.find(function(item) {
        return item.id === id;
    });

    if (!buku) return;

    const jumlah = Number(
        prompt("Masukkan jumlah stok yang ingin ditambahkan:")
    );

    if (!Number.isInteger(jumlah) || jumlah <= 0) {
        alert("Jumlah stok harus berupa bilangan bulat positif!");
        return;
    }

    buku.stok += jumlah;

    localStorage.setItem(
        "rynobookBooks",
        JSON.stringify(books)
    );

    tampilkanBuku();

    alert("Stok berhasil diperbarui!");
}

// Menghapus buku
function hapusBuku(id) {

    const yakin = confirm(
        "Apakah kamu yakin ingin menghapus buku ini?"
    );

    if (!yakin) return;

    let books = getBooks();

    books = books.filter(function(buku) {
        return buku.id !== id;
    });

    localStorage.setItem(
        "rynobookBooks",
        JSON.stringify(books)
    );

    tampilkanBuku();

    alert("Buku berhasil dihapus!");
}

// Fitur pencarian buku
const searchBook = document.getElementById("searchBook");

if (searchBook) {
    searchBook.addEventListener("input", function() {
        tampilkanBuku(this.value);
    });
}

// Jalankan daftar buku saat halaman dibuka
tampilkanBuku();

// ==================================
// SISTEM CHECKOUT RYNOBOOK STORE
// ==================================


function formatRupiah(angka) {
    return "Rp " + angka.toLocaleString("id-ID");
}

// Mengisi pilihan buku
function isiPilihanBuku() {
    const pilihan = document.getElementById("pilihBuku");

    if (!pilihan) return;

    const books = getBooks();

    pilihan.innerHTML = '<option value="">Pilih buku</option>';

    books.forEach(function(buku) {
        const option = document.createElement("option");

        option.value = buku.id;
        option.textContent =
            buku.judul + " - " + formatRupiah(buku.harga) +
            " (Stok: " + buku.stok + ")";

        pilihan.appendChild(option);
    });
}

// Menambahkan buku ke keranjang
const cartForm = document.getElementById("cartForm");


if (cartForm) {
    isiPilihanBuku();

    cartForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const id = Number(
            document.getElementById("pilihBuku").value
        );

        const jumlah = Number(
            document.getElementById("jumlahBeli").value
        );

        const buku = getBooks().find(function(item) {
            return item.id === id;
        });

        if (!buku) {
            alert("Silakan pilih buku!");
            return;
        }

        if (!Number.isInteger(jumlah) || jumlah <= 0) {
            alert("Jumlah pembelian tidak valid!");
            return;
        }


        const itemKeranjang = keranjang.find(function(item) {
            return item.id === id;
        });

        const jumlahSaatIni = itemKeranjang
            ? itemKeranjang.jumlah : 0;

        if (jumlahSaatIni + jumlah > buku.stok) {
            alert("Stok buku tidak mencukupi!");
            return;
        }

        if (itemKeranjang) {
            itemKeranjang.jumlah += jumlah;
        } else {
            keranjang.push({
                id: buku.id,
                judul: buku.judul,
                harga: buku.harga,
                jumlah: jumlah
            });
        }

        tampilkanKeranjang();
        cartForm.reset();
        document.getElementById("jumlahBeli").value = 1;
    });
}

// Menampilkan keranjang
function tampilkanKeranjang() {
    const tabel = document.getElementById("cartTable");

    if (!tabel) return;

    tabel.innerHTML = "";

    let total = 0;

    keranjang.forEach(function(item, index) {
        const subtotal = item.harga * item.jumlah;

        total += subtotal;

        const row = document.createElement("tr");

        const judul = document.createElement("td");
        judul.textContent = item.judul;

        const harga = document.createElement("td");
        harga.textContent = formatRupiah(item.harga);

        const jumlah = document.createElement("td");
        jumlah.textContent = item.jumlah;

        const sub = document.createElement("td");
        sub.textContent = formatRupiah(subtotal);

        const aksi = document.createElement("td");
        const tombol = document.createElement("button");

        tombol.textContent = "Hapus";
        tombol.className = "remove-cart";

        tombol.addEventListener("click", function() {
            keranjang.splice(index, 1);
            tampilkanKeranjang();
        });

        aksi.appendChild(tombol);

        [judul, harga, jumlah, sub, aksi].forEach(function(cell) {
            row.appendChild(cell);
        });

        tabel.appendChild(row);
    });

    document.getElementById("totalHarga").textContent =
        formatRupiah(total);
}

// Proses checkout
const checkoutForm = document.getElementById("checkoutForm");

if (checkoutForm) {
    checkoutForm.addEventListener("submit", function(e) {
        e.preventDefault();

        if (keranjang.length === 0) {
            alert("Keranjang masih kosong!");
            return;
        }

        const namaPembeli = document.getElementById("namaPembeli").value.trim();
        const alamat = document.getElementById("alamat").value.trim();
        const pembayaran = document.getElementById("metodeBayar").value;

        if (!namaPembeli || !alamat || !pembayaran) {
            alert("Lengkapi data pembelian!");
            return;
        }

        const books = getBooks();

        for (const item of keranjang) {
            const book = books.find(b => b.id === item.id);

            if (!book || book.stok < item.jumlah) {
                alert("Stok " + item.judul + " tidak mencukupi!");
                return;
            }
        }

        let total = 0;

        keranjang.forEach(item => {
            total += item.harga * item.jumlah;

            const book = books.find(b => b.id === item.id);
            book.stok -= item.jumlah;
        });

        const orders = JSON.parse(
            localStorage.getItem("rynobookOrders")
        ) || [];

        const order = {
            id: "ORD-" + Date.now(),
            nama: namaPembeli,
            alamat: alamat,
            pembayaran: pembayaran,
            items: [...keranjang],
            total: total,
            status: "Pesanan diproses",
            tanggal: new Date().toLocaleString("id-ID")
        };

        orders.push(order);

        localStorage.setItem("rynobookOrders", JSON.stringify(orders));
        saveBooks(books);

        keranjang = [];
        tampilkanKeranjang();

        alert("Pesanan berhasil dibuat! Nomor Pesanan Anda: " + order.id);
 
        checkoutForm.reset();

        const hasil = document.getElementById("hasilCheckout");

        if (hasil) {
            hasil.innerHTML = `
                <h3>Pesanan Berhasil!</h3>
                <p>Nomor pesanan: ${order.id}</p>
                <p>Total: ${formatRupiah(total)}</p>
                <p>Status: ${order.status}</p>
            `;
        }
    });
}

/* =====================================
   HALAMAN TRACKING PESANAN
===================================== */

const trackingForm = document.getElementById("trackingForm");

if (trackingForm) {
    trackingForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const nomor = document.getElementById("nomorPesanan").value.trim();

        const orders = JSON.parse(
            localStorage.getItem("rynobookOrders")
        ) || [];

        const order = orders.find(o => String(o.id) === nomor);

        const hasil = document.getElementById("hasilTracking");

        if (!hasil) return;

        if (order) {
            hasil.innerHTML = `
                <h3>Pesanan Ditemukan</h3>
                <p>Nomor: ${order.id}</p>
                <p>Nama: ${order.nama}</p>
                <p>Total: ${formatRupiah(order.total)}</p>
                <p>Status: ${order.status}</p>
                <p>Tanggal: ${order.tanggal}</p>
            `;
        } else {
            hasil.innerHTML = "<p>Nomor pesanan tidak ditemukan.</p>";
        }
    });
}

/* =========================================
   POP-UP SAMBUTAN BERANDA (DASHBOARD)
========================================= */
const welcomeModal = document.getElementById("welcomeModal");
const closeModal = document.getElementById("closeModal");

if (welcomeModal) {
  // Tampilkan pop-up otomatis saat halaman beranda dibuka
  welcomeModal.style.display = "flex";

  // Tutup saat tombol X diklik
  if (closeModal) {
    closeModal.addEventListener("click", function () {
      welcomeModal.style.display = "none";
    });
  }

  // Tutup saat area gelap di luar kotak diklik
  welcomeModal.addEventListener("click", function (e) {
    if (e.target === welcomeModal) {
      welcomeModal.style.display = "none";
    }
  });
}

function tampilkanRiwayatPesanan() {
  const wadahRiwayat = document.getElementById("riwayatPesanan");
  if (!wadahRiwayat) return;

  const orders = JSON.parse(localStorage.getItem("rynobookOrders")) || [];

  if (orders.length === 0) {
    wadahRiwayat.innerHTML = "<p>Belum ada riwayat pesanan.</p>";
    return;
  }

  let tabelHTML = `
    <table border="1" cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse; margin-top: 10px; background: #fff;">
      <thead>
        <tr>
          <th>Nomor Pesanan</th>
          <th>Nama Pemesan</th>
          <th>Total</th>
          <th>Status</th>
          <th>Tanggal</th>
        </tr>
      </thead>
      <tbody>
  `;

  orders.slice().reverse().forEach((order) => {
    tabelHTML += `
      <tr>
        <td>${order.id}</td>
        <td>${order.nama}</td>
        <td>${formatRupiah(order.total)}</td>
        <td>${order.status}</td>
        <td>${order.tanggal}</td>
      </tr>
    `;
  });

  tabelHTML += `
      </tbody>
    </table>
  `;

  wadahRiwayat.innerHTML = tabelHTML;
}

tampilkanRiwayatPesanan();