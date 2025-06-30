// crud-array-ops.spec.ts

import { CrudArrayOps, BaseCrudItem } from './crud-array-ops';

type TestItem = { id: string; name: string };

describe('CrudArrayOps', () => {
  let ops: CrudArrayOps<TestItem>;
  let data: TestItem[];

  beforeEach(() => {
    ops = new CrudArrayOps<TestItem>();
    data = [
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' },
      { id: '3', name: 'Charlie' },
    ];
  });

  it('should append a new item', () => {
    const newItem = { id: '4', name: 'Daisy' };
    const result = ops.append(data, newItem);
    expect(result).toHaveLength(4);
    expect(result[3]).toEqual(newItem);
  });

  it('should delete an item by id', () => {
    const result = ops.delete(data, { id: '2', name: 'Bob' });
    expect(result).toHaveLength(2);
    expect(result.find(i => i.id === '2')).toBeUndefined();
  });

  it('should not delete anything if id not found', () => {
    const result = ops.delete(data, { id: '999' , name: 'Nonexistent' });
    expect(result).toHaveLength(3);
  });

  it('should insert (update) an item by id', () => {
    const updated = { id: '2', name: 'Bobby' };
    const result = ops.insert(data, updated);
    expect(result.find(i => i.id === '2')?.name).toBe('Bobby');
    expect(result).toHaveLength(3);
  });

  it('should not change array if insert id not found', () => {
    const updated = { id: '999', name: 'Nobody' };
    const result = ops.insert(data, updated);
    expect(result).toEqual(data);
  });

  it('should use custom equals function if provided', () => {
    const customOps = new CrudArrayOps<TestItem>((a, b) => a?.name === b?.name);
    const result = customOps.delete(data, { id: '999', name: 'Bob' });
    expect(result.find(i => i.name === 'Bob')).toBeUndefined();
  });
});