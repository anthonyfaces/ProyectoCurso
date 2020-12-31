import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';
import { Paciente } from 'src/app/_model/paciente';
import { PacienteService } from 'src/app/_service/paciente.service';

@Component({
  selector: 'app-signos-dialogo',
  templateUrl: './signos-dialogo.component.html',
  styleUrls: ['./signos-dialogo.component.css']
})
export class SignosDialogoComponent implements OnInit {

  form: FormGroup;
  paciente : Paciente
  pacientes: Paciente[];

  myControlPaciente: FormControl = new FormControl();

  constructor(
    private dialogRef: MatDialogRef<SignosDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Paciente[],
    private pacienteService: PacienteService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombres': new FormControl(null, [Validators.required, Validators.minLength(3)]),
      'apellidos': new FormControl(null, [Validators.required, Validators.minLength(3)]),
      'dni': new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(8)]),
      'direccion' :  new FormControl(null, [Validators.required, Validators.minLength(3)]),
      'telefono': new FormControl(null,  [Validators.required, Validators.minLength(9), Validators.maxLength(9)]),
      'email': new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  onRegisterPatient(){
    let pac = new Paciente();

    // Construir JSON
    pac.idPaciente = this.form.value['id'];
    pac.nombres = this.form.value['nombres'];
    pac.apellidos = this.form.value['apellidos'];
    pac.dni = this.form.value['dni'];
    pac.direccion = this.form.value['direccion'];
    pac.telefono = this.form.value['telefono'];
    pac.email = this.form.value['email'];

    // Registrar
    this.pacienteService.registrar(pac).pipe( switchMap ( () => {
      return this.pacienteService.listar();
    })).subscribe( data => {
      // Poblar el listado del Autocomplete
      this.pacientes = data;
      this.pacienteService.setPacienteCambio(data);
      // Mostrar mensaje
      this.pacienteService.setMensajeCambio('Se Registro');
    })
  
    // Cerrar el Dialog
    this.dialogRef.close(true);
  }

  cerrar(){
    this.dialogRef.close(); 
  }
  get f() {
    return this.form.controls;
  }

}


