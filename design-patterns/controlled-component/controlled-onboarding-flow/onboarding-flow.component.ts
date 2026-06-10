// controlled-onboarding-flow.component.ts
import { Component, contentChildren, signal, computed, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-controlled-onboarding-flow',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="wizard">
      @if (currentTemplate()) {
        <ng-container [ngTemplateOutlet]="currentTemplate()"></ng-container>
      }

      <div class="buttons">
        <button (click)="prev()" [disabled]="currentIdx() === 0">上一步</button>
        <button (click)="next()" [disabled]="isLastStep()">下一步</button>
      </div>
    </div>
  `
})
export class ControlledOnboardingFlowComponent {
  // ✨ 關鍵：直接抓取所有的 TemplateRef
  readonly steps = contentChildren(TemplateRef);
  
  readonly currentIdx = signal(0);

  readonly currentTemplate = computed(() => this.steps()[this.currentIdx()]);
  readonly isLastStep = computed(() => this.currentIdx() === this.steps().length - 1);

  next() { if (!this.isLastStep()) this.currentIdx.update(i => i + 1); }
  prev() { if (this.currentIdx() > 0) this.currentIdx.update(i => i - 1); }
}