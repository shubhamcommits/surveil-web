import { Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AppService } from 'src/app/modules/shared/services/app.service';
import { ApiDetailsComponent } from '../api-details/api-details.component';

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.scss']
})
export class ServiceDetailsComponent implements OnInit {

  constructor(
    private _Injector: Injector,
    private _Route: ActivatedRoute,
    private _Router: Router,
    public _Dialog: MatDialog
  ) { }

  // App ID
  appId = this._Route.snapshot.paramMap.get('appId')
  serviceId = this._Route.snapshot.paramMap.get('serviceId')

  // Columns
  columns = ['name', 'method', 'end_point', 'time_interval', 'view', 'last_status', 'delete']

  // Service Details
  service: any

  // Data 
  data: any = []

  // Failed APIs Count - Cummulative
  failed_api_count = 0

  // Success Rate
  success_rate = 0

  // Healthy APIs Count
  healthy_apis = 0

  // Unhealthy APIs Count
  unhealthy_apis = 0

  // Chart Data - Multidimensional Array
  chartData: any = [[]]

  // Chart Labels
  chartLabels: any = []

  // Chart Legends
  chartLegends: any = []

  // Boolean variable to check the status of service name
  isServiceNameEditable = false

  // Boolean variable to check the status of service threshold
  isServiceThresholdEditable = false

  // Is loading behaviour
  isLoading$ = new BehaviorSubject(false)

  async ngOnInit() {

    // Start the Loader
    this.isLoading$.next(true)

    this.service = await this.fetchServiceDetailFunction()
    this.data = await this.fetchServiceApiFunction()

    // Compute Failed APIs Count
    this.data.forEach((api: any, index: any) => {

      // Append Last Status to Chart Data: X-Axis
      // this.chartData[0].push(api.last_status)

      // append Last Status to Chart Data: Y-Axis
      // this.chartLabels.push(index)

      // Compute Failed API Count
      this.failed_api_count = this.failed_api_count + api.failed_count
      if (api.last_status == 'healthy')
        this.healthy_apis = this.healthy_apis + 1
      else
        this.unhealthy_apis = this.unhealthy_apis + 1
    })

    // this.chartData = [this.healthy_apis, this.healthy_apis]

    // Append the legends
    // this.chartLegends = ['Status Code']

    // Calculate the success rate
    this.success_rate = (this.healthy_apis / this.data.length) * 100

    // This function updates the whole service status
    await this.updateServiceHealthStatus()

    // Stop the Loader
    this.isLoading$.next(false)

    // console.log(this.data, this.service)
  }

  fetchServiceApiFunction() {
    return new Promise((resolve, reject) => {
      let appService = this._Injector.get(AppService)
      appService.fetchServiceApis(this.appId, this.serviceId)
        .then((res: any) => {
          resolve(res['apis'])
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  fetchServiceDetailFunction() {
    return new Promise((resolve, reject) => {
      let appService = this._Injector.get(AppService)
      appService.getService(this.serviceId)
        .then((res: any) => {
          resolve(res['service'])
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  updateServiceFunction(serviceData: any) {
    return new Promise((resolve, reject) => {
      let appService = this._Injector.get(AppService)
      appService.updateService(this.serviceId, serviceData)
        .then((res: any) => {
          resolve(res['service'])
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  newApi($event: any) {
    this.data.unshift($event)
  }

  /**
   * This function opens the API Details Data
   * @param event 
   */
  openApiDetailDialog(event: any) {
    const dialogRef = this._Dialog.open(ApiDetailsComponent, {
      maxWidth: '100%',
      maxHeight: '100%',
      width: '95%',
      height: '95%',
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

  /**
   * This function updates the service name of a particular service
   * @param event 
   */
  onChangeServiceName(event: any) {
    if (event.keyCode === 13) {

      // Change the edit status
      this.isServiceNameEditable = !this.isServiceNameEditable

      // Pass service data
      let serviceData = {
        name: event.target.value
      }

      // Call the service function
      this.updateServiceFunction(serviceData)
    }
  }

  /**
   * This function changes the threshold of a service
   * @param event 
   */
  onChangeServiceThreshold(event: any) {
    if (event.keyCode === 13) {

      // Change the edit status
      this.isServiceThresholdEditable = !this.isServiceThresholdEditable

      this.service.threshold = event.target.value

      // Updates the Service Status and Threshold Value
      this.updateServiceHealthStatus()
    }
  }

  async updateServiceHealthStatus() {

    if (this.success_rate < this.service.threshold) {

      // Pass service data
      let serviceData = {
        threshold: this.service.threshold,
        last_status: 'unhealthy'
      }

      // Update the Status
      this.service.last_status = 'unhealthy'

      // Call the service function
      this.updateServiceFunction(serviceData)

    } else if (this.success_rate >= this.service.threshold) {

      // Pass service data
      let serviceData = {
        threshold: this.service.threshold,
        last_status: 'healthy'
      }

      // Update the Status
      this.service.last_status = 'healthy'

      // Call the service function
      this.updateServiceFunction(serviceData)

    } else {

      // Pass service data
      let serviceData = {
        threshold: this.service.threshold,
        last_status: 'broken'
      }

      // Update the Status
      this.service.last_status = 'broken'

      // Call the service function
      this.updateServiceFunction(serviceData)

    }

  }

}