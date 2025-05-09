# spider-baby-utils-testing

This library provides test-friendly utilities and wrappers for Angular projects.

## Provided Services

### AnimationFrameService

A testable wrapper for browser animation frame APIs. Use this service in your components or other services instead of calling `requestAnimationFrame` or `cancelAnimationFrame` directly. This makes it easy to mock or spy on animation frame behavior in your unit tests.

#### Usage Example

```typescript
import { AnimationFrameService } from 'spider-baby-utils-testing';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private animationFrame: AnimationFrameService) {}

  applyChanges() {
    this.animationFrame.request(() => {
      // DOM operations here
    });
  }
}
```

#### Testing Example

```typescript
const mockAnimationFrame = {
  request: (cb: FrameRequestCallback) => { cb(0); return 0; },
  cancel: (id: number) => {}
};
TestBed.configureTestingModule({
  providers: [
    { provide: AnimationFrameService, useValue: mockAnimationFrame }
  ]
});
```

#### Used By
- `ThemeGeneratorService` (see `@spider-baby/theming`): Uses `AnimationFrameService` to schedule DOM updates in a testable way.

## Running unit tests

Run `nx test spider-baby-utils-testing` to execute the unit tests.
