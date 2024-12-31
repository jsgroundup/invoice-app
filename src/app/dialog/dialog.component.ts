import { Component, OnInit } from '@angular/core';
import { ButtonsComponent } from '../buttons/buttons.component';
import { PopupOverlayComponent } from '../popup-overlay/popup-overlay.component';
import { GlobalService } from '../services/global.service';
import { Store } from '@ngrx/store';
import { AppStore } from '../../store';
import Actions from '../../store/actions/invoices';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [ButtonsComponent, PopupOverlayComponent],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
})
export class DialogComponent {

  activeInvoiceId: string = '';

  constructor(
    public globalService: GlobalService,
    private store: Store<AppStore>,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe(({ id }) => {
      this.activeInvoiceId = id;
    });
  }

  onExit() {
    this.globalService.deleting = false;
  }

  confirmDelete(id: string) {
    this.store.dispatch(Actions.delete({ id }));
    this.onExit();
    this.router.navigateByUrl('/');
  }
}
