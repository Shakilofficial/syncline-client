'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/apiClient';
import { useAuthStore } from '@/store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  CheckSquare,
  Clock,
  FolderKanban,
  TrendingUp,
  Users
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

export default function DashboardContent() {
  const { user } = useAuthStore();

  // Fetch projects list
  const { data: projectsData, isLoading: isProjectsLoading } = useQuery({
    queryKey: ['projects', { limit: 100 }],
    queryFn: async () => {
      const res = await apiClient.get('/api/v1/projects', {
        params: { page: 1, limit: 100 },
      });
      return res.data;
    },
  });

  const projects = projectsData?.data || [];

  // Concurrently fetch tasks of all projects
  const { data: tasks, isLoading: isTasksLoading } = useQuery({
    queryKey: ['dashboard-tasks', projects.map((p: any) => p.id)],
    queryFn: async () => {
      if (projects.length === 0) return [];
      const tasksPromises = projects.map(async (project: any) => {
        try {
          const res = await apiClient.get(`/api/v1/projects/${project.id}/tasks`, {
            params: { limit: 100 }
          });
          return res.data?.data || res.data || [];
        } catch {
          return [];
        }
      });
      const results = await Promise.all(tasksPromises);
      return results.flat();
    },
    enabled: projects.length > 0,
  });

  const isLoading = isProjectsLoading || isTasksLoading;

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const allTasks = tasks || [];

  // Aggregated Projects Stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p: any) => p.status === 'ACTIVE').length;
  const completedProjects = projects.filter((p: any) => p.status === 'COMPLETED').length;
  const onHoldProjects = projects.filter((p: any) => p.status === 'ON_HOLD').length;

  // Aggregated Tasks Stats
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter((t: any) => t.status === 'COMPLETED').length;
  const inProgressTasks = allTasks.filter((t: any) => t.status === 'IN_PROGRESS').length;
  const todoTasks = allTasks.filter((t: any) => t.status === 'TODO').length;

  // Task Priorities Stats
  const highPriorityTasks = allTasks.filter((t: any) => t.priority === 'HIGH').length;
  const mediumPriorityTasks = allTasks.filter((t: any) => t.priority === 'MEDIUM').length;
  const lowPriorityTasks = allTasks.filter((t: any) => t.priority === 'LOW').length;

  // Overdue / Urgent stats
  const today = new Date();
  const overdueTasks = allTasks.filter(
    (t: any) => t.dueDate && new Date(t.dueDate) < today && t.status !== 'COMPLETED'
  ).length;
  const unassignedTasks = allTasks.filter((t: any) => !t.assigneeId).length;

  const totalMembers = projects.reduce((acc: number, curr: any) => acc + (curr._count?.members || 0), 0);
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Recharts Data 1: Task status distribution
  const taskStatusData = [
    { name: 'To Do', value: todoTasks, color: '#6366f1' }, // Indigo
    { name: 'In Progress', value: inProgressTasks, color: '#f59e0b' }, // Amber
    { name: 'Completed', value: completedTasks, color: '#10b981' }, // Emerald
  ].filter(d => d.value > 0);

  // Recharts Data 2: Priority breakdown
  const taskPriorityData = [
    { name: 'High', Tasks: highPriorityTasks, fill: '#f43f5e' },
    { name: 'Medium', Tasks: mediumPriorityTasks, fill: '#fb923c' },
    { name: 'Low', Tasks: lowPriorityTasks, fill: '#34d399' },
  ];

  // Recharts Data 3: Tasks vs Members comparison per project
  const projectComparisonData = projects.map((p: any) => ({
    name: p.name.length > 15 ? `${p.name.substring(0, 15)}…` : p.name,
    Tasks: p._count?.tasks || 0,
    Members: p._count?.members || 0,
  }));

  // Recharts Data 4: Dynamic weekly trend
  const getTrendData = () => {
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
    const nowMs = today.getTime();
    
    return Array.from({ length: 5 }).map((_, idx) => {
      const wStart = new Date(nowMs - (5 - idx) * oneWeekMs);
      const wEnd = new Date(nowMs - (4 - idx) * oneWeekMs);
      
      const compInWk = allTasks.filter((t: any) => {
        const date = new Date(t.updatedAt || t.createdAt);
        return t.status === 'COMPLETED' && date >= wStart && date < wEnd;
      }).length;
      
      const activeInWk = allTasks.filter((t: any) => {
        const date = new Date(t.createdAt);
        return date < wEnd && (t.status !== 'COMPLETED' || new Date(t.updatedAt) >= wEnd);
      }).length;

      return {
        name: `Week ${idx + 1}`,
        Completed: compInWk,
        Active: activeInWk,
      };
    });
  };

  const completionTrendData = getTrendData();

  return (
    <div className="space-y-6 relative overflow-hidden">
      {/* Welcome Banner */}
      <div className="relative p-6 rounded-2xl border border-border/40 bg-card/25 backdrop-blur-md overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="space-y-1 relative z-10">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            Welcome back, {user?.name || 'User'}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Here is a consolidated overview of workspace performance, workloads, and task deadlines.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 font-semibold text-xs shrink-0 self-start sm:self-auto w-fit">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Workspace Synchronized
        </div>
      </div>

      {/* Grid of numeric metrics widgets */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Projects Overview */}
        <Card className="border-border/40 bg-card/35 backdrop-blur-md text-foreground shadow-sm hover:border-primary/15 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Projects
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <FolderKanban className="h-4.5 w-4.5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-3xl font-extrabold text-foreground">{totalProjects}</div>
              <p className="text-[10px] text-muted-foreground mt-0.5">Total managed workspaces</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground border-t border-border/40 pt-2.5">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                {activeProjects} Active
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {completedProjects} Done
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Overview */}
        <Card className="border-border/40 bg-card/35 backdrop-blur-md text-foreground shadow-sm hover:border-primary/15 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Tasks Progress
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <CheckSquare className="h-4.5 w-4.5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-3xl font-extrabold text-foreground">{totalTasks}</div>
              <p className="text-[10px] text-muted-foreground mt-0.5">Aggregated task cards</p>
            </div>
            <div className="grid grid-cols-3 gap-1 text-[9px] text-muted-foreground border-t border-border/40 pt-2.5">
              <div className="space-y-0.5">
                <span className="font-semibold text-foreground block">{todoTasks}</span>
                <span>To Do</span>
              </div>
              <div className="space-y-0.5">
                <span className="font-semibold text-foreground block">{inProgressTasks}</span>
                <span>Active</span>
              </div>
              <div className="space-y-0.5">
                <span className="font-semibold text-foreground block">{completedTasks}</span>
                <span>Done</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Urgent Items warnings */}
        <Card className={`border-border/40 bg-card/35 backdrop-blur-md text-foreground shadow-sm transition-all duration-300 hover:border-primary/15 ${overdueTasks > 0 ? 'ring-1 ring-rose-500/25' : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Urgent Items
            </CardTitle>
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${overdueTasks > 0 ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}`}>
              <AlertTriangle className="h-4.5 w-4.5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className={`text-3xl font-extrabold ${overdueTasks > 0 ? 'text-rose-500' : 'text-foreground'}`}>
                {overdueTasks}
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">Overdue items warning</p>
            </div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground border-t border-border/40 pt-2.5">
              <span>{unassignedTasks} unassigned tasks</span>
              {overdueTasks > 0 && <span className="text-[9px] text-rose-500 font-bold uppercase tracking-wide">Action Needed</span>}
            </div>
          </CardContent>
        </Card>

        {/* Global Completion Rate */}
        <Card className="border-border/40 bg-card/35 backdrop-blur-md text-foreground shadow-sm hover:border-primary/15 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Task Velocity
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Activity className="h-4.5 w-4.5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-3xl font-extrabold text-foreground">{completionRate}%</div>
              <p className="text-[10px] text-muted-foreground mt-0.5">Global task completion rate</p>
            </div>
            <div className="space-y-1.5 border-t border-border/40 pt-3">
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                  style={{ width: `${completionRate}%` }} 
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Trend Area Chart */}
        <Card className="border-border/40 bg-card/25 backdrop-blur-md text-foreground lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-1.5">
              <TrendingUp className="h-4.5 w-4.5 text-primary" /> Completion Velocity
            </CardTitle>
            <CardDescription className="text-muted-foreground text-xs">
              Chronological completed vs active tasks counts over the last 5 weeks
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80 pr-4 flex flex-col justify-end">
            {totalTasks === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                No tasks available to construct trend lines.
              </div>
            ) : (
              <div className="w-full h-[260px] min-w-0 min-h-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={completionTrendData}>
                    <defs>
                      <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" style={{ fontSize: 10 }} />
                    <YAxis stroke="var(--muted-foreground)" style={{ fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)', color: 'var(--popover-foreground)', borderRadius: 12, fontSize: 11 }}
                    />
                    <Area type="monotone" dataKey="Completed" stroke="#10b981" fillOpacity={1} fill="url(#colorCompleted)" strokeWidth={2} />
                    <Area type="monotone" dataKey="Active" stroke="#6366f1" fillOpacity={1} fill="url(#colorActive)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Task status Distribution Pie Chart */}
        <Card className="border-border/40 bg-card/25 backdrop-blur-md text-foreground shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-1.5">
              <Clock className="h-4.5 w-4.5 text-primary" /> Task Distribution
            </CardTitle>
            <CardDescription className="text-muted-foreground text-xs">
              Status breakdown of all queried workspace tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex flex-col items-center justify-center relative">
            {taskStatusData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                No active tasks found.
              </div>
            ) : (
              <>
                <div className="w-full h-[200px] min-w-0 min-h-0 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={taskStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {taskStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)', color: 'var(--popover-foreground)', borderRadius: 12, fontSize: 11 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Legend indicators */}
                <div className="flex flex-wrap justify-center gap-3.5 text-xs mt-2 text-muted-foreground px-2">
                  {taskStatusData.map((item) => (
                    <div key={item.name} className="flex items-center gap-1.5 font-medium">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.name} ({item.value})</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Load Charts row: Priority Distribution & Workspace workloads */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Priority Spread Chart */}
        <Card className="border-border/40 bg-card/25 backdrop-blur-md text-foreground shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-1.5">
              <CheckCircle2 className="h-4.5 w-4.5 text-primary" /> Task Priorities
            </CardTitle>
            <CardDescription className="text-muted-foreground text-xs">
              Spread of High, Medium, and Low priority task cards
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80 pr-4 flex flex-col justify-end">
            {totalTasks === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                No tasks to display priority data.
              </div>
            ) : (
              <div className="w-full h-[260px] min-w-0 min-h-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={taskPriorityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" style={{ fontSize: 10 }} />
                    <YAxis stroke="var(--muted-foreground)" style={{ fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)', color: 'var(--popover-foreground)', borderRadius: 12, fontSize: 11 }}
                    />
                    <Bar dataKey="Tasks" radius={[6, 6, 0, 0]}>
                      {taskPriorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Workload Comparison */}
        <Card className="border-border/40 bg-card/25 backdrop-blur-md text-foreground shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-1.5">
              <Users className="h-4.5 w-4.5 text-primary" /> Workload Comparison
            </CardTitle>
            <CardDescription className="text-muted-foreground text-xs">
              Comparing task cards allocation and team members counts per project workspace
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80 pr-4 flex flex-col justify-end">
            {totalProjects === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                No projects found.
              </div>
            ) : (
              <div className="w-full h-[260px] min-w-0 min-h-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={projectComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" style={{ fontSize: 9 }} />
                    <YAxis stroke="var(--muted-foreground)" style={{ fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)', color: 'var(--popover-foreground)', borderRadius: 12, fontSize: 11 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="Tasks" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Members" fill="#c084fc" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
