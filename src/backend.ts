export default class Backend{
    
    /* Backend functions */

    // POST 
    async postData(resource: string, data : any){
        const response = await fetch('http://localhost:3000/'+resource,{
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }

    // GET
    async getData(resource: string) {
        const response = await fetch('http://localhost:3000/'+resource);
        return response.json();
    }
    
    async getDataById(resource: string, id?:string) {
        const response = await fetch(`http://localhost:3000/${resource}/`+id);
        return response.json();
    }

    // DELETE 
    async deleteData(resource: string, id?:string) {
        // console.log(id);
        await fetch(`http://localhost:3000/${resource}/`+id,{
            method: "DELETE"
        });
    }

    // PUT (update)
    async updateData(resource: string, data: any) {
        console.log(data);
        
        await fetch(`http://localhost:3000/${resource}/`+data.id,{
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
    }

    checkLogin(){
        if (localStorage.getItem('UserName') == undefined) {
            window.localStorage.setItem('UserName', '');                     
        }
        let logout = (document.querySelector('#logout') as HTMLButtonElement);
        logout.innerText =  `LogOut: ${localStorage.getItem('UserName')}`;
        let login = (document.querySelector('#login') as HTMLButtonElement);
        if (localStorage.getItem('LoggedIn') == undefined || localStorage.getItem('LoggedIn') == "false") {
            logout.style.display = 'none';
            login.style.display = 'block';
        }else{
            logout.style.display = 'block';
            login.style.display = 'none';
        }
    }
}

