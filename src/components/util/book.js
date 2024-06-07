import {BookMarkService} from "../service/BookMarkService.js";
import {createErrorToast, createSuccessToast} from "./message.js";

window.addMark = async function addMark(bD, mark) {
    const token = $("meta[name='_csrf']").attr("content");
    const header = $("meta[name='_csrf_header']").attr("content");

    mark.addEventListener("change", async function () {
        const value = mark.value;

        if (value !== "Виберіть каталог") {


            console.log("value:" + value)
            console.log("b: " + bD)
            console.log("Було змінено")

            const service = new BookMarkService(header, token);

            const response = await service.createMark(value, bD);

            if (response.ok) {
                const text = await response.text();
                createSuccessToast(text);
            }else {
                const text = await response.text();
                createErrorToast(text);
            }
        }
    })
}


window.deleteMark = async function deleteMark(iD) {
    const token = $("meta[name='_csrf']").attr("content");
    const header = $("meta[name='_csrf_header']").attr("content");

    const service = new BookMarkService(header, token);
    const response = await service.deleteMark(iD);


    if (response.ok) {
        const text = await response.text();
        createSuccessToast(text);
    }else {
        const text = await response.text();
        createErrorToast(text);
    }
}
