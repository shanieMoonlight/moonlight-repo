/* eslint-disable @typescript-eslint/no-explicit-any */
import { of } from 'rxjs'
import { inject } from '@angular/core'
import { MiniCrudStateBuilder } from './mini-state-crud-builder'
import { MiniCrudStateNew } from './mini-state-crud.new'

//################################//

// Mock @angular/core before importing modules that call `inject()`
jest.mock('@angular/core', () => {
  const actual = jest.requireActual('@angular/core')
  return {
    ...actual,
    inject: jest.fn(),
    DestroyRef: jest.fn(),
  }
})

// Mock rxjs interop used by MiniState
jest.mock('@angular/core/rxjs-interop', () => ({
  toSignal: jest.fn((observable: any, options?: any) => {
    const initial = options?.initialValue
    let current = initial
    const ctrl: any = { updateValue: (v: any) => current = v }
    const s: any = () => current
    s._controller = ctrl
    if (observable) {
      const sub = observable.subscribe({ next: (v: any) => ctrl.updateValue(v), error: () => {} })
      s._subscription = sub
    }
    return s
  }),
  takeUntilDestroyed: jest.fn(() => (src: any) => src),
  toObservable: jest.fn((signal: any) => of(signal()))
}))

//################################//

describe('MiniCrudStateBuilder', () => {
  const mockDestroyRef: any = { onDestroy: jest.fn(), destroyed: false }

  beforeEach(() => {
    (inject as jest.Mock).mockReturnValue(mockDestroyRef)
    jest.clearAllMocks()
  })

  it('creates and builds a MiniCrudStateNew, calling getAll trigger', () => {
    const getAllTrigger = jest.fn().mockReturnValue(of([]))

    const builder = MiniCrudStateBuilder.Create(getAllTrigger)

    const crud = builder.build('my-filter' as any)

    expect(crud).toBeInstanceOf(MiniCrudStateNew)
    expect(inject).toHaveBeenCalledWith(expect.any(Function))
    // the getAll trigger should have been called as part of build()
    expect(getAllTrigger).toHaveBeenCalledWith('my-filter')
  })

  it('wires add/update/delete states and triggers call through', () => {
    const getAllTrigger = jest.fn().mockReturnValue(of([]))
    const addTrigger = jest.fn().mockReturnValue(of({ id: 1, name: 'X' }))
    const updateTrigger = jest.fn().mockReturnValue(of({ updatedOnUtc: 'now' }))
    const deleteTrigger = jest.fn().mockReturnValue(of(undefined))

    const builder = MiniCrudStateBuilder.Create(getAllTrigger)
      .setAddState(addTrigger)
      .setUpdateState(updateTrigger)
      .setDeleteState(deleteTrigger)

    const crud = builder.build(null as any)

    crud.triggerAdd({ name: 'X' } as any)
    expect(addTrigger).toHaveBeenCalledWith({ name: 'X' })

    crud.triggerUpdate({ id: 1, name: 'X2' } as any)
    expect(updateTrigger).toHaveBeenCalledWith({ id: 1, name: 'X2' })

    crud.triggerDelete({ id: 1, name: 'X2' } as any)
    expect(deleteTrigger).toHaveBeenCalledWith({ id: 1, name: 'X2' })
  })

})
