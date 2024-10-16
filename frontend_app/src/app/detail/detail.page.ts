import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  employeeId: number = 0;

  constructor(private router: Router) { }

  ngOnInit() {
    if (this.router.getCurrentNavigation()?.extras?.state?.['employee_id']) {
      this.employeeId = this.router.getCurrentNavigation()?.extras.state?.['employee_id'];
    }
    console.log(this.employeeId);
  }

}
