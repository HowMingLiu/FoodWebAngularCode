import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutTopComponent } from './layout-top/layout-top.component';
import { LayoutFootComponent } from "./layout-foot/layout-foot.component";


@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, LayoutTopComponent, LayoutFootComponent]
})
export class AppComponent {
}
