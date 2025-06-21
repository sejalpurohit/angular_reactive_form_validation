import { Component } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import Validation from "./utils/validation";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  form: FormGroup = new FormGroup({
    fullname: new FormControl(""),
    username: new FormControl(""),
    email: new FormControl(""),
    emaill: new FormControl(""),
    password: new FormControl(""),
    confirmPassword: new FormControl(""),
    acceptTerms: new FormControl(false),
  });
  submitted = false;
  
  downloadJsonHref: any;

  constructor(
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        fullname: ["", Validators.required],
        username: [
          "",
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
          ],
        ],
        email: ["", [Validators.required, Validators.email]],
        password: [
          "",
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40),
          ],
        ],
        confirmPassword: ["", Validators.required],
        acceptTerms: [false, Validators.requiredTrue],
      },
      {
        validators: [Validation.match("password", "confirmPassword")],
      }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    } else {
      console.log(JSON.stringify(this.form.value, null, 2));

      this.generateDownloadJsonUri(this.form.value);
    }
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }

  generateDownloadJsonUri(value: any) {

    value.password= "***";
    value.confirmPassword="***"


    
    var theJSON = JSON.stringify(value);
    var uri = this.sanitizer.bypassSecurityTrustUrl(
      "data:text/json;charset=UTF-8," + encodeURIComponent(theJSON)
    );
    this.downloadJsonHref = uri;
  }
}
