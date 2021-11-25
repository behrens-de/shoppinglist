
class App {

    constructor(user, list) {
        this._user = user ?? null;
        this._list = list ?? null;

    }

    _maxLists = 10;
    _self = this;
    // Erstellt eine ID
    generateID(format = 'xxxx-xxxx-xxxx-xxxx') {
        var d = new Date().getTime();
        var d2 = (performance && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
        var uuid = format.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16;
            if (d > 0) {
                var r = (d + r) % 16 | 0;
                d = Math.floor(d / 16);
            } else {
                var r = (d2 + r) % 16 | 0;
                d2 = Math.floor(d2 / 16);
            }
            return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });
        return uuid;
    };


    // Erstellt eine neue Liste
    addList() {
        const form = document.querySelector('.addList');
        const input = form.querySelector('input');


        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const getList = JSON.parse(this._list.get()) ?? [];
            const val = input.value;

            if (this._list.exist(val) || val.length < 2 || getList.length >= this._maxLists) {

                if (this._list.exist(val)) {
                    this.dialog(`Eine Liste mit dem Namen ${val} exestiert schon`);
                }
                if (val.length < 2) {
                    this.dialog(`Eingabe ist zu Kurz`);
                }

                if (getList.length >= this._maxLists) {
                    this.dialog(`Sie können maximal ${this._maxLists} Listen anlegen`);
                }

            } else {
                this._list.set({
                    name: input.value,
                    id: this._user.getId() + this.generateID('xxxxx')
                });
                input.value = '';
                this.renderList();
            }
        });
    }

    renderList() {
        const target = document.querySelector('.myLists');
        target.innerHTML = null;
        const getList = JSON.parse(this._list.get()) ?? [];

        if (getList.length < 1) {
            const div = document.createElement('div');
            div.classList.add('nolists');
            div.innerHTML = 'Keine Liste vorhanden';
            target.appendChild(div);
            return;
        }

        getList.forEach((liste) => {
            const name = liste.name;
            const listID = liste.id;
            const div = document.createElement('div');
            div.classList.add('list');

            const circle = document.createElement('div');
            circle.innerHTML = name[0].toUpperCase();
            circle.classList.add('list-circle');

            const label = document.createElement('input');
            label.value = name;
            label.disabled = true;
            label.addEventListener('blur', (i) => {

                this.updateList(name, label.value, liste.id);
                label.disabled = true;
                this.renderList();
            });

            // Wenn Enter

            label.classList.add('list-label');

            const settings = document.createElement('div');
            settings.classList.add('settingsList');


            const hammer = new Hammer(label);
            let panTyp;
            hammer.on("panleft panright panup pandown tap press panend", function (ev) {
                const sl = document.querySelectorAll('.settingsListShow');
                sl.forEach(el => {
                    el.classList.remove('settingsListShow');
                });
                if (ev.type === 'panend' && panTyp === 'panleft') {
                    console.log('PAN LEFT');
                    settings.classList.add('settingsListShow');

                }

                else {
                    panTyp = ev.type
                }
            });


            // UpdateClicked Elemet
            const edit = document.createElement('div');
            edit.classList.add('editList');
            edit.innerHTML = 'Ändern';
            edit.addEventListener('click', () => {
                const sl = document.querySelectorAll('.settingsListShow');
                sl.forEach(el => {
                    el.classList.remove('settingsListShow');
                });
                label.disabled = false;
                label.focus();
            });

            // Delet Clicked element
            const deleteBtn = document.createElement('div');
            deleteBtn.classList.add('deleteList');
            deleteBtn.dataset.id = liste.id;
            deleteBtn.innerHTML = 'Löschen';
            deleteBtn.addEventListener('click', () => {
                this.deleteList(liste.id);
                this.renderList();
            });

            // Create Elements
            div.appendChild(circle);
            div.appendChild(label);
            settings.appendChild(edit);
            settings.appendChild(deleteBtn);
            div.appendChild(settings);

            div.dataset.id = listID;
            div.dataset.name = name;

            target.appendChild(div);
        });

        //this.deleteAllList();
        const deleteAllList = document.createElement('div');
        deleteAllList.innerHTML = 'Alle Listen und Einträge löschen';
        deleteAllList.addEventListener('click', () => {
            this.deleteAllList();
        });

        target.appendChild(deleteAllList);
    }

    deleteList(id) {
        const oldList = JSON.parse(this._list.get()) ?? [];
        const newList = oldList.filter((l) => l.id !== id)
        list.update(newList);
    }

    deleteAllList() {
        // Alle Einträge löschen

        const storageKey = this._list._storageKey;
        localStorage.removeItem(storageKey);
        this.renderList();
    }

    updateList(oldValue, newValue, id) {


        const Lists = JSON.parse(this._list.get()) ?? [];
        // prüfen ob änderung vorliegt
        if (oldValue !== newValue && newValue.length > 1) {
            console.log('änderung liegt vor' + id);
            const newList = Lists.map((list) => {
                if (list.id === id) {
                    list.name = newValue;
                }
                return list;
            });

            this._list.update(newList);

        }




    }

    dialog(msg) {
        alert(msg);
    }
}


