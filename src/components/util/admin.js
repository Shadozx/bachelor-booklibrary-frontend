import {BookService} from "../service/BookService.js";
import {UserService} from "../service/UserService.js";
import {ChapterService} from "../service/ChapterService.js";
import {createErrorToast, createSuccessToast} from "./message.js";

window.addBook = async function addBook() {
    const token = $("meta[name='_csrf']").attr("content");
    const header = $("meta[name='_csrf_header']").attr("content");


    const bookUrl = document.getElementById('book-url');

    const service = new BookService(header, token);

    const response = await service.addBook(bookUrl);

    if (response.ok) {
        // window.location.reload();
        console.log(response.status)
        console.log(response.statusText);
        const text = await response.text();
        createSuccessToast(text);

    } else {

        console.log(response.status)
        console.log(response.statusText);

        const text = await response.text();

        if (text != null) createErrorToast(text);
        console.log("Error");
    }

}

window.createBook = async function createBook() {

    const token = $("meta[name='_csrf']").attr("content");
    const header = $("meta[name='_csrf_header']").attr("content");

    const title = document.getElementById('book-name').value;

    const description = document.getElementById('book-description').value;

    const bookImg = document.getElementById('book-image').value;


    const service = new BookService(header, token);

    const response = await service.createBook(title, description, bookImg);

    if (response.ok) {
        const text = await response.text();
        console.log(text)
        createSuccessToast(text);
    } else {
        const text = await response.text();
        createErrorToast(text);
    }
}

window.updateBook = async function updateBook(b) {

    const title = document.getElementById('book-name').value;
    const description = document.getElementById('book-description').value;
    const bookImg = document.getElementById('book-image').value;

    console.log(title, description, bookImg)

    const token = $("meta[name='_csrf']").attr("content");
    const header = $("meta[name='_csrf_header']").attr("content");

    const service = new BookService(header, token);

    const response = await service.updateBook(b, title, description, bookImg);

    if (response.ok) {
        const text = await response.text();
        createSuccessToast(text);
    } else {
        const text = await response.text();
        createErrorToast(text);
    }
}

window.deleteBook = async function deleteBook(id) {
    const token = $("meta[name='_csrf']").attr("content");
    const header = $("meta[name='_csrf_header']").attr("content");

    const service = new BookService(header, token);

    const response = await service.deleteBook(id);

    if (response.ok) {
        const text = await response.text();
        createSuccessToast(text);
    } else {
        const text = await response.text();
        createErrorToast(text);
    }
}

//========================================
window.initEditor = function initEditor(id) {
    $(id).summernote({
        placeholder: 'Введіть текст глави...',
        tabsize: 2,
        // height: 120,
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['insert', ['link', 'picture',]],
            ['view', ['fullscreen', 'codeview', 'help']],
        ],
    })
}

//===================================
window.createChapter = async function createChapter(bookId) {

    console.log("CREATE CHAPTER")
    const token = $("meta[name='_csrf']").attr("content");
    const header = $("meta[name='_csrf_header']").attr("content");


    const title = document.getElementById('chapter-name').value;

    const text = $("#chapter-text").summernote('code');
    const nP = document.getElementById('numberOfChapter').value;

    const service = new ChapterService(header, token);

    const response = await service.createChapter(bookId, title, text, nP);

    if (response.ok) {
        const text = await response.text();
        createSuccessToast(text);
    } else {
        const text = await response.text();
        createErrorToast(text);
    }

}


window.updateChapter = async function updateChapter(bookId, chId) {
    console.log('Here!')

    const token = $("meta[name='_csrf']").attr("content");
    const header = $("meta[name='_csrf_header']").attr("content");


    const title = document.getElementById('chapter-name').value;
    const text = $("#chapter-text").summernote('code');
    const nP = document.getElementById('numberOfChapter').value;

    const service = new ChapterService(header, token);

    const response = await service.updateChapter(bookId, chId, title, text, nP);


    if (response.ok) {
        const text = await response.text();
        createSuccessToast(text);
    } else {
        const text = await response.text();
        createErrorToast(text);
    }
}


window.deleteChapter = async function deleteChapter(id) {

    const token = $("meta[name='_csrf']").attr("content");
    const header = $("meta[name='_csrf_header']").attr("content");

    const service = new ChapterService(header, token);

    const response = await service.deleteChapter(id);

    if (response.ok) {
        const text = await response.text();
        createSuccessToast(text);
    } else {
        const text = await response.text();
        createErrorToast(text);
    }
}

window.reloadChapters = async function reloadChapters(id) {


    const token = $("meta[name='_csrf']").attr("content");
    const header = $("meta[name='_csrf_header']").attr("content");

    const service = new ChapterService(header, token);

    const response = await service.reloadChapters(id);

    if (response.ok) {
        const text = await response.text();
        createSuccessToast(text);
    } else {
        const text = await response.text();
        createErrorToast(text);
    }
}

//================================

window.updateUser = async function updateUser(i) {

    const token = $("meta[name='_csrf']").attr("content");
    const header = $("meta[name='_csrf_header']").attr("content");

    const us = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const uR = document.getElementById("user-role").value;


    const service = new UserService(header, token);


    const response = await service.updateUser(us, pass, uR, i);

    if (response.ok) {
        const text = await response.text();
        createSuccessToast(text);
    } else {
        const text = await response.text();
        createErrorToast(text);
    }
}

window.deleteUser = async function deleteUser(i) {

    const token = $("meta[name='_csrf']").attr("content");
    const header = $("meta[name='_csrf_header']").attr("content");

    const service = new UserService(header, token);
    const response = await service.deleteUser(i);

    if (response.ok) {
        const text = await response.text();
        createSuccessToast(text);
    } else {
        const text = await response.text();
        createErrorToast(text);
    }

}
