import { Component, computed, signal } from '@angular/core';
import { Busca } from './busca/busca';
import { Paginacao } from './paginacao/paginacao';

interface TermoAngular {
  termo: string;
  definicao: string;
}

interface VersaoAngular {
  versao: string;
  ano: string;
  termos: TermoAngular[];
}

interface TermoGlossario extends TermoAngular {
  categoria: string;
}

interface TermoDepreciado {
  termo: string;
  definicao: string;
  desde: string;
  alternativa: string;
}

type Aba = 'versoes' | 'todos' | 'depreciados';
type Ordenacao = 'categoria' | 'alfabetica';

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

@Component({
  selector: 'app-root',
  imports: [Busca, Paginacao],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly versoes: VersaoAngular[] = [
    {
      versao: '14',
      ano: '2022',
      termos: [
        { termo: 'Standalone Components (Developer Preview)', definicao: 'Componentes, diretivas e pipes que podem ser usados sem a necessidade de NgModules.' },
        { termo: 'inject()', definicao: 'Função que permite injetar dependências fora do construtor, inclusive em contextos funcionais.' },
        { termo: 'Formulários Tipados (Typed Forms)', definicao: 'Reactive Forms passam a ser fortemente tipados, evitando o uso de "any" nos valores do formulário.' },
        { termo: 'Guards Funcionais', definicao: 'Guards de rota podem ser escritos como funções simples, usando inject() em vez de classes.' },
        { termo: 'Page Title no Router', definicao: 'Permite definir o título da aba do navegador de forma declarativa em cada rota.' },
        { termo: 'Diagnósticos Estendidos', definicao: 'Novos avisos do compilador para detectar erros comuns diretamente nos templates.' }
      ]
    },
    {
      versao: '15',
      ano: '2022',
      termos: [
        { termo: 'Standalone APIs (Estável)', definicao: 'A API de componentes standalone sai do developer preview e se torna estável para uso em produção.' },
        { termo: 'Directive Composition API', definicao: 'Permite compor diretivas dentro de um componente host através da propriedade hostDirectives.' },
        { termo: 'NgOptimizedImage', definicao: 'Diretiva estável para otimizar o carregamento de imagens, com lazy loading e priorização automática.' },
        { termo: 'Resolvers Funcionais', definicao: 'CanActivateFn, CanDeactivateFn e ResolveFn substituem as antigas classes de guard/resolver.' },
        { termo: 'Angular Material MDC', definicao: 'Componentes do Material reescritos sobre o Material Design Components (MDC) do Google.' },
        { termo: 'Stack Traces Legíveis', definicao: 'Rastros de pilha mais limpos, removendo frames internos do framework das mensagens de erro.' }
      ]
    },
    {
      versao: '16',
      ano: '2023',
      termos: [
        { termo: 'Signals (Developer Preview)', definicao: 'Primitiva reativa que representa um valor e notifica automaticamente seus consumidores quando ele muda.' },
        { termo: 'Required Inputs', definicao: '@Input({ required: true }) obriga o consumidor do componente a fornecer aquele valor.' },
        { termo: 'Router Input Binding', definicao: 'withComponentInputBinding() vincula parâmetros de rota diretamente a inputs do componente.' },
        { termo: 'Hidratação Não Destrutiva', definicao: 'No SSR, o DOM renderizado no servidor é reaproveitado no cliente em vez de recriado do zero.' },
        { termo: 'Build com esbuild/Vite', definicao: 'Novo pipeline de build experimental, significativamente mais rápido que o Webpack.' },
        { termo: 'Self-Closing Tags', definicao: 'Componentes sem conteúdo projetado podem ser escritos como <app-foo />.' },
        { termo: 'takeUntilDestroyed()', definicao: 'Operador RxJS que cancela subscriptions automaticamente quando o contexto de injeção é destruído.' }
      ]
    },
    {
      versao: '17',
      ano: '2023',
      termos: [
        { termo: '@if / @for / @switch', definicao: 'Novo control flow nativo do template, substituindo as diretivas estruturais *ngIf, *ngFor e *ngSwitch.' },
        { termo: '@defer', definicao: 'Deferrable Views: permite carregar partes do template sob demanda, de forma declarativa.' },
        { termo: 'Application Builder', definicao: 'Novo builder padrão baseado em esbuild e Vite, substituindo o Webpack nas novas aplicações.' },
        { termo: 'View Transitions API', definicao: 'Integração com a API nativa do navegador para animar transições entre rotas.' },
        { termo: 'Angular.dev', definicao: 'Novo site oficial de documentação do framework, com editor de código interativo embutido.' },
        { termo: 'SSR Aprimorado', definicao: 'Melhorias de performance e code-splitting por rota no Server-Side Rendering.' }
      ]
    },
    {
      versao: '18',
      ano: '2024',
      termos: [
        { termo: 'Zoneless (Experimental)', definicao: 'Detecção de mudanças sem depender do Zone.js, usando Signals como gatilho de atualização.' },
        { termo: 'Control Flow Estável', definicao: '@if, @for e @switch saem do developer preview e se tornam a forma recomendada de controle de fluxo.' },
        { termo: 'Material 3 (M3)', definicao: 'Suporte aos novos tokens de design e temas do Material Design 3 no Angular Material.' },
        { termo: 'Fallback Content', definicao: '<ng-content> passa a aceitar um conteúdo padrão, exibido quando nada é projetado.' },
        { termo: 'Signal-based Queries (Developer Preview)', definicao: 'viewChild() e contentChild() passam a retornar signals em vez de depender de decorators.' },
        { termo: 'Event Replay (Experimental)', definicao: 'Eventos disparados antes da hidratação são "reproduzidos" assim que a aplicação fica interativa.' }
      ]
    },
    {
      versao: '19',
      ano: '2024',
      termos: [
        { termo: 'input() / output() / model()', definicao: 'APIs de Signals para inputs, outputs e two-way binding, saindo do developer preview e se tornando estáveis.' },
        { termo: 'Standalone por Padrão', definicao: 'Componentes, diretivas e pipes passam a ser standalone por padrão, sem precisar declarar standalone: true.' },
        { termo: 'linkedSignal()', definicao: 'Signal gravável que recalcula automaticamente seu valor quando uma signal de origem muda.' },
        { termo: 'Hidratação Incremental', definicao: 'Partes da página podem ser hidratadas sob demanda, combinando SSR com blocos @defer.' },
        { termo: 'Render Mode por Rota', definicao: 'Cada rota pode escolher individualmente entre Server, Client ou Prerender.' },
        { termo: 'resource() (Experimental)', definicao: 'Primitiva reativa para buscar dados assíncronos (ex.: HTTP) integrada ao sistema de Signals.' }
      ]
    },
    {
      versao: '20',
      ano: '2025',
      termos: [
        { termo: 'Zoneless (Estável)', definicao: 'Aplicações podem rodar em produção sem a dependência do Zone.js para detecção de mudanças.' },
        { termo: 'httpResource()', definicao: 'API baseada em Signals para realizar requisições HTTP de forma declarativa e reativa.' },
        { termo: 'effect() Aprimorado', definicao: 'Refinamentos no agendamento, limpeza e regras de execução dos efeitos reativos (effects).' },
        { termo: 'Signal Forms (Experimental)', definicao: 'Exploração inicial de formulários construídos sobre Signals, como alternativa aos Reactive Forms.' },
        { termo: 'Diagnósticos de Template', definicao: 'Mais checagens de tipos e detecção de erros comuns diretamente em tempo de build.' }
      ]
    },
    {
      versao: '21',
      ano: '2026',
      termos: [
        { termo: 'Zoneless por Padrão', definicao: 'Novos projetos usam detecção de mudanças zoneless por padrão, eliminando a dependência do Zone.js.' },
        { termo: 'Signal Forms (Experimental)', definicao: 'Nova experiência de formulários reativa e composable, construída sobre Signals.' },
        { termo: 'Vitest como Test Runner Padrão', definicao: 'Substitui o Karma como executor de testes padrão em novos projetos, com fake timers e snapshots.' },
        { termo: '@angular/aria', definicao: 'Novo pacote que fornece a base para construir bibliotecas de componentes acessíveis.' },
        { termo: 'MCP Server no CLI', definicao: 'O Angular adota o Model Context Protocol, conectando o código local a modelos de IA como Gemini ou Claude.' },
        { termo: 'HttpClient Automático', definicao: 'Não é mais necessário importar HttpClientModule manualmente para usar o HttpClient.' }
      ]
    },
    {
      versao: '22',
      ano: '2026',
      termos: [
        { termo: 'Signal Forms (Estável)', definicao: 'Os formulários baseados em Signals saem do experimental e ficam prontos para produção.' },
        { termo: 'Resource API (Estável)', definicao: 'A API de busca de dados assíncrona baseada em Signals (resource/httpResource) se torna estável.' },
        { termo: 'OnPush por Padrão', definicao: 'A estratégia de detecção de mudanças OnPush passa a ser o padrão para novos componentes.' },
        { termo: '@Service', definicao: 'Novo decorator que simplifica o registro e a leitura de serviços injetáveis.' },
        { termo: 'injectAsync()', definicao: 'Permite injeção de dependência assíncrona, carregando serviços grandes sob demanda.' },
        { termo: 'Limpeza de Rotas', definicao: 'Novo controle explícito sobre dependências e caches associados a cada rota.' },
        { termo: 'HttpClient com Fetch', definicao: 'O cliente HTTP passa a usar a Fetch API do navegador por padrão, em vez de XMLHttpRequest.' }
      ]
    }
  ];

  protected readonly versaoSelecionada = signal(this.versoes[this.versoes.length - 1].versao);

  protected readonly versaoAtual = computed(
    () => this.versoes.find((v) => v.versao === this.versaoSelecionada()) ?? this.versoes[0]
  );

  protected selecionarVersao(versao: string): void {
    this.versaoSelecionada.set(versao);
  }

  protected readonly abaSelecionada = signal<Aba>('versoes');

  protected selecionarAba(aba: Aba): void {
    this.abaSelecionada.set(aba);
  }

  protected readonly glossario: TermoGlossario[] = [
    // Fundamentos
    { categoria: 'Fundamentos', termo: 'Componente (Component)', definicao: 'Bloco básico de construção de UI no Angular, formado por classe, template e estilos.' },
    { categoria: 'Fundamentos', termo: 'NgModule', definicao: 'Mecanismo clássico de agrupar componentes, diretivas, pipes e serviços relacionados.' },
    { categoria: 'Fundamentos', termo: 'Componente Standalone', definicao: 'Componente que declara suas próprias dependências via imports, sem precisar de um NgModule.' },
    { categoria: 'Fundamentos', termo: 'Diretiva (Directive)', definicao: 'Classe que adiciona comportamento a elementos do DOM.' },
    { categoria: 'Fundamentos', termo: 'Diretiva de Atributo', definicao: 'Diretiva que altera a aparência ou o comportamento de um elemento existente, como NgClass.' },
    { categoria: 'Fundamentos', termo: 'Diretiva Estrutural', definicao: 'Diretiva que altera a estrutura do DOM adicionando ou removendo elementos, como *ngIf.' },
    { categoria: 'Fundamentos', termo: 'Pipe', definicao: 'Função de template usada para transformar valores exibidos, como {{ data | date }}.' },
    { categoria: 'Fundamentos', termo: 'Serviço (Service)', definicao: 'Classe injetável que encapsula lógica de negócio ou acesso a dados, reutilizável entre componentes.' },
    { categoria: 'Fundamentos', termo: 'Template', definicao: 'Marcação HTML associada a um componente, que define sua estrutura visual.' },
    { categoria: 'Fundamentos', termo: 'Interpolação', definicao: 'Sintaxe {{ valor }} usada para exibir dados do componente diretamente no template.' },
    { categoria: 'Fundamentos', termo: 'Property Binding', definicao: 'Sintaxe [propriedade]="valor" que vincula uma propriedade do DOM a um valor do componente.' },
    { categoria: 'Fundamentos', termo: 'Event Binding', definicao: 'Sintaxe (evento)="metodo()" que executa lógica do componente em resposta a eventos do DOM.' },
    { categoria: 'Fundamentos', termo: 'Two-way Binding', definicao: 'Sintaxe [(ngModel)] que sincroniza um valor nos dois sentidos entre template e componente.' },
    { categoria: 'Fundamentos', termo: 'Decorator', definicao: 'Função anotada com @ (como @Component, @Injectable) que adiciona metadados a uma classe.' },

    // Ciclo de vida
    { categoria: 'Ciclo de Vida', termo: 'ngOnChanges', definicao: 'Executado sempre que um input do componente muda de valor.' },
    { categoria: 'Ciclo de Vida', termo: 'ngOnInit', definicao: 'Executado uma vez, logo após o Angular inicializar as propriedades de entrada do componente.' },
    { categoria: 'Ciclo de Vida', termo: 'ngDoCheck', definicao: 'Permite implementar detecção de mudanças customizada, executado a cada ciclo de verificação.' },
    { categoria: 'Ciclo de Vida', termo: 'ngAfterContentInit', definicao: 'Executado após o Angular projetar conteúdo externo (ng-content) no componente.' },
    { categoria: 'Ciclo de Vida', termo: 'ngAfterContentChecked', definicao: 'Executado após cada verificação do conteúdo projetado no componente.' },
    { categoria: 'Ciclo de Vida', termo: 'ngAfterViewInit', definicao: 'Executado após o Angular inicializar completamente a view do componente e suas views filhas.' },
    { categoria: 'Ciclo de Vida', termo: 'ngAfterViewChecked', definicao: 'Executado após cada verificação da view do componente e de suas views filhas.' },
    { categoria: 'Ciclo de Vida', termo: 'ngOnDestroy', definicao: 'Executado imediatamente antes do Angular destruir o componente, ideal para limpeza de recursos.' },

    // Injeção de dependência
    { categoria: 'Injeção de Dependência', termo: 'Dependency Injection (DI)', definicao: 'Padrão em que dependências de uma classe são fornecidas de fora, em vez de criadas internamente.' },
    { categoria: 'Injeção de Dependência', termo: 'Injector', definicao: 'Mecanismo do Angular responsável por criar e entregar instâncias de dependências.' },
    { categoria: 'Injeção de Dependência', termo: 'Provider', definicao: 'Configuração que informa ao injetor como criar ou obter uma dependência.' },
    { categoria: 'Injeção de Dependência', termo: 'InjectionToken', definicao: 'Token único usado para injetar valores que não são classes, como configurações ou primitivos.' },
    { categoria: 'Injeção de Dependência', termo: 'inject()', definicao: 'Função que permite obter uma dependência do injetor atual fora do construtor.' },
    { categoria: 'Injeção de Dependência', termo: '@Injectable', definicao: 'Decorator que marca uma classe como disponível para ser injetada pelo sistema de DI.' },
    { categoria: 'Injeção de Dependência', termo: 'Injetores Hierárquicos', definicao: 'Estrutura em árvore de injetores, em que cada nível pode sobrescrever providers dos níveis acima.' },
    { categoria: 'Injeção de Dependência', termo: 'providedIn', definicao: 'Opção do @Injectable que define em qual injetor o serviço deve ser registrado (ex.: "root").' },

    // Signals
    { categoria: 'Signals', termo: 'signal()', definicao: 'Cria um valor reativo (WritableSignal) que pode ser lido e atualizado, notificando seus consumidores.' },
    { categoria: 'Signals', termo: 'computed()', definicao: 'Cria uma signal derivada, recalculada automaticamente quando suas dependências mudam.' },
    { categoria: 'Signals', termo: 'effect()', definicao: 'Executa uma função sempre que qualquer signal lida dentro dela mudar de valor.' },
    { categoria: 'Signals', termo: 'untracked()', definicao: 'Lê o valor de uma signal sem registrar dependência reativa no contexto atual.' },
    { categoria: 'Signals', termo: 'input()', definicao: 'API baseada em Signals para declarar propriedades de entrada (inputs) de um componente.' },
    { categoria: 'Signals', termo: 'input.required()', definicao: 'Variante de input() que obriga o consumidor do componente a fornecer aquele valor.' },
    { categoria: 'Signals', termo: 'output()', definicao: 'API baseada em Signals para declarar eventos de saída (outputs) de um componente.' },
    { categoria: 'Signals', termo: 'model()', definicao: 'API baseada em Signals para criar bindings de duas vias (two-way binding) em componentes.' },
    { categoria: 'Signals', termo: 'viewChild()', definicao: 'Obtém, como signal, a referência a um elemento ou componente filho na view.' },
    { categoria: 'Signals', termo: 'viewChildren()', definicao: 'Obtém, como signal, a lista de referências a elementos ou componentes filhos na view.' },
    { categoria: 'Signals', termo: 'contentChild()', definicao: 'Obtém, como signal, a referência a conteúdo projetado (ng-content) no componente.' },
    { categoria: 'Signals', termo: 'contentChildren()', definicao: 'Obtém, como signal, a lista de referências a conteúdos projetados no componente.' },
    { categoria: 'Signals', termo: 'linkedSignal()', definicao: 'Signal gravável que recalcula automaticamente seu valor quando uma signal de origem muda.' },
    { categoria: 'Signals', termo: 'resource()', definicao: 'Primitiva reativa para buscar dados assíncronos (ex.: requisições) integrada ao sistema de Signals.' },
    { categoria: 'Signals', termo: 'httpResource()', definicao: 'Variante de resource() especializada em realizar requisições HTTP de forma declarativa.' },
    { categoria: 'Signals', termo: 'toSignal() / toObservable()', definicao: 'Funções de interoperabilidade que convertem Observables em Signals e vice-versa.' },

    // Templates e control flow
    { categoria: 'Templates', termo: '@if / @else', definicao: 'Bloco de controle de fluxo nativo do template que renderiza conteúdo condicionalmente.' },
    { categoria: 'Templates', termo: '@for / track', definicao: 'Bloco de controle de fluxo nativo para iterar listas, exigindo uma expressão track para identidade dos itens.' },
    { categoria: 'Templates', termo: '@switch / @case', definicao: 'Bloco de controle de fluxo nativo equivalente a um switch, para renderizar um entre vários blocos.' },
    { categoria: 'Templates', termo: '@defer', definicao: 'Bloco que permite carregar parte do template e seu código sob demanda (lazy loading declarativo).' },
    { categoria: 'Templates', termo: '@placeholder / @loading / @error', definicao: 'Sub-blocos de @defer que definem o que exibir antes, durante e em caso de falha no carregamento.' },
    { categoria: 'Templates', termo: '@let', definicao: 'Declara uma variável local reutilizável dentro do template.' },
    { categoria: 'Templates', termo: 'ng-template', definicao: 'Elemento que define um fragmento de template não renderizado diretamente, usado por diretivas estruturais.' },
    { categoria: 'Templates', termo: 'ng-container', definicao: 'Elemento agrupador que não gera nó no DOM, útil para aplicar diretivas sem elementos extras.' },
    { categoria: 'Templates', termo: 'ng-content', definicao: 'Marca o local onde conteúdo projetado por um componente pai será inserido.' },
    { categoria: 'Templates', termo: 'TemplateRef', definicao: 'Referência a um bloco de template que pode ser instanciado programaticamente.' },
    { categoria: 'Templates', termo: 'ViewContainerRef', definicao: 'Representa um contêiner onde views podem ser inseridas dinamicamente.' },
    { categoria: 'Templates', termo: 'ElementRef', definicao: 'Encapsula uma referência direta a um elemento nativo do DOM.' },

    // Formulários
    { categoria: 'Formulários', termo: 'Template-driven Forms', definicao: 'Formulários definidos majoritariamente no template, usando diretivas como ngModel.' },
    { categoria: 'Formulários', termo: 'Reactive Forms', definicao: 'Formulários definidos de forma explícita e tipada no componente, com FormGroup e FormControl.' },
    { categoria: 'Formulários', termo: 'FormControl', definicao: 'Representa o estado e o valor de um único campo de formulário.' },
    { categoria: 'Formulários', termo: 'FormGroup', definicao: 'Agrupa múltiplos FormControls (ou FormGroups) em uma única unidade.' },
    { categoria: 'Formulários', termo: 'FormArray', definicao: 'Agrupa uma coleção dinâmica de controles de formulário, indexados por posição.' },
    { categoria: 'Formulários', termo: 'FormBuilder', definicao: 'Serviço utilitário que simplifica a criação de FormGroups, FormControls e FormArrays.' },
    { categoria: 'Formulários', termo: 'Validators', definicao: 'Funções embutidas (required, minLength, pattern etc.) usadas para validar controles de formulário.' },
    { categoria: 'Formulários', termo: 'Validadores Assíncronos', definicao: 'Validadores que retornam uma Promise ou Observable, usados para checagens como validação no servidor.' },
    { categoria: 'Formulários', termo: 'Signal Forms', definicao: 'Nova experiência de formulários construída sobre Signals, como alternativa aos Reactive Forms.' },
    { categoria: 'Formulários', termo: 'ngModel', definicao: 'Diretiva que vincula o valor de um campo de formulário a uma propriedade do componente.' },

    // Roteamento
    { categoria: 'Roteamento', termo: 'Router', definicao: 'Serviço que gerencia a navegação entre diferentes views da aplicação.' },
    { categoria: 'Roteamento', termo: 'Routes', definicao: 'Array de configuração que mapeia caminhos (paths) para componentes.' },
    { categoria: 'Roteamento', termo: 'RouterOutlet', definicao: 'Diretiva que marca o local no template onde o componente da rota ativa será renderizado.' },
    { categoria: 'Roteamento', termo: 'RouterLink', definicao: 'Diretiva usada para criar links de navegação declarativos entre rotas.' },
    { categoria: 'Roteamento', termo: 'ActivatedRoute', definicao: 'Fornece acesso às informações da rota atualmente ativa, como parâmetros e dados.' },
    { categoria: 'Roteamento', termo: 'CanActivate / CanActivateFn', definicao: 'Guard que decide se uma rota pode ser ativada, na forma de classe ou de função.' },
    { categoria: 'Roteamento', termo: 'CanDeactivate', definicao: 'Guard que decide se é permitido sair da rota atual, útil para confirmar perda de dados não salvos.' },
    { categoria: 'Roteamento', termo: 'Resolver (ResolveFn)', definicao: 'Busca dados antes da rota ser ativada, disponibilizando-os prontos ao componente.' },
    { categoria: 'Roteamento', termo: 'Lazy Loading de Rotas', definicao: 'Carrega o código de uma rota apenas quando ela é acessada, reduzindo o bundle inicial.' },
    { categoria: 'Roteamento', termo: 'Route Params / Query Params', definicao: 'Valores dinâmicos extraídos da URL, seja do caminho (:id) ou da query string (?busca=).' },
    { categoria: 'Roteamento', termo: 'withComponentInputBinding()', definicao: 'Vincula automaticamente parâmetros de rota a inputs do componente correspondente.' },

    // HTTP e reatividade
    { categoria: 'HTTP e Reatividade', termo: 'HttpClient', definicao: 'Serviço para realizar requisições HTTP, retornando Observables.' },
    { categoria: 'HTTP e Reatividade', termo: 'HttpInterceptor', definicao: 'Intercepta requisições e respostas HTTP para adicionar cabeçalhos, tratar erros ou logar chamadas.' },
    { categoria: 'HTTP e Reatividade', termo: 'Observable', definicao: 'Fluxo de dados assíncrono do RxJS que pode emitir múltiplos valores ao longo do tempo.' },
    { categoria: 'HTTP e Reatividade', termo: 'Subject / BehaviorSubject', definicao: 'Tipos especiais de Observable que também permitem emitir valores manualmente.' },
    { categoria: 'HTTP e Reatividade', termo: 'AsyncPipe', definicao: 'Pipe que se inscreve automaticamente em um Observable ou Promise e libera a inscrição ao destruir.' },
    { categoria: 'HTTP e Reatividade', termo: 'Operadores RxJS', definicao: 'Funções como map, filter e switchMap usadas para transformar e combinar fluxos de dados.' },
    { categoria: 'HTTP e Reatividade', termo: 'rxResource()', definicao: 'Variante de resource() que usa um Observable RxJS como fonte de dados assíncrona.' },
    { categoria: 'HTTP e Reatividade', termo: 'EventEmitter', definicao: 'Classe usada com @Output() para emitir eventos customizados de um componente filho para o pai.' },
    { categoria: 'HTTP e Reatividade', termo: 'takeUntilDestroyed()', definicao: 'Operador RxJS que cancela subscriptions automaticamente quando o contexto de injeção é destruído.' },

    // Diretivas e pipes embutidos
    { categoria: 'Diretivas e Pipes Embutidos', termo: 'NgClass', definicao: 'Diretiva de atributo que adiciona ou remove classes CSS dinamicamente.' },
    { categoria: 'Diretivas e Pipes Embutidos', termo: 'NgStyle', definicao: 'Diretiva de atributo que aplica estilos inline dinamicamente com base em um objeto.' },
    { categoria: 'Diretivas e Pipes Embutidos', termo: 'DatePipe', definicao: 'Pipe embutido para formatar valores de data de acordo com um padrão e localidade.' },
    { categoria: 'Diretivas e Pipes Embutidos', termo: 'CurrencyPipe', definicao: 'Pipe embutido para formatar valores numéricos como moeda.' },
    { categoria: 'Diretivas e Pipes Embutidos', termo: 'DecimalPipe', definicao: 'Pipe embutido para formatar números com casas decimais e separadores.' },
    { categoria: 'Diretivas e Pipes Embutidos', termo: 'JsonPipe', definicao: 'Pipe embutido que converte um valor para sua representação em JSON, útil para debug.' },
    { categoria: 'Diretivas e Pipes Embutidos', termo: 'SlicePipe', definicao: 'Pipe embutido que recorta uma parte de uma lista ou string.' },
    { categoria: 'Diretivas e Pipes Embutidos', termo: 'UpperCasePipe / LowerCasePipe', definicao: 'Pipes embutidos que transformam texto em maiúsculas ou minúsculas.' },
    { categoria: 'Diretivas e Pipes Embutidos', termo: 'TitleCasePipe', definicao: 'Pipe embutido que capitaliza a primeira letra de cada palavra de um texto.' },

    // Detecção de mudanças
    { categoria: 'Detecção de Mudanças', termo: 'Zone.js', definicao: 'Biblioteca que intercepta operações assíncronas do navegador para disparar a detecção de mudanças do Angular.' },
    { categoria: 'Detecção de Mudanças', termo: 'Zoneless', definicao: 'Modo de execução em que o Angular detecta mudanças sem depender do Zone.js, usando Signals.' },
    { categoria: 'Detecção de Mudanças', termo: 'ChangeDetectorRef', definicao: 'Serviço que permite controlar manualmente quando um componente deve ser verificado ou atualizado.' },
    { categoria: 'Detecção de Mudanças', termo: 'ChangeDetectionStrategy.OnPush', definicao: 'Estratégia que limita a verificação do componente a mudanças de referência em seus inputs.' },
    { categoria: 'Detecção de Mudanças', termo: 'markForCheck()', definicao: 'Sinaliza que um componente OnPush precisa ser verificado no próximo ciclo de detecção.' },

    // Testes
    { categoria: 'Testes', termo: 'TestBed', definicao: 'Utilitário principal para configurar e criar módulos de teste no Angular.' },
    { categoria: 'Testes', termo: 'ComponentFixture', definicao: 'Wrapper de teste que dá acesso à instância do componente e ao seu elemento DOM.' },
    { categoria: 'Testes', termo: 'Karma', definicao: 'Test runner tradicional do Angular, historicamente usado para rodar testes em navegadores reais.' },
    { categoria: 'Testes', termo: 'Vitest', definicao: 'Test runner moderno baseado em Vite, que se tornou o padrão em novos projetos Angular.' },
    { categoria: 'Testes', termo: 'fakeAsync / tick', definicao: 'Utilitários que permitem testar código assíncrono de forma síncrona, controlando o tempo manualmente.' },

    // CLI e build
    { categoria: 'CLI e Build', termo: 'Angular CLI', definicao: 'Ferramenta de linha de comando para criar, desenvolver, testar e construir aplicações Angular.' },
    { categoria: 'CLI e Build', termo: 'ng generate', definicao: 'Comando do CLI usado para gerar componentes, serviços, pipes e outros artefatos.' },
    { categoria: 'CLI e Build', termo: 'ng build / ng serve', definicao: 'Comandos do CLI para compilar a aplicação para produção ou servi-la em modo de desenvolvimento.' },
    { categoria: 'CLI e Build', termo: 'esbuild', definicao: 'Bundler extremamente rápido, escrito em Go, usado pelo novo pipeline de build do Angular.' },
    { categoria: 'CLI e Build', termo: 'Vite', definicao: 'Ferramenta de build usada para o servidor de desenvolvimento, com recarregamento quase instantâneo.' },
    { categoria: 'CLI e Build', termo: 'Application Builder', definicao: 'Builder padrão do Angular baseado em esbuild e Vite, substituindo o Webpack.' },
    { categoria: 'CLI e Build', termo: 'Schematics', definicao: 'Geradores de código configuráveis usados pelo CLI para criar e modificar arquivos do projeto.' },

    // SSR e renderização
    { categoria: 'SSR e Renderização', termo: 'Server-Side Rendering (SSR)', definicao: 'Técnica de renderizar a aplicação no servidor antes de enviá-la ao navegador.' },
    { categoria: 'SSR e Renderização', termo: 'Static Site Generation (Prerendering)', definicao: 'Gera páginas HTML estáticas em tempo de build, sem precisar de um servidor Angular em produção.' },
    { categoria: 'SSR e Renderização', termo: 'Hydration', definicao: 'Processo de reativar no cliente o HTML já renderizado pelo servidor, sem recriá-lo do zero.' },
    { categoria: 'SSR e Renderização', termo: 'Hidratação Incremental', definicao: 'Hidrata apenas partes específicas da página sob demanda, combinando SSR com blocos @defer.' },
    { categoria: 'SSR e Renderização', termo: 'TransferState', definicao: 'Mecanismo para repassar dados obtidos no servidor para o cliente, evitando buscá-los duas vezes.' },

    // Animações e acessibilidade
    { categoria: 'Animações e Acessibilidade', termo: 'Angular Animations', definicao: 'Módulo para criar animações declarativas baseadas em estados e transições.' },
    { categoria: 'Animações e Acessibilidade', termo: 'View Transitions API', definicao: 'Integração com a API nativa do navegador para animar trocas de rota e mudanças de DOM.' },
    { categoria: 'Animações e Acessibilidade', termo: '@angular/aria', definicao: 'Pacote que fornece a base para construir bibliotecas de componentes acessíveis.' },
    { categoria: 'Animações e Acessibilidade', termo: 'Angular CDK', definicao: 'Component Dev Kit: conjunto de primitivas de comportamento (overlay, a11y, drag-drop) sem estilo visual.' }
  ];

  protected readonly depreciados: TermoDepreciado[] = [
    {
      termo: 'ViewEngine',
      definicao: 'Motor de renderização e compilador anterior ao Ivy, removido antes do início desta linha do tempo. Sua remoção é o motivo por trás de boa parte das APIs baseadas em "factory" listadas abaixo.',
      desde: 'Removido na v13',
      alternativa: 'Ivy (compilador único desde então, sem necessidade de configuração).'
    },
    {
      termo: 'ComponentFactory / ComponentFactoryResolver',
      definicao: 'APIs usadas para criar componentes dinamicamente a partir de uma "fábrica" de componentes.',
      desde: 'v13 (removidas na v16)',
      alternativa: 'ViewContainerRef.createComponent(Componente), passando a classe diretamente.'
    },
    {
      termo: 'APIs de compilação JIT legadas (Compiler, CompilerFactory, JitCompilerFactory, NgModuleFactory, ModuleWithComponentFactories, getModuleFactory)',
      definicao: 'Conjunto de APIs usadas para acessar o compilador manualmente, necessárias apenas em cenários do ViewEngine.',
      desde: 'v13 (removidas na v16)',
      alternativa: 'Nenhuma ação necessária — o Ivy compila sob demanda automaticamente.'
    },
    {
      termo: 'Bootstrap baseado em factory (ApplicationRef.bootstrap, PlatformRef.bootstrapModuleFactory, ViewContainerRef.createComponent via factory, downgradeModule via factory)',
      definicao: 'Assinaturas antigas que exigiam resolver uma "factory" antes de inicializar componentes ou módulos.',
      desde: 'v13 (removidas na v15)',
      alternativa: 'Assinaturas baseadas em tipo — passar a classe do componente/módulo diretamente.'
    },
    {
      termo: 'Prefixos de template bind-, on-, bindon-, ref-',
      definicao: 'Sintaxe alternativa de binding usada antes da popularização de [ ], ( ) e #.',
      desde: 'v13 (removidos na v15)',
      alternativa: '[prop]="valor", (evento)="acao()", [(ngModel)]="valor" e #referencia.'
    },
    {
      termo: 'Input setter coercion',
      definicao: 'Padrão usado para contornar uma limitação antiga do TypeScript em pares getter/setter de inputs.',
      desde: 'v13 (removido na v15)',
      alternativa: 'Nenhuma ação necessária desde o TypeScript 4.3+ — basta ampliar o tipo do setter.'
    },
    {
      termo: 'fullTemplateTypeCheck',
      definicao: 'Flag de checagem de tipos em templates, antecessora do modo estrito de verificação.',
      desde: 'v13 (removida na v15)',
      alternativa: 'A família de opções strictTemplates.'
    },
    {
      termo: 'TestRequest aceitando ErrorEvent',
      definicao: 'Simulação de erros HTTP em testes usando o tipo ErrorEvent.',
      desde: 'v13 (removido na v16)',
      alternativa: 'ProgressEvent, que reflete o comportamento real dos navegadores.'
    },
    {
      termo: 'ServerTransferStateModule',
      definicao: 'Módulo necessário para usar TransferState em cenários de SSR.',
      desde: 'v14 (removido na v16)',
      alternativa: 'Nenhuma ação necessária — o TransferState já fica disponível automaticamente.'
    },
    {
      termo: 'NgComponentOutlet.ngComponentOutletNgModuleFactory',
      definicao: 'Input usado para indicar, via factory, o módulo de um componente carregado dinamicamente.',
      desde: 'v14 (removido na v17)',
      alternativa: 'ngComponentOutletNgModule, que aceita o módulo diretamente.'
    },
    {
      termo: 'DATE_PIPE_DEFAULT_TIMEZONE',
      definicao: 'Token para configurar o fuso horário padrão do DatePipe.',
      desde: 'v15 (removido na v17)',
      alternativa: 'DATE_PIPE_DEFAULT_OPTIONS, que permite configurar várias opções de uma vez.'
    },
    {
      termo: "providedIn com NgModule ou 'any'",
      definicao: 'Opções do @Injectable para escopar serviços a um módulo específico ou de forma "qualquer".',
      desde: 'v15 (removidas na v17)',
      alternativa: "providedIn: 'root', ou registrar o serviço nos providers do NgModule quando o escopo for realmente necessário."
    },
    {
      termo: 'RouterLinkWithHref',
      definicao: 'Diretiva separada, usada para links de navegação em elementos com atributo href.',
      desde: 'v15 (removida na v17)',
      alternativa: 'RouterLink, que já cobre todos os casos.'
    },
    {
      termo: 'provideRoutes()',
      definicao: 'Função para fornecer rotas adicionais fora da configuração principal do Router.',
      desde: 'v15 (removida na v17)',
      alternativa: 'O InjectionToken ROUTES diretamente.'
    },
    {
      termo: 'Propriedades graváveis do Router (routeReuseStrategy, onSameUrlNavigation, errorHandler, malformedUriErrorHandler)',
      definicao: 'Configuração do Router feita atribuindo valores diretamente às propriedades da instância.',
      desde: 'v15.1 (removidas na v17)',
      alternativa: 'withRouterConfig() e providers na configuração da aplicação.'
    },
    {
      termo: 'Guards CanLoad',
      definicao: 'Guard usado para impedir o carregamento (lazy loading) de módulos ou rotas.',
      desde: 'v15.1 (removido na v17)',
      alternativa: 'CanMatch, que cobre o mesmo caso e ainda permite cair para outra rota.'
    },
    {
      termo: 'Guards e resolvers baseados em classe/InjectionToken',
      definicao: 'Guards de rota implementados como classes ou tokens de injeção, em vez de funções simples.',
      desde: 'v15.2 (removidos na v17)',
      alternativa: 'Guards funcionais, usando inject() dentro de uma função.'
    },
    {
      termo: '@Component.moduleId',
      definicao: 'Propriedade usada para resolver caminhos relativos de templateUrl/styleUrls.',
      desde: 'v16 (removida na v17)',
      alternativa: 'Nenhuma ação necessária — não é mais usada pelo Angular.'
    },
    {
      termo: 'makeStateKey, StateKey e TransferState importados de platform-browser',
      definicao: 'Símbolos de transferência de estado do SSR, antes exportados por platform-browser.',
      desde: 'v16 (removidos na v18)',
      alternativa: 'Importar os mesmos símbolos de @angular/core.'
    },
    {
      termo: 'EnvironmentInjector.runInContext()',
      definicao: 'Método para executar código dentro de um contexto de injeção específico.',
      desde: 'v16 (removido na v18)',
      alternativa: 'runInInjectionContext(), mais flexível e compatível com injetores de elemento.'
    },
    {
      termo: 'BrowserModule.withServerTransition()',
      definicao: 'Método para configurar o ID da aplicação em cenários de SSR.',
      desde: 'v16 (removido na v19)',
      alternativa: 'O token APP_ID.'
    },
    {
      termo: 'AnimationDriver.NOOP',
      definicao: 'Referência estática para um driver de animação "vazio", usado em testes.',
      desde: 'v17 (removida na v19)',
      alternativa: 'Instanciar NoopAnimationDriver diretamente.'
    },
    {
      termo: 'NgProbeToken',
      definicao: 'Token relacionado ao antigo utilitário de debug ng.probe.',
      desde: 'v17 (removido na v19)',
      alternativa: 'ng.getComponent(), disponível desde o Ivy.'
    },
    {
      termo: 'ChangeDetectorRef.checkNoChanges()',
      definicao: 'Método usado para verificar manualmente se a detecção de mudanças está estável.',
      desde: 'v17',
      alternativa: 'Em testes, use ComponentFixture; em código de aplicação, evite chamar esse método diretamente.'
    },
    {
      termo: 'HttpClientModule, HttpClientXsrfModule e HttpClientJsonpModule',
      definicao: 'Módulos NgModule usados para configurar o HttpClient.',
      desde: 'v18',
      alternativa: 'Funções de provider como provideHttpClient(), com withXsrfConfiguration() ou withJsonpSupport() quando necessário.'
    },
    {
      termo: '@Component.interpolation',
      definicao: 'Propriedade para customizar os delimitadores de interpolação do template (trocar {{ }} por outro símbolo).',
      desde: 'v18',
      alternativa: 'Nenhuma — use os delimitadores padrão do Angular.'
    },
    {
      termo: 'Funções de locale de baixo nível (getLocaleId, getCurrencySymbol, getLocaleDateFormat, entre outras)',
      definicao: 'Funções utilitárias de acesso direto aos dados de localidade do Angular.',
      desde: 'v18',
      alternativa: 'Os Pipes embutidos (DatePipe, CurrencyPipe, DecimalPipe) ou a API Intl nativa do navegador.'
    },
    {
      termo: '*ngIf / *ngFor / *ngSwitch',
      definicao: 'Diretivas estruturais clássicas para controle de fluxo no template. Migração recomendada desde a v17, com depreciação oficial anunciada na v20.',
      desde: 'v20',
      alternativa: '@if, @for e @switch — o control flow nativo do template.'
    },
    {
      termo: 'Pacote @angular/platform-browser-dynamic',
      definicao: 'Pacote inteiro usado para compilação JIT diretamente no navegador.',
      desde: 'v20',
      alternativa: 'Nenhuma ação necessária na maioria dos apps — o Application Builder já usa AOT por padrão.'
    },
    {
      termo: 'Integração com HammerJS',
      definicao: 'Suporte embutido a gestos de toque (swipe, pinch etc.) via biblioteca HammerJS.',
      desde: 'v20',
      alternativa: 'Pointer Events nativos do navegador ou outra biblioteca de gestos mantida ativamente.'
    },
    {
      termo: '@angular/platform-server/testing',
      definicao: 'Utilitários para testar o comportamento de renderização SSR em testes unitários.',
      desde: 'v20',
      alternativa: 'Testes end-to-end reais para validar o comportamento de SSR.'
    },
    {
      termo: 'Pacote @angular/animations',
      definicao: 'O pacote inteiro de animações declarativas do Angular (trigger, state, transition, animate).',
      desde: 'v20.2',
      alternativa: 'View Transitions API nativa do navegador ou animações CSS padrão.'
    },
    {
      termo: 'Router.getCurrentNavigation()',
      definicao: 'Método para obter a navegação em andamento a partir do Router.',
      desde: 'v20.2',
      alternativa: 'O signal Router.currentNavigation.'
    },
    {
      termo: 'withFetch()',
      definicao: 'Função de provider usada para habilitar o backend baseado em Fetch no HttpClient.',
      desde: 'v22',
      alternativa: 'Nenhuma ação necessária — o Fetch já é o backend padrão do HttpClient.'
    },
    {
      termo: 'Opção reportProgress do HttpClient',
      definicao: 'Opção única para acompanhar progresso de upload e download em requisições.',
      desde: 'v22',
      alternativa: 'As opções reportUploadProgress e reportDownloadProgress, mais específicas.'
    },
    {
      termo: 'Suporte a XHR em @angular/platform-server',
      definicao: 'Uso do XMLHttpRequest como backend HTTP durante a renderização no servidor.',
      desde: 'v22',
      alternativa: 'A Fetch API padrão.'
    },
    {
      termo: 'HttpClient.jsonp() e HttpClientJsonpModule',
      definicao: 'Suporte a requisições JSONP no HttpClient.',
      desde: 'v22.1',
      alternativa: 'Requisições HTTP padrão — JSONP é uma técnica legada, hoje desnecessária com CORS.'
    },
    {
      termo: 'ModuleWithProviders sem tipo genérico',
      definicao: 'Uso do tipo ModuleWithProviders sem especificar qual NgModule ele representa, em métodos como forRoot(). Ainda sem versão de remoção definida.',
      desde: 'v9',
      alternativa: 'ModuleWithProviders<MeuModulo>, com o tipo explícito.'
    },
    {
      termo: 'Seletores /deep/, >>> e ::ng-deep',
      definicao: 'Combinadores de CSS para "atravessar" o encapsulamento de estilos de um componente. Sem remoção definida, mas já sem suporte nos navegadores.',
      desde: 'v7',
      alternativa: 'CSS custom properties ou :host/:host-context para compartilhar estilo entre componentes.'
    },
    {
      termo: 'deployUrl (CLI)',
      definicao: 'Opção do builder para definir a URL base de onde os assets da aplicação são servidos.',
      desde: 'v13 (removida na v15)',
      alternativa: 'A opção baseHref ou o token de DI APP_BASE_HREF.'
    },
    {
      termo: 'Protractor',
      definicao: 'Framework oficial de testes end-to-end do Angular, descontinuado pela equipe do projeto. O builder correspondente foi removido do CLI na v14.',
      desde: 'v12',
      alternativa: 'Cypress, Playwright ou WebdriverIO.'
    },
    {
      termo: '@angular/flex-layout',
      definicao: 'Biblioteca da equipe Angular para layouts responsivos baseados em diretivas (fxLayout, fxFlex). Arquivada pela equipe mantenedora, sem versão de depreciação formal.',
      desde: 'Arquivada',
      alternativa: 'CSS Grid/Flexbox nativo ou o Angular CDK Layout.'
    },
    {
      termo: '@nguniversal/* (Angular Universal)',
      definicao: 'Pacotes separados que forneciam Server-Side Rendering antes de o SSR ser incorporado ao core.',
      desde: 'v17',
      alternativa: '@angular/ssr, já integrado ao Angular CLI.'
    },
    {
      termo: 'Karma como test runner padrão',
      definicao: 'Executor de testes tradicional do Angular, rodando em navegadores reais. Deixou de ser o padrão em novos projetos na v21.',
      desde: 'v21',
      alternativa: 'Vitest.'
    }
  ];

  protected readonly categorias = computed(() => {
    const unicas = Array.from(new Set(this.glossario.map((t) => t.categoria))).sort((a, b) =>
      a.localeCompare(b, 'pt-BR')
    );
    return ['Todas', ...unicas];
  });

  protected readonly categoriaSelecionada = signal('Todas');

  protected selecionarCategoria(categoria: string): void {
    this.categoriaSelecionada.set(categoria);
    this.paginaAtual.set(1);
  }

  protected readonly ordenacao = signal<Ordenacao>('categoria');

  protected definirOrdenacao(valor: Ordenacao): void {
    this.ordenacao.set(valor);
    this.paginaAtual.set(1);
  }

  protected readonly termoBusca = signal('');

  protected readonly termosFiltrados = computed(() => {
    const consulta = normalizar(this.termoBusca());
    const categoria = this.categoriaSelecionada();

    const resultado = this.glossario.filter((t) => {
      const combinaCategoria = categoria === 'Todas' || t.categoria === categoria;
      const combinaBusca =
        !consulta || normalizar(t.termo).includes(consulta) || normalizar(t.definicao).includes(consulta);
      return combinaCategoria && combinaBusca;
    });

    if (this.ordenacao() === 'alfabetica') {
      return [...resultado].sort((a, b) => a.termo.localeCompare(b.termo, 'pt-BR', { sensitivity: 'base' }));
    }

    return resultado;
  });

  protected atualizarBusca(valor: string): void {
    this.termoBusca.set(valor);
    this.paginaAtual.set(1);
  }

  protected readonly itensPorPagina = 12;

  protected readonly paginaAtual = signal(1);

  protected readonly totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.termosFiltrados().length / this.itensPorPagina))
  );

  protected readonly termosPaginados = computed(() => {
    const inicio = (this.paginaAtual() - 1) * this.itensPorPagina;
    return this.termosFiltrados().slice(inicio, inicio + this.itensPorPagina);
  });

  protected irParaPagina(pagina: number): void {
    this.paginaAtual.set(Math.min(Math.max(1, pagina), this.totalPaginas()));
  }

  protected readonly termoBuscaDepreciados = signal('');

  protected readonly depreciadosFiltrados = computed(() => {
    const consulta = normalizar(this.termoBuscaDepreciados());
    if (!consulta) {
      return this.depreciados;
    }
    return this.depreciados.filter(
      (t) =>
        normalizar(t.termo).includes(consulta) ||
        normalizar(t.definicao).includes(consulta) ||
        normalizar(t.alternativa).includes(consulta)
    );
  });

  protected atualizarBuscaDepreciados(valor: string): void {
    this.termoBuscaDepreciados.set(valor);
    this.paginaAtualDepreciados.set(1);
  }

  protected readonly paginaAtualDepreciados = signal(1);

  protected readonly totalPaginasDepreciados = computed(() =>
    Math.max(1, Math.ceil(this.depreciadosFiltrados().length / this.itensPorPagina))
  );

  protected readonly depreciadosPaginados = computed(() => {
    const inicio = (this.paginaAtualDepreciados() - 1) * this.itensPorPagina;
    return this.depreciadosFiltrados().slice(inicio, inicio + this.itensPorPagina);
  });

  protected irParaPaginaDepreciados(pagina: number): void {
    this.paginaAtualDepreciados.set(Math.min(Math.max(1, pagina), this.totalPaginasDepreciados()));
  }
}
