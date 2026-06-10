// onboarding-step.directive.ts
import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
  selector: '[appOnboardingStep]', // 用這個屬性來標記步驟
  standalone: true
})
export class OnboardingStepDirective {
  // 直接注入該步驟的 Template
  templateRef = inject(TemplateRef);
}