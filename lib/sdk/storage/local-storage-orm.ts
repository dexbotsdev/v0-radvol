interface TableConfig {
  name: string
  keyPath: string
}

export class LocalStorageORM {
  private config: { prefix: string }
  private tables: TableConfig[] = []

  constructor(prefix: string) {
    this.config = { prefix }
  }

  public addTable(table: TableConfig): void {
    this.tables.push(table)
  }

  private getStorageKey(tableName: string, key: string): string {
    return `${this.config.prefix}_${tableName}_${key}`
  }

  public insert<T extends Record<string, any>>(tableName: string, data: T): T {
    const keyPath = this.tables.find((table) => table.name === tableName)?.keyPath

    if (!keyPath) {
      throw new Error(`Table "${tableName}" not found or keyPath not defined.`)
    }

    const key = data[keyPath]
    if (!key) {
      throw new Error(`Missing key value in data for keyPath "${keyPath}".`)
    }

    const storageKey = this.getStorageKey(tableName, key.toString())
    localStorage.setItem(storageKey, JSON.stringify(data))
    return data
  }

  public get<T>(tableName: string, key: string): T | null {
    const storageKey = this.getStorageKey(tableName, key)
    const item = localStorage.getItem(storageKey)
    return item ? JSON.parse(item) : null
  }

  public getAll<T>(tableName: string): T[] {
    const items: T[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const localStorageKey = localStorage.key(i)
      if (localStorageKey?.startsWith(`${this.config.prefix}_${tableName}_`)) {
        const item = localStorage.getItem(localStorageKey)
        if (item) {
          items.push(JSON.parse(item))
        }
      }
    }
    return items
  }

  public update<T extends Record<string, any>>(tableName: string, key: string, newData: Partial<T>): T | null {
    const storageKey = this.getStorageKey(tableName, key)
    const item = localStorage.getItem(storageKey)
    if (!item) {
      console.warn(`Item with key "${key}" not found in table "${tableName}".`)
      return null
    }

    const existingData: T = JSON.parse(item)
    const updatedData: T = { ...existingData, ...newData }
    localStorage.setItem(storageKey, JSON.stringify(updatedData))
    return updatedData
  }

  public delete(tableName: string, key: string): void {
    const storageKey = this.getStorageKey(tableName, key)
    localStorage.removeItem(storageKey)
  }

  public clear(tableName: string): void {
    const items = this.getAll(tableName)
    const keyPath = this.tables.find((table) => table.name === tableName)?.keyPath

    if (!keyPath) {
      throw new Error(`Table "${tableName}" not found or keyPath not defined.`)
    }

    items.forEach((item: any) => {
      const key = item[keyPath]
      if (key) {
        this.delete(tableName, key.toString())
      }
    })
  }
}
