window.addAutoResingTextarea = function addAutoResingTextarea() {

    const tx = document.getElementsByTagName('textarea')
    for (let i = 0; i < tx.length; i++) {
        tx[i].setAttribute(
            'style',
            'height:' + tx[i].scrollHeight + 'px;overflow-y:hidden;'
        )
        tx[i].addEventListener('input', OnInput, false)
    }

    function OnInput() {
        this.style.height = 0
        this.style.height = this.scrollHeight + 'px'
    }
}
