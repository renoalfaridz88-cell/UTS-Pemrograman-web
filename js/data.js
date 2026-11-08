// Data akun pengguna
const defaultUsers = [
    {
        nama: "Admin",
        email: "admin@rynobook.com",
        password: "123456"
    }
];

if (localStorage.getItem("rynobookUsers") === null) {
    localStorage.setItem("rynobookUsers", JSON.stringify(defaultUsers));
}

// Data buku
const defaultBooks = [
    {
        id: 1,
        judul: "Laskar Pelangi",
        harga: 85000,
        stok: 10
    },
    {
        id: 2,
        judul: "Bumi",
        harga: 95000,
        stok: 8
    },
    {
        id: 3,
        judul: "Negeri 5 Menara",
        harga: 78000,
        stok: 12
    },
    {
        id: 4,
        judul: "Filosofi Teras",
        harga: 90000,
        stok: 6
    }
];

if (localStorage.getItem("rynobookBooks") === null) {
    localStorage.setItem("rynobookBooks", JSON.stringify(defaultBooks));
}

function getBooks() {
  const data = localStorage.getItem("rynobookBooks");
  return data ? JSON.parse(data) : defaultBooks;
}

function saveBooks(books) {
  localStorage.setItem("rynobookBooks", JSON.stringify(books));
}