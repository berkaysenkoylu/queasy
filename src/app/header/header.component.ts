import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subscription } from 'rxjs';

import { AuthenticationService } from '../authentication/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('fadeIn', [
        state('notVisible', style({
            'visibility': 'hidden',
            'opacity': 0
        })),
        state('visible', style({
            'visibility': 'visible',
            'opacity': 1
        })),
        transition('notVisible => visible', animate(500)),
        transition('visible => notVisible', animate(500))
    ])
]
})
export class HeaderComponent implements OnInit, OnDestroy {

  isUserAuthenticated: boolean = false;
  welcomeState: string = 'notVisible';
  timeOut: any;
  private authListenerSubscription: Subscription;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.isUserAuthenticated = this.authenticationService.getIsAuthenticated();
    this.authListenerSubscription = this.authenticationService.getAuthenticationStatusListener().subscribe(authStatus => {
      this.isUserAuthenticated = authStatus;
      if (this.isUserAuthenticated) {
        this.welcomeState = 'visible';

        this.timeOut = setTimeout(() => {
          this.welcomeState = 'notVisible';
        }, 3000);

      } else {
        this.welcomeState = 'notVisible';
      }
    });
  }

  ngOnDestroy() {
    this.authListenerSubscription.unsubscribe();
    clearTimeout(this.timeOut);
  }

  onLogout() {
    this.authenticationService.logout();
  }
}
