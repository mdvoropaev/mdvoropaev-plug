const msgOne = document.querySelector('.h1');
const msgTwo = document.querySelector('.info__text');
const visitCard = document.querySelector('.visit-card');

function massageOne () {
    msgOne.classList.add('b-show');
}

function massageTwo () {
    msgTwo.classList.add('b-show');
}

function vCard () {
    visitCard.classList.add('b-show');
}


setTimeout(massageOne, 1000);
setTimeout(massageTwo, 3000);
setTimeout(vCard, 4500);

