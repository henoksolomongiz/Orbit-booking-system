import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';
import {NgxSpinnerService} from 'ngx-spinner';
import {DoctorsFormManager} from '../../../../utility/doctorsFormManager';
import {SnackBarManager} from '../../../../utility/snackBarManager';
import {Variables} from '../../../../utility/variables';
import {DoctorsService} from '../../../../services/Doctors/doctors.service';

@Component({
  selector: 'app-adddoctor',
  templateUrl: './adddoctor.component.html',
  styleUrls: ['../../reception/add-reception/add-reception.component.css'] // reuse
})
export class AdddoctorComponent implements OnInit, OnDestroy {

  hidePassword = true;
  @ViewChild('stepper') stepper: ElementRef;

  doctorsFormManager: DoctorsFormManager;

  private snackBarMan: SnackBarManager;

  private subscription: Subscription = new Subscription();

  status = Variables.status;

  constructor(private formBuilder: FormBuilder,
              private snackBar: MatSnackBar,
              private spinner: NgxSpinnerService,
              private doctorService: DoctorsService) {
  }

  ngOnInit(): void {
    this.doctorsFormManager = new DoctorsFormManager(this.formBuilder);
    this.snackBarMan = new SnackBarManager(this.snackBar);
  }

  submit() {
    this.spinner.show();

    const newDoctor = this.doctorsFormManager.bindDataToNewDoctor();

    this.subscription.add(this.doctorService.saveDoctor(newDoctor).subscribe(
      result => {
        this.snackBarMan.show('New Doctor added', 'Ok');
      },
      error => {
        console.error(error);
      },
      () => {
        this.spinner.hide();
      }
    ));

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


}