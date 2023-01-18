import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@Component({
  selector: 'app-api-advanced-details',
  templateUrl: './api-advanced-details.component.html',
  styleUrls: ['./api-advanced-details.component.scss']
})
export class ApiAdvancedDetailsComponent implements OnInit {

  constructor(
    private _FormBuilder: FormBuilder,
    private _ApiAdvancedDetailsComponent: MatDialogRef<ApiAdvancedDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Initialise the form 
    this.form = this._FormBuilder.group({
      name: this.name,
      method: this.method,
      end_point: this.end_point,
      time_interval: this.time_interval
    })

    // Headers Form
    this.headersForm = this._FormBuilder.group({
      headers: this.headers,
      authorization_from_api: this.authorization_from_api
    })

    // Body Form
    this.bodyForm = this._FormBuilder.group({
      body: this.body
    })

    // Params Form
    this.paramsForm = this._FormBuilder.group({
      params: this.params
    })
  }

  // Form
  form: any
  headersForm: any
  bodyForm: any
  paramsForm: any

  // Alert
  titleAlert: string = 'This field is required'

  // Define Form Controls
  name = new FormControl(this.data.name, [Validators.required, Validators.nullValidator])
  method = new FormControl(this.data.method, [Validators.required, Validators.nullValidator])
  time_interval = new FormControl(this.data.time_interval, [Validators.required, Validators.nullValidator])
  end_point = new FormControl(this.data.end_point, [Validators.required, Validators.nullValidator])
  headers = new FormControl(JSON.stringify(this.data.headers), [])
  authorization_from_api = new FormControl(this.data.authorization_from_api, [])
  body = new FormControl(JSON.stringify(this.data.body), [])
  params = new FormControl(JSON.stringify(this.data.params), [])

  // AutoSize Textarea
  @ViewChild('autosize', { static: false }) autosize: CdkTextareaAutosize;

  ngOnInit(): void {
    console.log(this.data)
  }

  close() {
    this._ApiAdvancedDetailsComponent.close(this.data)
  }

  updateApi() {
    this._ApiAdvancedDetailsComponent.close({
      name: this.name.value,
      method: this.method,
      end_point: this.end_point.value,
    })
  }

}
