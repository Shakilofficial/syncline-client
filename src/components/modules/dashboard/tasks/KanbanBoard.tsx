'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { apiClient } from '@/lib/apiClient';
import { cn } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Calendar,
  Plus,
  Search
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import CreateTaskDialog from './CreateTaskDialog';
import TaskDetailsSheet from './TaskDetailsSheet';

interface Member {
  user: {
    id: string;
    name: string;
  };
}

interface KanbanBoardProps {
  projectId: string;
  members: Member[];
}

const KanbanBoard = ({ projectId, members }: KanbanBoardProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priority, setPriority] = useState<string>('ALL');
  const [assigneeId, setAssigneeId] = useState<string>('ALL');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const [activeDropCol, setActiveDropCol] = useState<'TODO' | 'IN_PROGRESS' | 'COMPLETED' | null>(null);

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' }) => {
      await apiClient.patch(`/api/v1/tasks/${taskId}`, { status });
    },
    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks', projectId] });
      const previousTasksData = queryClient.getQueryData(['tasks', projectId, { searchTerm, priority, assigneeId }]);

      if (previousTasksData) {
        queryClient.setQueryData(
          ['tasks', projectId, { searchTerm, priority, assigneeId }],
          (old: any) => {
            if (!old || !old.data) return old;
            return {
              ...old,
              data: old.data.map((task: any) =>
                task.id === taskId ? { ...task, status } : task
              ),
            };
          }
        );
      }
      return { previousTasksData };
    },
    onError: (err, newVariables, context) => {
      if (context?.previousTasksData) {
        queryClient.setQueryData(
          ['tasks', projectId, { searchTerm, priority, assigneeId }],
          context.previousTasksData
        );
      }
      toast.error('Failed to update task status.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    },
  });

  // Query to fetch project tasks
  const { data: tasksData, isLoading, isError } = useQuery({
    queryKey: ['tasks', projectId, { searchTerm, priority, assigneeId }],
    queryFn: async () => {
      const params: any = {};
      if (searchTerm) params.searchTerm = searchTerm;
      if (priority && priority !== 'ALL') params.priority = priority;
      if (assigneeId && assigneeId !== 'ALL') params.assigneeId = assigneeId;

      const res = await apiClient.get(`/api/v1/projects/${projectId}/tasks`, { params });
      return res.data;
    },
  });

  const tasks = tasksData?.data || [];

  // Group tasks by status columns
  const todoTasks = tasks.filter((t: any) => t.status === 'TODO');
  const inProgressTasks = tasks.filter((t: any) => t.status === 'IN_PROGRESS');
  const completedTasks = tasks.filter((t: any) => t.status === 'COMPLETED');

  const getPriorityBadge = (prio: 'HIGH' | 'MEDIUM' | 'LOW') => {
    switch (prio) {
      case 'HIGH':
        return <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[9px] py-0 px-1.5 font-medium">High</Badge>;
      case 'MEDIUM':
        return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[9px] py-0 px-1.5 font-medium">Medium</Badge>;
      case 'LOW':
        return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[9px] py-0 px-1.5 font-medium">Low</Badge>;
      default:
        return <Badge variant="outline" className="text-[9px] py-0 px-1.5">{prio}</Badge>;
    }
  };

  const statusStyles = {
    TODO: {
      badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/25',
      cardIndicator: 'bg-blue-500/75 dark:bg-blue-400/80',
      columnBg: 'bg-blue-500/[0.015]'
    },
    IN_PROGRESS: {
      badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25',
      cardIndicator: 'bg-amber-500/75 dark:bg-amber-450/80',
      columnBg: 'bg-amber-500/[0.015]'
    },
    COMPLETED: {
      badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25',
      cardIndicator: 'bg-emerald-500/75 dark:bg-emerald-450/80',
      columnBg: 'bg-emerald-500/[0.015]'
    }
  };

  const getAssigneeInitials = (task: any) => {
    if (!task.assignee?.name) return 'UN';
    return task.assignee.name.substring(0, 2).toUpperCase();
  };

  const renderColumn = (title: string, columnTasks: any[], statusKey: 'TODO' | 'IN_PROGRESS' | 'COMPLETED') => {
    const config = statusStyles[statusKey];
    const isOver = activeDropCol === statusKey;
    return (
      <div 
        className={cn(
          "flex flex-col gap-3.5 flex-1 min-w-[280px] rounded-xl p-2 transition-all duration-300 border-2 border-transparent", 
          config.columnBg,
          isOver && "border-dashed border-primary/40 bg-primary/[0.02]"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          if (activeDropCol !== statusKey) {
            setActiveDropCol(statusKey);
          }
        }}
        onDragLeave={() => {
          setActiveDropCol(null);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setActiveDropCol(null);
          const taskId = e.dataTransfer.getData('text/plain');
          if (taskId) {
            updateTaskMutation.mutate({ taskId, status: statusKey });
          }
        }}
      >
        {/* Column Header */}
        <div className="flex items-center justify-between border-b border-border pb-2 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground/80">{title}</span>
            <span className={cn("rounded-full px-2 py-0.5 text-[9px] font-bold border", config.badge)}>
              {columnTasks.length}
            </span>
          </div>
          <CreateTaskDialog projectId={projectId} members={members}>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md">
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </CreateTaskDialog>
        </div>

        {/* Task Cards Container */}
        <div className="flex flex-col gap-2.5 min-h-[500px] border border-transparent p-0.5">
          {columnTasks.map((task: any) => (
            <Card
              key={task.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', task.id);
                e.dataTransfer.effectAllowed = 'move';
              }}
              onClick={() => setSelectedTaskId(task.id)}
              className="relative overflow-hidden border border-border/40 bg-card/30 backdrop-blur-md hover:bg-card/55 hover:border-primary/20 hover:shadow-md transition-all duration-200 cursor-pointer select-none pl-3 flex flex-col justify-between active:cursor-grabbing"
            >
              {/* Colored status bar */}
              <span className={cn("absolute left-0 top-0 bottom-0 w-1", config.cardIndicator)} />
              
              <CardHeader className="p-3 space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-xs font-bold line-clamp-2 leading-snug">
                    {task.title}
                  </CardTitle>
                  {getPriorityBadge(task.priority)}
                </div>
                {task.description && (
                  <p className="text-[10px] text-muted-foreground/80 line-clamp-2 leading-relaxed">
                    {task.description}
                  </p>
                )}
              </CardHeader>
              <CardContent className="p-3 pt-2 border-t border-border/40 flex items-center justify-between text-[9px] text-muted-foreground/70">
                {/* Due date */}
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-muted-foreground/55" />
                  <span>
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                  </span>
                </div>
                {/* Assignee initials badge */}
                <div className="flex items-center gap-1">
                  <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-muted text-[8px] font-bold text-foreground border border-border">
                    {getAssigneeInitials(task)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative group flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60 transition-colors group-focus-within:text-primary" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs border-border bg-background/60 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/40"
            />
          </div>

          {/* Priority Filter */}
          <Select value={priority} onValueChange={(val) => setPriority(val ?? 'ALL')}>
            <SelectTrigger className="w-[130px] h-9 text-xs border-border bg-background/60 text-foreground focus:ring-primary/40">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent className="border-border bg-popover text-popover-foreground">
              <SelectItem value="ALL" className="focus:bg-accent focus:text-accent-foreground text-xs">All Priorities</SelectItem>
              <SelectItem value="LOW" className="focus:bg-accent focus:text-accent-foreground text-xs">Low</SelectItem>
              <SelectItem value="MEDIUM" className="focus:bg-accent focus:text-accent-foreground text-xs">Medium</SelectItem>
              <SelectItem value="HIGH" className="focus:bg-accent focus:text-accent-foreground text-xs">High</SelectItem>
            </SelectContent>
          </Select>

          {/* Assignee Filter */}
          <Select value={assigneeId} onValueChange={(val) => setAssigneeId(val ?? 'ALL')}>
            <SelectTrigger className="w-[150px] h-9 text-xs border-border bg-background/60 text-foreground focus:ring-primary/40">
              <SelectValue placeholder="Assignee">
                {assigneeId === 'ALL'
                  ? 'All Assignees'
                  : assigneeId === 'NONE'
                  ? 'Unassigned'
                  : (members?.find((m) => m.user?.id === assigneeId)?.user?.name ?? assigneeId)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="border-border bg-popover text-popover-foreground">
              <SelectItem value="ALL" className="focus:bg-accent focus:text-accent-foreground text-xs">All Assignees</SelectItem>
              <SelectItem value="NONE" className="focus:bg-accent focus:text-accent-foreground text-xs">Unassigned</SelectItem>
              {members?.map((m) => (
                <SelectItem key={m.user?.id} value={m.user?.id} className="focus:bg-accent focus:text-accent-foreground text-xs">
                  {m.user?.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Board Listing Lanes */}
      {isLoading ? (
        <div className="flex justify-center items-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : isError ? (
        <div className="text-center py-12 text-muted-foreground border border-border rounded-lg bg-card/20 text-xs">
          Failed to load project tasks.
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 items-start w-full min-w-0">
          {renderColumn('To Do', todoTasks, 'TODO')}
          {renderColumn('In Progress', inProgressTasks, 'IN_PROGRESS')}
          {renderColumn('Completed', completedTasks, 'COMPLETED')}
        </div>
      )}

      {/* Slide-out Task Details Sheet */}
      {selectedTaskId && (
        <TaskDetailsSheet
          taskId={selectedTaskId}
          projectId={projectId}
          members={members}
          onClose={() => setSelectedTaskId(null)}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
