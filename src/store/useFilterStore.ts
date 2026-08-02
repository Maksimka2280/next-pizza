'use client'

import { useSyncExternalStore } from 'react';

export interface FilterStoreState {
  pendingMinPrice: number | "";
  pendingMaxPrice: number | "";
  appliedMinPrice: number | "";
  appliedMaxPrice: number | "";
  pendingIngredientIds: Set<string>;
  appliedIngredientIds: Set<string>;
}

const listeners = new Set<() => void>();

let filterStore: FilterStoreState = {
  pendingMinPrice: "",
  pendingMaxPrice: "",
  appliedMinPrice: "",
  appliedMaxPrice: "",
  pendingIngredientIds: new Set<string>(),
  appliedIngredientIds: new Set<string>(),
};

const notifySubscribers = () => {
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = () => filterStore;

export const useFilterStore = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

export const setPendingMinPrice = (value: number | "") => {
  filterStore = {
    ...filterStore,
    pendingMinPrice: value,
  };
  notifySubscribers();
};

export const setPendingMaxPrice = (value: number | "") => {
  filterStore = {
    ...filterStore,
    pendingMaxPrice: value,
  };
  notifySubscribers();
};

export const togglePendingIngredientId = (id: string) => {
  const next = new Set(filterStore.pendingIngredientIds);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }

  filterStore = {
    ...filterStore,
    pendingIngredientIds: next,
  };
  notifySubscribers();
};

export const applyFilters = () => {
  filterStore = {
    ...filterStore,
    appliedMinPrice: filterStore.pendingMinPrice,
    appliedMaxPrice: filterStore.pendingMaxPrice,
    appliedIngredientIds: new Set(filterStore.pendingIngredientIds),
  };
  notifySubscribers();
};
