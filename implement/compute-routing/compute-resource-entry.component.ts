import { ChangeDetectionStrategy, Component } from '@angular/core'

/**
 * Neutral entry point for resource-based navigation.
 *
 * The component itself has no UI or business logic.
 * The route guard resolves the resource and redirects
 * to the canonical compute route.
 */
@Component({
  selector: 'app-compute-resource-entry',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComputeResourceEntryComponent {}
