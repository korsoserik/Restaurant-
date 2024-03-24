import Backend from "./backend.js";

interface Order{
    id?:string,
    guest_name:string,
    ordered:string,
    order_started:string,
    status:string,
    additional_entry:string
}

interface Dish{
    id?:string
    name_dish:string
    price:string
    available:number
    img_url?:string
    description:string
};

export default class Orders{
    BACKEND = new Backend();
    
    h1 = document.querySelector('.this') as HTMLHeadElement;
    constructor(){
        this.refreshTable();
    }

    async getMenu(){
        let items: Array<Dish> = await this.BACKEND.getData('menu');
        // let options: Array<HTMLOptionElement> = new Array<HTMLOptionElement>;
        let select_dishes: HTMLSelectElement = document.createElement('select');            
        items.forEach(item  => {  
            let o = document.createElement('option');
            o.value = o.innerText = item.name_dish;         
            select_dishes.add(o);
        });
        return select_dishes;
    }

    async refreshTable() {
        const table = document.querySelector('.table tbody') as HTMLTableElement;
        table.innerHTML = '';
        let items : Array<Order>;
        items = await this.BACKEND.getData('orders');
        let menu: HTMLSelectElement = await this.getMenu();        
        items.forEach(item =>{  
            console.log(menu,item.ordered);

            menu.value = item.ordered;
            
            let tr = document.createElement('tr');
            tr.innerHTML =`
                <tr>
                    <td>${item.id}</td>
                    <td><input class="w-100" type="text" value="${item.guest_name}" disabled="true"></td>
                    <td>
                        ${menu.outerHTML.toString()}
                    </td>
                    <td>${item.order_started}</td>
                    <td>
                        <select class="w-100" disabled="true">
                            <option value="${item.status}" selected="selected">${item.status}</option>
                        </select>
                    </td>
                    <td><input class="w-100" type="text" value="${item.additional_entry}" disabled="true"></td>
                </tr>
            `;
            let td = document.createElement('td');
            let btn = document.createElement('button');
            btn.textContent = 'Delete';
            btn.type='button';
            btn.className = 'btn btn-danger';
            btn.addEventListener('click',()=> {this.BACKEND.deleteData('orders', item.id); this.refreshTable();});
            td.append(btn);
            tr.append(td);
    
            td = document.createElement('td'); 
            btn = document.createElement('button');
            btn.textContent = 'Modify';
            btn.type='button';
            btn.className = 'btn btn-warning';
            btn.addEventListener('click',()=> {/*this.BACKEND.modify(user.id)*/console.log(item.id, item.guest_name);})
            td.append(btn);
            tr.append(td);
    
            table.append(tr);
        })
    }
}