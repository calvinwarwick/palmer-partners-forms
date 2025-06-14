
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar as CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

interface AdminSearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  dateFilter: string;
  onDateFilterChange: (value: string) => void;
  customDateRange?: { from: Date; to: Date } | null;
  onCustomDateRangeChange?: (range: { from: Date; to: Date } | null) => void;
  totalApplications: number;
  filteredCount: number;
}

const AdminSearchFilters = ({
  searchTerm,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
  customDateRange,
  onCustomDateRangeChange,
  totalApplications,
  filteredCount
}: AdminSearchFiltersProps) => {
  const dateRange: DateRange | undefined = customDateRange 
    ? { from: customDateRange.from, to: customDateRange.to } 
    : undefined;

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    if (range?.from && range?.to && onCustomDateRangeChange) {
      onCustomDateRangeChange({ from: range.from, to: range.to });
      onDateFilterChange('custom');
    }
  };

  const getDateRangeDisplay = () => {
    if (customDateRange?.from && customDateRange?.to) {
      return `${format(customDateRange.from, "MMM dd")} - ${format(customDateRange.to, "MMM dd")}`;
    }
    return "Custom range";
  };

  const clearFilters = () => {
    onSearchChange("");
    onDateFilterChange("all");
    if (onCustomDateRangeChange) {
      onCustomDateRangeChange(null);
    }
  };

  const hasActiveFilters = searchTerm || dateFilter !== "all";

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Filter className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-gray-900">Filter Applications</h3>
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300">
            {filteredCount} of {totalApplications}
          </Badge>
        </div>
        
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="text-gray-600 hover:text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Search Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Search Applications</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by name, email, or address..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Date Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Date Range</label>
          <div className="flex gap-2">
            <Select value={dateFilter} onValueChange={onDateFilterChange}>
              <SelectTrigger className="flex-1 border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this_week">This week</SelectItem>
                <SelectItem value="this_month">This month</SelectItem>
                <SelectItem value="last_month">Last month</SelectItem>
                <SelectItem value="custom">{getDateRangeDisplay()}</SelectItem>
              </SelectContent>
            </Select>

            {/* Custom Date Range Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={handleDateRangeSelect}
                  numberOfMonths={2}
                />
                {dateRange?.from && dateRange?.to && (
                  <div className="p-3 border-t bg-gray-50">
                    <div className="text-sm text-gray-700 text-center">
                      {format(dateRange.from, "MMM dd, yyyy")} - {format(dateRange.to, "MMM dd, yyyy")}
                    </div>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSearchFilters;
