import Backend from "./backend.js";

export default class Home{
    constructor(){
       let BACKEND = new Backend;
       BACKEND.checkLogin();
    }
};