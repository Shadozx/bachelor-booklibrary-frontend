import {BookMarkService} from "../service/BookMarkService.js";
import {createErrorToast, createSuccessToast} from "./message.js";


window.initArrows = function initArrows() {

    const keyLeft = document.getElementById("keyLeft");
    const keyRight = document.getElementById("keyRight");


    document.onkeydown = function (e) {

        console.log(e.key);

        //37
        if (e.key === 'ArrowLeft') {
            window.location.href = keyLeft.href;
        }

        //39 key
        if (e.key === 'ArrowRight') {
            window.location.href = keyRight.href;
        }
    };

    const bookmark = document.getElementById("bookmark-paragraph");

    // if (bookmark != null) bookmark.scrollIntoView()
    if (bookmark != null) {
        // Прокрутити до параграфа

        // const paragraphPosition = bookmark.getBoundingClientRect();

        bookmark.scrollIntoView({
            behavior: "smooth",
            block: 'start',
            inline: "nearest"
        });

    }
}

window.addBookMark = async function addBookMark(chapterId, par) {

    const token = $("meta[name='_csrf']").attr("content");
    const header = $("meta[name='_csrf_header']").attr("content");


    const service = new BookMarkService(header, token);

    const response = await service.updateBookMark(chapterId, par);

    if (response.ok) {
        const text = await response.text();
        createSuccessToast(text);
    } else {
        const text = await response.text();
        createErrorToast(text);
    }
}