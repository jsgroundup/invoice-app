import { Component, OnDestroy } from '@angular/core';
import { InputsComponent } from "../inputs/inputs.component";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonsComponent } from '../buttons/buttons.component';
import { PopupOverlayComponent } from "../popup-overlay/popup-overlay.component";
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Invoice } from '../../data/data';
import { GlobalService } from '../services/global.service';
import { Router } from '@angular/router';
import Actions  from '../../store/actions/invoices'
import { NetworkingService } from '../services/networking.service';
import { LoaderComponent } from "../loader/loader.component";

// { email: 'bismark.yamoah@amalitech.com', name: 'Bismark Yamoah', password: U@4z!Q7x&6y% },

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    InputsComponent,
    ButtonsComponent,
    LoaderComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnDestroy {
  form!: FormGroup<FormFields>;
  fb = new FormBuilder();
  authenticating = false;
  loadingInvoices = false;
  aboutSigningIn = false;
  wrongCredentials = false;
  timeout?: ReturnType<typeof setTimeout>;
  noInternetConection = false;
  loadingMessages = {
    authenticating: ['Signing you in.', 'Please wait a minute...'],
    loadingInvoices: ['Loading your invoices.', 'Please wait a minute...'],
  };

  constructor(
    private http: HttpClient,
    private store: Store,
    private globalService: GlobalService,
    private router: Router,
    private network: NetworkingService
  ) {
    this.form = this.fb.group({
      email: [
        '',
        {
          validators: [
            Validators.email,
            Validators.pattern(/(\.[^\.]+)$/),
            Validators.maxLength(64),
            Validators.minLength(5),
            Validators.pattern(/[^\s+]/),
          ],
        },
      ],
      password: [
        '',
        {
          validators: [Validators.minLength(7), Validators.maxLength(64)],
        },
      ],
    });
  }
  ngOnDestroy(): void {
    clearTimeout(this.timeout);
  }

  getFormControl(name: keyof FormFields) {
    return this.form.controls[name];
  }

  controllErrored(controlName: keyof FormFields) {
    if (this.wrongCredentials) return true;
    const control = this.form.controls[controlName];
    if (
      this.aboutSigningIn &&
      (!control.touched || control.getRawValue().trim().length < 1)
    )
      return true;
    return control.touched && control.invalid;
  }

  onClose() {
    alert('Close');
  }

  onFocus() {
    this.aboutSigningIn = false;
    this.wrongCredentials = false;
  }

  onSignIn() {
    this.aboutSigningIn = true;
    if (this.controllErrored('email') || this.controllErrored('password')) {
      return;
    }
    // Start the authentication process and display loading spinner
    this.authenticating = true;

    // Login to request for access token
    this.network.logIn({
      username: this.form.controls.email.getRawValue(),
      password: this.form.controls.password.getRawValue(),

      onNext: (res) => {
        if (!!res.token) {
          // Save the token in the local storage
          // this.globalService.token = (res as { token: string }).token;
          // localStorage.setItem('token', this.globalService.token);

          this.timeout = setTimeout(() => {
            this.authenticating = false;
            this.wrongCredentials = false;

            // Load the invoices
            this.loadInvoices((res as { token: string }).token);
          }, 1000);
        } else {
          // Show error message
          this.wrongCredentials = true;
          this.hidePopup();
        }
      },
      onError: (err) => {
        console.log(err);

        this.timeout = setTimeout(() => {
          if (err.status === 0) {
            // No internet connection
            this.noInternetConection = true;
            return;
          }
          // Show error message
          this.wrongCredentials = true;
          this.hidePopup();
        }, 2000);
      },
    });
  }

  hidePopup() {
    this.authenticating = false;
    this.loadingInvoices = false;
    this.noInternetConection = false;
  }

  retry() {
    this.authenticating = true;
    this.loadingInvoices = false;
    this.noInternetConection = false;
    this.onSignIn();
  }

  // david.quaye@amalitech.com
  // `5vfRUTFN>?*
  loadInvoices(token: string) {
    // Start the authentication process and display loading spinner
    this.loadingInvoices = true;

    // Loads invoinces data before page loads
    this.network.loadInvoices({
      token: token,
      onNext: (invoices) => {
        // Save the invoices in the store
        this.store.dispatch(
          Actions.addInitial({ invoices: invoices as Array<Invoice> })
        );

        this.timeout = setTimeout(() => {
          this.loadingInvoices = false;
          this.globalService.token = token;

          // Store token in the local storage
          localStorage.setItem('token', token);
        }, 1000);
      },
      onError: (error) => {},
    });

    // // Request for access token
    // this.http
    //   .get<Invoice[]>(
    //     'https://invoice-app-bknd-strapi-cloud.onrender.com/invoices',
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token || ''}`,
    //       },
    //     }
    //   )
    //   .subscribe({
    //     next: (res) => {
    //       console.log(res);
    //       debugger;
    //       if (!!(res as Array<Invoice>)?.length) {
    //         // Save the invoices in the store
    //         this.store.dispatch(
    //           Actions.addInitial({ invoices: res as Array<Invoice> })
    //         );

    //         // Save invoices in the local storage
    //         try {
    //           localStorage.setItem('invoices', JSON.stringify(res));
    //           localStorage.setItem('token', token);
    //         } catch (error) {
    //           this.loadingInvoices = false;
    //           return;
    //         }

    //         this.timeout = setTimeout(() => {
    //           this.loadingInvoices = false;
    //           this.globalService.token = localStorage.getItem('token') || '';

    //           debugger;
    //           // Redirect to the invoices page
    //           // this.router.navigate(['/']);
    //         }, 1000);
    //       } else {
    //         // Redirect to the invoices page
    //         // this.router.navigate(['/']);
    //         console.log('!!(res as Array<Invoice>)?.length');
    //       }
    //     },
    //     error: (err) => {
    //       debugger;
    //       this.loadingInvoices = false;
    //       // Redirect to the invoices page
    //       // this.router.navigate(['/']);
    //       console.log(err);
    //     },
    //   });
  }
}

type FormFields = { email: FormControl; password: FormControl };
