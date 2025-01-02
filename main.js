// Membuat array untuk menyimpan data buku
let books = [];

// Fungsi untuk menghasilkan ID unik
const generateId = () => {
  return +new Date();
};

// Fungsi untuk menyimpan data ke localStorage
const saveData = () => {
  localStorage.setItem("books", JSON.stringify(books));
};

// Fungsi untuk memuat data dari localStorage
const loadData = () => {
  const storedBooks = localStorage.getItem("books");
  if (storedBooks) {
    books = JSON.parse(storedBooks);
  }
  renderBooks();
};

// Fungsi untuk membuat elemen buku
const createBookElement = (book) => {
  const bookElement = document.createElement("div");
  bookElement.classList.add("bookItem");
  bookElement.dataset.bookid = book.id;

  const title = document.createElement("h3");
  title.classList.add("bookItemTitle");
  title.textContent = book.title;

  const author = document.createElement("p");
  author.classList.add("bookItemAuthor");
  author.textContent = `Penulis: ${book.author}`;

  const year = document.createElement("p");
  year.classList.add("bookItemYear");
  year.textContent = `Tahun: ${book.year}`;

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("bookItemButton");

  const toggleButton = document.createElement("button");
  toggleButton.classList.add("bookItemIsCompleteButton");
  toggleButton.textContent = book.isComplete
    ? "Belum selesai dibaca"
    : "Sudah selesai dibaca";
  toggleButton.onclick = () => toggleBookStatus(book.id);

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("bookItemDeleteButton");
  deleteButton.textContent = "Hapus Buku";
  deleteButton.onclick = () => deleteBook(book.id);

  const editButton = document.createElement("button");
  editButton.classList.add("bookItemEditButton");
  editButton.textContent = "Edit Buku";
  editButton.onclick = () => editBook(book.id);

  buttonContainer.append(toggleButton, deleteButton, editButton);
  bookElement.append(title, author, year, buttonContainer);

  return bookElement;
};

// Fungsi untuk merender buku
const renderBooks = () => {
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  books.forEach((book) => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
};

// Fungsi untuk menambah buku
const addBook = (e) => {
  e.preventDefault();

  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = parseInt(document.getElementById("bookFormYear").value);
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const newBook = {
    id: generateId(),
    title,
    author,
    year,
    isComplete,
  };

  books.push(newBook);
  saveData();
  renderBooks();
  e.target.reset();
};

// Fungsi untuk menghapus buku
const deleteBook = (bookId) => {
  if (confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
    books = books.filter((book) => book.id !== bookId);
    saveData();
    renderBooks();
  }
};

// Fungsi untuk mengubah status buku
const toggleBookStatus = (bookId) => {
  const bookIndex = books.findIndex((book) => book.id === bookId);
  if (bookIndex !== -1) {
    books[bookIndex].isComplete = !books[bookIndex].isComplete;
    saveData();
    renderBooks();
  }
};

// Fungsi untuk mengedit buku
const editBook = (bookId) => {
  const book = books.find((book) => book.id === bookId);
  if (book) {
    document.getElementById("bookFormTitle").value = book.title;
    document.getElementById("bookFormAuthor").value = book.author;
    document.getElementById("bookFormYear").value = book.year;
    document.getElementById("bookFormIsComplete").checked = book.isComplete;

    // Simpan data form ke localStorage
    saveFormData();

    // Hapus buku yang akan diedit
    books = books.filter((b) => b.id !== bookId);
    saveData();
    renderBooks();

    // Auto-scroll ke "Tambah Buku Baru"
    const addBookHeader = document.querySelector("h2");
    addBookHeader.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

// Fungsi untuk mencari buku dan scroll ke hasil
const searchBooks = (e) => {
  e.preventDefault();
  const searchTerm = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();

  const filteredBooks = searchTerm
    ? books.filter((book) => book.title.toLowerCase().includes(searchTerm))
    : books;

  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  let firstFoundElement = null;

  filteredBooks.forEach((book) => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }

    // Simpan elemen pertama yang ditemukan
    if (!firstFoundElement) {
      firstFoundElement = bookElement;
    }
  });

  // Scroll ke elemen pertama yang ditemukan
  if (firstFoundElement) {
    firstFoundElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  } else {
    alert("Buku tidak ditemukan!");
  }
};

// Fungsi untuk menyimpan data form ke localStorage
const saveFormData = () => {
  const formData = {
    title: document.getElementById("bookFormTitle").value,
    author: document.getElementById("bookFormAuthor").value,
    year: document.getElementById("bookFormYear").value,
    isComplete: document.getElementById("bookFormIsComplete").checked,
  };
  localStorage.setItem("formData", JSON.stringify(formData));
};

// Fungsi untuk memuat data form dari localStorage
const loadFormData = () => {
  const storedFormData = localStorage.getItem("formData");
  if (storedFormData) {
    const formData = JSON.parse(storedFormData);
    document.getElementById("bookFormTitle").value = formData.title || "";
    document.getElementById("bookFormAuthor").value = formData.author || "";
    document.getElementById("bookFormYear").value = formData.year || "";
    document.getElementById("bookFormIsComplete").checked =
      formData.isComplete || false;

    // Update teks tombol submit
    const submitSpan = document
      .getElementById("bookFormSubmit")
      .querySelector("span");
    submitSpan.textContent = formData.isComplete
      ? "Selesai dibaca"
      : "Belum selesai dibaca";
  }
};

// Fungsi untuk menghapus data
const clearFormData = () => {
  localStorage.removeItem("formData");
};

// PROGRAM BARU START

// PROGRAM BARU END

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  const bookForm = document.getElementById("bookForm");
  const searchForm = document.getElementById("searchBook");
  const bookFormIsComplete = document.getElementById("bookFormIsComplete");
  const bookFormSubmit = document.getElementById("bookFormSubmit");

  // Muat data dari localStorage saat halaman dimuat
  loadData();
  loadFormData();

  // Simpan data form ke localStorage setiap kali ada perubahan input
  bookForm.addEventListener("input", saveFormData);

  // Simpan perubahan checkbox ke localStorage
  bookFormIsComplete.addEventListener("change", (e) => {
    const submitSpan = bookFormSubmit.querySelector("span");
    submitSpan.textContent = e.target.checked
      ? "Selesai dibaca"
      : "Belum selesai dibaca";
    saveFormData();
  });

  // Hapus data form dari localStorage setelah form disubmit
  bookForm.addEventListener("submit", (e) => {
    addBook(e);
    clearFormData();
  });

  // Event untuk search form
  searchForm.addEventListener("submit", searchBooks);
});
