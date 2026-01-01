import { NextRequest, NextResponse } from 'next/server'

// Exchange rate API key (fallback to mock data if not available)
const EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY
const EXCHANGE_RATE_BASE_URL = 'https://api.exchangerate-api.com/v4/latest'

// Mock exchange rates for fallback
const getMockExchangeRates = (baseCurrency: string) => {
  const mockRates: Record<string, Record<string, number>> = {
    USD: {
      EUR: 0.85,
      GBP: 0.73,
      JPY: 110.0,
      CAD: 1.25,
      AUD: 1.35,
      CHF: 0.92,
      CNY: 6.45,
      INR: 74.5,
      BRL: 5.2,
      MXN: 20.0,
      RUB: 74.0,
      KRW: 1180.0,
      SGD: 1.35,
      HKD: 7.85,
      SEK: 8.6,
      NOK: 8.5,
      DKK: 6.4,
      PLN: 3.9,
      THB: 33.0,
      MYR: 4.2,
      IDR: 14500.0,
      PHP: 50.0,
      VND: 23000.0,
      ZAR: 15.0,
      TRY: 8.5,
      ILS: 3.2,
      AED: 3.67,
      SAR: 3.75,
      QAR: 3.64,
      KWD: 0.30,
      BHD: 0.38,
      OMR: 0.38,
      JOD: 0.71,
      LBP: 1500.0,
      EGP: 15.7,
      MAD: 9.0,
      TND: 2.85,
      DZD: 135.0,
      NGN: 410.0,
      KES: 110.0,
      GHS: 6.0,
      XAF: 560.0,
      XOF: 560.0,
      XPF: 110.0,
      CLP: 800.0,
      ARS: 98.0,
      COP: 3800.0,
      PEN: 4.0,
      UYU: 44.0,
      PYG: 7000.0,
      BOB: 6.9,
      CRC: 640.0,
      GTQ: 7.8,
      SVC: 8.75,
      HNL: 24.0,
      NIO: 35.0,
      CUP: 25.0,
      DOP: 58.0,
      HTG: 95.0,
      JMD: 155.0,
      TTD: 6.8,
      BBD: 2.0,
      BZD: 2.0,
      XCD: 2.7,
      BSD: 1.0,
      BMD: 1.0,
      SBD: 8.2,
      FJD: 2.1,
      WST: 2.6,
      PGK: 3.5,
      VUV: 110.0,
      SLL: 10500.0,
      LRD: 180.0,
      GMD: 55.0,
      MRO: 360.0,
      MGA: 4000.0,
      DJF: 178.0,
      ERN: 15.0,
      ETB: 45.0,
      SDG: 450.0,
      GNF: 9500.0,
      BIF: 2000.0,
      RWF: 1000.0,
      CDF: 2000.0,
      AOA: 650.0,
      KZT: 430.0,
      KGS: 85.0,
      UZS: 10500.0,
      TJS: 11.0,
      TMT: 3.4,
      GEL: 3.3,
      AMD: 530.0,
      AZN: 1.7,
      BYN: 2.6,
      MDL: 17.8,
      RON: 4.2,
      BGN: 1.7,
      HRK: 6.4,
      CZK: 22.0,
      HUF: 300.0,
      UAH: 27.0,
      MKD: 53.0,
      ALL: 105.0,
      BAM: 1.7
    },
    EUR: {
      USD: 1.18,
      GBP: 0.86,
      JPY: 129.5,
      CAD: 1.47,
      AUD: 1.59,
      CHF: 1.08,
      CNY: 7.6,
      INR: 87.7,
      BRL: 6.12,
      MXN: 23.5,
      RUB: 87.1,
      KRW: 1389.0,
      SGD: 1.59,
      HKD: 9.24,
      SEK: 10.1,
      NOK: 10.0,
      DKK: 7.5,
      PLN: 4.6,
      THB: 38.8,
      MYR: 4.94,
      IDR: 17060.0,
      PHP: 58.8,
      VND: 27060.0,
      ZAR: 17.65,
      TRY: 10.0,
      ILS: 3.77,
      AED: 4.32,
      SAR: 4.41,
      QAR: 4.28,
      KWD: 0.35,
      BHD: 0.45,
      OMR: 0.45,
      JOD: 0.84,
      LBP: 1765.0,
      EGP: 18.5,
      MAD: 10.6,
      TND: 3.35,
      DZD: 159.0,
      NGN: 482.0,
      KES: 129.5,
      GHS: 7.06,
      XAF: 659.0,
      XOF: 659.0,
      XPF: 129.5,
      CLP: 941.0,
      ARS: 115.3,
      COP: 4470.0,
      PEN: 4.7,
      UYU: 51.8,
      PYG: 8240.0,
      BOB: 8.12,
      CRC: 753.0,
      GTQ: 9.18,
      SVC: 10.3,
      HNL: 28.2,
      NIO: 41.2,
      CUP: 29.4,
      DOP: 68.2,
      HTG: 111.8,
      JMD: 182.4,
      TTD: 8.0,
      BBD: 2.35,
      BZD: 2.35,
      XCD: 3.18,
      BSD: 1.18,
      BMD: 1.18,
      SBD: 9.65,
      FJD: 2.47,
      WST: 3.06,
      PGK: 4.12,
      VUV: 129.5,
      SLL: 12350.0,
      LRD: 212.0,
      GMD: 64.7,
      MRO: 424.0,
      MGA: 4700.0,
      DJF: 209.0,
      ERN: 17.65,
      ETB: 52.9,
      SDG: 529.0,
      GNF: 11180.0,
      BIF: 2350.0,
      RWF: 1176.0,
      CDF: 2350.0,
      AOA: 765.0,
      KZT: 506.0,
      KGS: 100.0,
      UZS: 12350.0,
      TJS: 12.9,
      TMT: 4.0,
      GEL: 3.88,
      AMD: 624.0,
      AZN: 2.0,
      BYN: 3.06,
      MDL: 20.9,
      RON: 4.94,
      BGN: 2.0,
      HRK: 7.53,
      CZK: 25.9,
      HUF: 353.0,
      UAH: 31.8,
      MKD: 62.4,
      ALL: 123.5,
      BAM: 2.0
    }
  }

  // If base currency not found, use USD as default
  const rates = mockRates[baseCurrency] || mockRates.USD
  
  // Add the base currency itself with rate 1
  rates[baseCurrency] = 1.0
  
  return rates
}

