declare global {
  type Not<T> = {
    [P in keyof T]?: never
  }

  type Diff<
    T extends Record<PropertyKey, unknown>,
    U extends Record<PropertyKey, unknown>
  > = T & Not<Omit<U, keyof T>>

  type Xor<
    T extends Record<PropertyKey, unknown>,
    U extends Record<PropertyKey, unknown>
  > = Diff<T, U> | Diff<U, T>

  type RequiredAndOptional<
    T extends Record<string, any>,
    U extends Record<string, any>
  > = T & Required<U>
}

export {}
