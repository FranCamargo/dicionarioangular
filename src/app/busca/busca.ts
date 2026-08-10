import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-busca',
  templateUrl: './busca.html',
  styleUrl: './busca.scss'
})
export class Busca {
  readonly placeholder = input('Buscar...');
  readonly valor = model('');

  protected atualizar(valor: string): void {
    this.valor.set(valor);
  }

  protected limpar(): void {
    this.valor.set('');
  }
}
