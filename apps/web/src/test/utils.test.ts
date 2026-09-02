import { describe, it, expect } from 'vitest'
import { cn, formatDate, formatRelativeTime, slugify, truncate, getInitials } from '@/lib/utils'

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names', () => {
      const result = cn('foo', 'bar')
      expect(result).toBe('foo bar')
    })

    it('should handle conditional classes', () => {
      const result = cn('foo', false && 'bar', 'baz')
      expect(result).toBe('foo baz')
    })
  })

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const result = formatDate('2024-01-15')
      expect(result).toContain('Jan')
      expect(result).toContain('15')
      expect(result).toContain('2024')
    })
  })

  describe('formatRelativeTime', () => {
    it('should return "Today" for today', () => {
      const result = formatRelativeTime(new Date().toISOString())
      expect(result).toBe('Today')
    })
  })

  describe('slugify', () => {
    it('should convert string to slug', () => {
      const result = slugify('Hello World')
      expect(result).toBe('hello-world')
    })
  })

  describe('truncate', () => {
    it('should truncate long strings', () => {
      const result = truncate('This is a very long string', 10)
      expect(result).toBe('This is a ...')
    })

    it('should not truncate short strings', () => {
      const result = truncate('Hi', 10)
      expect(result).toBe('Hi')
    })
  })

  describe('getInitials', () => {
    it('should return initials from name', () => {
      const result = getInitials('John Doe')
      expect(result).toBe('JD')
    })
  })
})
