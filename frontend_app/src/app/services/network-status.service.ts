import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { PluginListenerHandle } from '@capacitor/core';
import { Network, ConnectionStatus } from '@capacitor/network';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkStatusService implements OnDestroy {

  private networkListener: PluginListenerHandle | null = null;
  private networkStatus: ConnectionStatus = {
    connected: false,
    connectionType: 'none',
  };
  private networkStatusSubject: BehaviorSubject<ConnectionStatus> = new BehaviorSubject<ConnectionStatus>(this.networkStatus);

  constructor(private zone: NgZone) {
    Network.addListener('networkStatusChange', (status: ConnectionStatus) => {
      this.zone.run(() => {
        console.log('[NetworkStatusComponent] Network status changed:', status);
        this.networkStatus = status;
        this.networkStatusSubject.next(status);
      });
    })
      .then((listener) => {
        this.networkListener = listener;
        console.log('[NetworkStatusComponent] Listener added successfully');
      })
      .catch((error) => {
        console.error('[NetworkStatusComponent] Error adding listener:', error);
      });
    this.checkNetworkStatus();
  }

  private async checkNetworkStatus() {
    try {
      console.log('[NetworkStatusComponent] Checking network status...');
      this.networkStatus = await Network.getStatus();
      console.log('[NetworkStatusComponent] Current network status:', this.networkStatus.connected, this.networkStatus.connectionType);
      this.networkStatusSubject.next(this.networkStatus);
    } catch (error) {
      console.error('[NetworkStatusComponent] Error checking network status:', error);
    }
  }

  public getNetworkStatus() {
    return this.networkStatusSubject.asObservable();
  }

  ngOnDestroy() {
    if (this.networkListener) {
      this.networkListener.remove();
      console.log('[NetworkStatusService] Listener removed');
    }
  }
}
