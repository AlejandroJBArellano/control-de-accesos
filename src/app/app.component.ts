import { Component, OnInit } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { environment } from 'src/environments/environment';
import { ApiService } from './services/api.service';
import { ConfigurationService } from './services/configuration.service';
import { IBadge, IPort } from './types';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  // Arrays
  declare returnedPulses: string[];
  declare ports: IPort[];
  declare badges: IBadge[];
  // Strings
  declare imgBadge: string;
  declare messageBadge: string;
  declare responseService: string;
  declare fontColorForBadge: string;
  declare event_type: string;
  declare selectedConfig: string;
  public linkLogo = environment.linkLogo;
  state: 'userTagId' | 'noUser' | 'UserSoon' | 'begin' = 'noUser';
  declare background: string;
  // Int and floats
  // Booleans
  waitingForUser: boolean = true;
  canEntry: boolean = true;
  err: boolean = false;
  // Others
  declare timeout: null | NodeJS.Timeout;
  declare portToListen: IPort;
  declare config: any;
  declare userTagId: any;
  declare accessDate: any;

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
      clearTimeout(this.timeout as NodeJS.Timeout);
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
      this.timeout = setTimeout(this.resetVariables, 5000);
    } catch (err) {
      this.err = true;
      console.log('err', err);
    }
  }

  resetVariables() {
    this.userTagId = null;
    this.canEntry = true;
    this.state = 'begin';
    this.imgBadge = '';
    this.messageBadge = '';
    this.fontColorForBadge = '';
  }

  isEntrance() {
    this.portToListen = this.ports.find(
      (e) => this.portToListen.event === e.event
    ) as IPort;
    this._mqttService
      .observe(this.portToListen.topic)
      .subscribe((message: IMqttMessage) => {
        this.processMessage(
          message.payload.toString(),
          this.portToListen.topic
        );
      });
    this.linkLogo = this.portToListen.imgUrl;
    console.log('configuration');
    console.table(this.portToListen);
    if (this.portToListen && this.portToListen.badges) {
      this.badges = this.portToListen.badges;
    }
    console.info('Badges');
    console.table(this.badges);
    this.waitingForUser = false;
  }
}
