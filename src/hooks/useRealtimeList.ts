import { onMount } from 'svelte';
import { writable } from 'svelte/store';
import { onDocChange, QueryBuilder } from 'pocketto';
import type { ModelStatic } from 'pocketto/dist/src/definitions/Model';
import { BaseModel } from 'pocketto';

export function useRealtimeList<T extends BaseModel>(type: ModelStatic<T>, config: {
  condition?: (query: QueryBuilder<T>) => QueryBuilder<T>;
  onItemChange?: (value: T | undefined) => void;
  onItemCreate?: (value: T | undefined) => void;
  onItemUpdate?: (value: T | undefined) => void;
  animationDelay?: number;
  order?: "asc" | "desc";
  orderBy?: keyof T;
  disableAutoAppend?: boolean;
} = {}) {
  const {
    condition = (query) => query.orderBy('createdAt', 'desc'),
    onItemChange,
    onItemCreate,
    onItemUpdate,
    animationDelay,
    order,
    orderBy,
    disableAutoAppend,
  } = config;
  const data = writable([] as T[]);

  const fetch = async (builder: (query: QueryBuilder<T>) => QueryBuilder<T>) => {
    const query = builder(new type().getClass().query() as unknown as QueryBuilder<T>);
    const docs = await query.get() as Array<T>;
    data.set(docs);
  };

  onMount(async () => {
    fetch(condition || ((query) => query));
  });

  onDocChange(async (id) => {
    const changedDoc = await new type().getClass().find(id) as T;
    if (changedDoc) {
      data.update((currentData) => {
        const index = currentData.findIndex((i) => i.id === changedDoc.id);
        if (index !== -1) {
          currentData[index] = changedDoc;
          onItemUpdate?.(changedDoc);
          setTimeout(() => onItemUpdate?.(undefined), animationDelay || 1);
        } else if (!disableAutoAppend) {
          if (!order || order === "desc") {
            currentData.unshift(changedDoc as T);
          } else if (order === "asc") {
            currentData.push(changedDoc as T);
          }

          const sortBy = orderBy || 'createdAt';
          currentData.sort((a, b) => {
            if (a[sortBy] > b[sortBy]) {
              return order === "asc" ? 1 : -1;
            }
            if (a[sortBy] < b[sortBy]) {
              return order === "asc" ? -1 : 1;
            }
            return 0;
          });

          onItemCreate?.(changedDoc);
          setTimeout(() => onItemCreate?.(undefined), animationDelay || 1);
        }
        onItemChange?.(changedDoc);
        setTimeout(() => onItemChange?.(undefined), animationDelay || 1);
        return currentData;
      });
    }
  });

  return data;
}
