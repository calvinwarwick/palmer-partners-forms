
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
        <div className="flex items-center justify-center w-10 h-10 bg-orange-500/10 rounded-lg">
          <Filter className="h-5 w-5 text-orange-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Filters</h3>
          <p className="text-sm text-gray-400">Search and filter applications</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
          <Input
            placeholder="Search by name, email, address, or postcode..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 h-12 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
          />
        </div>

        {/* Date Filter */}
        <Select value={dateFilter} onValueChange={onDateFilterChange}>
          <SelectTrigger className="w-full lg:w-56 h-12 bg-gray-700 border-gray-600 text-white focus:ring-orange-500 shadow-sm">
            <Calendar className="h-5 w-5 mr-2 text-gray-400" />
            <SelectValue placeholder="Filter by date" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-600">
            <SelectItem value="all" className="text-white hover:bg-gray-600">All Time</SelectItem>
            <SelectItem value="today" className="text-white hover:bg-gray-600">Today</SelectItem>
            <SelectItem value="this_week" className="text-white hover:bg-gray-600">This Week</SelectItem>
            <SelectItem value="this_month" className="text-white hover:bg-gray-600">This Month</SelectItem>
            <SelectItem value="last_month" className="text-white hover:bg-gray-600">Last Month</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button 
            variant="outline" 
            onClick={onClearFilters} 
            className="w-full lg:w-auto h-12 bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600 shadow-sm"
          >
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-700">
          <span className="text-sm font-medium text-gray-400 self-center">Active filters:</span>
          {searchTerm && (
            <Badge variant="secondary" className="text-xs bg-orange-500/10 text-orange-400 border-orange-500/30">
              Search: "{searchTerm}"
            </Badge>
          )}
          {dateFilter !== "all" && (
            <Badge variant="secondary" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/30">
              Date: {dateFilter.replace('_', ' ')}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default ApplicationFilters;
