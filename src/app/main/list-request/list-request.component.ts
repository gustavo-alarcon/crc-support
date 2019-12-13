import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';


const dataExample = [
  { subject: 'Apoyo con descarga/instalación de ANSYS 16.1', id: '#2859', created: '4 days ago', lastactivity: '1 day ago', status: 'Abierto' },
  { subject: 'Instalación Ansys 17', id: '#4584', created: '1 month ago', lastactivity: '1 month ago', status: 'Resuelto' },
  { subject: 'Influencia del Loctite (Retaining Compound) en Interferencia Cubo Eje.', id: '#4557', created: '1 year ago', lastactivity: '1 month ago', status: 'Esperando respuesta' },
  { subject: 'Consulta respecto a problema de licencia', id: '#3581', created: '2 years ago', lastactivity: '1 year ago', status: 'Resuelto' },
]

@Component({
  selector: 'app-list-request',
  templateUrl: './list-request.component.html',
  styleUrls: ['./list-request.component.css']
})


export class ListRequestComponent implements OnInit {
  displayedColumns: string[] = ['subject', 'id', 'created', 'lastactivity', 'status'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor() { }

  ngOnInit() {
    this.dataSource.data = dataExample;
    this.dataSource.paginator = this.paginator;
  }

}
