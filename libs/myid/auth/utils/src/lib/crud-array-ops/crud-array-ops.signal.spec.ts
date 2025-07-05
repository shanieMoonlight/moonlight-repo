import { CrudArraySignalOps } from './crud-array-ops.signal';

type TestItem = { id: string; name: string };

describe('CrudArraySignalOps', () => {
  let ops: CrudArraySignalOps<TestItem>;

  beforeEach(() => {
    ops = new CrudArraySignalOps<TestItem>([
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' }
    ]);
  });

  it('refresh sets the array', () => {
    ops.refresh([{ id: '3', name: 'Charlie' }]);
    expect(ops.data()).toEqual([{ id: '3', name: 'Charlie' }]);
  });

  it('append adds an item', () => {
    ops.append({ id: '3', name: 'Charlie' });
    expect(ops.data()).toHaveLength(3);
    expect(ops.data()[2].name).toBe('Charlie');
  });

  it('delete removes an item', () => {
    ops.delete({ id: '1', name: 'Alice' });
    expect(ops.data()).toHaveLength(1);
    expect(ops.data()[0].id).toBe('2');
  });

  it('insert updates an item', () => {
    ops.insert({ id: '2', name: 'Bobby' });
    expect(ops.data().find(i => i.id === '2')?.name).toBe('Bobby');
  });
});