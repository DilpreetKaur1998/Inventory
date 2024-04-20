import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userRole: 'superadmin' | 'admin' | 'user' = 'superadmin' ;

  constructor() { }
  permissions = {
    superadmin: ['User Management', 'Store', 'Purchase','Material Issue'],
    admin: ['Store', 'Purchase'],
    user: ['Store', 'Purchase', 'Material Issue']
  };
}
