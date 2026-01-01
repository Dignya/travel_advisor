'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useCurrency, formatCurrency, getCurrencySymbol } from '@/hooks/useCurrency'
import { RefreshCw, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface CurrencyConverterProps {
  amount?: number
  fromCurrency?: string
  toCurrency?: string
  country?: string
  onConversionChange?: (result: any) => void
  className?: string
}

export function CurrencyConverter({
  amount = 100,
  fromCurrency = 'USD',
  toCurrency = 'EUR',
  country,
  onConversionChange,
  className = ''
}: CurrencyConverterProps) {
  const { convertCurrency, convertByCountry, loading, error, lastConversion } = useCurrency()
  const [inputAmount, setInputAmount] = useState(amount)
  const [from, setFrom] = useState(fromCurrency)
  const [to, setTo] = useState(toCurrency)
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null)
  const [conversionRate, setConversionRate] = useState<number | null>(null)

  // Popular currencies
  const popularCurrencies = [
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
    { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
    { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
    { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
    { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
    { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
    { code: 'BRL', name: 'Brazilian Real', flag: '🇧🇷' },
  ]

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performConversion()
    }, 500) // Debounce to avoid too many API calls

    return () => clearTimeout(timeoutId)
  }, [inputAmount, from, to, country])

  const performConversion = async () => {
    try {
      let result
      if (country) {
        result = await convertByCountry(from, inputAmount, country)
        setTo(result.to)
      } else {
        result = await convertCurrency(from, to, inputAmount)
      }
      
      setConvertedAmount(result.convertedAmount)
      setConversionRate(result.rate)
      
      if (onConversionChange) {
        onConversionChange(result)
      }
    } catch (error) {
      console.error('Currency conversion failed:', error)
      // Don't set error state to avoid UI glitches, just log the error
    }
  }

  const handleAmountChange = (value: string) => {
    const numValue = parseFloat(value) || 0
    setInputAmount(numValue)
  }

  const handleSwap = () => {
    setFrom(to)
    setTo(from)
  }

  const getRateChangeIcon = () => {
    if (!conversionRate) return <Minus className="h-4 w-4" />
    if (conversionRate > 1) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (conversionRate < 1) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-gray-600" />
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Currency Converter</span>
          <Button
            variant="outline"
            size="sm"
            onClick={performConversion}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            value={inputAmount}
            onChange={(e) => handleAmountChange(e.target.value)}
            min="0"
            step="0.01"
            placeholder="Enter amount"
          />
        </div>

        {/* From Currency */}
        <div className="space-y-2">
          <Label>From</Label>
          <Select value={from} onValueChange={setFrom}>
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {popularCurrencies.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  <div className="flex items-center space-x-2">
                    <span>{currency.flag}</span>
                    <span>{currency.code}</span>
                    <span className="text-muted-foreground">- {currency.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSwap}
            className="rounded-full"
          >
            ⇅
          </Button>
        </div>

        {/* To Currency */}
        <div className="space-y-2">
          <Label>To</Label>
          <Select value={to} onValueChange={setTo}>
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {popularCurrencies.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  <div className="flex items-center space-x-2">
                    <span>{currency.flag}</span>
                    <span>{currency.code}</span>
                    <span className="text-muted-foreground">- {currency.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Country Selection (Optional) */}
        {country && (
          <div className="space-y-2">
            <Label>Destination Country</Label>
            <Badge variant="outline" className="text-sm">
              {country}
            </Badge>
          </div>
        )}

        {/* Result */}
        <div className="space-y-3 pt-4 border-t">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : convertedAmount !== null ? (
            <>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {formatCurrency(inputAmount, from)} = {formatCurrency(convertedAmount, to)}
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground mt-1">
                  {getRateChangeIcon()}
                  <span>1 {from} = {conversionRate?.toFixed(4)} {to}</span>
                </div>
              </div>

              {/* Quick Conversion Examples */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Quick Conversions</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[10, 50, 100, 500].map((value) => (
                    <div key={value} className="text-sm p-2 bg-muted rounded">
                      <span className="font-medium">{formatCurrency(value, from)}</span>
                      <span className="text-muted-foreground"> = </span>
                      <span>{formatCurrency(value * (conversionRate || 0), to)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground">
              Enter an amount to see the conversion
            </div>
          )}
        </div>

        {/* Last Updated */}
        {lastConversion && (
          <div className="text-xs text-muted-foreground text-center">
            Last updated: {new Date(lastConversion.timestamp).toLocaleString()}
            {lastConversion.source === 'fallback' && ' (Using fallback rates)'}
          </div>
        )}
      </CardContent>
    </Card>
  )
}