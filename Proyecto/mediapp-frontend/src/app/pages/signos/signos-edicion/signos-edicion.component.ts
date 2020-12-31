import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { isEmpty, map, switchMap } from 'rxjs/operators';
import { Paciente } from 'src/app/_model/paciente';
import { Signo } from 'src/app/_model/Signo';
import { PacienteService } from 'src/app/_service/paciente.service';
import { SignoService } from 'src/app/_service/signo.service';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SignosDialogoComponent } from '../signos-dialogo/signos-dialogo.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-signos-edicion',
  templateUrl: './signos-edicion.component.html',
  styleUrls: ['./signos-edicion.component.css']
})
export class SignosEdicionComponent implements OnInit {

  form: FormGroup;
  id: number;
  edicion: boolean;

  // Version Select de pacientes
  pacientes: Paciente[];
  pacientes$: Observable<Paciente[]>;
  pacienteSeleccionado: Paciente;
  idPacienteSeleccionado: number;

  // Version autocomplete
  myControlPaciente: FormControl = new FormControl();
  pacientesFiltrados$: Observable<Paciente[]>;
  habilitarCaja : boolean
  
  constructor(
   private route: ActivatedRoute,
   private router: Router,
   private signoService: SignoService,
   private pacienteService : PacienteService,
   private snackBar: MatSnackBar,
   private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'id': new FormControl(0),
      'temperatura': new FormControl(30),
      'pulso': new FormControl(),
      'frecRespiratoria': new FormControl(),
      'fecha' :  new FormControl(new Date()),
      'paciente': this.myControlPaciente
    });

    this.listarPacientes();   
    this.pacientesFiltrados$ = this.myControlPaciente.valueChanges.pipe(map( val => this.filtrarPacientes(val) ));

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.initForm();
    });
  }

  private initForm() {
    this.habilitarCaja = false;

    if (this.edicion) { 
      this.habilitarCaja = true;

      this.signoService.listarPorId(this.id).pipe(switchMap((data) => {
        this.form = new FormGroup({
          'id': new FormControl(data.idSigno),
          'temperatura': new FormControl(data.temperatura, [Validators.required]),
          'pulso': new FormControl(data.pulso, [Validators.required]),
          'frecRespiratoria': new FormControl(data.frecRespiratoria, Validators.required),
          'fecha': new FormControl(data.fecha, Validators.required),       
          'paciente': this.myControlPaciente
        });
        return this.pacienteService.listarPorId(data.paciente.idPaciente)
      }))
      .subscribe(data => {
        this.myControlPaciente = new FormControl(data);
      });
    }
  }

  mostrarPaciente(val: Paciente) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }

  listarPacientes() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }

  filtrarPacientes(val: any){
    if (val != null && val.idPaciente > 0) {
      return this.pacientes.filter(el =>
        el.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || el.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || el.dni.includes(val.dni)
      );
    }
    return this.pacientes.filter(el => 
      el.nombres.toLowerCase().includes(val?.toLowerCase()) || el.apellidos.toLowerCase().includes(val?.toLowerCase()) || el.dni.includes(val)
    );
  }

  onEditSign() {
    let signo = new Signo();
    signo.idSigno = this.form.value['id'];
    signo.temperatura = this.form.value['temperatura'];
    signo.pulso = this.form.value['pulso'];
    signo.frecRespiratoria = this.form.value['frecRespiratoria'];
    signo.fecha = moment(this.form.value['fecha']).format('YYYY-MM-DDTHH:mm:ss');
    signo.paciente = this.myControlPaciente.value;

    // Validacion de formulario
    if (this.form.invalid) { return; }

    if (!signo.paciente.idPaciente || signo.paciente == null  ) {
      this.snackBar.open("Paciente no Registrado", 'AVISO', { duration: 2000 });  
      return;
    }

    // Registro en la BDs: Update o Insert
    if (this.edicion) {
      console.log("Te Edito");
     
      this.signoService.modificar(signo).pipe(switchMap(() => {
        return this.signoService.listar();
      }))
      .subscribe ( data => {
        this.signoService.setSignoCambio(data);
        this.signoService.setMensajeCambio("SE MODIFICO");
      });

    } else {
      this.signoService.registrar(signo).pipe(switchMap(() => {
        return this.signoService.listar();
      }))
      .subscribe ( data => {
        this.signoService.setSignoCambio(data);
        this.signoService.setMensajeCambio("SE REGISTRO");
      });
    }

    // Cerramos el componente de edicion
    this.router.navigate(['signo']);
  }

  get f() {
    // Retornamos los controles para usarlo en la validacion
    return this.form.controls;
  }

  abrirDialogo() {
    let paciente = new Paciente();
    const dialogRef = this.dialog.open(SignosDialogoComponent, {
      width: '350px',
      data: this.pacientes
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.listarPacientes();
        this.pacientesFiltrados$ = this.myControlPaciente.valueChanges.pipe(map( val => this.filtrarPacientes(val) ));
      }
    });
  }

}