// Country to currency mapping
const getCurrencyByCountry = (country: string): string => {
  const countryToCurrency: Record<string, string> = {
    'US': 'USD',
    'CA': 'CAD',
    'GB': 'GBP',
    'FR': 'EUR',
    'DE': 'EUR',
    'IT': 'EUR',
    'ES': 'EUR',
    'PT': 'EUR',
    'NL': 'EUR',
    'BE': 'EUR',
    'AT': 'EUR',
    'IE': 'EUR',
    'FI': 'EUR',
    'GR': 'EUR',
    'CY': 'EUR',
    'MT': 'EUR',
    'SK': 'EUR',
    'SI': 'EUR',
    'LV': 'EUR',
    'EE': 'EUR',
    'LT': 'EUR',
    'LU': 'EUR',
    'JP': 'JPY',
    'AU': 'AUD',
    'CH': 'CHF',
    'CN': 'CNY',
    'IN': 'INR',
    'BR': 'BRL',
    'MX': 'MXN',
    'RU': 'RUB',
    'KR': 'KRW',
    'SG': 'SGD',
    'HK': 'HKD',
    'SE': 'SEK',
    'NO': 'NOK',
    'DK': 'DKK',
    'PL': 'PLN',
    'TH': 'THB',
    'MY': 'MYR',
    'ID': 'IDR',
    'PH': 'PHP',
    'VN': 'VND',
    'ZA': 'ZAR',
    'TR': 'TRY',
    'IL': 'ILS',
    'AE': 'AED',
    'SA': 'SAR',
    'QA': 'QAR',
    'KW': 'KWD',
    'BH': 'BHD',
    'OM': 'OMR',
    'JO': 'JOD',
    'LB': 'LBP',
    'EG': 'EGP',
    'MA': 'MAD',
    'TN': 'TND',
    'DZ': 'DZD',
    'NG': 'NGN',
    'KE': 'KES',
    'GH': 'GHS',
    'CM': 'XAF',
    'SN': 'XOF',
    'PF': 'XPF',
    'CL': 'CLP',
    'AR': 'ARS',
    'CO': 'COP',
    'PE': 'PEN',
    'UY': 'UYU',
    'PY': 'PYG',
    'BO': 'BOB',
    'CR': 'CRC',
    'GT': 'GTQ',
    'SV': 'SVC',
    'HN': 'HNL',
    'NI': 'NIO',
    'CU': 'CUP',
    'DO': 'DOP',
    'HT': 'HTG',
    'JM': 'JMD',
    'TT': 'TTD',
    'BB': 'BBD',
    'BZ': 'BZD',
    'AG': 'XCD',
    'BS': 'BSD',
    'BM': 'BMD',
    'SB': 'SBD',
    'FJ': 'FJD',
    'WS': 'WST',
    'PG': 'PGK',
    'VU': 'VUV',
    'SL': 'SLL',
    'LR': 'LRD',
    'GM': 'GMD',
    'MR': 'MRO',
    'MG': 'MGA',
    'DJ': 'DJF',
    'ER': 'ERN',
    'ET': 'ETB',
    'SD': 'SDG',
    'GN': 'GNF',
    'BI': 'BIF',
    'RW': 'RWF',
    'CD': 'CDF',
    'AO': 'AOA',
    'KZ': 'KZT',
    'KG': 'KGS',
    'UZ': 'UZS',
    'TJ': 'TJS',
    'TM': 'TMT',
    'GE': 'GEL',
    'AM': 'AMD',
    'AZ': 'AZN',
    'BY': 'BYN',
    'MD': 'MDL',
    'RO': 'RON',
    'BG': 'BGN',
    'HR': 'HRK',
    'CZ': 'CZK',
    'HU': 'HUF',
    'UA': 'UAH',
    'MK': 'MKD',
    'AL': 'ALL',
    'BA': 'BAM'
  }

  return countryToCurrency[country] || 'USD'
}

