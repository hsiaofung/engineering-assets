import { inject, Injectable } from '@angular/core'
import { TreeNode } from '@app/shared/design-system/global-component/tree-view-v1/models/tree-view.types'
import { Observable, of } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import { ComputeSelectionContext } from '../../selection/compute-selection-context.model'
import { ComputeSelectionRestoreService } from '../../selection/compute-selection-restore.service'
import { ComputeSelectionService } from '../../selection/compute-selection.service'
import { ComputeTreeNode } from '../models/compute-tree-node.model'
import {
  ComputeTreeSelectionRestoreAction,
  ComputeTreeSelectionRestoreResult,
  ComputeTreeSelectionRestoreState,
  ComputeTreeSystemSelectionRestoreResult,
} from '../models/compute-tree-selection-restore.model'
import { ComputeTreeLoaderService } from './compute-tree-loader.service'
import { ComputeTreeNodeOperationsService } from './compute-tree-node-operations.service'

/**
 * Service that determines the appropriate selection restoration strategy
 * for a given compute selection context.
 */
@Injectable()
export class ComputeTreeSelectionResolverService {
  private readonly selectionRestoreService = inject(ComputeSelectionRestoreService)
  private readonly treeDataService = inject(ComputeTreeNodeOperationsService)
  private readonly selectionService = inject(ComputeSelectionService)
  private readonly treeLoaderService = inject(ComputeTreeLoaderService)

  private restoredSelectionKey: string | null = null

  /**
   * Maps a selection context kind to the corresponding restoration action.
   * @param {ComputeSelectionContext} target - The selection context to evaluate.
   * @returns {ComputeTreeSelectionRestoreAction} The action to use for restoring the selection.
   */
  getRestoreAction(target: ComputeSelectionContext): ComputeTreeSelectionRestoreAction {
    switch (target.kind) {
      case 'virtual-pool':
      case 'physical-pool':
        return 'pool'

      case 'row':
        return 'row'

      case 'rack':
        return 'rack'

      case 'drawer':
        return 'drawer'

      case 'system':
        return 'system'

      default:
        return 'none'
    }
  }

  /**
   * Restores a tree selection based on the target context.
   * Dispatches to the appropriate restoration strategy according to the target kind.
   * @param {ComputeSelectionContext} target - The selection context to restore.
   * @param {ComputeTreeSelectionRestoreState} state - The tree state helpers used to update UI and selection.
   */
  restoreSelection(target: ComputeSelectionContext, state: ComputeTreeSelectionRestoreState): void {
    switch (this.getRestoreAction(target)) {
      case 'pool':
        this.restorePoolSelection(target, state)
        break

      case 'row':
        this.restoreRowSelection(target, state)
        break

      case 'rack':
        this.restoreRackSelection(target, state)
        break

      case 'drawer':
        this.restoreDrawerSelection(target, state.getData()).subscribe({
          next: (result) => {
            if (!result) {
              return
            }

            const { row, rack, drawer, ancestor } = result

            const physicalPool = state.findNodeByKind('physical-pool')

            if (!physicalPool) {
              return
            }

            state.expand(physicalPool)

            state.setData(state.updateChildren(state.getData(), physicalPool.key, [row]))

            const rowTreeNode = state.findNode(row.id)

            if (!rowTreeNode) {
              return
            }

            state.expand(rowTreeNode)

            state.setData(state.updateChildren(state.getData(), row.id, [rack]))

            const rackTreeNode = state.findNode(rack.id)

            if (!rackTreeNode) {
              return
            }

            state.expand(rackTreeNode)

            state.setData(state.updateChildren(state.getData(), rack.id, [drawer]))

            state.select(drawer, {
              kind: 'drawer',
              id: drawer.id,
              name: drawer.name,
              parentName: ancestor.rackLocationId,
            })
          },
          error: (error) => {
            console.error('DRAWER SELECTION RESTORE ERROR:', error)
          },
        })
        break

      case 'system':
        this.restoreSystemSelection(target, state.getData()).subscribe({
          next: (result) => {
            if (!result) {
              return
            }

            const { row, rack, drawer, system } = result

            const physicalPool = state.findNodeByKind('physical-pool')

            if (!physicalPool) {
              return
            }

            state.expand(physicalPool)

            state.setData(state.updateChildren(state.getData(), physicalPool.key, [row]))

            const rowTreeNode = state.findNode(row.id)

            if (!rowTreeNode) {
              return
            }

            state.expand(rowTreeNode)

            state.setData(state.updateChildren(state.getData(), row.id, [rack]))

            const rackTreeNode = state.findNode(rack.id)

            if (!rackTreeNode) {
              return
            }

            state.expand(rackTreeNode)

            state.setData(state.updateChildren(state.getData(), rack.id, [drawer]))

            const drawerTreeNode = state.findNode(drawer.id)

            if (!drawerTreeNode) {
              return
            }

            state.expand(drawerTreeNode)

            state.setData(state.updateChildren(state.getData(), drawer.id, [system]))

            state.select(system, target)
          },
          error: (error) => {
            console.error('SYSTEM SELECTION RESTORE ERROR:', error)
          },
        })
        break

      default:
        break
    }
  }

