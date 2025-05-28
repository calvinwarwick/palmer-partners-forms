
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Search, X, Filter } from "lucide-react";

interface ApplicationFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  dateFilter: string;
  onDateFilterChange: (date: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const ApplicationFilters = ({
  searchTerm,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
  onClearFilters,
  hasActiveFilters
}: ApplicationFiltersProps) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg">
          <Filter className="h-5 w-5 text-orange-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          <p className="text-sm text-gray-500">Search and filter applications</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search by name, email, address, or postcode..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 h-12 border-gray-200 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
          />
        </div>

        {/* Date Filter */}
        <Select value={dateFilter} onValueChange={onDateFilterChange}>
          <SelectTrigger className="w-full lg:w-56 h-12 border-gray-200 focus:ring-orange-500 shadow-sm">
            <Calendar className="h-5 w-5 mr-2 text-gray-500" />
            <SelectValue placeholder="Filter by date" />
          </SelectTrigger>
          <SelectContent className="bg-white shadow-lg border">
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="this_week">This Week</SelectItem>
            <SelectItem value="this_month">This Month</SelectItem>
            <SelectItem value="last_month">Last Month</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button 
            variant="outline" 
            onClick={onClearFilters} 
            className="w-full lg:w-auto h-12 border-gray-200 hover:bg-gray-50 shadow-sm"
          >
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          <span className="text-sm font-medium text-gray-600 self-center">Active filters:</span>
          {searchTerm && (
            <Badge variant="secondary" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
              Search: "{searchTerm}"
            </Badge>
          )}
          {dateFilter !== "all" && (
            <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              Date: {dateFilter.replace('_', ' ')}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default ApplicationFilters;
