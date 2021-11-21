// JP BHERENS - SHOPPING LIST

const myList = ['TEST 1', 'TEST 2'];

function addItem() {
    const form = document.querySelector('.addItem');
    const input = form.querySelector('input');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const value = input.value;
        const valid = validateItem(input.value);

        input.value = valid ? '' : value;
    });
}


function validateItem(input) {
    if (input.length > 2) {
        myList.push(input);
        loadList();
        return true;
    }
    return false;
}


function loadList() {

    const itmes = document.querySelector('.items ul');
    itmes.innerHTML = '';

    myList.forEach((item) => {
        const li = document.createElement('li');
        li.classList.add('test');
        li.innerHTML = item;

        itmes.appendChild(li);
        //itmes.innerHTML += `<li class="test">${item}</li>`;
    });
    countItems();
    selectItem();
}


function selectItem() {
    const items = document.querySelectorAll('.test');
    items.forEach((item) => {
        item.addEventListener('click', clickItem);
    })
}

function clickItem() {
    // Toggle (.active)
    const activeClassName = "active";
    this.classList.contains(activeClassName) ? this.classList.remove(activeClassName) : this.classList.add(activeClassName);
}


function countItems() {
    const quanty = myList.length;
    const headline = document.querySelector('.countItems');
    headline.innerHTML = `${quanty} Einträge`;
}


function init() {
    addItem();
    loadList();

}

init();