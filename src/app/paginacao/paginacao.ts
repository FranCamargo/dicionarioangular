import { Component, computed, input, output } from '@angular/core';

function calcularNumeros(atual: number, total: number): (number | '...')[] {
  const paginas: (number | '...')[] = [1];

  if (atual - 1 > 2) {
    paginas.push('...');
  }

  for (let p = Math.max(2, atual - 1); p <= Math.min(total - 1, atual + 1); p++) {
    paginas.push(p);
  }

  if (atual + 1 < total - 1) {
    paginas.push('...');
  }

  if (total > 1) {
    paginas.push(total);
  }

  return paginas;
}

@Component({
  selector: 'app-paginacao',
  templateUrl: './paginacao.html',
  styleUrl: './paginacao.scss'
})
export class Paginacao {
  readonly paginaAtual = input.required<number>();
  readonly totalPaginas = input.required<number>();
  readonly mudarPagina = output<number>();

  protected readonly numeros = computed<(number | '...')[]>(() =>
    calcularNumeros(this.paginaAtual(), this.totalPaginas())
  );

  protected irParaPagina(pagina: number): void {
    this.mudarPagina.emit(pagina);
  }

  protected anterior(): void {
    this.mudarPagina.emit(this.paginaAtual() - 1);
  }

  protected proxima(): void {
    this.mudarPagina.emit(this.paginaAtual() + 1);
  }
}
