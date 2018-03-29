import {
  Component,
  HostListener,
  ElementRef,
  ViewChild,
  NgZone,
  Renderer2
} from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  public lastScrollTop: number = 0;
  public lastScrollLeft: number = 0;
  public direction: string = "";
  public counter: number = 0;
  public isDouble: boolean = false;
  public background: string = '';

  constructor(lc: NgZone, private renderer: Renderer2) {
    window.onscroll = () => {
      let st = window.pageYOffset;
      let dr = window.pageXOffset;
      let dir = '';
      if (st > this.lastScrollTop && dr == this.lastScrollLeft) {
        dir = "down";
      } else if (st <= this.lastScrollTop && dr == this.lastScrollLeft) {
        dir = "up";
      } else if (dr > this.lastScrollLeft && st == this.lastScrollTop) {
        dir = "right";
      } else if (dr <= this.lastScrollLeft && st == this.lastScrollTop) {
        dir = "left";
      }

      this.lastScrollTop = st;
      this.lastScrollLeft = dr;
      lc.run(() => {
        this.direction = dir;
      });
    };
  }

  @ViewChild('box') private boxElement: ElementRef;

  @HostListener('scroll', ['$event'])
  onElementScroll($event) {
    console.log("element scrolling");
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {
    console.log("window scrolling");

    this.clearStyles();

    if (this.direction) {
      if (this.direction == 'up') {
        this.renderer.setStyle(this.boxElement.nativeElement, 'top', '0');
      } else if (this.direction == 'down') {
        this.renderer.setStyle(this.boxElement.nativeElement, 'bottom', '0');
      } else if (this.direction == 'left') {
        this.renderer.setStyle(this.boxElement.nativeElement, 'left', '0');
      } else if (this.direction == 'right') {
        this.renderer.setStyle(this.boxElement.nativeElement, 'right', '0');
      }

      this.renderer.setStyle(this.boxElement.nativeElement, 'position', 'absolute');
      this.renderer.setStyle(this.boxElement.nativeElement, 'background-image', 'url(../assets/img/blue.png)');
    }
  }

  clearStyles() {
    this.renderer.removeStyle(this.boxElement.nativeElement, 'top');
    this.renderer.removeStyle(this.boxElement.nativeElement, 'bottom');
    this.renderer.removeStyle(this.boxElement.nativeElement, 'left');
    this.renderer.removeStyle(this.boxElement.nativeElement, 'right');
  }

  click() {
    this.counter += 1;
    if (this.counter > 100) {
      this.counter = 0;
    }
  }

  doubleClick() {
    this.isDouble = !this.isDouble;
    let c = '';
    for (let i = 0; i < this.counter; i++) {
      c += c.length == 0 ? '#' + Math.random().toString(16).substr(-6) : ', ' + '#' + Math.random().toString(16).substr(-6);
    }

    if (c) {
      this.background = 'linear-gradient(90deg, ' + c + ')';
    }
  }

}
