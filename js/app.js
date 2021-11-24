
class App {

    _maxLists = 10;
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
    addList(user, list) {
        const form = document.querySelector('.addList');
        const input = form.querySelector('input');

        const getList = JSON.parse(list.get()) ?? [];

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const val = input.value;

            if (list.exist(val) || val.length < 2 || getList.length >= this._maxLists) {
                
                if(list.exist(val)){
                    this.dialog(`Eine Liste mit dem Namen ${val} exestiert schon`);
                }
                if(val.length < 2){
                    this.dialog(`Eingabe ist zu Kurz`);
                }

                if(getList.length >= this._maxLists){
                    this.dialog(`Sie können maximal ${this._maxLists} Listen anlegen`);
                }
                
            } else {
                list.set({
                    name: input.value,
                    id: user.getId() + this.generateID('xxxxx')
                });
                input.value = '';
                this.renderList(list);
            }
        });
    }

    renderList(list){
        const target = document.querySelector('.myLists');
        target.innerHTML = null;
        const getList = JSON.parse(list.get()) ?? [];

        if(getList.length < 1){
            const div = document.createElement('div');
            div.classList.add('nolists');
            div.innerHTML = 'Noch keine Liste vorhanden';
            target.appendChild(div);
            return;
        }

        getList.forEach((liste)=>{
            const name = liste.name;
            const div = document.createElement('div');
            div.classList.add('list');
            div.innerHTML = name;

            target.appendChild(div);

        });

    }

    dialog(msg){
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











const app = new App;
const user = new User;
const list = new List;

// Erstellt eine USERID wenn noch nicht vorhanden
if (!user.isset()) {
    user.create(app.generateID(format = 'xxxxxxxx'));
}

app.addList(user, list);
app.renderList(list);











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



