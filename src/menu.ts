import Backend from "./backend.js";

interface Dish{
    id?:string
    name_dish:string
    price:string
    img_url?:string
    description:string
};

interface Order{
    id?:string,
    guest_name:string,
    ordered:string,
    order_started:string,
    status:string,
    additional_entry:string
}

export default class Menu{
    constructor(){
        this.refreshTable().then(this.handleButtonVisibility);
        this.giveOutEventHandlers();
        this.BACKEND.checkLogin();
    };

    BACKEND = new Backend();
    
    table = document.querySelector('.table tbody') as HTMLTableElement; 
    
    namePopUp(dishData: Dish) {
        let text;
        let person = prompt("Please enter your name:", "");
        if (person == null || person == "") {
          alert('Order cancelled');
        } else {
            let date: Date = new Date;
            let Order: Order = {
                guest_name: person,
                ordered: dishData.name_dish,
                order_started: `${date.getHours()}:${date.getMinutes()}`,
                status: 'Recieved',
                additional_entry: ''
            }
          this.BACKEND.postData('orders', Order)
          alert('Successful Order!');
        }   
      }
    
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
            let updated_Data: Dish = {
                id: (document.querySelector('#idField') as HTMLInputElement).value, 
                name_dish: (document.querySelector('#nameField') as HTMLInputElement).value,
                price: (document.querySelector('#priceField') as HTMLInputElement).value,                
                img_url: (document.querySelector('#imgField') as HTMLInputElement).value,
                description: (document.querySelector('#plusField') as HTMLInputElement).value
            };
            (document.querySelector('#modifyDish') as HTMLDivElement).style.display = "none";
            this.BACKEND.updateData('menu', updated_Data);
            setTimeout(()=>{this.refreshTable()}, 100);
            
        });
        (document.querySelector('#cancelUpdate') as HTMLButtonElement).addEventListener('click', (e: Event)=>{
            e.preventDefault();          
            (document.querySelector('#modifyDish') as HTMLDivElement).style.display = "none";
        });
    }

    async refreshTable() {
        const table = document.querySelector('.table tbody') as HTMLTableElement;
        table.innerHTML = '';
        let items : Array<Dish>;
        items = await this.BACKEND.getData('menu');
        items.forEach(item =>{
            let tr = document.createElement('tr');
            tr.innerHTML =`
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
            btn.type='button';
            btn.className = 'btn btn-danger manager';
            btn.addEventListener('click',()=> {this.BACKEND.deleteData('menu', item.id); this.refreshTable();});
            td.append(btn);
            tr.append(td);
    
            td = document.createElement('td'); 
            btn = document.createElement('button');
            btn.textContent = 'Modify';
            btn.type='button';
            btn.className = 'btn btn-warning manager';
            btn.addEventListener('click',()=> {
                (document.querySelector('#modifyDish') as HTMLDivElement).style.display = "block";
                (document.querySelector('#nameField') as HTMLInputElement).value = item.name_dish;
                (document.querySelector('#priceField') as HTMLInputElement).value = item.price;                
                (document.querySelector('#imgField') as HTMLInputElement).value = String(item.img_url);
                (document.querySelector('#plusField') as HTMLInputElement).value = String(item.description);
                //hidden
                (document.querySelector('#idField') as HTMLInputElement).value = String(item.id);
            })
            td.append(btn);
            tr.append(td);

            td = document.createElement('td');
            btn = document.createElement('button');
            btn.textContent = 'Order';
            btn.type='button';
            btn.className = 'btn btn-success';
            btn.addEventListener('click',()=> {this.namePopUp(item);});
            td.append(btn);
            tr.append(td);
    
            table.append(tr);
        })
    }
    
}