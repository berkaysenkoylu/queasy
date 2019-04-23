import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { User } from './user.model';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + "/users/"

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    private token: string;
    private isAuthenticated: boolean;
    private userId: string;
    private tokenTimer: any;
    private authenticationStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router) {}

    getUserId() {
        return this.userId;
    }

    getToken() {
        return this.token;
    }

    getIsAuthenticated() {
        return this.isAuthenticated;
    }

    getAuthenticationStatusListener() {
        return this.authenticationStatusListener.asObservable();
    }

    createUser(inputUsername: string, inputEmail: string, inputPassword: string) {
        const newUser: User = {
            id: null,
            username: inputUsername,
            email: inputEmail,
            password: inputPassword
        };

        this.http.post<{ message: string, result: {} }>(BACKEND_URL + "signup", newUser).subscribe(responseData => {
            this.router.navigate(['/']);
        }, error => {
            console.log(error);
        });
    }

    login(inputEmail: string, inputPassword: string) {
        const allegedUser: User = {
            id: null, 
            username: null, 
            email: inputEmail, 
            password: inputPassword 
        };

        this.http.post<{ token: string, expiresIn: string, userId: string }>(BACKEND_URL + "login", allegedUser).subscribe(responseData => {
            // Get the token from the backend
            this.token = responseData.token;
            
            // Check if we successfully get the token
            if(this.token){
                // Get the expiration time
                const expirationTime = +responseData.expiresIn;

                // Set the timer for authentication
                this.setAuthenticationTimer(expirationTime);

                // Set the authenticated flag to true
                this.isAuthenticated = true;

                // Get the user id
                this.userId = responseData.userId;

                // Pass the authentication flag to the subject so that listeners of this can have the necessary information
                this.authenticationStatusListener.next(this.isAuthenticated);

                // Setup the authentication duration, and save auth data to local storage
                const now = new Date();
                const expirationDate = new Date(now.getTime() + expirationTime * 1000);
                this.saveAuthData(this.token, this.userId, expirationDate);

                // Navigate to the front page
                this.router.navigate(['/']);
            }
        }, error => {
            this.isAuthenticated = false;
            this.authenticationStatusListener.next(false);
        });
    }

    getUserName() {
        return this.http.get<{ message: string, username: string }>(BACKEND_URL + this.userId);
    }

    logout() {
        this.isAuthenticated = false;
        this.authenticationStatusListener.next(this.isAuthenticated);
        this.token = null;
        this.userId = null;
        this.clearAuthData();
        clearTimeout(this.tokenTimer);
        this.router.navigate(['/']);
    }

    private setAuthenticationTimer(duration: number) {
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    private saveAuthData(token: string, userId: string, expirationDate: Date) {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('expiration', expirationDate.toISOString());
    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('expiration');
    }

    private getAuthenticationData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const id = localStorage.getItem('userId');
        if (!token || !expirationDate || !id) {
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate),
            id: id
        }
    }

    autoAuthenticateUser() {
        const authenticationInformation = this.getAuthenticationData();

        if (!authenticationInformation) {
            return;
        }

        const now = new Date();
        const expiresIn = authenticationInformation.expirationDate.getTime() - now.getTime();
        
        if(expiresIn > 0) {
            this.token = authenticationInformation.token;
            this.userId = authenticationInformation.id;
            this.setAuthenticationTimer(expiresIn / 1000);
            this.isAuthenticated = true;
            this.authenticationStatusListener.next(this.isAuthenticated);
        }
    }
}