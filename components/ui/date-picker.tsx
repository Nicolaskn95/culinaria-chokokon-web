"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { format, isValid, parse } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface DatePickerProps {
  date: Date | null
  onDateChange: (date: Date | null) => void
  placeholder?: string
  disabled?: boolean
  minDate?: Date
  className?: string
  theme?: "amber" | "default" | "dark"
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Selecione uma data",
  disabled = false,
  minDate,
  className,
  theme = "amber",
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  // Update input value when date changes
  useEffect(() => {
    if (date) {
      setInputValue(format(date, "dd/MM/yyyy"))
    } else {
      setInputValue("")
    }
  }, [date])

  // Handle manual input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    // Try to parse the date
    if (value.length === 10) {
      // dd/MM/yyyy format has 10 characters
      const parsedDate = parse(value, "dd/MM/yyyy", new Date())
      if (isValid(parsedDate)) {
        onDateChange(parsedDate)
      }
    }
  }

  // Get theme-specific classes
  const getThemeClasses = () => {
    switch (theme) {
      case "amber":
        return "bg-amber-50 border-amber-200 focus-within:border-amber-500 focus-within:ring-amber-500 dark:bg-gray-800 dark:border-gray-700 dark:focus-within:border-amber-600 dark:focus-within:ring-amber-600"
      case "dark":
        return "bg-gray-800 border-gray-700 text-white focus-within:border-gray-500 focus-within:ring-gray-500"
      default:
        return ""
    }
  }

  const getButtonThemeClasses = () => {
    switch (theme) {
      case "amber":
        return "text-amber-700 hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-gray-700"
      case "dark":
        return "text-gray-300 hover:bg-gray-700"
      default:
        return ""
    }
  }

  const getPopoverThemeClasses = () => {
    switch (theme) {
      case "amber":
        return "bg-white border-amber-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
      case "dark":
        return "bg-gray-800 border-gray-700 text-white"
      default:
        return ""
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className={`relative w-full rounded-md transition-colors ${getThemeClasses()}`}>
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          disabled={disabled}
          className={`border-0 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent ${className}`}
        />
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={disabled}
            className={`absolute right-0 top-0 h-full px-3 ${getButtonThemeClasses()}`}
            onClick={() => setOpen(true)}
          >
            <CalendarIcon className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className={`w-auto p-0 ${getPopoverThemeClasses()}`} align="start">
        <Calendar
          mode="single"
          selected={date || undefined}
          onSelect={(date) => {
            onDateChange(date)
            setOpen(false)
          }}
          disabled={(date) => (minDate ? date < minDate : false)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
