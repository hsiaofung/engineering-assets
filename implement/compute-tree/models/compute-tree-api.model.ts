export interface ComputePoolResponse {
  virtualPool: {
    isLeaf: boolean
  }
  physicalPool: {
    isLeaf: boolean
  }
}

export interface ComputeRowResponse {
  id: string
  location: string
  isLeaf: boolean
}

export interface ComputeRowsResponse {
  items: ComputeRowResponse[]
}

export interface ComputeRowDetailResponse {
  id: string
  location: string
  isLeaf: boolean
  racks: ComputeRackSummaryResponse[]
  inRowCdus: unknown[]
  sidecars: unknown[]
}

export interface ComputeRackSummaryResponse {
  id: string
  location: string
  size: number
  isLeaf: boolean
  hasPdu: boolean
  hasInRackCdu: boolean
  hasRdhx: boolean
}

export interface ComputeRackResponse {
  id: string
  location: string
  size: number
  isLeaf: boolean
  row: {
    id: string
    location: string
  }
  drawers: ComputeDrawerResponse[]
}

export interface ComputeDrawerResponse {
  id: string
  location: string
  type: string
  systems: ComputeSystemResponse[]
}

export interface ComputeSystemResponse {
  id: string
  location: string
  ipv4: string
}
