import { TestBed } from '@angular/core/testing'
import { NotificationService } from './notification.service'

describe('NotificationService', () => {
  let service: NotificationService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(NotificationService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should set notification payload on show', () => {
    service.show({
      message: 'Hello',
      messageType: 'success',
      timeStamp: 123,
    })

    expect(service.notification()).toEqual({
      message: 'Hello',
      messageType: 'success',
      timeStamp: 123,
    })
  })

  it('should clear notification payload', () => {
    service.show({
      message: 'Hello',
      messageType: 'success',
      timeStamp: 123,
    })
    service.clear()

    expect(service.notification()).toEqual({
      message: '',
      messageType: '',
      timeStamp: 0,
    })
  })
})
