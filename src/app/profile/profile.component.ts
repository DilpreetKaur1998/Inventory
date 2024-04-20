import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {animate, trigger,state, style, transition} from "@angular/animations";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [
    trigger('flipIn', [
      state('in', style({ transform: 'rotateY(0deg)' })),
      transition('void => *', [
        style({ transform: 'rotateY(90deg)' }),
        animate('0.4s ease-in')
      ]),
    ])
  ]
})
export class ProfileComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  privileges() {
    this.router.navigate(['/privileges']).then()
  }

  back() {
    this.router.navigate(['/users']).then()
  }


}
