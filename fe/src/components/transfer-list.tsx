'use no memo';

import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconGripVertical,
} from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { ButtonGroup } from '~/components/ui/button-group';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Checkbox } from '~/components/ui/checkbox';
import { Label } from '~/components/ui/label';

// ==================== Types ====================

export interface TransferItem {
  id: number;
  label: string;
  description?: string;
  badge?: string;
  group?: string;
  groupSortOrder?: number;
}

export interface AssignedItem extends TransferItem {
  isRequired: boolean;
}

export interface TransferListProps {
  /** All items available for assignment */
  availableSource: TransferItem[];
  /** Currently assigned items (with order and required flag) */
  assignedSource: AssignedItem[];
  /** Called whenever assigned list changes */
  onAssignedChange?: (assigned: AssignedItem[]) => void;
  /** Labels */
  labels: {
    available: string;
    assigned: string;
    noAvailable: string;
    noAssigned: string;
    required: string;
    ungrouped?: string;
  };
}

// ==================== Sub-components ====================

const AVAILABLE_CONTAINER = 'available';
const ASSIGNED_CONTAINER = 'assigned';

function DraggableCard({
  item,
  containerId,
  checked,
  onCheck,
  showRequired,
  onToggleRequired,
  requiredLabel,
}: {
  item: AssignedItem;
  containerId: string;
  checked: boolean;
  onCheck: (id: number) => void;
  showRequired: boolean;
  onToggleRequired?: (id: number) => void;
  requiredLabel?: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    data: { containerId },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='bg-background flex items-center gap-2 rounded-md border px-3 py-2'
    >
      <Checkbox checked={checked} onCheckedChange={() => onCheck(item.id)} />
      <Button
        variant='ghost'
        size='icon'
        className='size-6 cursor-grab'
        {...attributes}
        {...listeners}
      >
        <IconGripVertical className='size-4' />
      </Button>
      <span className='flex-1 text-sm'>
        {item.label}
        {item.description && (
          <span className='text-muted-foreground ml-1'>({item.description})</span>
        )}
      </span>
      {item.badge && (
        <Badge variant='secondary' className='text-xs'>
          {item.badge}
        </Badge>
      )}
      {showRequired && onToggleRequired && (
        <Label className='text-muted-foreground gap-1.5 text-xs'>
          <Checkbox checked={item.isRequired} onCheckedChange={() => onToggleRequired(item.id)} />
          {requiredLabel}
        </Label>
      )}
    </div>
  );
}

function OverlayCard({ item }: { item: AssignedItem }) {
  return (
    <div className='bg-background flex items-center gap-2 rounded-md border px-3 py-2 shadow-lg'>
      <Checkbox />
      <IconGripVertical className='text-muted-foreground size-4' />
      <span className='flex-1 text-sm'>
        {item.label}
        {item.description && (
          <span className='text-muted-foreground ml-1'>({item.description})</span>
        )}
      </span>
      {item.badge && (
        <Badge variant='secondary' className='text-xs'>
          {item.badge}
        </Badge>
      )}
    </div>
  );
}

function DroppableContainer({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className='max-h-[400px] min-h-[100px] space-y-1 overflow-y-auto'>
      {children}
    </div>
  );
}

// ==================== Main Component ====================

