import Backend from "./backend.js";
;
export default class Orders {
    constructor() {
        this.BACKEND = new Backend();
        this.h1 = document.querySelector('.this');
        this.refreshTable().then(this.handleButtonVisibility);
        this.giveOutEventHandlers();
        this.BACKEND.checkLogin();
    }
    ;
    async handleButtonVisibility() {
        let buttons = document.querySelectorAll('.manager');
        if (localStorage.getItem('LoggedIn') == undefined || localStorage.getItem('LoggedIn') == "false") {
            buttons.forEach(btn => {
                btn.style.display = 'none';
            });
        }
        else {
            buttons.forEach(btn => {
                btn.style.display = 'block';
            });
        }
    }
    async giveOutEventHandlers() {
        document.querySelector('#update').addEventListener('click', (e) => {
            e.preventDefault();
            let updated_Data = {
                id: document.querySelector('#idField').value,
                guest_name: document.querySelector('#nameField').value,
                ordered: document.querySelector('#dishField').value,
                order_started: document.querySelector('#timeField').value,
                status: document.querySelector('#statusField').value,
                additional_entry: document.querySelector('#plusField').value
            };
            document.querySelector('#modifyOrder').style.display = "none";
            this.BACKEND.updateData('orders', updated_Data);
            setTimeout(() => { this.refreshTable(); }, 100);
        });
        document.querySelector('#cancelUpdate').addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('#modifyOrder').style.display = "none";
        });
    }
    async getMenu() {
        let items = await this.BACKEND.getData('menu');
        // let options: Array<HTMLOptionElement> = new Array<HTMLOptionElement>;
        let select_dishes = document.createElement('select');
        items.forEach(item => {
            let o = document.createElement('option');
            o.value = o.innerText = item.name_dish;
            select_dishes.add(o);
        });
        return select_dishes;
    }
    async refreshTable() {
        const table = document.querySelector('.table tbody');
        table.innerHTML = '';
        let items;
        items = await this.BACKEND.getData('orders');
        items.forEach(item => {
            let tr = document.createElement('tr');
            tr.innerHTML = `
                <tr>
                    <td>${item.guest_name}</td>
                    <td>${item.ordered}</td>
                    <td>${item.order_started}</td>
                    <td>${item.status}</td>
                    <td>${item.additional_entry}</td>
                </tr>
            `;
            let td = document.createElement('td');
            let btn = document.createElement('button');
            btn.textContent = 'Delete';
            btn.type = 'button';
            btn.className = 'btn btn-danger manager';
            btn.addEventListener('click', () => { this.BACKEND.deleteData('orders', item.id); setTimeout(() => { this.refreshTable(); }, 100); });
            td.append(btn);
            tr.append(td);
            td = document.createElement('td');
            btn = document.createElement('button');
            btn.textContent = 'Modify';
            btn.type = 'button';
            btn.className = 'btn btn-warning manager';
            btn.addEventListener('click', () => {
                document.querySelector('#modifyOrder').style.display = "block";
                document.querySelector('#nameField').value = item.guest_name;
                document.querySelector('#dishField').value = item.ordered;
                document.querySelector('#statusField').value = item.status;
                document.querySelector('#plusField').value = item.additional_entry;
                //hidden
                document.querySelector('#idField').value = String(item.id);
                document.querySelector('#timeField').value = item.order_started;
            });
            td.append(btn);
            tr.append(td);
            table.append(tr);
        });
    }
}
