import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html',
})
export class DirectivaComponent implements OnInit {

  listCurso: string[] = ['TypeScript', 'JavaScript', 'Java SE', 'C#', 'PHP'];

  habilitar = true;

  constructor() { }

  ngOnInit() {
  }

  setHabilitar(): void {
    this.habilitar = !this.habilitar;
  }

}
