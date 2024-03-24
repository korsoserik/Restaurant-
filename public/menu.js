import Backend from "./backend.js";
;
export default class Menu {
    constructor() {
        this.BACKEND = new Backend();
        this.table = document.querySelector('.table tbody');
        this.refreshTable();
    }
    ;
    async refreshTable() {
        const table = document.querySelector('.table tbody');
        table.innerHTML = '';
        let items;
        items = await this.BACKEND.getData('menu');
        items.forEach(item => {
            let tr = document.createElement('tr');
            tr.innerHTML = `
                <tr>
                    <td>${item.id}</td>
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
            btn.className = 'btn btn-danger';
            btn.addEventListener('click', () => { this.BACKEND.deleteData('menu', item.id); this.refreshTable(); });
            td.append(btn);
            tr.append(td);
            td = document.createElement('td');
            btn = document.createElement('button');
            btn.textContent = 'Modify';
            btn.type = 'button';
            btn.className = 'btn btn-warning';
            btn.addEventListener('click', () => { /*this.BACKEND.modify(user.id)*/ console.log(item.id, item.name_dish); });
            td.append(btn);
            tr.append(td);
            table.append(tr);
        });
    }
}
