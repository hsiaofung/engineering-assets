import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core'
import { TreeNodeIconDirective, TreeViewV1Component } from '@app/shared/design-system/global-component/tree-view-v1'
import { TreeNode } from '@app/shared/design-system/global-component/tree-view-v1/models/tree-view.types'
import { ComputeSelectionContext } from '../selection/compute-selection-context.model'
import { ComputeSelectionService } from '../selection/compute-selection.service'
import { ComputeTreeNodeToUiMapper } from './mapper/compute-tree-node-to-ui.mapper'
import { ComputeTreeNode } from './models/compute-tree-node.model'
import { ComputeTreeSelectionRestoreState } from './models/compute-tree-selection-restore.model'
import { ComputeTreeLoaderService } from './services/compute-tree-loader.service'
import { ComputeTreeNodeOperationsService } from './services/compute-tree-node-operations.service'
import { ComputeTreeSelectionResolverService } from './services/compute-tree-selection-resolver.service'

/**
 *
 */
@Component({
  selector: 'app-compute-tree',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TreeViewV1Component, TreeNodeIconDirective],
  providers: [
    ComputeTreeNodeOperationsService,
    ComputeTreeLoaderService,
    ComputeTreeNodeToUiMapper,
    ComputeTreeSelectionResolverService,
  ],
  template: `
    <app-tree-view-v1
      [data]="data()"
      [loading]="loading()"
      [loadingKeys]="loadingKeys()"
      [(selectedKey)]="selectedKey"
      [(expandedKeys)]="expandedKeys"
      (nodeExpand)="onNodeExpand($event)"
      (nodeClick)="onNodeClick($event)"
      treeTitle="Tree View"
    >
      <ng-template appTreeNodeIcon let-node let-level="level">
        <img style="width: 16px; height: 16px;" [src]="getIcon(node.data)" [alt]="node.data?.kind ?? ''" />
      </ng-template>
    </app-tree-view-v1>
  `,
})
export class ComputeTreeComponent implements OnInit {
  private readonly treeDataService = inject(ComputeTreeNodeOperationsService)
  private readonly treeLoaderService = inject(ComputeTreeLoaderService)
  private readonly treeSelectionRestoreService = inject(ComputeTreeSelectionResolverService)
  private readonly selectionService = inject(ComputeSelectionService)
  private readonly treeNodeToUiMapper = new ComputeTreeNodeToUiMapper()

  /**
   * Target selection restored from the current URL.
   *
   * When provided, the tree automatically expands the required
   * hierarchy and selects the target node.
   */
  readonly selectionTarget = input<ComputeSelectionContext | null>(null)

  readonly data = signal<TreeNode<ComputeTreeNode>[]>([])
  readonly loading = signal(false)
  readonly loadingKeys = signal<Set<string>>(new Set())

  readonly selectedKey = signal<string | null>(null)
  readonly expandedKeys = signal<Set<string>>(new Set())

  readonly nodeSelect = output<ComputeTreeNode>()

  private readonly treeSelectionRestoreState: ComputeTreeSelectionRestoreState = {
    getData: () => this.data(),

    setData: (data) => {
      this.data.set(data)
    },

    expand: (node) => {
      this.expandedKeys.update((keys) => {
        const next = new Set(keys)
        next.add(node.key)
        return next
      })
    },

    addLoadingKey: (key) => {
      this.addLoadingKey(key)
    },

    removeLoadingKey: (key) => {
      this.removeLoadingKey(key)
    },

    findNode: (id) => {
      return this.treeDataService.findNode(this.data(), id)
    },

    findNodeByKind: (kind) => {
      return this.treeDataService.findNodeByKind(this.data(), kind)
    },

    updateChildren: (nodes, parentKey, children) => {
      return this.treeDataService.updateChildren(nodes, parentKey, children)
    },

    select: (node, target) => {
      this.treeSelectionRestoreService.selectRestoredNode(node, target, this.data(), (key) => this.selectedKey.set(key))
    },
  }

  /**
   *
   */
  ngOnInit(): void {
    this.loadRoot()
  }

