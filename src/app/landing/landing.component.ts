import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
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
export class LandingComponent implements OnInit {
  constructor(private router: Router) {
  }
  ngOnInit(): void {
  }

  userScreen() {
    this.router.navigate(['/users']).then();
  }

}
