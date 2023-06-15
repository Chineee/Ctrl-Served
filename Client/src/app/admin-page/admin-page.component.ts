import {Component, OnInit} from '@angular/core';
import User from "../models/User";
import {UserHttpService} from "../Services/user-http.service";
import {Router} from "@angular/router";
import {SocketioService} from "../Services/socketio.service";

enum Role {
  WAITERS = 'Waiter',
  COOKS = 'Cook',
  BARTENDERS = 'Bartender',
  CASHIERS = 'Cashier',
  ALL = 'All'
}

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {

  protected users : User[] = [];
  protected filter : Role = Role.ALL;
  protected Role = Role;
  protected popup : {name?: string, surname?: string, role?: string, id?:string, confirm?: boolean} = {}
  protected alert : {error ?: boolean, message ?: string} = {}
  protected popupModify : {name ?: string, surname ?: string, email ?: string, role ?: string, password ?: string, id?: string} = {}

  constructor(protected us : UserHttpService, protected router : Router, protected so : SocketioService) {}


  ngOnInit() {
    this.loadUsers();
    this.so.connect().subscribe({
      next: (data) => this.loadUsers()
    })
  }

  setModifyPopup(user : User) {
    this.popupModify = {name: user.name, surname: user.surname, email: user.email, role: user.role, id:user._id}
  }

  showUsers(){
    if (this.filter === Role.ALL) return this.users;
    return this.users.filter( (user) => user.role === this.filter);
  }

  loadUsers() {
    this.us.getUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => {
        this.logout()
      }
    })
  }


  closePopup(){
    this.popup = {}
  }

  setConfirm() {
    const confirm = {...this.popup};
    confirm.confirm = true;
    this.popup = confirm;

  }

  modifyUser(userObj : any){
    const input = {
      new_name: userObj.name,
      new_surname: userObj.surname,
      new_email: userObj.email,
      new_role: userObj.role,
      new_password: userObj.password
    }
    this.us.modifyUser(input, userObj.id).subscribe({
      next: (data) => {
        this.alert = {error: false, message:"User modified correctly"}
        this.loadUsers()
      },
      error: (err) => {
        this.alert = {error: true, message: err.message}
      }
    })
  }

  impersonateUser(role: Role) {
    // console.log(role as string)
    // this.us.setAdminRole(role)
    const mapper = {Cook:"/makers", Bartender:"/makers", Waiter:"/waiters", Cashier:"/cashiers", All:"/admins"}
    this.so.disconnect();
    this.router.navigate([mapper[role]])
  }

  logout() {
    this.so.disconnect();
    this.us.logout();
    this.router.navigate(['/login'])
  }

  deleteUser(id?: string){
    // this.alert = {error: true, message: "User deleted succesfully"}
    // console.log(id);
    this.us.deleteUser(id as string).subscribe({
      next:(data) => {
        this.loadUsers();
        this.alert = {error: false, message: "User deleted succesfully"}
      },
      error: (err) => this.alert = {error: true, message: err.message}
    })
  }

  closeAlert() {
    this.alert = {}
  }

  showPopup(user : User) {
    this.popup = {name: user.name, surname: user.surname, role: user.role, id: user._id, confirm: false}
  }
}
