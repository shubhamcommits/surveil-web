import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { AppService } from 'src/app/modules/shared/services/app.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-details',
  templateUrl: './app-details.component.html',
  styleUrls: ['./app-details.component.scss']
})
export class AppDetailsComponent implements OnInit {

  constructor(
    private _Injector: Injector,
    private _Route: ActivatedRoute
  ) { }

  // App ID
  appId = this._Route.snapshot.paramMap.get('appId')

  services: any = []

  // Is loading behaviour
  isLoading$ = new BehaviorSubject(false)

  async ngOnInit() {

    // Enable the Loading Subject
    this.isLoading$.next(true)

    // Fetch the list of the services
    this.services = await this.fetchUserServiceFunction()

    // Disable the Loading Subject
    this.isLoading$.next(false)
  }

  fetchUserServiceFunction() {
    return new Promise((resolve, reject) => {
      let appService = this._Injector.get(AppService)
      appService.fetchUserServices(this.appId)
        .then((res: any) => {
          resolve(res['services'])
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  removeServiceFunction(serviceId: any) {
    return new Promise((resolve, reject) => {
      let appService = this._Injector.get(AppService)
      appService.removeService(serviceId)
        .then((res: any) => {
          resolve(res['service'])
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  newService($event: any) {
    this.services.unshift($event)
  }

  trackByElement(index: number, element: any): number {
    return element.id
  }

  async removeService(serviceId: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will remove the entire service, all the related APIs, and scheduled Jobs!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1d4ed8',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.removeServiceFunction(serviceId)
          .then((service) => {
            Swal.fire(
              'Deleted!',
              'Your service has been removed from the system!',
              'success'
            ).then(() => {
              let index = this.services.findIndex((service: any) => service._id == serviceId)
              if (index != -1)
                this.services.splice(index, 1)
            })
          })
      }
    })
  }
}