  /**
   * Restores a pool selection (virtual or physical) by finding the matching node
   * in the current tree state and selecting it.
   * @param {ComputeSelectionContext} target - The pool selection context to restore.
   * @param {ComputeTreeSelectionRestoreState} state - The tree state helpers used to update UI and selection.
   */
  restorePoolSelection(target: ComputeSelectionContext, state: ComputeTreeSelectionRestoreState): void {
    const node = this.treeDataService.findNode(state.getData(), target.id)

    if (!node?.data) {
      return
    }

    state.select(node.data, target)
  }

  /**
   * Restores a row selection by expanding the physical pool, loading its children,
   * and selecting the matching row node.
   * @param {ComputeSelectionContext} target - The row selection context to restore.
   * @param {ComputeTreeSelectionRestoreState} state - The tree state helpers used to update UI and selection.
   */
  restoreRowSelection(target: ComputeSelectionContext, state: ComputeTreeSelectionRestoreState): void {
    const physicalPool = state.findNodeByKind('physical-pool')

    if (!physicalPool?.data) {
      return
    }

    state.expand(physicalPool)
    state.addLoadingKey(physicalPool.key)

    this.treeLoaderService.loadChildren(physicalPool.data).subscribe({
      next: (rows) => {
        state.setData(state.updateChildren(state.getData(), physicalPool.key, rows))

        state.removeLoadingKey(physicalPool.key)

        const row = rows.find((node) => node.id === target.id)

        if (!row) {
          return
        }

        state.select(row, target)
      },
      error: () => {
        state.removeLoadingKey(physicalPool.key)
      },
    })
  }

  /**
   * Restores the selection of a rack by resolving its ancestor hierarchy.
   * Loads the physical pool rows, finds the parent row of the target rack,
   * and then restores the rack under that row.
   * @param {ComputeSelectionContext} target - The selection context of the rack to restore.
   * @param {ComputeTreeSelectionRestoreState} state - The tree state helpers used to update UI and data during restoration.
   */
  restoreRackSelection(target: ComputeSelectionContext, state: ComputeTreeSelectionRestoreState): void {
    this.selectionRestoreService.getRackAncestor(target.id).subscribe({
      next: (ancestor) => {
        const physicalPool = state.findNodeByKind('physical-pool')

        if (!physicalPool?.data) {
          return
        }

        state.expand(physicalPool)
        state.addLoadingKey(physicalPool.key)

        this.treeLoaderService.loadChildren(physicalPool.data).subscribe({
          next: (rows) => {
            state.setData(state.updateChildren(state.getData(), physicalPool.key, rows))

            state.removeLoadingKey(physicalPool.key)

            const row = state.findNode(ancestor.rowId)

            if (!row?.data) {
              return
            }

            this.restoreRackUnderRow(row, target, state)
          },
          error: () => {
            state.removeLoadingKey(physicalPool.key)
          },
        })
      },
      error: (error) => {
        console.error('RACK ANCESTOR ERROR:', error)
      },
    })
  }

