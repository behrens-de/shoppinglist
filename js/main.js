// JP BHERENS - SHOPPING LIST


const lists = [
    {
        active: true,
        id: 'jp-default',
        name: 'Allgemeine'
    }
];


let item = {
    list: 'jp-default', // id of the List
    done: true,
    name: 'Example'
}

let item2 = {
    list: 'jp-default', // id of the List
    done: false,
    name: 'Example 2'
}

const myList = [item, item2];

// Added the Items to the Array - myList
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

// Ckecked if the addItem is valid
function validateItem(input) {
    if (input.length > 2) {
        myList.push({
            list: getActiveList().id,
            done: false,
            name: input
        });
        loadList();
        return true;
    }
    return false;
}


// Display the List
function loadList() {
    const itmes = document.querySelector('.items ul');
    itmes.innerHTML = '';

    myList.forEach((item) => {
        // Creates Items  
        const li = document.createElement('li');
        if(item.done){
            li.classList.add('active');
        }
        li.innerHTML = item.name;
        itmes.appendChild(li);
    });
    countItems();
    selectItem();
}

// If item is done
function selectItem() {
    const items = document.querySelectorAll('.items li');
    items.forEach((item) => {
        item.addEventListener('click', clickItem);
    })
}

function clickItem() {
    // Toggle (.active)
    const activeClassName = "active";
    this.classList.contains(activeClassName) ? this.classList.remove(activeClassName) : this.classList.add(activeClassName);
}

// Count the Items
function countItems() {
    const quanty = myList.length;
    const headline = document.querySelector('.countItems');
    headline.innerHTML = `${quanty} Einträge`;
}

// set active List
function getActiveList(){
    let activeList;
    lists.forEach((list)=>{
        if(list.active){
            activeList = list; 
        }
    });
    return activeList;
}
function setActiveList(){}

// Zeigt die Aktuelle Liste an
function displayActiveList(){
    const currentList = document.querySelector('.currentList');
    currentList.innerHTML = getActiveList().name;
}

function init() {
    addItem();
    loadList();
    displayActiveList();

}

init();