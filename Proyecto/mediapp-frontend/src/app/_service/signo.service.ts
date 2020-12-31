import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Signo } from '../_model/Signo';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class SignoService extends GenericService<Signo>{

  private signoCambio = new Subject<Signo[]>();
  private mensajeCambio = new Subject<string>();


  constructor( protected http: HttpClient ) {
    super( http, `${environment.HOST}/signos`);
   }

   getSignoCambio(){
    return this.signoCambio.asObservable();
  }

  setSignoCambio(signos : Signo[]){
    this.signoCambio.next(signos);
  }

  getMensajeCambio(){
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: string){
    return this.mensajeCambio.next(mensaje);
  }
}
