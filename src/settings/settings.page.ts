import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Divider } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleButton } from 'primeng/togglebutton';
import { ThemeService } from '../theme/theme.service';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-settings',
  imports: [InputNumberModule, CommonModule, FormsModule, FloatLabelModule, ToggleButton, Divider],
  templateUrl: './settings.page.html',
})
export class SettingsPage {
  readonly settingsService = inject(SettingsService);
  readonly themeService = inject(ThemeService);
}
