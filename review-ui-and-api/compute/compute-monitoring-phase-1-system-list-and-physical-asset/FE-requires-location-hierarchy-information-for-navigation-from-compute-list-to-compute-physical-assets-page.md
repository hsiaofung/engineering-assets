@tyl @VincentLin @CloverH

# Q-003

## Status

Resolved - API requirement clarified.    
Pending - SCC 4.0 routing migration and UX alignment.   

## Summary

Frontend needs to navigate from Compute List Location link
to Compute Physical Assets page.

The navigation approach changes from hierarchy-based routing
to resource-based routing in SCC 4.0.

## Previous Design

According to the existing design, when a user clicks the Location link in Compute List, the UI navigates to:

/compute/${pod_name}/${group_uiid}/${rack_uiid}/${drawer_uiid}/${system_uiid}/physical-assets

Frontend required:

- pod_name
- group_uiid
- rack_uiid
- drawer_uiid
- system_uiid

In SCC 3.X, this information was retrieved through:

GET /web/cloud-monitoring-detail/overview/system/redirection?uuid={uuid}

## SCC 4.0 Routing Design

According to SCC 4.0 Compute Routing Spec, frontend navigation uses resource-based routing:

/compute/pod/{resourceId}

Frontend only passes the resource ID.

The Compute routing resolver will consume the ancestor API
to resolve the resource context and generate the canonical route.

Example:

GET
/rackconfig-service/v1/device-info/systems/{id}/redirection

Response:

- unassigned
- rowId
- rackId
- drawerId

The routing resolver determines the correct virtual/physical context.

## API Confirmation

BE provides the required ancestor API for SCC 4.0 resource-based routing:

GET
/rackconfig-service/v1/device-info/systems/{id}/redirection

## Decision

Frontend does not need to:

- call the ancestor API directly during Compute List navigation
- maintain pod/group/rack/drawer relationship
- construct hierarchy-based URLs

The Compute routing resolver consume the ancestor API
to resolve the resource context and generate the canonical route.

## Dependency / Open Item

The following items are required before implementation:

- SCC 4.0 Compute routing migration
- Update Compute Tree View / UX mock-up to align with resource-based routing
- Alignment between UX, FE, and BE API contracts

## Reference

- Existing SCC 3.X redirection API
- SCC 4.0 Compute Routing Spec
- Compute List → Location link navigation