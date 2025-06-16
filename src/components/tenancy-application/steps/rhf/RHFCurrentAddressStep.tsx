
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin } from "lucide-react";
import { useRHFFormContext } from "@/components/tenancy-application/RHFFormProvider";

const RHFCurrentAddressStep = () => {
  const { form } = useRHFFormContext();
  const applicants = form.watch("currentAddress.applicants") || [];

  return (
    <div className="space-y-8 font-lexend">
      <div>
        <h3 className="text-2xl font-bold text-dark-grey mb-2">Current Address</h3>
        <p className="text-light-grey mb-4">Tell us about your current living situation.</p>
        <div className="border-b border-gray-200 mb-6"></div>
      </div>

      {applicants.map((applicant, index) => (
        <Card key={applicant.id} className="border-2 border-orange-100 bg-gradient-to-br from-white to-orange-50/30">
          <CardHeader className="pb-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
            <CardTitle className="text-lg font-semibold flex items-center gap-3 text-white">
              <div className="p-2 bg-white/20 rounded-lg">
                <MapPin className="h-5 w-5" />
              </div>
              Current Address - Applicant {index + 1}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name={`currentAddress.applicants.${index}.currentAddress`}
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="form-label text-gray-700 font-medium">
                      Current Address <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter current address"
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
                name={`currentAddress.applicants.${index}.currentPostcode`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="form-label text-gray-700 font-medium">
                      Postcode <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter postcode"
                        className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name={`currentAddress.applicants.${index}.residencyStatus`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="form-label text-gray-700 font-medium">
                      Residency Status <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="form-select border-gray-200 focus:border-orange-500 focus:ring-orange-500">
                          <SelectValue placeholder="Select residency status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white border-gray-300 z-50">
                        <SelectItem value="tenant">Tenant</SelectItem>
                        <SelectItem value="owner">Property Owner</SelectItem>
                        <SelectItem value="living-with-family">Living with Family</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`currentAddress.applicants.${index}.timeAtAddress`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="form-label text-gray-700 font-medium">
                      Time at Address
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="form-select border-gray-200 focus:border-orange-500 focus:ring-orange-500">
                          <SelectValue placeholder="Select time at address" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white border-gray-300 z-50">
                        <SelectItem value="less-than-6-months">Less than 6 months</SelectItem>
                        <SelectItem value="6-12-months">6-12 months</SelectItem>
                        <SelectItem value="1-2-years">1-2 years</SelectItem>
                        <SelectItem value="2-3-years">2-3 years</SelectItem>
                        <SelectItem value="3-years">3+ years</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name={`currentAddress.applicants.${index}.moveInDate`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="form-label text-gray-700 font-medium">
                      Move In Date <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="date-input-container">
                        <Calendar className="date-input-icon h-4 w-4 text-orange-500" />
                        <Input
                          type="date"
                          className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
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
                name={`currentAddress.applicants.${index}.vacateDate`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="form-label text-gray-700 font-medium">
                      Vacate Date <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="date-input-container">
                        <Calendar className="date-input-icon h-4 w-4 text-orange-500" />
                        <Input
                          type="date"
                          className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RHFCurrentAddressStep;
