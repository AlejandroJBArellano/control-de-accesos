import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import {
  IMqttMessage,
  MqttModule,
  MqttService,
  IMqttServiceOptions
} from 'ngx-mqtt';
import { ConfigurationService } from './services/configuration.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  config:any={}

  event_type: string = ""

  reutrnedPulses: string[] = []

  selectedConfig: string = ""

  responseService: string = ""

  waitingForUser: boolean = true
  canEntry: boolean = true
  userTagId: any
  accessDate: any
  linkLogo = environment.linkLogo
  ports: {_id: string; topic: string; event: string; imgUrl: string;}[] = []
  portTolisten: any = {}
  background = ''
  timeout: any;
  err: boolean = false;
  state: 'userTagId' | 'noUser' | 'UserSoon' | 'begin' = "noUser"
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
    this.state = "begin";
  }

  ngOnInit(){
    this.apiService.getConfigTags().subscribe(
      (res: any) => {
        this.ports = [...res]
        console.log(res)
      },
      err => console.log(err)
    )
  }
  async processMessage(message: string, topic: string){
    console.log('message on reader ' + message)
    try{
      clearTimeout(this.timeout)
      const cmd = JSON.parse(message)
      cmd.id_lectora = topic
      cmd.event_type = this.selectedConfig
      console.log('cmd', cmd)
      this.apiService.userTagId(cmd.tag_id).subscribe(res => {
        this.userTagId = res
        if(Object.keys(this.userTagId).length <= 0) {
          this.state = "noUser"
          this.err = true
          setTimeout(() => {
            this.userTagId = null;
            this.state = "begin"
          }, 1000)
          return;
        }
        this.accessDate = this.userTagId?.accessdate ?? 0
        if(this.accessDate || this.accessDate === 0){
          this.canEntry = new Date(this.accessDate).getTime() < new Date().getTime()
          console.log(this.accessDate, this.canEntry)
          if(!this.canEntry){
            console.log(this.canEntry)
            this.state = "UserSoon"
          }
          console.log('accessDate', new Date(this.accessDate))
          return;
        }
        this.state = "userTagId"
      }, err => console.log(err))
      console.log(this.userTagId, 'usertag')
      this.timeout = setTimeout(() => {
        this.userTagId = null
        this.canEntry = true
        this.state = "begin"
      }, 5000);
      // TODO: get user info by tag id desde localhost:3000 and save the data into local variable
    }catch(err){
      this.err = true
      console.log('err',err)
    }
  }

  isEntrance(){
    this.portTolisten = this.ports.find((e) => this.portTolisten.topic === e.topic)
    this._mqttService.observe(this.portTolisten.topic).subscribe((message: IMqttMessage) => {
      this.processMessage(message.payload.toString(), this.portTolisten.topic)
    })
    this.linkLogo = this.portTolisten.imgUrl
    console.log(this.portTolisten)
    this.waitingForUser = false
  }
}
