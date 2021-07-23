import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fab',
  templateUrl: './fab.component.html',
  styleUrls: ['./fab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FabComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
