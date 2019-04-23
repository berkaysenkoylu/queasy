import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthenticationService } from '../authentication.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    
    constructor(private authenticationService: AuthenticationService) {}

    ngOnInit() {
        
    }

    onSubmit(form: NgForm) {
        this.authenticationService.login(form.value.email, form.value.password);
    }
}