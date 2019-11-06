import { Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { ToolTip, TOOLTIP_CLASS_HOOK, createToolTip, ToolTipTheme } from '../../../shared/model/tooltip.model';

@Component({
    selector: 'mibi-last-change-display',
    templateUrl: './last-change-display.component.html',
    styleUrls: ['./last-change-display.component.scss']
})
export class LastChangeDisplayComponent implements AfterViewInit {
    @Input() lastChange$: Observable<moment.Moment>;
    @Input() serverVersion: string;
    @Input() clientVersion: string;
    @ViewChild('entry', { read: ElementRef, static: false }) entry: ElementRef;
    tooltipClassName = TOOLTIP_CLASS_HOOK;
    private toolTip: ToolTip;

    constructor() {
        this.toolTip = createToolTip(ToolTipTheme.INFO, 'top');
    }

    ngAfterViewInit(): void {

        const display: string[] = [];
        if (this.serverVersion) {
            display.push('server version@' + this.serverVersion);
        }
        if (this.clientVersion) {
            display.push('client version@' + this.clientVersion);
        }
        $(this.entry.nativeElement).tooltipster(this.toolTip.getOptions(
            display));
    }
}
