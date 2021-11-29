class Base {
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
}

class HTML {
    headline({ type = 1, label = null }) {
        let tp = parseInt(type);
        tp = tp < 1 || tp > 6 ? 1 : tp;
        const h = document.createElement(`h${tp}`);
        h.innerHTML = label ?? 'No Named';
        return h;
    }

    div({ cname = null, id = null }) {
        const d = document.createElement('div');
        cname !== null ? d.classList.add(cname) : null;
        id !== null ? d.setAttribute("id", id) : null;
        return d;
    }
}
/* ------- */

class FormElements {
    form({ cNname = 'form', name = null, id = null }) {
        const f = document.createElement('form');
        f.className = cNname;
        return f;
    }

    input({ cNname = 'input', placeholder = 'Input', name = 'input' }) {
        const i = document.createElement('input');
        i.name = name;
        i.className = cNname;
        i.placeholder = placeholder;
        return i;
    }

    button({ cNname = 'btn', name = '', label = null, type = 'button', fx = () => { } }) {
        const b = document.createElement('button');
        b.className = cNname;
        b.setAttribute("type", type);
        b.onclick = fx;
        b.innerHTML = label !== null ? label : 'button';
        return b;
    }
}


class Validator {

    addList(form, input) {

        const value = input.value;
        const list = new List;

        if (value.length > 1 && !list.exist(value)) {
            list.set({ name: value});
            this.displayStatus(form, true);
            input.value = '';
        } else {
            this.displayStatus(form, false);
        }
    }

    displayStatus(e,success = false){
        const className = success ? 'greenBorder' : 'redBorder';
        e.classList.add(className);
        setTimeout(() => {
            e.classList.remove(className);
        }, 1000);
    }
}


class Form extends FormElements {
    addList() {

        const form = this.form({});
        const input = this.input({ placeholder: 'Name der Liste' });
        form.appendChild(input);
        form.appendChild(this.button({
            label: '+',
            type: 'submit', fx: (e) => {
                e.preventDefault();
                const validator = new Validator;
                validator.addList(form, input);

            }
        }));
        return form;
    }
}

class List {
    _storageKey = 'lists';

    update(newData) {
        localStorage.setItem(this._storageKey, JSON.stringify(newData));
    }

    set({ name = "NO NAME" }) {

        const base = new Base;
        const userID = localStorage.getItem('uid')??0;
        const listId =  userID+'-'+base.generateID('xxxxxxxx')

        const newList = {
            name,
            id: listId, 
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

class Elements {

    addListForm() {
        const form = new Form;
        const html = new HTML;

        const headline = html.headline({ label: 'Liste anlegen' });
        const div = html.div({ id: 'addlist' });

        div.appendChild(headline);
        div.appendChild(form.addList());
        return div;
    }

}

class UI extends Elements {


    init(target) {
        const app = document.querySelector(target);
        app.appendChild(this.addListForm());
    }
}

const ui = new UI;
ui.init('#app');