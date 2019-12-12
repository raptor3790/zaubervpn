import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';
import { ContactService } from 'src/app/core/services';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})

export class ContactComponent implements OnInit {

  contactForm: FormGroup;

  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private _contactService: ContactService,
    private _sNotify: SnotifyService,
  ) { }

  ngOnInit() {
    this.contactForm = this.formBuilder.group({
      name: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      subject: [null, Validators.required],
      message: [null, Validators.required]
    });
  }

  onSubmit(event) {
    event.preventDefault();
    this.submitted = true;

    if (this.contactForm.invalid) {
      return;
    }

    this.loading = true;

    this._contactService.sendContact(this.contactForm.value).subscribe(() => {
      this.loading = false;

      this._sNotify.success('Sent message to support team successfully.', {timeout: 3000});
    }, () => {
      this.loading = false;

      this._sNotify.error('Error occured while send message.', {timeout: 3000});
    });
  }

  get controls() { return this.contactForm.controls; }

  isInvalid(field) {
    return ((this.submitted || this.contactForm.get(field).touched) && this.contactForm.get(field).errors);
  }

}
