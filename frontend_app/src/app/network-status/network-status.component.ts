import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { PluginListenerHandle } from '@capacitor/core';
import { ConnectionStatus, Network } from '@capacitor/network';
import { NgZone } from '@angular/core';
import { NetworkStatusService } from '../services/network-status.service';

@Component({
  selector: 'app-network-status',
  templateUrl: './network-status.component.html',
  styleUrls: ['./network-status.component.scss'],
})
export class NetworkStatusComponent implements OnInit, OnDestroy {
  networkStatus: ConnectionStatus = {
    connected: false,
    connectionType: 'none',
  };

  constructor(private network_status_service: NetworkStatusService,
    private cd: ChangeDetectorRef
  ) {
    console.log('[NetworkStatusComponent] Constructor initialized');
  }

  ngOnInit() {
    this.network_status_service.getNetworkStatus().subscribe(status => {
      this.networkStatus = status;
      this.cd.detectChanges();
    });
  }

   ionViewDidEnter() {
    console.log('[NetworkStatusComponent] ionViewDidEnter called');
  }

  ionViewWillEnter() {
    console.log('[NetworkStatusComponent] ionViewWillEnter called');
  }

  ionViewWillLeave() {
    console.log('[NetworkStatusComponent] ionViewWillLeave called');
    
  }

  ngOnDestroy(): void {
    console.log('[NetworkStatusComponent] ngOnDestroy called');
  }
}
