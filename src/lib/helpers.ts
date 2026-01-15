import { Currencies } from "./currencies"

export function sleep( ms: number ){
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

export const getCurrencyFormatter = ( currency: string ) => {
  const locale = Currencies.find( c => c.value === currency )?.locale ?? "en-US"
  return new Intl.NumberFormat( locale, {
    style: "currency",
    currency
  })
}

export const startOfMonth = ( date: Date ) => {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export const dateToUtcDate = ( date : Date ) => {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    )
  )
}

export const formatDate = ( date: Date ) => {
  return new Date( date ).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

export const dateFormatter = ( date: Date ) => {
  const createdAt = new Date(date)
  return createdAt.toLocaleDateString("es-PE")
}


export function dateStringToLocalDate(value?: string | null): Date | undefined {
  if (!value) return undefined
  const [year, month, day] = value.split("-").map(Number)
  if (!year || !month || !day) return undefined
  return new Date(year, month - 1, day)
}