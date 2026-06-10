import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-controlled-form",
  templateUrl: "./controlled-form.html",
})
export class ControlledFormComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ["Shaun", [Validators.minLength(2)]], //預設值 + 即時validation
      age: [123], //預設值
      hairColor: ["Brown"], //預設值
    });
  }

  ngOninit() {
    //設定預設值: 也可以用patchValue設定。
    this.form.patchValue({
      name: "Shaun",
      age: 123,
      hairColor: "Brown",
    });

    //即時監聽
    this.form.get("name")?.valueChanges.subscribe((value) => {
      if (value.length < 2) {
        console.log("Name too short");
      }
    });
  }

  submit() {
    console.log(this.form.value);
  }
}
