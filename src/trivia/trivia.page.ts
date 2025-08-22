import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButton } from 'primeng/radiobutton';
import { ToggleButton } from 'primeng/togglebutton';
import { TriviaForm } from './trivia-form.service';

@Component({
  selector: 'app-trivia',
  imports: [
    InputNumberModule,
    CommonModule,
    FormsModule,
    FloatLabelModule,
    Button,
    ToggleButton,
    Divider,
    RadioButton,
  ],
  templateUrl: './trivia.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TriviaPage {
  readonly triviaForm = inject(TriviaForm);
}
