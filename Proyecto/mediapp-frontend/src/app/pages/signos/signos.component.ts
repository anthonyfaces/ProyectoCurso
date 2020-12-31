import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { switchMap } from 'rxjs/operators';
import { Signo } from 'src/app/_model/Signo';
import { SignoService } from 'src/app/_service/signo.service';

@Component({
  selector: 'app-signos',
  templateUrl: './signos.component.html',
  styleUrls: ['./signos.component.css']
})
export class SignosComponent implements OnInit {

  displayedColumns = ['idSigno', 'dni', 'nombres', 'temperatura','pulso', 'frecResp', 'fecha', 'acciones'];
  dataSource: MatTableDataSource<Signo>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private signoService: SignoService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.signoService.listar().subscribe(data => {
      this.crearTabla(data);    
    });

    this.signoService.getSignoCambio().subscribe(data => {
      this.crearTabla(data);
    });

    this.signoService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', { duration: 2000 });
    });
  }

  crearTabla(data: Signo[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
   
    // Filtramos por el campo DNI
    this.dataSource.filterPredicate = (data, filter) => {
      let valid = false;
  
      const transformedFilter = filter.trim().toLowerCase();
  
      Object.keys(data).map(key => {
        if ( key === 'paciente' && data.paciente.dni.toLowerCase().includes(transformedFilter) ) {
          console.log("IF")
          valid = true;
        } 
      });
  
      return valid;
    }
  }

  eliminar( idSigno : number) {
    this.signoService.eliminar(idSigno).pipe(switchMap(() => {
      return this.signoService.listar();
    }))
      .subscribe(data => {
        this.signoService.setSignoCambio(data);
        this.signoService.setMensajeCambio('SE ELIMINO');
      });
  }

}
