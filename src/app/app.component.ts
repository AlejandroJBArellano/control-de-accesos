import { Component } from '@angular/core';
import { ApiService } from './services/api.service';
import {
  IMqttMessage,
  MqttModule,
  MqttService,
  IMqttServiceOptions
} from 'ngx-mqtt';
import { ConfigurationService } from './services/configuration.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  config:any={}
  
  event_type: string = ""

  reutrnedPulses: string[] = []

  selectedConfig: string = ""

  responseService: string = ""

  state: boolean = true

  constructor(private _mqttService: MqttService,
    private apiService: ApiService,
    private configurationService: ConfigurationService ) {

    this._mqttService.onConnect.subscribe(event=> {
      console.log('CONNECTED',event);
    });
    this._mqttService.onReconnect.subscribe(event=> {
      console.log('RECONNECTING',event);
    });
    this._mqttService.onError.subscribe(event=> {
      console.log('ERROR',event);
    });
    this._mqttService.onClose.subscribe(event=> {
      console.log('CLOSED',event);
    });

  }

  processMessage(message: string, topic: string){
    console.log('message on reader ' + message)
    try{
      const cmd = JSON.parse(message)
      cmd.id_lectora = topic
      cmd.event_type = this.selectedConfig
      console.log(cmd)
      this.apiService.entry(cmd).subscribe(
        res => this.responseService = JSON.stringify(res),
        err => this.responseService = JSON.stringify(err)
      )
    }catch(err){
      console.log('err',err)
    }
  }

  isEntrance(isEntrance: boolean){
    this.reutrnedPulses = this.configurationService.getConfig(isEntrance)
    this.reutrnedPulses.forEach((topic: any) => {
      this._mqttService.observe(topic).subscribe((message: IMqttMessage) => {
        this.processMessage(message.payload.toString(), topic)
      })
    })
    if(isEntrance) this.selectedConfig = "entrada"
    else this.selectedConfig = "salida"
    this.state = false
  }
}