class User {

    _storageKey = 'uid';

    create(userID) {
        localStorage.setItem(this._storageKey, userID);
    }
    isset() {
        return localStorage.getItem(this._storageKey) !== null ? true : false;
    }

    getId() {
        return localStorage.getItem(this._storageKey);
    }
}


class List {
    _storageKey = 'lists';

    update(newData) {
        localStorage.setItem(this._storageKey, JSON.stringify(newData));
    }

    set({ name = "NO NAME", id = "XXX" }) {
        const newList = {
            name,
            id,
            sort: 0
        }

        const getList = JSON.parse(this.get()) ?? [];

        getList.push(newList);

        localStorage.setItem(this._storageKey, JSON.stringify(getList));
    }

    get() {
        return localStorage.getItem(this._storageKey);
    }

    exist(name) {
        const getList = JSON.parse(this.get()) ?? [];
        let exist = false;
        getList.forEach((list) => {
            if (list.name.toLowerCase() === name.toLowerCase()) {
                exist = true;
            };
        });
        return exist;
    }
}











const user = new User;
const list = new List;
const app = new App(user, new List);

// Erstellt eine USERID wenn noch nicht vorhanden
if (!user.isset()) {
    user.create(app.generateID(format = 'xxxxxxxx'));
}

app.addList();
app.renderList();











function frameSlide() {
    const wrap = document.querySelector('#wrap');
    const frames = document.querySelectorAll('.frame');
    const prev = document.querySelectorAll('.prevFrame');
    const next = document.querySelectorAll('.nextFrame');

    let current = 0;

    prev.forEach((btn) => {
        btn.addEventListener('click', () => {
            if (current > 0) {
                current--;
                const vw = current === 0 ? 0 : `-${100 * current}vw`;
                wrap.style = 'left:' + vw + ';';
                console.log(document.activeElement.tagName);
            }
        });
    });

    next.forEach((btn) => {
        btn.addEventListener('click', () => {
            if (current < frames.length - 1) {
                current++;
                const vw = current === 0 ? 0 : `-${100 * current}vw`;
                wrap.style = 'left:' + vw + ';';
            }

        });
    });
}


function swipe(direction) {
    if (direction === 'next') {
        document.querySelector('.nextFrame').click();
    }
    if (direction === 'prev') {
        document.querySelector('.prevFrame').click();
    }
}

frameSlide();




//window.addEventListener("touchmove", function (event) { event.preventDefault(); }, { passive: false });

dragula([document.querySelector("#allLists")])
    .on('drag', function (el) {
        el.className = el.className.replace('ex-moved', '');
    }).on('drop', function (el) {
        console.log('drop');

        // Das letze element ist immer das welches man bewegt hat (Doppeltes Element)
        const demo = document.querySelectorAll('.list');
        let i = 0;
        demo.forEach(e=>{
            console.log(i,e.dataset.id, e.dataset.name);
            i++;
        });
        console.log(demo);
    }).on('over', function (el, container) {
        container.className += ' ex-over';
    }).on('out', function (el, container) {
        container.className = container.className.replace('ex-over', '');
    });