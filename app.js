//vanilla js ile
//book class her bir kitabı temsil eder
class Book {
  constructor(title, author, barcode) {
    this.title = title;
    this.author = author;
    this.barcode = barcode;
  }
}
// UI class: UI görevlerini ele alır
class UI {
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach((book) => UI.addBookToList(book));
  }
  static addBookToList(book) {
    //queryselector() yöntemi belgede blrtlen bir css seciciyle eslesen ilk ögeyi dondurur
    const list = document.querySelector("#book-list");
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.barcode}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>

        `;
    // appendChild; methodu, belirtilen bir üst düğümün alt öğelerinin sonuna bir düğüm ekler.
    // Belirli bir alt öğe belgedeki varolan bir düğüme başvuruyorsa, appendChild() onu geçerli konumundan yeni konuma taşır.
    list.appendChild(row);
  }
  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);
    //make timer uyarı gitmesi için
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }
  static clearFields(row) {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#barcode").value = "";
  }
}
//Store Class: Depolamayı yönetir

class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }
  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }
  static removeBook(barcode) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.barcode === barcode) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}
//event görüntülemek için kitapları
document.addEventListener("DOMContentLoaded", UI.displayBooks);
//event: kitap eklemek,
document.querySelector("#book-form").addEventListener("submit", (e) => {
  e.preventDefault();
  //get form values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const barcode = document.querySelector("#barcode").value;
  // Instatiate Book

  if (title === "" || author === "" || barcode === "") {
    //hem deger hem tip
    UI.showAlert("Tüm boşlukları doldurmalısınız!", "danger");
  } else {
    const book = new Book(title, author, barcode);

    //add book to UI
    UI.addBookToList(book);
    Store.addBook(book);
    UI.showAlert("Book Added", "success");
    //clear fields
    UI.clearFields();
    //başarılı
  }
});
// event silmek için,kitapları
document.querySelector("#book-list").addEventListener("click", (e) => {
  UI.deleteBook(e.target);
  //remove book from store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  UI.showAlert("Book Removed", "info");
});
