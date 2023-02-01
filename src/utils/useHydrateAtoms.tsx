import type { WritableAtom } from 'jotai/vanilla'
import { useStore } from '../Provider'

type Store = ReturnType<typeof useStore>
type Options = Parameters<typeof useStore>[0]
type AnyWritableAtom = WritableAtom<unknown, any[], any>

const hydratedMap: WeakMap<Store, WeakSet<AnyWritableAtom>> = new WeakMap()

const getHydratedSet = (store: Store) => {
  let hydratedSet = hydratedMap.get(store)
  if (!hydratedSet) {
    hydratedSet = new WeakSet()
    hydratedMap.set(store, hydratedSet)
  }
  return hydratedSet
}

export function useHydrateAtoms(
  values: Iterable<readonly [AnyWritableAtom, unknown]>,
  options?: Options,
) {
  const store = useStore(options)

  const hydratedSet = getHydratedSet(store)
  for (const [atom, value] of values) {
    if (!hydratedSet.has(atom)) {
      hydratedSet.add(atom)
      store.set(atom, value)
    }
  }
}
