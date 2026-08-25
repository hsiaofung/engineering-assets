import { ComponentFixture, TestBed } from '@angular/core/testing'
import { of, throwError } from 'rxjs'
import { ComputeTreeComponent } from './compute-tree.component'
import { ComputeTreeNode } from './models/compute-tree-node.model'
import { ComputeTreeApiService } from './services/compute-tree-api.service'

describe('ComputeTreeComponent', () => {
  let fixture: ComponentFixture<ComputeTreeComponent>
  let component: ComputeTreeComponent
  let treeService: {
    loadPod: ReturnType<typeof vi.fn>
    loadPhysicalPool: ReturnType<typeof vi.fn>
    loadRacks: ReturnType<typeof vi.fn>
    loadDrawers: ReturnType<typeof vi.fn>
    loadChildren: ReturnType<typeof vi.fn>
  }

  beforeEach(async () => {
    treeService = {
      loadPod: vi.fn(),
      loadPhysicalPool: vi.fn(),
      loadRacks: vi.fn(),
      loadDrawers: vi.fn(),
      loadChildren: vi.fn(),
    }

    treeService.loadPod.mockReturnValue(of([]))
    treeService.loadChildren.mockReturnValue(of([]))

    await TestBed.configureTestingModule({
      imports: [ComputeTreeComponent],
      providers: [
        {
          provide: ComputeTreeApiService,
          useValue: treeService,
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(ComputeTreeComponent)
    component = fixture.componentInstance
  })

  describe('initialization', () => {
    it('should load the root tree', () => {
      const nodes: ComputeTreeNode[] = [
        {
          id: 'pod-1',
          kind: 'pod',
          name: 'Pod',
          isLeaf: false,
        },
      ]

      treeService.loadPod.mockReturnValue(of(nodes))

      fixture.detectChanges()

      expect(treeService.loadPod).toHaveBeenCalledTimes(1)
      expect(component.data()).toEqual([
        {
          key: 'pod',
          label: 'Pod',
          leaf: false,
          data: {
            id: 'pod',
            kind: 'pod',
            name: 'Pod',
            isLeaf: false,
          },
          children: [
            {
              key: 'pod-1',
              label: 'Pod',
              leaf: false,
              data: nodes[0],
              children: [],
            },
          ],
        },
      ])
      expect(component.expandedKeys()).toEqual(new Set(['pod']))

      expect(component.loading()).toBe(false)
    })

    it('should stop loading when root loading fails', () => {
      treeService.loadPod.mockReturnValue(throwError(() => new Error('Failed to load tree')))

      fixture.detectChanges()

      expect(treeService.loadPod).toHaveBeenCalledTimes(1)
      expect(component.loading()).toBe(false)
    })
  })

  describe('node expansion', () => {
    it('should load children when a non-leaf node is expanded', () => {
      const rootNode: ComputeTreeNode = {
        id: 'physical-pool',
        kind: 'physical-pool',
        name: 'Physical Pool',
        isLeaf: false,
      }

      const children: ComputeTreeNode[] = [
        {
          id: 'row-1',
          kind: 'row',
          name: 'Row 1',
          parentId: 'physical-pool',
          isLeaf: false,
        },
      ]

      treeService.loadPod.mockReturnValue(of([rootNode]))
      treeService.loadChildren.mockReturnValue(of(children))

      fixture.detectChanges()

      const treeNode = component.data()[0].children![0]

      component['onNodeExpand'](treeNode)

      expect(treeService.loadChildren).toHaveBeenCalledWith(rootNode)

      expect(component.data()[0].children![0].children).toEqual([
        {
          key: 'row-1',
          label: 'Row 1',
          leaf: false,
          data: children[0],
          children: [],
        },
      ])
    })

    it('should not load children for a leaf node', () => {
      const node: ComputeTreeNode = {
        id: 'system-1',
        kind: 'system',
        name: 'System 1',
        isLeaf: true,
      }

      treeService.loadPod.mockReturnValue(of([node]))

      fixture.detectChanges()

      component['onNodeExpand'](component.data()[0])

      expect(treeService.loadChildren).not.toHaveBeenCalled()
    })

    it('should remove loading key after children are loaded', () => {
      const node: ComputeTreeNode = {
        id: 'row-1',
        kind: 'row',
        name: 'Row 1',
        isLeaf: false,
      }

      treeService.loadPod.mockReturnValue(of([node]))
      treeService.loadChildren.mockReturnValue(of([]))

      fixture.detectChanges()

      component['onNodeExpand'](component.data()[0])

      expect(component.loadingKeys().has('row-1')).toBe(false)
    })

    it('should remove loading key when loading children fails', () => {
      const node: ComputeTreeNode = {
        id: 'row-1',
        kind: 'row',
        name: 'Row 1',
        isLeaf: false,
      }

      treeService.loadPod.mockReturnValue(of([node]))
      treeService.loadChildren.mockReturnValue(throwError(() => new Error('Failed to load children')))

      fixture.detectChanges()

      component['onNodeExpand'](component.data()[0])

      expect(component.loadingKeys().has('row-1')).toBe(false)
    })
  })

  describe('node click', () => {
    it('should update selected key', () => {
      const node: ComputeTreeNode = {
        id: 'row-1',
        kind: 'row',
        name: 'Row 1',
        isLeaf: false,
      }

      treeService.loadPod.mockReturnValue(of([node]))

      fixture.detectChanges()

      const row = component.data()[0].children![0]

      component['onNodeClick'](row)

      expect(component.selectedKey()).toBe('row-1')
    })

    it('should emit nodeSelect with the selected node', () => {
      const node: ComputeTreeNode = {
        id: 'row-1',
        kind: 'row',
        name: 'Row 1',
        isLeaf: false,
      }

      treeService.loadPod.mockReturnValue(of([node]))

      fixture.detectChanges()

      const nodeSelectSpy = vi.fn()
      component.nodeSelect.subscribe(nodeSelectSpy)

      const row = component.data()[0].children![0]

      component['onNodeClick'](row)

      expect(nodeSelectSpy).toHaveBeenCalledTimes(1)
      expect(nodeSelectSpy).toHaveBeenCalledWith(node)
    })
  })
})
