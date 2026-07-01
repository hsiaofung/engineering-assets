/*
 * Key Testing Areas Covered:
 * - Basic initialization
 * - URL-based HTTP fetching (success + error)
 * - Custom getFn (Observable + Promise support)
 * - Error handling (network, sync, and custom function errors)
 * - Loading state management
 * - ngOnChanges reactivity
 * - Priority logic (getFn vs url)
 * - Edge cases (missing inputs, exceptions)
 */

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing'
import { delay, of, throwError } from 'rxjs'
import { DataLoaderComponent } from './data-loader.component'

describe('DataLoaderComponent', () => {
  let component: DataLoaderComponent<any>
  let fixture: ComponentFixture<DataLoaderComponent<any>>
  let httpMock: HttpTestingController

  const mockData = { id: 1, name: 'Test Data' }
  const mockErrorMsg = 'Data loading failed'

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, DataLoaderComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(DataLoaderComponent)
    component = fixture.componentInstance
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })

  it('should create the component', () => {
    expect(component).toBeTruthy()
    expect(component.data()).toBeNull()
    expect(component.isLoading()).toBeTrue()
    expect(component.error()).toBeNull()
  })

  describe('URL-based fetching', () => {
    it('should fetch data using URL input', fakeAsync(() => {
      component.url = '/api/test'

      component.ngOnChanges()

      const req = httpMock.expectOne('/api/test')
      expect(req.request.method).toBe('GET')
      req.flush(mockData)

      tick()

      expect(component.data()).toEqual(mockData)
      expect(component.isLoading()).toBeFalse()
      expect(component.error()).toBeNull()
    }))

    it('should handle HTTP error when using URL', fakeAsync(() => {
      component.url = '/api/error'

      component.ngOnChanges()

      const req = httpMock.expectOne('/api/error')
      req.flush('Error', { status: 500, statusText: 'Server Error' })

      tick()

      expect(component.data()).toBeNull()
      expect(component.isLoading()).toBeFalse()
      expect(component.error()).toBe(mockErrorMsg)
    }))
  })

  describe('getFn-based fetching', () => {
    it('should use custom getFn returning Observable', fakeAsync(() => {
      const getFnSpy = jasmine.createSpy().and.returnValue(of(mockData).pipe(delay(100)))
      component.getFn = getFnSpy

      component.ngOnChanges()

      tick(100)

      expect(getFnSpy).toHaveBeenCalled()
      expect(component.data()).toEqual(mockData)
      expect(component.isLoading()).toBeFalse()
      expect(component.error()).toBeNull()
    }))

    it('should use custom getFn returning Promise', fakeAsync(() => {
      const getFnSpy = jasmine.createSpy().and.returnValue(Promise.resolve(mockData))
      component.getFn = getFnSpy

      component.ngOnChanges()

      tick()

      expect(getFnSpy).toHaveBeenCalled()
      expect(component.data()).toEqual(mockData)
      expect(component.isLoading()).toBeFalse()
    }))

    it('should handle error from getFn Observable', fakeAsync(() => {
      const getFnSpy = jasmine.createSpy().and.returnValue(throwError(() => new Error('Failed')))
      component.getFn = getFnSpy

      component.ngOnChanges()

      tick()

      expect(component.data()).toBeNull()
      expect(component.isLoading()).toBeFalse()
      expect(component.error()).toBe(mockErrorMsg)
    }))
  })

  describe('Edge cases', () => {
    it('should set error when neither url nor getFn is provided', () => {
      component.ngOnChanges()

      expect(component.error()).toBe('No valid url or getFn provided')
      expect(component.isLoading()).toBeFalse()
      expect(component.data()).toBeNull()
    })

    it('should prioritize getFn over url if both are provided', fakeAsync(() => {
      component.url = '/api/test'
      const getFnSpy = jasmine.createSpy().and.returnValue(of({ custom: true }))
      component.getFn = getFnSpy

      component.ngOnChanges()

      tick()

      expect(component.data()).toEqual({ custom: true })
      httpMock.expectNone('/api/test') // No HTTP request should be made
    }))

    it('should handle execution error in try/catch', () => {
      component.getFn = () => {
        throw new Error('Sync error')
      }
      component.ngOnChanges()

      expect(component.error()).toBe('Execution error')
      expect(component.isLoading()).toBeFalse()
      expect(component.data()).toBeNull()
    })
  })

  describe('ngOnChanges behavior', () => {
    it('should refetch when url changes', fakeAsync(() => {
      // First fetch
      component.url = '/api/v1'
      component.ngOnChanges()

      httpMock.expectOne('/api/v1').flush(mockData)
      tick()

      // Second fetch
      component.url = '/api/v2'
      component.ngOnChanges()

      httpMock.expectOne('/api/v2').flush({ id: 2 })
      tick()

      expect(component.data()).toEqual({ id: 2 })
    }))

    it('should refetch when getFn changes', fakeAsync(() => {
      const fn1 = () => of({ version: 1 })
      const fn2 = () => of({ version: 2 })

      component.getFn = fn1
      component.ngOnChanges()
      tick()
      expect(component.data()).toEqual({ version: 1 })

      component.getFn = fn2
      component.ngOnChanges()
      tick()
      expect(component.data()).toEqual({ version: 2 })
    }))
  })
})
