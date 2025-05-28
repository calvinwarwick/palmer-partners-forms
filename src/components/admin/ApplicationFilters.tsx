
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Search, Filter, X } from "lucide-react";
import { useState } from "react";

interface ApplicationFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  dateFilter: string;
  onDateFilterChange: (date: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const ApplicationFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  dateFilter,
  onDateFilterChange,
  onClearFilters,
  hasActiveFilters
}: ApplicationFiltersProps) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name, email, address, or postcode..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-full lg:w-48 focus:ring-orange-500">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Filter */}
        <Select value={dateFilter} onValueChange={onDateFilterChange}>
          <SelectTrigger className="w-full lg:w-48 focus:ring-orange-500">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="this_week">This Week</SelectItem>
            <SelectItem value="this_month">This Month</SelectItem>
            <SelectItem value="last_month">Last Month</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="outline" onClick={onClearFilters} className="w-full lg:w-auto">
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="text-xs">
              Search: "{searchTerm}"
            </Badge>
          )}
          {statusFilter !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Status: {statusFilter.replace('_', ' ')}
            </Badge>
          )}
          {dateFilter !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Date: {dateFilter.replace('_', ' ')}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default ApplicationFilters;
