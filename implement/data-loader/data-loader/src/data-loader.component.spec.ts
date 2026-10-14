/*
 * Key Testing Areas Covered:
 * - Basic initialization
 * - URL-based HTTP fetching (success + error)
 * - Custom getFn (Observable + Promise support)
 * - Error handling (network, sync, and custom function errors)
 * - Loading state management
 * - signal input reactivity
 * - Priority logic (getFn vs url)
 * - Edge cases (missing inputs, exceptions)
 */

import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
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
      imports: [DataLoaderComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents()

    fixture = TestBed.createComponent(DataLoaderComponent)
    component = fixture.componentInstance
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
    // Restore real timers in case a test enabled Vitest fake timers
    vi.useRealTimers()
  })

  it('should create the component', () => {
    expect(component).toBeTruthy()
    expect(component.data()).toBeNull()
    expect(component.isLoading()).toBe(true)
    expect(component.error()).toBeNull()
  })

  describe('URL-based fetching', () => {
    it('should fetch data using URL input', async () => {
      fixture.componentRef.setInput('url', '/api/test')
      fixture.detectChanges()

      const req = httpMock.expectOne('/api/test')
      expect(req.request.method).toBe('GET')
      req.flush(mockData)

      await fixture.whenStable()

      expect(component.data()).toEqual(mockData)
      expect(component.isLoading()).toBe(false)
      expect(component.error()).toBeNull()
    })

    it('should handle HTTP error when using URL', async () => {
      fixture.componentRef.setInput('url', '/api/error')
      fixture.detectChanges()

      const req = httpMock.expectOne('/api/error')
      req.flush('Error', { status: 500, statusText: 'Server Error' })

      await fixture.whenStable()

      expect(component.data()).toBeNull()
      expect(component.isLoading()).toBe(false)
      expect(component.error()).toBe(mockErrorMsg)
    })
  })

  describe('getFn-based fetching', () => {
    it('should use custom getFn returning Observable', async () => {
      vi.useFakeTimers()
      const getFnSpy = vi.fn().mockReturnValue(of(mockData).pipe(delay(100)))
      fixture.componentRef.setInput('getFn', getFnSpy)
      fixture.detectChanges()

      await vi.advanceTimersByTimeAsync(100)
      fixture.detectChanges()

      expect(getFnSpy).toHaveBeenCalled()
      expect(component.data()).toEqual(mockData)
      expect(component.isLoading()).toBe(false)
      expect(component.error()).toBeNull()
    })

    it('should use custom getFn returning Promise', async () => {
      const getFnSpy = vi.fn().mockReturnValue(Promise.resolve(mockData))
      fixture.componentRef.setInput('getFn', getFnSpy)
      fixture.detectChanges()

      await fixture.whenStable()

      expect(getFnSpy).toHaveBeenCalled()
      expect(component.data()).toEqual(mockData)
      expect(component.isLoading()).toBe(false)
    })

    it('should handle error from getFn Observable', async () => {
      const getFnSpy = vi.fn().mockReturnValue(throwError(() => new Error('Failed')))
      fixture.componentRef.setInput('getFn', getFnSpy)
      fixture.detectChanges()

      await fixture.whenStable()

      expect(component.data()).toBeNull()
      expect(component.isLoading()).toBe(false)
      expect(component.error()).toBe(mockErrorMsg)
    })
  })

  describe('Edge cases', () => {
    it('should set error when neither url nor getFn is provided', () => {
      fixture.detectChanges()

      expect(component.error()).toBe('No valid url or getFn provided')
      expect(component.isLoading()).toBe(false)
      expect(component.data()).toBeNull()
    })

    it('should prioritize getFn over url if both are provided', async () => {
      const getFnSpy = vi.fn().mockReturnValue(of({ custom: true }))
      fixture.componentRef.setInput('url', '/api/test')
      fixture.componentRef.setInput('getFn', getFnSpy)
      fixture.detectChanges()

      await fixture.whenStable()

      expect(component.data()).toEqual({ custom: true })
      httpMock.expectNone('/api/test') // No HTTP request should be made
    })

    it('should handle execution error in try/catch', () => {
      fixture.componentRef.setInput('getFn', () => {
        throw new Error('Sync error')
      })
      fixture.detectChanges()

      expect(component.error()).toBe('Execution error')
      expect(component.isLoading()).toBe(false)
      expect(component.data()).toBeNull()
    })
  })

  describe('signal input behavior', () => {
    it('should refetch when url changes', async () => {
      // First fetch
      fixture.componentRef.setInput('url', '/api/v1')
      fixture.detectChanges()

      httpMock.expectOne('/api/v1').flush(mockData)
      await fixture.whenStable()

      // Second fetch
      fixture.componentRef.setInput('url', '/api/v2')
      fixture.detectChanges()

      httpMock.expectOne('/api/v2').flush({ id: 2 })
      await fixture.whenStable()

      expect(component.data()).toEqual({ id: 2 })
    })

    it('should refetch when getFn changes', async () => {
      const fn1 = () => of({ version: 1 })
      const fn2 = () => of({ version: 2 })

      fixture.componentRef.setInput('getFn', fn1)
      fixture.detectChanges()
      await fixture.whenStable()
      expect(component.data()).toEqual({ version: 1 })

      fixture.componentRef.setInput('getFn', fn2)
      fixture.detectChanges()
      await fixture.whenStable()
      expect(component.data()).toEqual({ version: 2 })
    })
  })
})