  /**
   * Returns the icon path for a compute tree node.
   * @param {ComputeTreeNode | undefined} node - The compute tree node.
   * @returns {string} The icon asset path.
   */
  protected getIcon(node: ComputeTreeNode | undefined): string {
    if (!node) {
      return 'assets/tree/system.svg'
    }

    const iconMap: Record<ComputeTreeNode['kind'], string> = {
      pod: 'assets/tree/Pod.svg',
      'virtual-pool': 'assets/tree/group.svg',
      'physical-pool': 'assets/tree/group.svg',
      row: 'assets/tree/row.svg',
      rack: 'assets/tree/rack.svg',
      drawer: 'assets/tree/drawer.svg',
      system: 'assets/tree/system.svg',
    }

    return iconMap[node.kind] ?? 'assets/tree/system.svg'
  }

  /**
   * Loads the top-level compute tree.
   *
   * The API returns the initial children of the Pod.
   * The Pod itself is created locally as the root node.
   */
  private loadRoot(): void {
    this.loading.set(true)

    this.treeLoaderService.loadRoot().subscribe({
      next: (nodes) => {
        const pod: ComputeTreeNode = {
          id: 'pod',
          kind: 'pod',
          name: 'Pod',
          isLeaf: false,
        }

        this.data.set([
          {
            ...this.treeNodeToUiMapper.toUiTreeNode(pod),
            children: nodes.map((node) => this.treeNodeToUiMapper.toUiTreeNode(node)),
          },
        ])

        // Pod is expanded by default.
        this.expandedKeys.set(new Set(['pod']))
        this.loading.set(false)

        const target = this.selectionTarget()

        console.log('ROOT LOADED TARGET:', target)

        if (target) {
          this.syncSelection(target)
        }
      },
      error: () => {
        this.loading.set(false)
      },
    })
  }

  /**
   * Handles lazy loading when a non-leaf node is expanded.
   * @param {TreeNode<ComputeTreeNode>} treeNode - The expanded tree node.
   */
  protected onNodeExpand(treeNode: TreeNode<ComputeTreeNode>): void {
    const node = treeNode.data

    if (!node || node.isLeaf) {
      return
    }

    // Avoid loading children again when they already exist.
    if (treeNode.children?.length) {
      return
    }

    this.loadChildren(node)
  }

  /**
   * Loads children for the specified compute tree node.
   * @param {ComputeTreeNode} node - The parent compute tree node.
   */
  private loadChildren(node: ComputeTreeNode): void {
    this.addLoadingKey(node.id)

    this.treeLoaderService.loadChildren(node).subscribe({
      next: (children) => {
        this.data.update((tree) => this.treeDataService.updateChildren(tree, node.id, children))

        this.removeLoadingKey(node.id)
      },
      error: () => {
        this.removeLoadingKey(node.id)
      },
    })
  }

  /**
   * Handles node click events.
   * @param {TreeNode<ComputeTreeNode>} treeNode - The clicked tree node.
   */
  protected onNodeClick(treeNode: TreeNode<ComputeTreeNode>): void {
    const node = treeNode.data

    if (!node) {
      return
    }

    this.selectedKey.set(node.id)

    const selection = this.treeSelectionRestoreService.buildSelectionContext(node, this.data())

    this.selectionService.select(selection)
    this.nodeSelect.emit(node)
  }

  /**
   * Synchronizes the tree selection with the current URL selection.
   *
   * If the target node is already loaded, it is selected immediately.
   * Otherwise, the required parent node is expanded and its children
   * are loaded before selecting the target.
   * @param {ComputeSelectionContext} target - The target selection.
   */
  private syncSelection(target: ComputeSelectionContext): void {
    const targetNode = this.treeDataService.findNode(this.data(), target.id)

    if (targetNode?.data) {
      this.treeSelectionRestoreService.selectRestoredNode(targetNode.data, target, this.data(), (key) =>
        this.selectedKey.set(key),
      )
      return
    }

    this.treeSelectionRestoreService.restoreSelection(target, this.treeSelectionRestoreState)
  }

  /**
   * Adds a node key to the loading set.
   * @param {string} key - The loading node key.
   */
  private addLoadingKey(key: string): void {
    this.loadingKeys.update((keys) => {
      const next = new Set(keys)
      next.add(key)
      return next
    })
  }

  /**
   * Removes a node key from the loading set.
   * @param {string} key - The completed node key.
   */
  private removeLoadingKey(key: string): void {
    this.loadingKeys.update((keys) => {
      const next = new Set(keys)
      next.delete(key)
      return next
    })
  }
}
