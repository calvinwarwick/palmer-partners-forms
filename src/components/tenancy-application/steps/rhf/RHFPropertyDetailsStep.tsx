
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Home } from "lucide-react";
import { useRHFFormContext } from "@/components/tenancy-application/RHFFormProvider";

const RHFPropertyDetailsStep = () => {
  const { form } = useRHFFormContext();

  return (
    <div className="space-y-8 font-lexend">
      <div>
        <h3 className="text-2xl font-bold text-dark-grey mb-2">Rental Property Details</h3>
        <p className="text-light-grey mb-4">Please provide the details of the property you are applying for.</p>
        <div className="border-b border-gray-200 mb-6"></div>
      </div>

      <Card className="border-2 border-orange-100 bg-gradient-to-br from-white to-orange-50/30">
        <CardHeader className="pb-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
          <CardTitle className="text-lg font-semibold flex items-center gap-3 text-white">
            <div className="p-2 bg-white/20 rounded-lg">
              <Home className="h-5 w-5" />
            </div>
            Property Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="propertyPreferences.streetAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label text-gray-700 font-medium">
                    Address <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Rental property address"
                      className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="propertyPreferences.postcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label text-gray-700 font-medium">
                    Postcode <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Rental property postcode"
                      className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="propertyPreferences.maxRent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label text-gray-700 font-medium">
                    Rental amount <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="currency-input-container">
                      <span className="currency-input-icon text-orange-500">£</span>
                      <Input
                        type="number"
                        placeholder=""
                        className="currency-input border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="propertyPreferences.moveInDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label text-gray-700 font-medium">
                    Preferred move-in date <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="date-input-container">
                      <Calendar className="date-input-icon h-4 w-4 text-orange-500" />
                      <Input
                        type="date"
                        className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                        placeholder="dd/mm/yyyy"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="propertyPreferences.latestMoveInDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label text-gray-700 font-medium">
                    Latest move-in date
                  </FormLabel>
                  <FormControl>
                    <div className="date-input-container">
                      <Calendar className="date-input-icon h-4 w-4 text-orange-500" />
                      <Input
                        type="date"
                        className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                        placeholder="dd/mm/yyyy"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="propertyPreferences.initialTenancyTerm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label text-gray-700 font-medium">
                    Preferred initial tenancy term <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="form-select border-gray-200 focus:border-orange-500 focus:ring-orange-500">
                        <SelectValue placeholder="Please select an option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border-gray-300 z-50">
                      <SelectItem value="1 year">1 year</SelectItem>
                      <SelectItem value="2 years">2 years</SelectItem>
                      <SelectItem value="3 years">3 years</SelectItem>
                      <SelectItem value="4+ years">4+ years</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RHFPropertyDetailsStep;
