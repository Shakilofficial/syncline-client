'use client';

import CreateProjectDialog from '@/components/modules/dashboard/projects/CreateProjectDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { apiClient } from '@/lib/apiClient';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpDown, Calendar, CheckSquare, Plus, Search, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ProjectsContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);

  // Fetch projects list
  const { data: projectsData, isLoading, isError } = useQuery({
    queryKey: ['projects', { searchTerm, status, sortBy, sortOrder, page }],
    queryFn: async () => {
      const params: any = {
        page,
        limit: 9,
        sortBy,
        sortOrder,
      };
      if (searchTerm) params.searchTerm = searchTerm;
      if (status && status !== 'ALL') params.status = status;

      const res = await apiClient.get('/api/v1/projects', { params });
      return res.data;
    },
  });

  const projects = projectsData?.data || [];
  const meta = projectsData?.meta || { page: 1, limit: 9, total: 0 };
  const totalPages = Math.ceil(meta.total / meta.limit);

  const getStatusBadge = (projStatus: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD') => {
    switch (projStatus) {
      case 'ACTIVE':
        return <Badge className="bg-primary/10 text-primary border border-primary/20 text-[9px] py-0 px-2 font-medium">Active</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border border-emerald-500/20 text-[9px] py-0 px-2 font-medium">Completed</Badge>;
      case 'ON_HOLD':
        return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-450 border border-amber-500/20 text-[9px] py-0 px-2 font-medium">On Hold</Badge>;
      default:
        return <Badge variant="outline" className="text-[9px] py-0 px-2">{projStatus}</Badge>;
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header section */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-foreground animate-in fade-in slide-in-from-top-4 duration-300">
            Projects Workspace
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage, collaborate, and monitor all active workspaces.
          </p>
        </div>
        <CreateProjectDialog>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-9 font-semibold flex items-center gap-2 w-full md:w-auto justify-center px-4">
            <Plus className="h-4 w-4" /> Create Project
          </Button>
        </CreateProjectDialog>
      </div>

      {/* Filter and search controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm">
        <div className="flex flex-1 flex-wrap items-center gap-2.5 w-full">
          {/* Search */}
          <div className="relative group flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60 transition-colors group-focus-within:text-primary" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="pl-9 h-9 text-xs border-border bg-background/60 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/40"
            />
          </div>

          {/* Status filter */}
          <Select
            value={status}
            onValueChange={(val) => {
              setStatus(val ?? 'ALL');
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[130px] h-9 text-xs border-border bg-background/60 text-foreground focus:ring-primary/40">
              <SelectValue placeholder="Status">
                {status === 'ALL'
                  ? 'All Status'
                  : status === 'ACTIVE'
                  ? 'Active'
                  : status === 'ON_HOLD'
                  ? 'On Hold'
                  : status === 'COMPLETED'
                  ? 'Completed'
                  : status}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="border-border bg-popover text-popover-foreground">
              <SelectItem value="ALL" className="focus:bg-accent focus:text-accent-foreground text-xs">All Status</SelectItem>
              <SelectItem value="ACTIVE" className="focus:bg-accent focus:text-accent-foreground text-xs">Active</SelectItem>
              <SelectItem value="ON_HOLD" className="focus:bg-accent focus:text-accent-foreground text-xs">On Hold</SelectItem>
              <SelectItem value="COMPLETED" className="focus:bg-accent focus:text-accent-foreground text-xs">Completed</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort By filter */}
          <Select
            value={sortBy}
            onValueChange={(val) => {
              setSortBy(val ?? 'createdAt');
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[130px] h-9 text-xs border-border bg-background/60 text-foreground focus:ring-primary/40">
              <SelectValue placeholder="Sort By">
                {sortBy === 'createdAt'
                  ? 'Created Date'
                  : sortBy === 'name'
                  ? 'Name'
                  : sortBy === 'deadline'
                  ? 'Deadline'
                  : sortBy}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="border-border bg-popover text-popover-foreground">
              <SelectItem value="createdAt" className="focus:bg-accent focus:text-accent-foreground text-xs">Created Date</SelectItem>
              <SelectItem value="name" className="focus:bg-accent focus:text-accent-foreground text-xs">Name</SelectItem>
              <SelectItem value="deadline" className="focus:bg-accent focus:text-accent-foreground text-xs">Deadline</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Order filter */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              setPage(1);
            }}
            className="border-border bg-background/60 h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Grid listing */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-40 border border-border bg-card/45 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12 text-muted-foreground border border-border rounded-xl bg-card/20 text-xs">
          Failed to load projects. Please try refreshing.
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl bg-card/20 text-xs">
          No projects found. Try creating a new one!
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project: any) => (
              <Link 
                key={project.id} 
                href={`/projects/${project.id}`}
                className="group block border border-border/40 bg-card/35 backdrop-blur-md hover:bg-card/60 text-foreground hover:border-primary/25 hover:shadow-lg hover:shadow-primary/5 rounded-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="p-3.5 space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-xs font-bold tracking-tight truncate group-hover:text-primary transition-colors">
                      {project.name}
                    </h2>
                    {getStatusBadge(project.status)}
                  </div>
                  
                  <p className="text-[10px] text-muted-foreground/90 line-clamp-2 leading-relaxed min-h-[30px]">
                    {project.description || 'No description provided.'}
                  </p>

                  <div className="flex items-center gap-3 text-[9px] text-muted-foreground/60 pt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground/50" />
                      {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}
                    </span>
                  </div>
                </div>

                <div className="px-3.5 py-2 bg-muted/10 border-t border-border flex items-center justify-between text-[9px] text-muted-foreground/80">
                  <div className="flex items-center gap-2.5">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-muted-foreground/60" />
                      {project._count?.members || 0} members
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckSquare className="h-3 w-3 text-muted-foreground/60" />
                      {project._count?.tasks || 0} tasks
                    </span>
                  </div>
                  <span className="text-primary group-hover:translate-x-0.5 transition-transform font-medium">
                    Open →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-6">
              <Button
                variant="outline"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="border-border bg-card/60 h-8 text-xs text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                Previous
              </Button>
              <span className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="border-border bg-card/60 h-8 text-xs text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
