import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AppService } from 'src/app/modules/shared/services/app.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { ApiAdvancedDetailsComponent } from './api-advanced-details/api-advanced-details.component';

@Component({
  selector: 'app-api-details',
  templateUrl: './api-details.component.html',
  styleUrls: ['./api-details.component.scss']
})
export class ApiDetailsComponent implements OnInit {

  constructor(
    private _Route: ActivatedRoute,
    private _Injector: Injector,
    private _Router: Router,
    public _Dialog: MatDialog
  ) { }

  // API Data
  api: any

  // App ID
  appId = this._Route.snapshot.paramMap.get('appId')
  serviceId = this._Route.snapshot.paramMap.get('serviceId')
  // // Redirect URL
  // redirectURL: any

  // API ID
  apiId = this._Route.snapshot.paramMap.get('apiId')

  // Is loading behaviour
  isLoading$ = new BehaviorSubject(false)

  // Columns
  columns: any = []

  // Chart Data - Multidimensional Array
  chartData: any = [[]]

  // Chart Labels
  chartLabels: any = []

  // Chart Legends
  chartLegends: any = []
  @Output('remove') removeAppEmitter = new EventEmitter<any>()

  async ngOnInit() {

    // Start the Loader
    this.isLoading$.next(true)

    this.api = await this.getApiFunction(this.apiId)

    if (this.api.response.length > 0) {
      this.columns = Object.keys(this.api.response[0])
      this.api.response.forEach((response: any, index: any) => {
        this.chartData[0].push(response.status)
        this.chartLabels.push(index)
      })

      // Append the legends
      this.chartLegends = ['Status Code']
    }

    // Stop the Loader
    this.isLoading$.next(false)

  }

  getApiFunction(apiId: any) {
    return new Promise((resolve, reject) => {
      let appService = this._Injector.get(AppService)
      appService.getApi(apiId)
        .then((res: any) => {
          resolve(res['api'])
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  changeApiStatusServiceFunction(status: any, interval: any) {
    return new Promise((resolve, reject) => {
      let appService = this._Injector.get(AppService)
      appService.changeApiStatus(this.api._id, { active: status, interval: interval })
        .then((res: any) => {
          resolve(res['api'])
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  async changeApiStatus($event: any) {
    let status = $event.checked
    await this.changeApiStatusServiceFunction(status, this.api.time_interval)
  }

  removeApiFunction(appId: any) {
    return new Promise((resolve, reject) => {
      let api = this._Injector.get(AppService)
      api.removeApi(appId)
        .then((res: any) => {
          resolve(res['api'])
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  /**
   * This function opens the API Advanced Details Data
   * @param event 
   */
  openApiAdvancedDetailDialog(event: any) {
    const dialogRef = this._Dialog.open(ApiAdvancedDetailsComponent, {
      maxWidth: '100%',
      maxHeight: '100%',
      width: '80%',
      height: '80%',
      autoFocus: true,
      hasBackdrop: true,
      disableClose: true,
      closeOnNavigation: true,
      data: event || '',
      panelClass: 'modal-class'
    });

    dialogRef.afterClosed().subscribe(
      data => {
        console.log('API Detail Data', data)
      }
    )
  }

  async removeApp(appId: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will remove the api and all the related information about api",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1d4ed8',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.removeApiFunction(appId)
          .then((api) => {
            console.log(api);
            Swal.fire(
              'Deleted!',
              'Your api has been removed from the system!',
              'success'
            ).then(() => {
              this.removeAppEmitter.emit(api)

              this._Router.navigate(['/health-check', 'apps', this.appId, 'services', this.serviceId])
            })
          })
      }
    })
  }
}
