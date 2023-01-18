import { Component, Injector, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { AppService } from 'src/app/modules/shared/services/app.service';

@Component({
  selector: 'apps-list',
  templateUrl: './apps-list.component.html',
  styleUrls: ['./apps-list.component.scss']
})
export class AppsListComponent implements OnInit {

  constructor(
    private _Injector: Injector,
  ) { }

  // Apps List
  apps: any = []

  // Is loading behaviour
  isLoading$ = new BehaviorSubject(false)

  async ngOnInit() {

    // Enable the Loading Subject
    this.isLoading$.next(true)

    // Fetch the list of the apps
    this.apps = await this.fetchUserAppsServiceFunction()

    // Disable the Loading Subject
    this.isLoading$.next(false)
  }

  /**
   * Fetch Applications
   * @returns 
   */
  fetchUserAppsServiceFunction() {
    return new Promise((resolve, reject) => {
      let appService = this._Injector.get(AppService)
      appService.fetchUserApps()
        .then((res: any) => {
          resolve(res['apps'])
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  /**
   * This functions pushes the app when receiving the event from the child component
   * @param $event 
   */
  newApp($event: any) {
    this.apps.unshift($event)
  }

  /**
   * This functions removes the app when receiving the event from the child component
   * @param $event 
   */
  removeApp($event: any){
    let index = this.apps.findIndex((app: any) => app._id == $event)
    if (index != -1)
      this.apps.splice(index, 1)
  }

  /**
   * Track By Element
   * @param index 
   * @param element 
   * @returns 
   */
  trackByElement(index: number, element: any): number {
    return element.id
  }

}
