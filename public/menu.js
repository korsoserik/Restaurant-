import Backend from "./backend.js";
;
export default class Menu {
    constructor() {
        this.BACKEND = new Backend();
        this.table = document.querySelector('.table tbody');
        this.refreshTable().then(this.handleButtonVisibility);
        this.giveOutEventHandlers();
        this.BACKEND.checkLogin();
    }
    ;
    namePopUp(dishData) {
        let text;
        let person = prompt("Please enter your name:", "");
        if (person == null || person == "") {
            alert('Order cancelled');
        }
        else {
            let date = new Date;
            let Order = {
                guest_name: person,
                ordered: dishData.name_dish,
                order_started: `${date.getHours()}:${date.getMinutes()}`,
                status: 'Recieved',
                additional_entry: ''
            };
            this.BACKEND.postData('orders', Order);
            alert('Successful Order!');
        }
    }
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
                name_dish: document.querySelector('#nameField').value,
                price: document.querySelector('#priceField').value,
                img_url: document.querySelector('#imgField').value,
                description: document.querySelector('#plusField').value
            };
            document.querySelector('#modifyDish').style.display = "none";
            this.BACKEND.updateData('menu', updated_Data);
            setTimeout(() => { this.refreshTable(); }, 100);
        });
        document.querySelector('#cancelUpdate').addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('#modifyDish').style.display = "none";
        });
    }
    async refreshTable() {
        const table = document.querySelector('.table tbody');
        table.innerHTML = '';
        let items;
        items = await this.BACKEND.getData('menu');
        items.forEach(item => {
            let tr = document.createElement('tr');
            tr.innerHTML = `
                <tr>                    
                    <td>${item.img_url}</td>
                    <td>${item.name_dish}</td>
                    <td>${item.description}</td>
                    <td>${item.price}</td>
                </tr>
            `;
            let td = document.createElement('td');
            let btn = document.createElement('button');
            btn.textContent = 'Delete';
            btn.type = 'button';
            btn.className = 'btn btn-danger manager';
            btn.addEventListener('click', () => { this.BACKEND.deleteData('menu', item.id); this.refreshTable(); });
            td.append(btn);
            tr.append(td);
            td = document.createElement('td');
            btn = document.createElement('button');
            btn.textContent = 'Modify';
            btn.type = 'button';
            btn.className = 'btn btn-warning manager';
            btn.addEventListener('click', () => {
                document.querySelector('#modifyDish').style.display = "block";
                document.querySelector('#nameField').value = item.name_dish;
                document.querySelector('#priceField').value = item.price;
                document.querySelector('#imgField').value = String(item.img_url);
                document.querySelector('#plusField').value = String(item.description);
                //hidden
                document.querySelector('#idField').value = String(item.id);
            });
            td.append(btn);
            tr.append(td);
            td = document.createElement('td');
            btn = document.createElement('button');
            btn.textContent = 'Order';
            btn.type = 'button';
            btn.className = 'btn btn-success';
            btn.addEventListener('click', () => { this.namePopUp(item); });
            td.append(btn);
            tr.append(td);
            table.append(tr);
        });
    }
}