export function TransferList({
  availableSource,
  assignedSource,
  onAssignedChange,
  labels,
}: TransferListProps) {
  const assignedIds = new Set(assignedSource.map((a) => a.id));
  const [availableItems, setAvailableItems] = useState<AssignedItem[]>(() =>
    availableSource
      .filter((item) => !assignedIds.has(item.id))
      .map((item) => ({ ...item, isRequired: false })),
  );
  const [assignedList, setAssignedList] = useState<AssignedItem[]>(() => assignedSource);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [checkedAvailable, setCheckedAvailable] = useState<Set<number>>(new Set());
  const [checkedAssigned, setCheckedAssigned] = useState<Set<number>>(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const findContainer = (id: number): string | null => {
    if (availableItems.some((i) => i.id === id)) return AVAILABLE_CONTAINER;
    if (assignedList.some((i) => i.id === id)) return ASSIGNED_CONTAINER;
    return null;
  };

  // --- Drag handlers ---
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(active.id as number);
    const overContainer =
      over.id === AVAILABLE_CONTAINER || over.id === ASSIGNED_CONTAINER
        ? (over.id as string)
        : findContainer(over.id as number);

    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    const activeItem =
      activeContainer === AVAILABLE_CONTAINER
        ? availableItems.find((i) => i.id === active.id)
        : assignedList.find((i) => i.id === active.id);

    if (!activeItem) return;

    if (activeContainer === AVAILABLE_CONTAINER && overContainer === ASSIGNED_CONTAINER) {
      setAvailableItems((prev) => prev.filter((i) => i.id !== active.id));
      setAssignedList((prev) => {
        const overIndex = prev.findIndex((i) => i.id === over.id);
        const insertIndex = overIndex >= 0 ? overIndex : prev.length;
        const newList = [...prev];
        newList.splice(insertIndex, 0, activeItem);
        return newList;
      });
    } else if (activeContainer === ASSIGNED_CONTAINER && overContainer === AVAILABLE_CONTAINER) {
      setAssignedList((prev) => prev.filter((i) => i.id !== active.id));
      setAvailableItems((prev) => [...prev, { ...activeItem, isRequired: false }]);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const activeContainer = findContainer(active.id as number);
    const overContainer =
      over.id === AVAILABLE_CONTAINER || over.id === ASSIGNED_CONTAINER
        ? (over.id as string)
        : findContainer(over.id as number);

    if (!activeContainer || !overContainer || activeContainer !== overContainer) return;

    if (activeContainer === ASSIGNED_CONTAINER) {
      setAssignedList((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return items;
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // --- Arrow button handlers ---
  const moveSelectedToAssigned = () => {
    const toMove = availableItems.filter((i) => checkedAvailable.has(i.id));
    setAvailableItems((prev) => prev.filter((i) => !checkedAvailable.has(i.id)));
    setAssignedList((prev) => [...prev, ...toMove]);
    setCheckedAvailable(new Set());
  };

  const moveAllToAssigned = () => {
    setAssignedList((prev) => [...prev, ...availableItems]);
    setAvailableItems([]);
    setCheckedAvailable(new Set());
  };

  const moveSelectedToAvailable = () => {
    const toMove = assignedList.filter((i) => checkedAssigned.has(i.id));
    setAssignedList((prev) => prev.filter((i) => !checkedAssigned.has(i.id)));
    setAvailableItems((prev) => [...prev, ...toMove.map((i) => ({ ...i, isRequired: false }))]);
    setCheckedAssigned(new Set());
  };

  const moveAllToAvailable = () => {
    setAvailableItems((prev) => [
      ...prev,
      ...assignedList.map((i) => ({ ...i, isRequired: false })),
    ]);
    setAssignedList([]);
    setCheckedAssigned(new Set());
  };

  // --- Checkbox handlers ---
  const toggleCheckAvailable = (id: number) => {
    setCheckedAvailable((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleCheckAssigned = (id: number) => {
    setCheckedAssigned((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleRequired = (id: number) => {
    setAssignedList((items) =>
      items.map((item) => (item.id === id ? { ...item, isRequired: !item.isRequired } : item)),
    );
  };

  useEffect(() => {
    onAssignedChange?.(assignedList);
  }, [assignedList, onAssignedChange]);

  const activeItem =
    activeId !== null
      ? ([...availableItems, ...assignedList].find((i) => i.id === activeId) ?? null)
      : null;

  return (
    <div className='space-y-4'>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className='grid grid-cols-[1fr_auto_1fr] gap-4'>
          {/* Available */}
          <Card className='dark:bg-[oklch(0.24_0.03_261.57)]'>
            <CardHeader>
              <CardTitle>
                {labels.available} ({availableItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SortableContext
                id={AVAILABLE_CONTAINER}
                items={availableItems.map((i) => i.id)}
                strategy={verticalListSortingStrategy}
              >
                <DroppableContainer id={AVAILABLE_CONTAINER}>
                  {(() => {
                    const ungroupedLabel = labels.ungrouped || 'Khác';
                    const grouped: Record<string, { items: AssignedItem[]; sortOrder: number }> =
                      {};
                    for (const item of availableItems) {
                      const key = item.group || ungroupedLabel;
                      if (!grouped[key]) {
                        grouped[key] = { items: [], sortOrder: item.groupSortOrder ?? 9999 };
                      }
                      grouped[key].items.push(item);
                    }
                    const entries = Object.entries(grouped).sort(([, a], [, b]) => {
                      return a.sortOrder - b.sortOrder;
                    });
                    return entries.map(([groupName, { items }]) => (
                      <div key={groupName}>
                        <div className='text-muted-foreground sticky top-0 bg-inherit px-1 py-1.5 text-xs font-semibold'>
                          {groupName}
                        </div>
                        {items.map((item) => (
                          <DraggableCard
                            key={item.id}
                            item={item}
                            containerId={AVAILABLE_CONTAINER}
                            checked={checkedAvailable.has(item.id)}
                            onCheck={toggleCheckAvailable}
                            showRequired={false}
                          />
                        ))}
                      </div>
                    ));
                  })()}
                  {availableItems.length === 0 && (
                    <p className='text-muted-foreground py-4 text-center text-sm'>
                      {labels.noAvailable}
                    </p>
                  )}
                </DroppableContainer>
              </SortableContext>
            </CardContent>
          </Card>

          {/* Arrow buttons */}
          <div className='flex flex-col items-center justify-center'>
            <ButtonGroup orientation='vertical'>
              <Button
                variant='outline'
                size='icon'
                onClick={moveAllToAssigned}
                disabled={availableItems.length === 0}
              >
                <IconChevronsRight className='size-4' />
              </Button>
              <Button
                variant='outline'
                size='icon'
                onClick={moveSelectedToAssigned}
                disabled={checkedAvailable.size === 0}
              >
                <IconChevronRight className='size-4' />
              </Button>
              <Button
                variant='outline'
                size='icon'
                onClick={moveSelectedToAvailable}
                disabled={checkedAssigned.size === 0}
              >
                <IconChevronLeft className='size-4' />
              </Button>
              <Button
                variant='outline'
                size='icon'
                onClick={moveAllToAvailable}
                disabled={assignedList.length === 0}
              >
                <IconChevronsLeft className='size-4' />
              </Button>
            </ButtonGroup>
          </div>

          {/* Assigned */}
          <Card className='dark:bg-[oklch(0.24_0.03_261.57)]'>
            <CardHeader>
              <CardTitle>
                {labels.assigned} ({assignedList.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SortableContext
                id={ASSIGNED_CONTAINER}
                items={assignedList.map((i) => i.id)}
                strategy={verticalListSortingStrategy}
              >
                <DroppableContainer id={ASSIGNED_CONTAINER}>
                  {(() => {
                    const ungroupedLabel = labels.ungrouped || 'Khác';
                    const grouped: Record<string, { items: AssignedItem[]; sortOrder: number }> =
                      {};
                    for (const item of assignedList) {
                      const key = item.group || ungroupedLabel;
                      if (!grouped[key]) {
                        grouped[key] = { items: [], sortOrder: item.groupSortOrder ?? 9999 };
                      }
                      grouped[key].items.push(item);
                    }
                    const entries = Object.entries(grouped).sort(([, a], [, b]) => {
                      return a.sortOrder - b.sortOrder;
                    });
                    return entries.map(([groupName, { items }]) => (
                      <div key={groupName}>
                        <div className='text-muted-foreground sticky top-0 bg-inherit px-1 py-1.5 text-xs font-semibold'>
                          {groupName}
                        </div>
                        {items.map((item) => (
                          <DraggableCard
                            key={item.id}
                            item={item}
                            containerId={ASSIGNED_CONTAINER}
                            checked={checkedAssigned.has(item.id)}
                            onCheck={toggleCheckAssigned}
                            showRequired={true}
                            onToggleRequired={toggleRequired}
                            requiredLabel={labels.required}
                          />
                        ))}
                      </div>
                    ));
                  })()}
                  {assignedList.length === 0 && (
                    <p className='text-muted-foreground py-4 text-center text-sm'>
                      {labels.noAssigned}
                    </p>
                  )}
                </DroppableContainer>
              </SortableContext>
            </CardContent>
          </Card>
        </div>

        <DragOverlay>{activeItem && <OverlayCard item={activeItem} />}</DragOverlay>
      </DndContext>
    </div>
  );
}
