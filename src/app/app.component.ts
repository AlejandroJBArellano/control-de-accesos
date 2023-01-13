import { Component, OnInit } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { environment } from 'src/environments/environment';
import { ApiService } from './services/api.service';
import { ConfigurationService } from './services/configuration.service';
import { IBagde } from './types/badge';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  config: any = {};

  event_type: string = '';

  reutrnedPulses: string[] = [];

  selectedConfig: string = '';

  responseService: string = '';

  waitingForUser: boolean = true;
  canEntry: boolean = true;
  declare userTagId: any;
  accessDate: any;
  linkLogo = environment.linkLogo;
  ports: {
    _id: string;
    topic: string;
    event: string;
    terminalTitle: string;
    imgUrl: string;
  }[] = [];
  portTolisten: any = {};
  background = '';
  timeout: any;
  err: boolean = false;
  state: 'userTagId' | 'noUser' | 'UserSoon' | 'begin' = 'noUser';

  badges: IBagde[] = [];

  imgBadge = '';

  messageBadge = '';
  fontColorForBadge = '';

  constructor(
    private _mqttService: MqttService,
    private apiService: ApiService,
    private configurationService: ConfigurationService
  ) {
    this._mqttService.onConnect.subscribe((event) => {
      console.log('CONNECTED', event);
    });
    this._mqttService.onReconnect.subscribe((event) => {
      console.log('RECONNECTING', event);
    });
    this._mqttService.onError.subscribe((event) => {
      console.log('ERROR', event);
    });
    this._mqttService.onClose.subscribe((event) => {
      console.log('CLOSED', event);
    });
    this.state = 'begin';
  }

  ngOnInit() {
    this.apiService.getConfigEntrances().subscribe(
      (res: any) => {
        this.ports = [...res];
        console.log(res);
      },
      (err) => console.log(err)
    );
  }
  async processMessage(message: string, topic: string) {
    console.log('message on reader ' + message);
    try {
      clearTimeout(this.timeout);
      const cmd = JSON.parse(message);
      cmd.id_lectora = topic;
      cmd.event_type = this.selectedConfig;
      console.log('cmd', cmd);
      this.apiService.userTagId(cmd.tag_id).subscribe(
        (res) => {
          console.log(res);
          this.userTagId = res;
          if (Object.keys(this.userTagId).length <= 0) {
            this.state = 'noUser';
            this.err = true;
            setTimeout(() => {
              this.userTagId = null;
            }, 1000);
            return;
          }
          const badge = this.badges.find(({ badge }) => {
            return badge === this.userTagId.badge;
          });
          if (badge) {
            (window as any).userTagId = this.userTagId;
            const randomMessage =
              badge?.messages[~~(Math.random() * badge?.messages?.length)];
            this.imgBadge = randomMessage?.img;
            this.messageBadge = eval('`' + randomMessage?.message + '`');
            this.fontColorForBadge = badge?.fontColor as string;
            this.accessDate = this.userTagId?.accessdate ?? 0;
            if (this.accessDate || this.accessDate === 0) {
              this.canEntry =
                new Date(this.accessDate).getTime() < new Date().getTime();
              console.log(this.accessDate, this.canEntry);
              if (!this.canEntry) {
                console.log(this.canEntry);
                this.state = 'UserSoon';
              }
              console.log('accessDate', new Date(this.accessDate));
              return;
            }
          }
        },
        (err) => console.log(err)
      );
      console.log(this.userTagId, 'userTag');
      this.timeout = setTimeout(() => {
        this.userTagId = null;
        this.canEntry = true;
        this.state = 'begin';
        this.imgBadge = '';
        this.messageBadge = '';
        this.fontColorForBadge = '';
      }, 5000);
      // TODO: get user info by tag id desde localhost:3000 and save the data into local variable
    } catch (err) {
      this.err = true;
      console.log('err', err);
    }
  }

  isEntrance() {
    this.portTolisten = this.ports.find(
      (e) => this.portTolisten.event === e.event
    );
    this._mqttService
      .observe(this.portTolisten.topic)
      .subscribe((message: IMqttMessage) => {
        this.processMessage(
          message.payload.toString(),
          this.portTolisten.topic
        );
      });
    this.linkLogo = this.portTolisten.imgUrl;
    console.log('configuration');
    console.table(this.portTolisten);
    if (this.portTolisten && this.portTolisten.badges) {
      this.badges = this.portTolisten.badges;
    }
    console.info('Badges');
    console.table(this.badges);
    this.waitingForUser = false;
  }
}
