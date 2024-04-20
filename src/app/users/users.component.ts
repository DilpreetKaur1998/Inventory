import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {NavigationExtras, Router} from "@angular/router";
import {MainService} from "../service/main/main.service";
import {ToastrService} from "ngx-toastr";
import {MatTabGroup} from "@angular/material/tabs";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  animations: [
    trigger('flipIn', [
      state('in', style({ transform: 'rotateY(0deg)' })),
      transition('void => *', [
        style({ transform: 'rotateY(90deg)' }),
        animate('0.4s ease-in')
      ]),
    ])
  ],
  styleUrls: ['./users.component.scss']
})

export class UsersComponent implements OnInit {
  userForm: FormGroup | any;
  employees: Employee[] = [];
  selectedFileName: string | any;
  showFilter: boolean = false;
  showPasswordField: boolean = true;
  userData: {} | any;
  formData: any;
  selection = new SelectionModel<PeriodicElement>(true, []);
  dataSource: MatTableDataSource<any> | any;
  displayedColumns = ['userId', 'employeeId', 'employeeName', 'department', 'privileges', 'emailId', 'createdBy', 'createdDate', 'status', 'action']; // Define columns to be displayed in the table

  pageIndex = 0;
  pageSize = 10;
  totalElements = 0;
  searchForm: FormGroup | any;

  @ViewChild('tabGroup') tabGroup: MatTabGroup | any;

