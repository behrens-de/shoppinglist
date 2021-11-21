// JP BHERENS - SHOPPING LIST




const myList = [];

function addItem() {
    const form = document.querySelector('.addItem');
    const input = form.querySelector('input');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const value = input.value;
        //alert(value);
        myList.push(value);
        loadList();

        input.value = '';
    });
}


function loadList() {

    const itmes = document.querySelector('.items ul');
    itmes.innerHTML = '';

    myList.forEach((item) => {
        itmes.innerHTML += `<li>${item}</li>`;
    });
}




function init() {
    addItem();
    loadList();
}

init();