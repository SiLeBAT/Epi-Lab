import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DefaultInstitution } from '../../../user/model/institution.model';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

export interface RegistrationDetails {
    email: string;
    firstName: string;
    lastName: string;
    instituteName: string;
    password: string;
}

@Component({
    selector: 'mibi-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    @Input() institutions: DefaultInstitution[];
    private pwStrength: number;
    @Output() register = new EventEmitter();
    filteredOptions: Observable<DefaultInstitution[]>;
    constructor(
        private changeRef: ChangeDetectorRef) {
        this.pwStrength = -1;
    }

    ngOnInit() {
        this.registerForm = new FormGroup({
            institution: new FormControl(null, Validators.required),
            firstName: new FormControl(null, Validators.required),
            lastName: new FormControl(null, Validators.required),
            email: new FormControl(null, [
                Validators.required,
                Validators.email
            ]),
            password1: new FormControl(null, [Validators.required, Validators.minLength(8)]),
            password2: new FormControl(null)
        }, this.passwordConfirmationValidator);

        this.filteredOptions = this.registerForm.controls.institution.valueChanges
            .pipe(
                startWith(''),
                map(value => {
                    if (!value) {
                        return this.institutions;
                    }
                    return this._filter(value);
                })
            );
    }

    private _filter(value: string): DefaultInstitution[] {
        try {
            const filterValue = value.toLowerCase();

            return this.institutions.filter(inst => {
                return inst.name1.toLowerCase().includes(filterValue)
                    || inst.name2.toLowerCase().includes(filterValue)
                    || inst.location.toLowerCase().includes(filterValue);
            });
        } catch (err) {
            return [];
        }
    }

    onRegister() {
        if (this.registerForm.valid) {
            const details: RegistrationDetails = {
                email: this.registerForm.value.email,
                firstName: this.registerForm.value.firstName,
                lastName: this.registerForm.value.lastName,
                instituteName: this.registerForm.value.institution,
                password: this.registerForm.value.password1

            };
            this.register.emit(details);

        }
    }

    validateField(fieldName: string) {
        return this.registerForm.controls[fieldName].valid
            || this.registerForm.controls[fieldName].untouched;
    }

    validatePwStrength() {
        return (this.pwStrength >= 0 && this.pwStrength < 2);
    }

    doStrengthChange(pwStrength: number) {
        this.pwStrength = pwStrength;
        this.changeRef.detectChanges();
    }

    private passwordConfirmationValidator(fg: FormGroup) {
        const pw1 = fg.controls.password1;
        const pw2 = fg.controls.password2;

        if (pw1.value !== pw2.value) {
            pw2.setErrors({ validatePasswordConfirm: true });
        } else {
            pw2.setErrors(null);
        }
        return null;
    }
}
