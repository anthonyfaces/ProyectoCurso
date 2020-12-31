import { Component, OnInit } from '@angular/core';
import { Rol } from 'src/app/_model/rol';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent implements OnInit {

  roles : string[]
  nameUser : string

  constructor() {
    
   }

  ngOnInit(): void {
     // Recuperamos el Token del sessionStorage
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
   
    // Usamos la libereria angular-jwt
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    
    // Extraer data: user_name y authorities
    this.roles = decodedToken.authorities;
    this.nameUser = decodedToken.user_name;
  }

}
