async function  deleteBook(id) {
    let response = await fetch("/api/books/" + id, {method:"DELETE"})

    if(response.ok) window.location.reload()
}


function updateBook(id) {
    window.location.href = "/book/" + id + "/edit"
}
