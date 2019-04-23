import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthenticationService } from '../authentication.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

    constructor(private authenticationService: AuthenticationService) {}

    ngOnInit() {
        
    }

    onSubmit(form: NgForm) {
        this.authenticationService.createUser(form.value.username, form.value.email, form.value.password);
    }
}