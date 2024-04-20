import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  constructor() { }

  permissions = {
    superadmin: ['User Management', 'Store', 'Purchase','Material Issue'],
    admin: ['Store', 'Purchase'],
    user: ['Store', 'Purchase', 'Material Issue']
  };

}
