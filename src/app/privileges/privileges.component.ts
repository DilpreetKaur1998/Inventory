import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {MainService} from "../service/main/main.service";
import {ToastrService} from "ngx-toastr";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-privileges',
  templateUrl: './privileges.component.html',
  styleUrls: ['./privileges.component.scss'],
  animations: [
    trigger('flipIn', [
      state('in', style({transform: 'rotateX(0deg)'})),
      transition('void => *', [
        style({transform: 'rotateX(90deg)'}),
        animate('0.4s ease-in')
      ]),
    ])
  ],
})
export class PrivilegesComponent implements OnInit{
  employeeName = '';
  formGroup: FormGroup | any;
  userId: any;
  name: any;
  getPrivilegesId: any;


  permissions = [
    {name: 'Inventory Creation', inventoryRead: true, inventoryWrite: true},
  ];
  stocks = [
    {name: 'Stock Entry', stockRead: true, stockWrite: true},
  ];
  issues = [
    {name: 'Material Issue', issueRead: true, issueWrite: true},
  ];
  returns = [
    {name: 'Material Return', returnRead: true, returnWrite: true},
  ];
  bomEntry = [
    {name: 'BOM Entry', bomRead: true, bomWrite: true},
  ];

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private service: MainService, private toaster: ToastrService, private router: Router) {


  }

  saveData() {
    this.formGroup = this.formBuilder.group({
      userId: this.userId,
      inventoryRead: [false],
      inventoryWrite: [false],
      stockRead: [false],
      stockWrite: [false],
      issueRead: [false], issueWrite: [false],
      returnRead: [false], returnWrite: [false],
      bomRead: [false], bomWrite: [false]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'];
      this.name = params['name'];
    });

    this.saveData();

    this.service.getPrivileges(this.userId).subscribe((data: any) => {
      this.getPrivilegesId = data.userId;
      this.formGroup.patchValue({
        inventoryRead: data.inventoryRead,
        inventoryWrite: data.inventoryWrite,
        stockRead: data.stockRead,
        stockWrite: data.stockWrite,
        issueRead: data.issueRead, issueWrite: data.issueWrite,
        returnRead: data.returnRead, returnWrite: data.returnWrite,
        bomRead: data.bomRead, bomWrite: data.bomRead
      })
    })
  }

  // savePermissions() {
  //   console.log(this.formGroup.value);
  //   this.service.savePrivileges(this.formGroup.value).subscribe((data:any)=>{
  //     console.log("Privileges saved", data)
  //   })
  // }

  savePermissions() {
    const formData = this.formGroup.value;
    if (this.getPrivilegesId) {
      this.service.updatePrivileges(formData.id, formData).subscribe((data: any) => {
        this.toaster.success("Privileges Updated Successfully", "Success");
        this.router.navigateByUrl('/users').then();
      }, error => {
        this.toaster.error("Error occurred while Updating Privileges", "Error");
      });
    } else {
      this.service.savePrivileges(formData).subscribe((data: any) => {
        this.toaster.success("Privileges Saved Successfully", "Success");
        this.router.navigate(['/users']).then()
      }, error => {
        this.toaster.error("Error Occurred while saving Privileges", "Error");
      });
    }
  }


  resetForm() {
    this.formGroup = this.formBuilder.group({
      userId: this.userId,
      inventoryRead: [false],
      inventoryWrite: [false],
      stockRead: [false],
      stockWrite: [false],
      issueRead: [false], issueWrite: [false],
      returnRead: [false], returnWrite: [false],
      bomRead: [false], bomWrite: [false]
    });
  }

  back() {
    this.router.navigate(['/users']).then();
  }
}
