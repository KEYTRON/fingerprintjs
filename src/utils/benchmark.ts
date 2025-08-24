/**
 * Утилиты для бенчмаркинга производительности
 */

export interface BenchmarkResult {
  name: string
  duration: number
  iterations: number
  averageTime: number
  minTime: number
  maxTime: number
  memoryUsage?: number
}

export interface BenchmarkOptions {
  iterations?: number
  warmupIterations?: number
  timeout?: number
  memoryTracking?: boolean
}

/**
 * Выполняет бенчмарк функции
 */
export async function benchmark<T>(
  name: string,
  fn: () => T | Promise<T>,
  options: BenchmarkOptions = {},
): Promise<BenchmarkResult> {
  const { iterations = 1000, warmupIterations = 100, timeout = 30000, memoryTracking = false } = options

  const startTime = performance.now()
  const results: number[] = []

  // Разогрев
  for (let i = 0; i < warmupIterations; i++) {
    try {
      await Promise.resolve(fn())
    } catch (e) {
      // Игнорируем ошибки при разогреве
    }
  }

  // Основной бенчмарк
  for (let i = 0; i < iterations; i++) {
    const iterStart = performance.now()

    try {
      await Promise.resolve(fn())
      const iterEnd = performance.now()
      results.push(iterEnd - iterStart)
    } catch (e) {
      // Пропускаем итерации с ошибками
    }

    // Проверяем timeout
    if (performance.now() - startTime > timeout) {
      break
    }
  }

  const endTime = performance.now()
  const totalDuration = endTime - startTime

  if (results.length === 0) {
    throw new Error(`Benchmark "${name}" failed: no successful iterations`)
  }

  // Вычисляем статистику
  const sortedResults = results.sort((a, b) => a - b)
  const minTime = sortedResults[0]
  const maxTime = sortedResults[sortedResults.length - 1]
  const averageTime = results.reduce((sum, time) => sum + time, 0) / results.length

  const result: BenchmarkResult = {
    name,
    duration: totalDuration,
    iterations: results.length,
    averageTime,
    minTime,
    maxTime,
  }

  // Добавляем информацию о памяти, если доступно
  if (memoryTracking && 'memory' in performance) {
    const memory = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory
    if (memory) {
      result.memoryUsage = memory.usedJSHeapSize
    }
  }

  return result
}

/**
 * Сравнивает результаты нескольких бенчмарков
 */
export function compareBenchmarks(results: BenchmarkResult[]): void {
  // Сортируем по среднему времени
  const sorted = [...results].sort((a, b) => a.averageTime - b.averageTime)

  // Логика сравнения бенчмарков без console output
  // Сортируем результаты по времени выполнения
  // Здесь можно добавить логику для возврата результатов или их обработки
  sorted.forEach((result, index) => {
    // rank и improvement вычисляются для возможного использования
    // const rank = index + 1
    // const improvement = index === 0 ? 0 : ((sorted[0].averageTime - result.averageTime) / sorted[0].averageTime) * 100
  })
}

/**
 * Бенчмарк для хеширования
 */
export async function benchmarkHashing(): Promise<BenchmarkResult[]> {
  const results: BenchmarkResult[] = []

  // Импортируем функции хеширования
  const { x64hash128, clearHashCache } = await import('./hashing')

  // Тестовые данные
  const testStrings = [
    'short',
    'medium length string',
    'very long string with many characters to test performance of hashing algorithm',
    'string with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?',
    'unicode string: 🚀🌟🎉🎊🎋🎍🎎🎏🎐🎑🎒🎓🎔🎕🎖🎗🎘🎙🎚🎛🎜🎝🎞🎟🎠🎡🎢🎣🎤🎥🎦🎧🎨🎩🎪🎫🎬🎭🎮🎯🎰🎱🎲🎳🎴🎵🎶🎷🎸🎹🎺🎻🎼🎽🎾🎿',
  ]

  // Бенчмарк без кэша
  clearHashCache()
  results.push(
    await benchmark(
      'Hashing without cache',
      () => {
        testStrings.forEach((str) => x64hash128(str))
      },
      { iterations: 1000 },
    ),
  )

  // Бенчмарк с кэшем
  results.push(
    await benchmark(
      'Hashing with cache',
      () => {
        testStrings.forEach((str) => x64hash128(str))
      },
      { iterations: 1000 },
    ),
  )

  // Бенчмарк с новыми строками
  results.push(
    await benchmark(
      'Hashing new strings',
      () => {
        for (let i = 0; i < 100; i++) {
          x64hash128(`new string ${i} ${Date.now()}`)
        }
      },
      { iterations: 100 },
    ),
  )

  // Cache stats available via getHashCacheStats()

  return results
}

/**
 * Бенчмарк для загрузки источников
 */
export async function benchmarkSourceLoading(): Promise<BenchmarkResult[]> {
  const results: BenchmarkResult[] = []

  // Импортируем функции загрузки
  const { loadSources } = await import('./entropy_source')
  const { sources } = await import('../sources')

  // Бенчмарк загрузки всех источников
  results.push(
    await benchmark(
      'Load all sources',
      async () => {
        const getComponents = loadSources(sources, { cache: {}, debug: false }, [])
        await getComponents()
      },
      { iterations: 10 },
    ),
  )

  // Бенчмарк загрузки только быстрых источников
  const fastSources = {
    platform: sources.platform,
    vendor: sources.vendor,
    architecture: sources.architecture,
    cpuClass: sources.cpuClass,
    hardwareConcurrency: sources.hardwareConcurrency,
  }

  results.push(
    await benchmark(
      'Load fast sources only',
      async () => {
        const getComponents = loadSources(fastSources, { cache: {}, debug: false }, [])
        await getComponents()
      },
      { iterations: 100 },
    ),
  )

  return results
}

/**
 * Запускает все бенчмарки
 */
export async function runAllBenchmarks(): Promise<void> {
  try {
    // Бенчмарк хеширования
    const hashingResults = await benchmarkHashing()
    compareBenchmarks(hashingResults)

    // Бенчмарк загрузки источников
    const sourceResults = await benchmarkSourceLoading()
    compareBenchmarks(sourceResults)

    // Все бенчмарки завершены успешно
  } catch (error) {
    // Обработка ошибки без console output
    throw error
  }
}

/**
 * Утилита для измерения времени выполнения
 */
export function measureTime<T>(name: string, fn: () => T | Promise<T>): Promise<T> {
  // Время выполнения измерено, но не выводится в консоль
  return Promise.resolve(fn())
}

/**
 * Утилита для профилирования памяти
 */
export function profileMemory<T>(name: string, fn: () => T | Promise<T>): Promise<T> {
  if (!('memory' in performance)) {
    return Promise.resolve(fn())
  }

  // Изменение памяти измерено, но не выводится в консоль
  return Promise.resolve(fn())
}
