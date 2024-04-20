import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MainService} from "../service/main/main.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
  animations: [
    trigger('flipIn', [
      state('in', style({ transform: 'rotateX(0deg)' })),
      transition('void => *', [
        style({ transform: 'rotateX(90deg)' }),
        animate('0.4s ease-in')
      ]),
    ])
  ],
})
export class EditUserComponent implements OnInit{
  editUserForm: FormGroup | any;
  userId: any;
  userImage: any;
  re_file: File | any;

  constructor(private router: Router, private mainService: MainService, private route: ActivatedRoute, private formBuilder: FormBuilder, private toaster: ToastrService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      this.userId = params['userId'];
    })
    this.mainService.getSingleUser(this.userId).subscribe((data: any) => {
      // console.log("data=", data);
      if (data) {
        this.editUserForm.patchValue({
          employeeId: data.employeeId,
          employeeName: data.employeeName,
          department: data.department,
          privileges: data.privileges,
          emailId: data.emailId
        })
      }
    })
    this.editUserForm = this.formBuilder.group({
      userId: this.userId,
      employeeId: [''],
      employeeName: [''],
      privileges: [''],
      emailId: [''],
      department: ['']
    })

    this.mainService.getImage(this.userId).subscribe(
      (blobData: Blob) => {
        // console.log("Image fetched successfully:", blobData);
        this.convertBlobToImage(blobData); // Convert Blob to image URL
      },
    );

  }

  convertBlobToImage(blob: Blob) {
    const reader = new FileReader();
    reader.onloadend = () => {
      this.userImage = reader.result;
    };
    reader.readAsDataURL(blob);
  }

  privilege() {
    this.router.navigate(['/privileges']).then()
  }

  resetForm() {
    this.editUserForm.reset();
  }

  onSubmit() {
    this.mainService.updateUser(this.editUserForm.value).subscribe((data: any) => {
      const formData = new FormData();
      formData.append('image', this.re_file);
      formData.append('userId', this.userId);
      this.mainService.uploadPhoto(formData).subscribe((data) => {
        // console.log(data);
        // console.log("formData" + formData);
      })
      this.toaster.success("User Updated Successfully!","Success");
    },error => {
      this.toaster.error("Error Occurred while Updated Details!", "Error");
    })
  }
  openFileExplorer() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: any) {
    this.re_file = event.target.files[0];
    if (this.re_file) {
      const reader = new FileReader();
      reader.readAsDataURL(this.re_file);
      reader.onload = () => {
        this.userImage = reader.result;
      };
    }
  }

  userScreen() {
    this.router.navigate(['/users']).then();
  }
}