  constructor(private formBuilder: FormBuilder, private router: Router, private mainService: MainService, private toaster: ToastrService) {
    this.dataSource = new MatTableDataSource<any>([]);
  }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      employeeName: ['', [Validators.required, Validators.maxLength(50)]],
      userId: ['', Validators.required],
      employeeId: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      emailId: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(16)]],
      department: ['', [Validators.required]],
      privileges: ['', [Validators.required]],
      createdBy: 'SUPER_ADMIN',
      modifiedBy: 'SUPER_ADMIN'
    });
    // this.manageForm = this.formBuilder.group({
    //   name: ['', [Validators.maxLength(50)]],
    //   empId: ['', [Validators.pattern('^[0-9]*$')]],
    //   dept: [''],
    //   emailId: ['', [Validators.email]],
    //   status: [''],
    //   userId: [''],
    //   role:[''],
    //   department:['']
    // })
    this.searchForm = this.formBuilder.group({
      role: [''],
      department: [''],
      status: [''],
      page: 1,
      sortBy: "userId",
      sortOrder: "asc"
    })

    // this.searchData ={
    //   role: this.manageForm.value.privileges,
    //   department: this.manageForm.value.department,
    //   status: this.manageForm.value.status,
    //   page: 0,
    //   size:2,
    //   sortBy: "userId",
    //   sortOrder:"asc",
    // }

  }

  // onSubmit() {
  //   if (this.userForm.valid) {
  //     const newEmployee = {
  //       name: this.userForm.value.username,
  //       id: this.userForm.value.employeeId,
  //       email: this.userForm.value.email,
  //       department: this.userForm.value.department,
  //       type: this.userForm.value.privileges
  //     };
  //
  //     this.employees.push(newEmployee);
  //     this.userForm.reset();
  //   }
  // }


  onSubmit() {
    if (this.userForm.valid) {
      const newEmployee: Employee = {
        name: this.userForm.value.employeeName,
        id: this.userForm.value.employeeId,
        email: this.userForm.value.emailId,
        department: this.userForm.value.department,
        type: this.userForm.value.privileges,
        createdBy: 'SUPER_ADMIN',
      };
      this.employees.push(newEmployee);
    }
  }


  resetForm(): void {
    this.userForm.reset();
  }

  // resetManageForm(): void {
  //   this.manageForm.reset();
  // }


  onFileSelected(event: any): void {

    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
    } else {
      this.selectedFileName = undefined;
    }
  }

  uploadImage(file: File, userId: any) {
    this.formData = new FormData();
    this.formData.append('image', file);
    this.formData.append('userId', userId);
    this.mainService.uploadPhoto(this.formData).subscribe((data) => {

    })
  }



  privileges(userId: any, name: any) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        userId: userId,
        name: name,
      }
    };

    this.router.navigate(['/privileges'], navigationExtras).then()
  }


  saveUser() {
    this.mainService.createUser(this.userForm.value).subscribe((data: any) => {
      this.toaster.success('User created successfully!', 'Success');
      const profilePicInput = document.getElementById('profilePic') as HTMLInputElement | null;
      if (profilePicInput && profilePicInput.files && profilePicInput.files.length > 0) {
        const file = profilePicInput.files[0];
        const userId = this.userForm.value.userId;
        this.uploadImage(file, userId);
      } else {
      }
      const navigationExtras: NavigationExtras = {
        queryParams: {
          userId: this.userForm.value.userId,
          name: this.userForm.value.employeeName
        }
      };
      this.router.navigate(['/privileges'], navigationExtras).then()

    }, error => {
      this.toaster.error('Error occurred while creating user!', 'Error');
    })
    // name: ['', [Validators.maxLength(50)]],
    //   empId: ['', [Validators.pattern('^[0-9]*$')]],
    //   dept: [''],
    //   emailId: ['', [Validators.email]],
    //   status: [''],
    //   userId: ['']
    this.userData = {
      "userId": this.userForm.value.userId,
      "employeeId": this.userForm.value.employeeId,
      "employeeName": this.userForm.value.employeeName,
      "department": this.userForm.value.dept,
      "privileges": this.userForm.value.privileges,
      "emailId": this.userForm.value.emailId,
      "modifiedBy": 'SUPER_ADMIN'
    }

  }

  // getAllUsersData() {
  // if(!this.manageForm.value.userId) {
  //   this.mainService.getAllUsers().subscribe((data: any[] | any) => {
  //     console.log(data);
  //     if (data !== undefined) {
  //       this.dataSource.data = data;
  //     }
  //   });
  // }
  // else{
  //   this.getSingleUserData();
  // }
  loadData() {
    this.mainService.getDataWithPagination(this.searchForm.value, this.pageIndex, this.pageSize).subscribe(
      (data: any) => {
        this.dataSource.data = data.content;
        this.totalElements = data.totalElements;
        this.pageSize = data.size;
        this.pageIndex = data.number;
      }
    );
  }

  onPageChanged(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }


  // getSingleUserData(){
  //   if (this.manageForm.value.userId != '') {
  //     this.mainService.getSingleUser(this.manageForm.value.userId).subscribe((data: any) => {
  //       console.log(data);
  //       this.dataSource.data = data ? [data] : [];
  //     })
  //   }
  // }

  deleteUser(userId: string) {
    this.mainService.deleteUser(userId).subscribe((data: any) => {
      this.toaster.success('User Deleted successfully!', 'Success');
      this.loadData();
    })
  }

  // backToCreation(userId:any) {
  // this.mainService.getSingleUser(userId).subscribe((userData:any)=>{
  //   if(userData){
  //     this.userForm.patchValue({
  //       employeeName: userData.employeeName,
  //       userId: userData.userId,
  //       employeeId: userData.employeeId,
  //       emailId: userData.emailId,
  //       department: userData.department,
  //       privileges: userData.privileges
  //     })
  //   }
  // })
  //   this.tabGroup.selectedIndex = 0;
  // }

  toggleStatus(element: any) {
    element.status = element.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this.mainService.updateStatus(element.userId, element.status).subscribe((data) => {
    })
  }

  updateUser() {
    this.mainService.updateUser(this.userForm.value).subscribe((data) => {
      this.toaster.success("User Updated Successfully!","Success")
      this.tabGroup.selectedIndex = 1;
    })
  }


  goToEditUser(userId: any) {
    const navParams: NavigationExtras = {
      queryParams: {
        userId: userId
      }
    }
    this.router.navigate(['/editUser'], navParams).then()
  }

  onSubmit1() {

  }

  resetSearch() {
    this.searchForm.reset();
  }
}

export interface Employee {
  name: string;
  id: number;
  email: string;
  department: string;
  type: string;
  createdBy: string;
}

export interface PeriodicElement {
  name: string;
  email: string;
  userType: string;
  status: string;
  teams: string;
  createdDate: string;
  createdBy: string;
  lastActive: string;
}

