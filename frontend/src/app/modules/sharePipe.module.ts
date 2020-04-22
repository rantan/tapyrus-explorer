import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentFromNowPipe } from '../moment-from-now.pipe';

@NgModule({
    declarations: [ MomentFromNowPipe ],
    imports: [
        CommonModule
    ],
    exports: [
        MomentFromNowPipe
    ]
})
export class SharedPipeModule {}