  /**
   * Restores and expands a rack node under a given row during selection restoration.
   * Loads the children of the row, finds the target rack, and selects it if found.
   * @param {TreeNode<ComputeTreeNode>} row - The parent row tree node under which the rack should be restored.
   * @param {ComputeSelectionContext} target - The selection context containing the target rack information.
   * @param {ComputeTreeSelectionRestoreState} state - The tree state helpers used to update UI and data during restoration.
   */
  private restoreRackUnderRow(
    row: TreeNode<ComputeTreeNode>,
    target: ComputeSelectionContext,
    state: ComputeTreeSelectionRestoreState,
  ): void {
    state.expand(row)
    state.addLoadingKey(row.key)

    this.treeLoaderService.loadChildren(row.data!).subscribe({
      next: (racks) => {
        state.setData(state.updateChildren(state.getData(), row.key, racks))

        state.removeLoadingKey(row.key)

        const rack = racks.find((node) => node.id === target.id)

        if (!rack) {
          return
        }

        state.select(rack, target)
      },
      error: () => {
        state.removeLoadingKey(row.key)
      },
    })
  }

  /**
   * Builds a selection context from a compute tree node.
   * For drawer and system nodes, enriches the context with parent hierarchy information.
   * @param {ComputeTreeNode} node - The tree node to convert into a selection context.
   * @param {TreeNode<ComputeTreeNode>[]} nodes - The current tree structure used to resolve parent nodes.
   * @returns {ComputeSelectionContext} The constructed selection context.
   */
  buildSelectionContext(node: ComputeTreeNode, nodes: TreeNode<ComputeTreeNode>[]): ComputeSelectionContext {
    if (node.kind === 'system') {
      return this.buildSystemSelectionContext(node, nodes)
    }

    if (node.kind !== 'drawer') {
      return {
        kind: node.kind,
        id: node.id,
        name: node.name,
        parentId: node.parentId,
      }
    }

    const parent = this.treeDataService.findNode(nodes, node.parentId ?? '')

    return {
      kind: node.kind,
      id: node.id,
      name: node.name,
      parentId: node.parentId,
      parentName: parent?.data?.name,
    }
  }

  /**
   * Builds a selection context specifically for a system node.
   * Resolves the parent drawer and grandparent rack to include hierarchy details.
   * @param {ComputeTreeNode} node - The system tree node to convert.
   * @param {TreeNode<ComputeTreeNode>[]} nodes - The current tree structure used to resolve parent nodes.
   * @returns {ComputeSelectionContext} The constructed system selection context.
   */
  private buildSystemSelectionContext(
    node: ComputeTreeNode,
    nodes: TreeNode<ComputeTreeNode>[],
  ): ComputeSelectionContext {
    const drawer = this.treeDataService.findNode(nodes, node.parentId ?? '')

    const rack = drawer?.data?.parentId ? this.treeDataService.findNode(nodes, drawer.data.parentId) : null

    return {
      kind: 'system',
      id: node.id,
      name: node.name,
      parentId: node.parentId,
      parentName: drawer?.data?.name,
      rackId: rack?.data?.id,
      rackName: rack?.data?.name,
    }
  }

  /**
   * Selects a restored tree node and updates the selection service.
   * Prevents duplicate restoration by checking against the last restored selection key.
   * @param {ComputeTreeNode} node - The tree node to select after restoration.
   * @param {ComputeSelectionContext} target - The original selection context used to build the restoration key.
   * @param {TreeNode<ComputeTreeNode>[]} tree - The current tree structure used to build the selection context.
   * @param {(key: string) => void} setSelectedKey - Callback to update the currently selected key in the UI.
   */
  selectRestoredNode(
    node: ComputeTreeNode,
    target: ComputeSelectionContext,
    tree: TreeNode<ComputeTreeNode>[],
    setSelectedKey: (key: string) => void,
  ): void {
    const selectionKey = `${target.kind}:${target.id}`

    if (this.restoredSelectionKey === selectionKey) {
      return
    }

    setSelectedKey(node.id)

    const context = this.buildSelectionContext(node, tree)

    this.selectionService.select(context)

    this.restoredSelectionKey = selectionKey
  }

