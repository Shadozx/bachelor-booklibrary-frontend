window.autohideTop = function (element) {

    console.log('here top!')
    let prevScrollpos = window.scrollY
    const nav = document.getElementById(element);

    if (nav == null) {

        console.log('Element ' + element + ' is null');
    } else {
        window.addEventListener('scroll', function () {
            console.log('work top!')
            let currentScrollPos = window.scrollY
            if (prevScrollpos > currentScrollPos) {
                nav.style.top = '0'
            } else {
                nav.style.top = '-150px'
            }
            prevScrollpos = currentScrollPos
        });
    }
}

window.autohideBottom = function (element) {

    console.log('here bottom!')
    let prevScrollpos = window.scrollY
    const nav = document.getElementById(element);
    if (nav == null) {

        console.log('Element ' + element + ' is null');
    } else {
        window.addEventListener('scroll', function () {
            console.log('work bottom!')
            let currentScrollPos = window.scrollY
            if (prevScrollpos > currentScrollPos) {
                nav.style.bottom = '0'
            } else {
                nav.style.bottom = '-150px'
            }
            prevScrollpos = currentScrollPos
        });
    }
}

/*
window.autohide = function (element, nav) {

    const el_autohide = document.querySelector(element);

    // add padding-top to bady (if necessary)
    const navbar_height = document.querySelector(nav).offsetHeight;
    document.body.style.paddingTop = navbar_height + 'px';
    document.body.style.paddingBottom = navbar_height + 'px';

    if (el_autohide) {
        let last_scroll_top = 0;
        window.addEventListener('scroll', function () {
            let scroll_top = window.scrollY;
            if (scroll_top < last_scroll_top) {
                el_autohide.classList.remove('scrolled-down');
                el_autohide.classList.add('scrolled-up');
            } else {
                el_autohide.classList.remove('scrolled-up');
                el_autohide.classList.add('scrolled-down');
            }
            last_scroll_top = scroll_top;
        });
        // window.addEventListener
    }
    // if

}*/
