
class App {
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


    addList(user, list) {
        const form = document.querySelector('.addList');
        const input = form.querySelector('input');
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            list.set({
                name: input.value,
                id: user.getId() + this.generateID('xxxxx')
            });
            input.value = '';
        });
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
}











const app = new App;
const user = new User;
const list = new List;

// Erstellt eine USERID wenn noch nicht vorhanden
if (!user.isset()) {
    user.create(app.generateID(format = 'xxxxxxxx'));
}

console.log(user.getId());


app.addList(user, list);











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



