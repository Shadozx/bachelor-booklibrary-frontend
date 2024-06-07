export function createSuccessToast(text) {
    createToast('successMessage', text);
}

export function createErrorToast(text) {

    createToast('errorMessage', text);
}

function createToast(elName, text) {
    const toastElement = document.getElementById(elName);

    if (toastElement == null) throw new Error("Немає елемента " + elName);

    else {
        const toast = new bootstrap.Toast(toastElement)
        // var toastBodyElement = toastElement.querySelector('.toast-body')
        // toastBodyElement.textContent = text
        const message = toastElement.querySelector('.toast-header-message');

        if (message == null)  throw new Error("Немає елемента toast-header-message");
        else {
            message.textContent = text
            toast.show()
        }
    }
}