  /**
   * Restores the selection of a drawer by resolving its full ancestor hierarchy.
   * Loads and expands the physical pool → row → rack path, then returns the target drawer node.
   * @param {ComputeSelectionContext} target - The selection context of the drawer to restore.
   * @param {TreeNode<ComputeTreeNode>[]} tree - The current tree structure used to locate the physical pool.
   * @returns {Observable<ComputeTreeNode | null>} An observable emitting the restored drawer node, or `null` if not found.
   */
  restoreDrawerSelection(
    target: ComputeSelectionContext,
    tree: TreeNode<ComputeTreeNode>[],
  ): Observable<ComputeTreeSelectionRestoreResult | null> {
    return this.selectionRestoreService.getDrawerAncestor(target.id).pipe(
      switchMap((ancestor) => {
        const physicalPool = this.treeDataService.findNodeByKind(tree, 'physical-pool')

        if (!physicalPool?.data) {
          return of(null)
        }

        return this.treeLoaderService.loadChildren(physicalPool.data).pipe(
          switchMap((rows) => {
            const row = rows.find((node) => node.id === ancestor.rowId)

            if (!row) {
              return of(null)
            }

            return this.treeLoaderService.loadChildren(row).pipe(
              switchMap((racks) => {
                const rack = racks.find((node) => node.id === ancestor.rackId)

                if (!rack) {
                  return of(null)
                }

                return this.treeLoaderService.loadChildren(rack).pipe(
                  map((drawers) => {
                    const drawer = drawers.find((node) => node.id === ancestor.drawerId)

                    if (!drawer) {
                      return null
                    }

                    return {
                      row,
                      rack,
                      drawer,
                      ancestor,
                    }
                  }),
                )
              }),
            )
          }),
        )
      }),
    )
  }

  /**
   * Restores the selection of a system by resolving its full ancestor hierarchy.
   * Loads the physical pool → row → rack → drawer path, then returns the target system
   * along with its intermediate ancestor nodes.
   * @param {ComputeSelectionContext} target - The selection context of the system to restore.
   * @param {TreeNode<ComputeTreeNode>[]} tree - The current tree structure used to locate the physical pool.
   * @returns {Observable<ComputeTreeSystemSelectionRestoreResult | null>} An observable emitting the restored system result, or `null` if not found.
   */
  restoreSystemSelection(
    target: ComputeSelectionContext,
    tree: TreeNode<ComputeTreeNode>[],
  ): Observable<ComputeTreeSystemSelectionRestoreResult | null> {
    return this.selectionRestoreService.getSystemAncestor(target.id).pipe(
      switchMap((ancestor) => {
        const physicalPool = this.treeDataService.findNodeByKind(tree, 'physical-pool')

        if (!physicalPool?.data) {
          return of(null)
        }

        return this.treeLoaderService.loadChildren(physicalPool.data).pipe(
          switchMap((rows) => {
            const row = rows.find((node) => node.id === ancestor.rowId)

            if (!row) {
              return of(null)
            }

            return this.treeLoaderService.loadChildren(row).pipe(
              switchMap((racks) => {
                const rack = racks.find((node) => node.id === ancestor.rackId)

                if (!rack) {
                  return of(null)
                }

                return this.treeLoaderService.loadChildren(rack).pipe(
                  switchMap((drawers) => {
                    const drawer = drawers.find((node) => node.id === ancestor.drawerId)

                    if (!drawer) {
                      return of(null)
                    }

                    return this.treeLoaderService.loadChildren(drawer).pipe(
                      map((systems) => {
                        const system = systems.find((node) => node.id === target.id)

                        if (!system) {
                          return null
                        }

                        return {
                          row,
                          rack,
                          drawer,
                          system,
                          ancestor,
                        }
                      }),
                    )
                  }),
                )
              }),
            )
          }),
        )
      }),
    )
  }
}
