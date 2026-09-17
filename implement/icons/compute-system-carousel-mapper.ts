import { CarouselContent } from '@app/shared/design-system/global-component/carousel-v1/carousel-v1.interface'
import { ComputeSystemDetailApiResponse } from '../model/compute-system-detail-model'

export const ICONS = {
  computeHardware: {
    cpu: 'assets/design-system/icons/compute-hardware-cpu.svg',
    core: 'assets/design-system/icons/compute-hardware-core.svg',
    memory: 'assets/design-system/icons/compute-hardware-memory.svg',
    slot: 'assets/design-system/icons/compute-hardware-slot.svg',
    gpu: 'assets/design-system/icons/compute-hardware-gpu.svg',
    raid: 'assets/design-system/icons/compute-hardware-raid.svg',
    hba: 'assets/design-system/icons/compute-hardware-hba.svg',
    nvme: 'assets/design-system/icons/compute-hardware-nvme.svg',
  },

  health: {
    ok: 'assets/design-system/icons/health-ok.svg',    
    warning: 'assets/design-system/icons/health-warning.svg',
    critical: 'assets/design-system/icons/health-critical.svg',
  }, 

  status: {
    enabled: 'assets/design-system/icons/status-enabled.svg',
  },
} as const

/**
 * Maps a compute system detail API response into carousel content for the UI.
 * @param {ComputeSystemDetailApiResponse} response - The system detail response containing summary and hardware fields.
 * @returns {CarouselContent[]} Carousel sections for processor, memory, GPU, and ethernet.
 */
export function toSystemCarousel(response: ComputeSystemDetailApiResponse): CarouselContent[] {
  const { summary, memorySize, memorySizeUnit, health } = response

  return [
    {
      title: 'Current Health',
      items: [
        {
          status: healthLabel(health),
          description: 'System Health',
          src: healthIcon(health),
        },
      ],
    },
    {
      title: 'Processor',
      items: [
        {
          status: String(countCpus(summary.processor.items)),
          description: 'CPU',
          src: ICONS.computeHardware.cpu,
        },
        {
          status: String(summary.processor.totalCore ?? 0),
          description: 'Core',
          src: ICONS.computeHardware.core,
        },
      ],
    },
    {
      title: 'Memory',
      items: [
        {
          status: String(summary.memory.items.filter((item) => item.state === 'Enabled').length),
          description: 'Enabled',
          src: ICONS.status.enabled,
        },
        {
          status: String(summary.memory.items.length),
          description: 'Slot',
          src: ICONS.computeHardware.slot,
        },
        {
          status: String(summary.memory.totalCapacityGib ?? memorySize ?? 0),
          unit: memorySizeUnit ?? 'GB',
          description: 'Memory',
          src: ICONS.computeHardware.memory,
        },
      ],
    },
    {
      title: 'Accelerator',
      items: [
        {
          status: String(summary.gpu.totalGpu),
          description: 'Local GPU',
          src: ICONS.computeHardware.gpu,
        },
      ],
    },
    //TODO: Add storage section when API provides storage summary
    // {
    //   title: 'Local Storage',
    //   items: [
    //     {
    //       status: String(summary.ethernetInterface.totalNics),
    //       unit: 'NICs',
    //       description: `${summary.ethernetInterface.totalPorts} ports`,
    //       src: COMPUTE_HARDWARE_ICON.raid,
    //     },
    //   ],
    // },
  ]
}

/**
 * Counts CPU items that have a non-null core value.
 * @param {{ socket: string; core: number | null }[]} items - The CPU items to evaluate.
 * @returns {number} The number of CPU items with a defined core count.
 */
function countCpus(items: { socket: string; core: number | null }[]): number {
  return items.filter((item) => item.core != null).length
}

/**
 * Resolves the health icon path from a health status string.
 * Falls back to the OK icon when the status is missing or unknown.
 * @param {string | null | undefined} health - The health status from the API.
 * @returns {string} The matching health icon asset path.
 */
function healthIcon(health: string | null | undefined): string {
  const key = health?.trim().toLowerCase() ?? ''
  return ICONS.health[key as keyof typeof ICONS.health] ?? ICONS.health.ok
}

/**
 * Formats a health status string for display.
 * Empty values become `Unknown`, and `ok` is shown as `Good`.
 * @param {string | null | undefined} health - The health status from the API.
 * @returns {string} The UI label for the health status.
 */
function healthLabel(health: string | null | undefined): string {
  const key = health?.trim() ?? ''
  if (!key) {
    return 'Unknown'
  }
  return key.toLowerCase() === 'ok' ? 'Good' : key
}
