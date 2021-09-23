import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  MQTT_BASE_DT_TOPIC:string = 'inpulse/dt/pulses'
  // array de pulsos de entrada
  private entranceArray:string[] = [
    `${this.MQTT_BASE_DT_TOPIC}/pulso201/tag-id`,
    `${this.MQTT_BASE_DT_TOPIC}/pulso202/tag-id`,
    `${this.MQTT_BASE_DT_TOPIC}/pulso203/tag-id`,
    `${this.MQTT_BASE_DT_TOPIC}/pulso204/tag-id`,
    `${this.MQTT_BASE_DT_TOPIC}/pulso205/tag-id`,
    `${this.MQTT_BASE_DT_TOPIC}/pulso206/tag-id`,
    `${this.MQTT_BASE_DT_TOPIC}/pulso207/tag-id`,
    `${this.MQTT_BASE_DT_TOPIC}/pulso208/tag-id`,
    `${this.MQTT_BASE_DT_TOPIC}/pulso209/tag-id`,
    `${this.MQTT_BASE_DT_TOPIC}/pulso210/tag-id`
  ]
  // pulsos de salida
  private exitArray: string[] =[
    `${this.MQTT_BASE_DT_TOPIC}/pulso301/tag-id`,
    `${this.MQTT_BASE_DT_TOPIC}/pulso302/tag-id`,
    `${this.MQTT_BASE_DT_TOPIC}/pulso303/tag-id`,
    `${this.MQTT_BASE_DT_TOPIC}/pulso304/tag-id`,
    `${this.MQTT_BASE_DT_TOPIC}/pulso305/tag-id`,
    `${this.MQTT_BASE_DT_TOPIC}/pulso306/tag-id`,
    `${this.MQTT_BASE_DT_TOPIC}/pulso307/tag-id`,
    `${this.MQTT_BASE_DT_TOPIC}/pulso308/tag-id`,
    `${this.MQTT_BASE_DT_TOPIC}/pulso309/tag-id`,
    `${this.MQTT_BASE_DT_TOPIC}/pulso310/tag-id`
  ]
  getConfig(isEntrance: boolean){
    if( isEntrance ) {
      return this.entranceArray
    } else {
      return this.exitArray
    } 
  }
}
