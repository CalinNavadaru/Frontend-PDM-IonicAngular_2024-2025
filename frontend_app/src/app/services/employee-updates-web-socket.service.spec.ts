import { TestBed } from '@angular/core/testing';

import { EmployeeUpdatesWebSocketService } from './employee-updates-web-socket.service';

describe('EmployeeUpdatesWebSocketService', () => {
  let service: EmployeeUpdatesWebSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeUpdatesWebSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
