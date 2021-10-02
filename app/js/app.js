const burgerMenu = document.querySelector('.nav_btn'); //выбрать где именно нарисован бургер и скрыт.
const menuList = document.querySelector('.nav_adaptive'); //родительский элемент листа меню
const body = document.querySelector('body'); //это просто body для фиксации
const links = document.querySelectorAll('.nav_adaptive a'); // ссылки меню

menuList.onclick = function hideMenu() {
    burgerMenu.classList.toggle('activeBurger');
    menuList.classList.toggle('activeBurger');
    body.classList.remove('lockScroll');
}
burgerMenu.onclick = function showBurger() {
    this.classList.toggle('activeBurger');
    menuList.classList.toggle('activeBurger');
    body.classList.toggle('lockScroll');
}
const swiper = new Swiper('.swiper', {
    // Optional parameters
    direction: 'vertical',
    loop: true,

    // If we need pagination
    pagination: {
        el: '.swiper-pagination',
    },




});