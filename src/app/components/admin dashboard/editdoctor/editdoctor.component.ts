import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DoctorsService} from '../../../services/Doctors/doctors.service';
import {switchMap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {Doctor} from '../../../models/Doctor';
import {DoctorsFormManager} from '../../../utility/doctorsFormManager';
import {SnackBarManager} from '../../../utility/snackBarManager';
import {Subscription} from 'rxjs';
import {NgxSpinnerService} from 'ngx-spinner';
import {Variables} from '../../../utility/variables';

@Component({
  selector: 'app-editdoctor',
  templateUrl: './editdoctor.component.html',
  styleUrls: ['../addpatient/addpatient.component.css']
})
export class EditdoctorComponent implements OnInit, OnDestroy {

  hidePassword = true;
  doctor: Doctor;

  primaryInfo: FormGroup;
  private snackBarMan: SnackBarManager;

  private subscription: Subscription = new Subscription();

  status = Variables.status;

  constructor(private formBuilder: FormBuilder,
              private snackBar: MatSnackBar,
              private activatedRoute: ActivatedRoute,
              private spinner: NgxSpinnerService,
              private doctorService: DoctorsService) {
    const commonFormBuilder = new DoctorsFormManager(this.formBuilder);
    this.primaryInfo = commonFormBuilder.getFormBuilders();
    this.snackBarMan = new SnackBarManager(this.snackBar);
  }

  ngOnInit(): void {

    this.subscription.add(this.activatedRoute.paramMap.pipe(
      switchMap(params => this.doctorService.getDoctorById(Number(params.get('doctorId'))))
    ).subscribe(result => {
      this.doctor = result;
      this.updateForm(result);
    }, error => {
      console.error(error);
    }));
  }

  private updateForm(doctor: Doctor) {
    this.primaryInfo.get('password').setValue(doctor.password);
    this.primaryInfo.get('status').setValue(doctor.status);
    this.primaryInfo.get('displayOrder').setValue(doctor.displayOrder);
    this.primaryInfo.get('username').setValue(doctor.username);
    this.primaryInfo.get('email').setValue(doctor.email);
  }

  submit() {
    this.spinner.show();
    const updatedDoctor = DoctorsFormManager.bindDataToNewDoctor(this.doctor.id, this.primaryInfo);

    this.subscription.add(this.doctorService.updateDoctor(updatedDoctor).subscribe(
      result => {
        console.log(result);
        this.spinner.hide();
        if (result > 0) {
          this.snackBarMan.show('Doctor updated successfully', 'Ok');
        }
      }, error => {
        this.spinner.hide();
        console.error(error);
      }
    ));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
