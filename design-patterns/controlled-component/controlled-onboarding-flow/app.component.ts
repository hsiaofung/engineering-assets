// app.component.ts
import { Component } from "@angular/core";
import { ControlledOnboardingFlowComponent } from "./controlled-onboarding-flow.component";
import { OnboardingStepDirective } from "./onboarding-step.directive";
import {
  StepOneComponent,
  StepTwoComponent,
  StepThreeComponent,
} from "./steps.components";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    ControlledOnboardingFlowComponent,
    OnboardingStepDirective,
    StepOneComponent,
    StepTwoComponent,
    StepThreeComponent,
  ],
  template: `
    <h1>歡迎加入系統</h1>

    <app-controlled-onboarding-flow>
      <ng-template><app-step-one /></ng-template>
      <ng-template><app-step-two /></ng-template>
      <ng-template><app-step-three /></ng-template>
    </app-controlled-onboarding-flow>
  `,
})
export class AppComponent {}
