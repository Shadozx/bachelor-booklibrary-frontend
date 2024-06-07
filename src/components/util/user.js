import {CatalogService} from "../service/CatalogService.js";
import {UserService} from "../service/UserService.js";
import {createErrorToast, createSuccessToast} from "./message.js";

window.initDropzone = function initDropzone(id) {
    // Dropzone.autoDiscover = false

    const token = $("meta[name='_csrf']").attr("content");
    const header = $("meta[name='_csrf_header']").attr("content");


    // Ініціалізуємо Dropzone
    if (!Dropzone.forElement(id)) {
        var dropzone = new Dropzone(id, {
            // url: '/api/users/image',
            paramName: 'data',
            maxFilesize: 1,
            acceptedFiles: 'image/*',
            dictDefaultMessage: 'Киньте фото',

            init: function () {
                this.on('sending', function (file, xhr, formData) {
                    formData.append('data', file);

                    xhr.setRequestHeader(header, token);

                    xhr.send(formData);
                });

            },
            success: function (file, response) {
                console.log("Готово!");
            }
        });
    }
}


window.createUser = async function createUser() {
    const token = $("meta[name='_csrf']").attr("content");
    const header = $("meta[name='_csrf_header']").attr("content");

    const unm = document.getElementById("username");

    const pass = document.getElementById("password");


    console.log("create");
    console.log(unm, pass);


    const service = new UserService(header, token);

    if (unm !== null && pass !== null) {
        const response = await service.createUser(unm.value, pass.value);

        if (response.ok) {
            const text = await response.text();
            createSuccessToast(text);
        } else {
            const text = await response.text();
            createErrorToast(text);
        }
    }
}

window.updateUser = async function updateUser() {

    const token = $("meta[name='_csrf']").attr("content");
    const header = $("meta[name='_csrf_header']").attr("content");

    const unm = document.getElementById("username");

    const pass = document.getElementById("password");


    console.log("update");
    console.log(unm, pass);


    const service = new UserService(header, token);

    if (unm !== null && pass !== null) {
        const response = await service.updateUser(unm.value, pass.value);

        if (response.ok) {
            const text = await response.text();
            createSuccessToast(text);
        } else {
            const text = await response.text();
            createErrorToast(text);
        }
    } else return null;
}


window.deleteMark = async function deleteMark(id) {
    const token = $("meta[name='_csrf']").attr("content");
    const header = $("meta[name='_csrf_header']").attr("content");

    const response = await fetch("/api/bookmarks/" + id,
        {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                [header]: token  // Додавання CSRF-токену до заголовків
            }
        });

    if (response.ok) {
        const text = await response.text();
        createSuccessToast(text);
    } else {
        const text = await response.text();
        createErrorToast(text);
    }
}

window.addCatalog = async function addCatalog() {
    const token = $("meta[name='_csrf']").attr("content");
    const header = $("meta[name='_csrf_header']").attr("content");

    const title = document.getElementById("add-catalog");

    const isPublic = document.getElementById("isPublic");


    const service = new CatalogService(header, token);

    const response = await service.createCatalog(title.value, isPublic.checked);

    if (response.ok) {
        const text = await response.text();
        createSuccessToast(text);
    } else {
        const text = await response.text();
        createErrorToast(text);
    }
}

window.editModalCatalog = async function editCatalog(element) {

    const token = $("meta[name='_csrf']").attr("content");
    const header = $("meta[name='_csrf_header']").attr("content");

    const dataId = element.getAttribute("data-id");

    const service = new CatalogService(header, token);

    console.log('edit!');
    const response = await service.getCatalog(dataId);

    if (response.ok) {
        const catalog = await response.json();

        console.log(catalog)
        const title = document.getElementById("edit-catalog-name");

        title.value = catalog.title;

        const editor = document.getElementById("editCatalog");
        editor.setAttribute("data-id", dataId);
        const modal = new bootstrap.Modal(editor, {});

        modal.show();

    }
}

window.updateCatalog = async function updateCatalog() {

    const token = $("meta[name='_csrf']").attr("content");
    const header = $("meta[name='_csrf_header']").attr("content");


    const editor = document.getElementById("editCatalog");
    const cD = editor.getAttribute("data-id");

    const service = new CatalogService(header, token);
    const title = document.getElementById('edit-catalog-name').value;
    const isPublic = document.getElementById('edit-isPublic').checked;


    const response = await service.updateCatalog(cD, title, isPublic);


    if (response.ok) {
        const text = await response.text();
        createSuccessToast(text);
    } else {
        const text = await response.text();
        createErrorToast(text);
    }

}


window.deleteCatalog = async function deleteCatalog(id) {
    const token = $("meta[name='_csrf']").attr("content");
    const header = $("meta[name='_csrf_header']").attr("content");

    const response = await fetch("/api/catalogs/" + id,
        {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                [header]: token  // Додавання CSRF-токену до заголовків
            }
        });

    if (response.ok) {
        const text = await response.text();
        createSuccessToast(text);
    } else {
        const text = await response.text();
        createErrorToast(text);
    }

}
