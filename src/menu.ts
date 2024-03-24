import Backend from "./backend.js";

interface Dish{
    id?:string
    name_dish:string
    price:string
    available:number
    img_url?:string
    description:string
};

export default class Menu{
    constructor(){
        this.refreshTable();
    };

    BACKEND = new Backend();
    
    table = document.querySelector('.table tbody') as HTMLTableElement;    

    async refreshTable() {
        const table = document.querySelector('.table tbody') as HTMLTableElement;
        table.innerHTML = '';
        let items : Array<Dish>;
        items = await this.BACKEND.getData('menu');
        items.forEach(item =>{
            let tr = document.createElement('tr');
            tr.innerHTML =`
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
            btn.type='button';
            btn.className = 'btn btn-danger';
            btn.addEventListener('click',()=> {this.BACKEND.deleteData('menu', item.id); this.refreshTable();});
            td.append(btn);
            tr.append(td);
    
            td = document.createElement('td'); 
            btn = document.createElement('button');
            btn.textContent = 'Modify';
            btn.type='button';
            btn.className = 'btn btn-warning';
            btn.addEventListener('click',()=> {/*this.BACKEND.modify(user.id)*/console.log(item.id, item.name_dish);})
            td.append(btn);
            tr.append(td);
    
            table.append(tr);
        })
    }
    
}