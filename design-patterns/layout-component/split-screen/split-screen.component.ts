// split-screen.component.ts
@Component({
  selector: 'app-split-screen',
  standalone: true,
  template: `
    <div class="split-screen">
      <div class="pane left-pane" [style.flex]="leftWeight">
        <ng-content select="[left]"></ng-content>
      </div>
      <div class="pane right-pane" [style.flex]="rightWeight">
        <ng-content select="[right]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .split-screen { display: flex; width: 100%; height: 100%; overflow: hidden; }
    .pane { overflow: auto; min-width: 0; }
  `]
})
export class SplitScreenComponent {
  @Input() leftWeight: number = 1;
  @Input() rightWeight: number = 1;
}