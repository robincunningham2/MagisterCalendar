
window.onscroll = () => {
    const navStyle = window.scrollY > 10 ? 'box-shadow: 0 5px 10px rgba(0, 0, 0, .1);' : '';
    const downButtonClass = window.scrollY > 100 ? 'hidden' : '';

    document.querySelector('div.nav').setAttribute('style', navStyle);
    document.querySelector('#down').setAttribute('class', downButtonClass);
};
