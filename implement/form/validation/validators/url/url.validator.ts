import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

/**
 * Validates an image server URL.
 * Rejects trailing slashes, credentials, paths, query strings, fragments, and invalid host characters.
 * Returns `null` when the value is empty or valid.
 * @returns {ValidatorFn} An Angular validator that checks the image server URL format.
 */
export function imageServerUrlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.trim()
    if (!value) return null

    // Reject trailing /
    if (value.endsWith('/')) {
      return { invalid: true }
    }

    // Reject user:pass@
    if (value.includes('@')) {
      return { invalid: true }
    }

    // Reject path / query / fragment after host
    // Match: [scheme://][host][:port][path|query|fragment]
    const schemeMatch = value.match(/^(https?|smb):\/\/(.+)$/i)
    const rest = schemeMatch ? schemeMatch[2] : value

    // After host:port, anything else is path/query/fragment
    if (/[/?#]/.test(rest)) {
      return { invalid: true }
    }

    // Host part (strip port and IPv6 brackets)
    let host = rest
    // IPv6: [2001:db8::1] or [2001:db8::1]:port
    if (host.startsWith('[')) {
      const close = host.indexOf(']')
      if (close === -1) return { invalid: true }
      host = host.slice(1, close)
    } else {
      // IPv4 or DNS, strip :port
      host = host.replace(/:\d+$/, '')
    }

    // Host chars: only [A-Za-z0-9.-] for non-IPv6
    // IPv6 allows hex and :
    const isIpv6 = rest.startsWith('[')
    if (!isIpv6 && /[^A-Za-z0-9.-]/.test(host)) {
      return { invalid: true }
    }
    if (isIpv6 && /[^A-Fa-f0-9:]/.test(host)) {
      return { invalid: true }
    }

    return null
  }
}
