class HTML{
    div({ cname = null, id = null }) {
        const d = document.createElement('div');
        cname !== null ? d.classList.add(cname) : null;
        id !== null ? d.setAttribute("id", id) : null;
        return d;
    }
}

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

    button({ cNname = 'btn', name='',label= null, type = 'button', fx = () => { } }) {
        const b = document.createElement('button');
        b.className = cNname;
        b.setAttribute("type", type);
        b.onclick = fx;
        b.innerHTML = label!==null ? label : 'button';
        return b;
    }
}

class Form extends FormElements {
    addList() {
        const form = this.form({});
        const input = this.input({});
        form.appendChild(input);
        form.appendChild(this.button({ label:'+',
            type: 'submit', fx: (e) => {
                e.preventDefault();
                alert(input.value);
            }
        }));
        return form;
    }
}



class Elements {

    addListForm(){
        const form = new Form;
        const html = new HTML;

        const div = html.div({id: 'addlist'});

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