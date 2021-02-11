const msgOne = document.querySelector('.h1');
const msgTwo = document.querySelector('.info__text');
const visitCard = document.querySelector('.visit-card');


setTimeout(function messageOne () {
    msgOne.classList.add('b-show');
}, 1000);

setTimeout(function messageTwo () {
    msgTwo.classList.add('b-show');
}, 3000);

setTimeout(function vCard () {
    visitCard.classList.add('b-show');
}, 4500);
