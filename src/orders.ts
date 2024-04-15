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
    img_url?:string
    description:string
};

export default class Orders{
    BACKEND = new Backend();
    
    h1 = document.querySelector('.this') as HTMLHeadElement;
    constructor(){
        this.refreshTable().then(this.handleButtonVisibility);
        this.giveOutEventHandlers();  
        this.BACKEND.checkLogin();      
    };

    async handleButtonVisibility(){
        let buttons: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.manager')
        
        if (localStorage.getItem('LoggedIn') == undefined || localStorage.getItem('LoggedIn') == "false") {
            buttons.forEach(btn => {
                btn.style.display = 'none';
                
        })
        }else{
            buttons.forEach(btn => {
                btn.style.display = 'block';
            })
        }
    }

    async giveOutEventHandlers() {
        (document.querySelector('#update') as HTMLButtonElement).addEventListener('click', (e: Event)=>{
            e.preventDefault();
            let updated_Data: Order = {
                id: (document.querySelector('#idField') as HTMLInputElement).value, 
                guest_name: (document.querySelector('#nameField') as HTMLInputElement).value,
                ordered: (document.querySelector('#dishField') as HTMLInputElement).value,
                order_started: (document.querySelector('#timeField') as HTMLInputElement).value,
                status: (document.querySelector('#statusField') as HTMLInputElement).value,
                additional_entry: (document.querySelector('#plusField') as HTMLInputElement).value
            };
            (document.querySelector('#modifyOrder') as HTMLDivElement).style.display = "none";
            this.BACKEND.updateData('orders', updated_Data);
            setTimeout(()=>{this.refreshTable()}, 100);
            
        });
        (document.querySelector('#cancelUpdate') as HTMLButtonElement).addEventListener('click', (e: Event)=>{
            e.preventDefault();          
            (document.querySelector('#modifyOrder') as HTMLDivElement).style.display = "none";
        });
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
        items.forEach(item =>{           
            let tr = document.createElement('tr');
            tr.innerHTML =`
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
            btn.type='button';
            btn.className = 'btn btn-danger manager';
            btn.addEventListener('click',()=> {this.BACKEND.deleteData('orders', item.id); setTimeout(()=>{this.refreshTable()}, 100);});
            td.append(btn);
            tr.append(td);
    
            td = document.createElement('td'); 
            btn = document.createElement('button');
            btn.textContent = 'Modify';
            btn.type='button';
            btn.className = 'btn btn-warning manager';
            btn.addEventListener('click',()=> {
                (document.querySelector('#modifyOrder') as HTMLDivElement).style.display = "block";
                (document.querySelector('#nameField') as HTMLInputElement).value = item.guest_name;
                (document.querySelector('#dishField') as HTMLInputElement).value = item.ordered;
                (document.querySelector('#statusField') as HTMLInputElement).value = item.status;
                (document.querySelector('#plusField') as HTMLInputElement).value = item.additional_entry;
                //hidden
                (document.querySelector('#idField') as HTMLInputElement).value = String(item.id);
                (document.querySelector('#timeField') as HTMLInputElement).value = item.order_started;
            })
            td.append(btn);
            tr.append(td);
    
            table.append(tr);
        })
    }
}