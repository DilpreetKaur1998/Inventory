import {Component, OnInit} from '@angular/core';
import {PermissionsService} from "./service/menu/permissions.service";
import {AuthenticationService} from "./service/auth/authentication.service";
import {NavigationEnd, Router} from "@angular/router";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('flipIn', [
      state('in', style({transform: 'rotateY(0deg)'})),
      transition('void => *', [
        style({transform: 'rotateY(90deg)'}),
        animate('0.4s ease-in')
      ]),
    ])
  ],
})
export class AppComponent implements OnInit {
  title = 'UI';
  visibleModules: string[] = [];
  roleInfo: any;
  isLoginRoute: boolean = true;


  constructor(private permissionService: PermissionsService, private authService: AuthenticationService, private router: Router) {


  }

  ngOnInit(): void {
    this.updateVisibleModules();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isLoginRoute = event.url.includes('login');
      }
    });

  }


  updateVisibleModules(): void {
    const role = this.authService.userRole;
    this.roleInfo = this.authService.userRole;
    this.visibleModules = this.permissionService.permissions[role] || [];
  }

  getRouterLink(module: string): string {
    switch (module) {
      case 'User Management':
        return '/users';
      case 'purchase':
        return '/purchase';
      case 'store':
        return '/store';
      case 'Material Issue':
        return '/material-issue';
      default:
        return '/';
    }
  }


  checkPermission(moduleName: string): boolean {
    const userRole = this.authService.userRole;
    const allowedModules = this.permissionService.permissions[userRole];
    return allowedModules && allowedModules.includes(moduleName);
  }


  personalData() {
    this.router.navigate(['/profile']).then();
  }
}
