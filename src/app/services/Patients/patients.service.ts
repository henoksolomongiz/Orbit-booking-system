import {Injectable} from '@angular/core';
import {Patient} from '../../models/Patient';
import {Observable} from 'rxjs';
import {Contact} from '../../models/Contact';
import {Address} from '../../models/Address';
import {EmergencyInfo} from '../../models/EmergencyInfo';
import {HttpClient} from '@angular/common/http';
import {GeneralTitle} from '../../models/GeneralTitle';
import {shareReplay} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PatientsService {

  private patientTitle$: Observable<GeneralTitle[]>;
  private emergencyTitle$: Observable<GeneralTitle[]>;


  constructor(private http: HttpClient) {
  }


  getAllPatients() {
    const url = 'http://localhost:5000/patient/';
    return this.http.get<Patient[]>(url);
  }


  getContactInfo(contactInfoId: string) {
    const url = 'http://localhost:5000/patient/contactInfo/' + contactInfoId;
    return this.http.get<Contact>(url);
  }


  getAddress(addressId: string) {
    const url = 'http://localhost:5000/patient/address/' + addressId;
    return this.http.get<Address>(url);
  }


  getEmergencyInfo(emergencyInfoId: string) {
    const url = 'http://localhost:5000/patient/emergencyInfo/' + emergencyInfoId;
    return this.http.get<EmergencyInfo>(url);
  }

  getPatientTitle() {
    const url = 'http://localhost:5000/patient/titles';

    if (!this.patientTitle$) {
      this.patientTitle$ = this.http.get<GeneralTitle[]>(url).pipe(
        shareReplay(1)
      );
    }

    return this.patientTitle$;
  }

  getEmergencyTitle() {
    const url = 'http://localhost:5000/patient/emergencyTitle';

    if (!this.emergencyTitle$) {
      this.emergencyTitle$ = this.http.get<GeneralTitle[]>(url).pipe(
        shareReplay(1)
      );
    }

    return this.emergencyTitle$;
  }

  savePatient(patient: Patient) {
    const url = 'http://localhost:5000/patient/';
    return this.http.post<Patient>(url, patient);
  }

  getPatientByIdFull(id: number) {
    const url = 'http://localhost:5000/patient/byIdFull/' + id;
    return this.http.get<Patient>(url);
  }

  deletePatientById(patient: Patient) {
    const url = `http://localhost:5000/patient/${patient.seq}/${patient.addressId}/${patient.contactId}/${patient.emergencyInfoId}`;
    return this.http.delete<number>(url);
  }

  updatePatient(patient: Patient) {
    const url = 'http://localhost:5000/patient/' + patient.seq;
    return this.http.put<number>(url, patient);
  }
}
