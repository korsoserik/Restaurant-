import Backend from "./backend.js";
export default class Login {
    constructor() {
        this.BACKEND = new Backend();
        this.Button_login = document.querySelector('.login');
        this.login = async (e) => {
            e.preventDefault();
            this.Button_login.disabled = true;
            let admins = await this.BACKEND.getData('admins');
            let _name = document.querySelector('#nameField').value;
            let _password = document.querySelector('#passField').value;
            admins.forEach(admin => {
                if (admin.name == _name && admin.password == _password) {
                    window.localStorage.setItem('LoggedIn', 'true');
                    window.localStorage.setItem('UserName', _name);
                    document.querySelector('#shortcut').click();
                }
            });
            this.Button_login.disabled = false;
        };
        this.Button_login.addEventListener('click', this.login);
        this.BACKEND.checkLogin();
    }
}