export async function GET(request: NextRequest) {
  try {
    console.log('Currency API called')
    const { searchParams } = new URL(request.url)
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const amount = searchParams.get('amount')
    const country = searchParams.get('country')

    console.log('Parameters:', { from, to, amount, country })

    if (!from || !amount) {
      return NextResponse.json(
        { error: 'Missing required parameters: from and amount' },
        { status: 400 }
      )
    }

    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount. Must be a positive number' },
        { status: 400 }
      )
    }

    let targetCurrency = to
    let rate: number
    let convertedAmount: number
    let source = 'fallback'

    // If country is provided, get the target currency from country
    if (country && !to) {
      targetCurrency = getCurrencyByCountry(country)
    }

    if (!targetCurrency) {
      return NextResponse.json(
        { error: 'Missing target currency or country' },
        { status: 400 }
      )
    }

    console.log('Using fallback rates for currency conversion')
    const mockRates = getMockExchangeRates(from.toUpperCase())
    rate = mockRates[targetCurrency.toUpperCase()] || 1.0
    convertedAmount = amountNum * rate

    const conversionResult = {
      from: from.toUpperCase(),
      to: targetCurrency.toUpperCase(),
      amount: amountNum,
      convertedAmount: Math.round(convertedAmount * 100) / 100,
      rate: Math.round(rate * 10000) / 10000,
      timestamp: new Date().toISOString(),
      source: source
    }

    console.log('Conversion result:', conversionResult)

    return NextResponse.json(conversionResult)
  } catch (error) {
    console.error('Currency conversion error:', error)
    
    // Even in case of error, try to provide fallback data
    try {
      const { searchParams } = new URL(request.url)
      const from = searchParams.get('from') || 'USD'
      const to = searchParams.get('to') || 'EUR'
      const amount = searchParams.get('amount') || '1'
      
      const amountNum = parseFloat(amount)
      const mockRates = getMockExchangeRates(from.toUpperCase())
      const rate = mockRates[to.toUpperCase()] || 1.0
      const convertedAmount = amountNum * rate
      
      return NextResponse.json({
        from: from.toUpperCase(),
        to: to.toUpperCase(),
        amount: amountNum,
        convertedAmount: Math.round(convertedAmount * 100) / 100,
        rate: Math.round(rate * 10000) / 10000,
        timestamp: new Date().toISOString(),
        source: 'fallback'
      })
    } catch (fallbackError) {
      return NextResponse.json(
        { error: 'Failed to convert currency and fallback failed' },
        { status: 500 }
      )
    }
  }
}