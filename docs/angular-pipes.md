**Angular Pipes: Pure vs Impure — Quick Reference
**

- **Purpose:** concise guidance for junior devs on when to use pure vs impure pipes, with examples and alternatives.

**What Angular Checks**
- **By Reference:** Angular compares non-primitive inputs by reference (===). It does not deep-inspect heap contents.
- **Primitives vs References:** primitives (string, number, boolean) compare by value; objects/arrays/functions/observables compare by reference.

**Pure Pipes (default)**
- **Behavior:** executed only when the input reference changes.
- **Use For:** stateless, deterministic transforms (formatting, filtering based on new array references, string transforms).
- **Example:**

```ts
@Pipe({ name: 'fmt' })
export class FmtPipe implements PipeTransform {
  transform(v: string) { return v.trim().toUpperCase(); }
}
```

**Impure Pipes (`pure: false`)**
- **Behavior:** executed every change-detection cycle.
- **When Required:** the transform result can change without the input reference changing — e.g. when the pipe reads mutated arrays/objects, global/ngrx state inside the pipe, `Math.random()` or `Date.now()`.
- **Performance:** expensive transforms in impure pipes can degrade performance; avoid side effects.
- **Declare:** `@Pipe({ name: 'mypipe', pure: false })`

**Why reference types matter**
- If you `push()` onto an array, the reference stays the same, so Angular/pure-pipe will not run.
- To make pure pipes detect changes, produce a new reference (immutable update): `items = [...items, newItem]`.

**Common Alternatives (prefer these over impure pipes)**
- **Immutable updates:** return new arrays/objects so pure pipes run only when needed.
- **Observables + `async` pipe:** keep streams in component and use `| async` in template (good with NgRx selectors).
- **Compute in component:** update bound value in component and bind to template.
- **OnPush + markForCheck():** control change detection and avoid frequent full checks.

**Examples**
- Impure pipe reading global state (bad for performance):

```ts
@Pipe({ name: 'itemsFilter', pure: false })
export class ItemsFilterPipe implements PipeTransform {
  constructor(private store: Store<AppState>) {}
  transform(items: Item[], filterId: string) {
    const filter = this.store.selectSnapshot(selectFilterById(filterId));
    return items.filter(i => matches(i, filter));
  }
}
```

- Preferred: use selector in component and `async` pipe in template:

```ts
// component.ts
items$ = this.store.select(selectItems).pipe(map(items => items.filter(i => matches(i, this.filter))));
```

```html
<!-- template -->
<ul>
  <li *ngFor="let it of items$ | async">{{ it.name }}</li>
</ul>
```

**Migration Pattern (impure → observable + async)**
1. Move logic out of pipe into a selector/service or component method.
2. Expose an `Observable` on the component (use `select`, `combineLatest`, `map`).
3. Use `| async` in template.

**Quick Checklist for Junior Devs**
- **Q:** Does the output change when the input reference stays identical? — **Yes** → consider `pure: false` or, better, use observable/immutable pattern.
- **Q:** Does the transform use global or external state (`Math.random()`, `Date`, NgRx store)? — **Yes** → avoid doing it in a pure pipe; prefer observable/component.
- **Q:** Is the transform expensive? — **Yes** → avoid impure pipe; compute upstream and cache results.
- **Action:** Prefer pure pipes + immutable updates; use `async` for reactive data.

**References**
- Angular guide: pipes and change detection
- `AsyncPipe` is impure by design (it reacts to emissions)

---
Created as `docs/angular-pipes.md` — ask if you want additional examples or a short slide-friendly cheat sheet.
