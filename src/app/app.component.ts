import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from "@angular/router";
import { ConfirmationService, ConfirmSettings, ResolveEmit } from "@jaspero/ng-confirmations";

import { AuthService } from './auth/services/auth.service';
import { environment } from './../environments/environment';
import { UploadService } from './services/upload.service';
import { ValidateService } from './services/validate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private isActive = false;
  currentUser;
  appName: string = environment.appName;
  supportContact: string = environment.supportContact;

  constructor(public authService: AuthService,
    public uploadService: UploadService,
    public validateService: ValidateService,
    private confirmationService: ConfirmationService,
    private router: Router,) {}

  ngOnInit() {}

  getCurrentUserEmail() {
    if (this.authService.loggedIn()) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      return currentUser.email;
    }
  }

  getUserInstitution() {
    if (this.authService.loggedIn()) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      let name = currentUser.institution.name1;
      if (currentUser.institution.name2) {
        name = name + ', ' + currentUser.institution.name2;
      }
      return name;
    }
  }

  onLogin() {
    if (this.uploadService.isValidationActive()) {
      const options: ConfirmSettings = {
        overlay: true,
        overlayClickToClose: false,
        showCloseButton: true,
        confirmText: 'Ok',
        declineText: 'Cancel'
      }

      this.confirmationService
        .create(
          "Upload",
          `<p>Möchten Sie Ihre Daten verwerfen und sich anmelden?</p>`,
          options
        )
        .subscribe((ans: ResolveEmit) => {
          if (ans.resolved) {
            this.router.navigate(["/users/login"]);
          }
        });
    } else {
      this.router.navigate(["/users/login"]);
    }

  }


  getDisplayMode() {
    let displayMode;
    if (this.isActive) {
      displayMode = 'block';
    } else {
      displayMode = 'none';
    }

    return displayMode;
  }

  onLogout() {
    if (this.uploadService.isValidationActive()) {
      const options: ConfirmSettings = {
        overlay: true,
        overlayClickToClose: false,
        showCloseButton: true,
        confirmText: 'Ok',
        declineText: 'Cancel'
      }

      this.confirmationService
        .create(
          "Upload",
          `<p>Möchten Sie Ihre Daten verwerfen und sich abmelden?</p>`,
          options
        )
        .subscribe((ans: ResolveEmit) => {
          if (ans.resolved) {
            this.authService.logout();
          }
        });
    } else {
      this.authService.logout();
    }
  }

}
