import {Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {CalendarEvent, CalendarEventTimesChangedEvent, CalendarView, CalendarWeekViewBeforeRenderEvent} from 'angular-calendar';
import {Subject, Subscription} from 'rxjs';
import {isSameDay, isSameMonth} from 'date-fns';
import {AddEditDialogComponent} from '../../dialogs/addEditDialog/addEditDialog.component';
import {LocalAppointments} from '../../../models/Appointemts/LocalAppointments';
import {MatDialog} from '@angular/material/dialog';
import {AppointmentsServices} from '../../../services/Appointments/appointments-services';
import {LocalAppointmentsBuilder} from '../../../models/Appointemts/LocalAppointmentsBuilder';
import {AppointmentWrapper} from '../../../models/Appointemts/AppointmentWrapper';
import {Variables} from '../../../utility/variables';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css'],
})
export class AppointmentsComponent implements OnInit, OnDestroy {

  @ViewChild('modalContent', {static: true}) modalContent: TemplateRef<any>;

  @ViewChild('shoeDate') showDate: ElementRef;
  isFabHidden = false;

  view: CalendarView = CalendarView.Week;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];

  activeDayIsOpen = true;
  doctorName: string;

  private currentSelectedDoctorSeq = 0;
  private subscription: Subscription = new Subscription();

  constructor(private dialog: MatDialog,
              private calenderEventService: AppointmentsServices) {
  }

  ngOnInit(): void {
    // this.subscription.add(this.calenderEventService.getAllAppointments().subscribe(
    //   result => {
    //     this.events = AppointmentWrapper.toLocalAppointmentBatch(result);
    //   },
    //   error => {
    //     console.error(error + 'On appointment getAllEvents ngOnInit');
    //   }
    // ));
  }

  dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.activeDayIsOpen = !((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0);
      this.viewDate = date;
    }
  }

  // called when items are Dropped or resized (do update)
  eventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.updateEvent(event as LocalAppointments);
  }

  // called when items are clicked
  handleEvent(action: string, event: CalendarEvent): void {
    const dialogRef = this.openDialogWith(event);

    this.subscription.add(dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed handle event');
      console.table(result);
      if (result.action === 'D') {
        this.deleteEvent(result);
      } else if (result.action === 'U') {
        this.updateEvent(result);
      }
    }));

  }

  deleteEvent(eventToDelete: LocalAppointments) {
    this.subscription.add(this.calenderEventService.deleteAppointment(eventToDelete).subscribe(
      result => {
        if (result !== 0) {
          this.events = this.events.filter(event => event !== eventToDelete);
        }
      },
      error => {
        console.error(error);
      }
    ));

  }

  updateEvent(eventToUpdate: LocalAppointments) {
    this.subscription.add(this.calenderEventService.updateAppointment(eventToUpdate).subscribe(
      result => {
        if (result === 0) {
          return;
        }
        this.events = this.events.map(iEvent => {
          if (iEvent === eventToUpdate) {
            return {
              ...eventToUpdate
            };
          }
          return iEvent;
        });
      },
      error => {
        console.error(error);
      }
    ));
  }

  addEvent(newEvent: LocalAppointments): void {
    console.table(newEvent);
    this.subscription.add(this.calenderEventService.addNewAppointment(newEvent).subscribe(
      result => {
        this.events = [
          ...this.events,
          AppointmentWrapper.toLocalAppointment(result)
        ];
      },
      error => {
        console.log(error);
      }
    ));
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  openDialogWith(appointment: CalendarEvent) {
    return this.dialog.open(AddEditDialogComponent, {
      width: Variables.dialogBigWidth,
      data: appointment
    });
  }

  openAddDialog(date?: Date) {
    const emptyAppointment = new LocalAppointments();
    emptyAppointment.start = date || (new Date());
    emptyAppointment.servedBy = this.currentSelectedDoctorSeq === 0 ? null : this.currentSelectedDoctorSeq;
    const dialogRef = this.openDialogWith(emptyAppointment);

    this.subscription.add(dialogRef.afterClosed().subscribe((result: LocalAppointments) => {
      if (result !== undefined && result.patientId) {
        const newEvent = new LocalAppointmentsBuilder(0, result.patientId, result.appointmentTypeId,
          result.appointmentStatusId, result.start, result.end, result.isServed, result.servedBy).build();
        this.addEvent(newEvent);
      }
    }));
  }

  updateWithDoctor(seq: number) {
    if (this.currentSelectedDoctorSeq === seq) {
      return;
    }
    this.currentSelectedDoctorSeq = seq;
    this.showDoctorsAppointment(seq);
  }

  private showDoctorsAppointment(seq: number) {
    this.subscription.add(this.calenderEventService.getAppointmentByDoctor(seq).subscribe(
      result => {
        this.events = AppointmentWrapper.toLocalAppointmentBatch(result);
      }, error => {
        console.error(error);
      }
    ));
  }

  beforeWeekViewRender(renderEvent: CalendarWeekViewBeforeRenderEvent) {
    renderEvent.hourColumns.forEach(hourColumn => {
      hourColumn.hours.forEach(hour => {
        hour.segments.forEach(segment => {
          if (
            segment.date.getHours() >= 2 &&
            segment.date.getHours() <= 5 &&
            segment.date.getDay() === 5
          ) {
            segment.cssClass = 'bg-pink';
          }
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  resizeShowDate() {
    this.showDate.nativeElement.style = 'height:0';
    this.isFabHidden = true;
  }
}