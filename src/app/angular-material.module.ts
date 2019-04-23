import { NgModule } from '@angular/core';

import { 
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatRadioModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatTableModule,
    MatDialogModule
 } from '@angular/material';

@NgModule({
    exports: [
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatRadioModule,
        MatExpansionModule,
        MatCheckboxModule,
        MatIconModule,
        MatMenuModule,
        MatDividerModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatTableModule,
        MatDialogModule
    ]
})
export class AngularMaterialModule {}