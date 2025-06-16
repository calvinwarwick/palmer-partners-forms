
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { FileText } from "lucide-react";
import { useRHFFormContext } from "@/components/tenancy-application/RHFFormProvider";

const RHFAdditionalDetailsStep = () => {
  const { form } = useRHFFormContext();
  const petsValue = form.watch("additionalDetails.pets");
  const childrenValue = form.watch("additionalDetails.children");

  return (
    <div className="space-y-8 font-lexend">
      <div>
        <h3 className="text-2xl font-bold text-dark-grey mb-2">Additional Details</h3>
        <p className="text-light-grey mb-4">Tell us more about your household and requirements.</p>
        <div className="border-b border-gray-200 mb-6"></div>
      </div>

      <Card className="border-2 border-orange-100 bg-gradient-to-br from-white to-orange-50/30">
        <CardHeader className="pb-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
          <CardTitle className="text-lg font-semibold flex items-center gap-3 text-white">
            <div className="p-2 bg-white/20 rounded-lg">
              <FileText className="h-5 w-5" />
            </div>
            Household Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="additionalDetails.children"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Children <span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Do you have children who will be living in the property?
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalDetails.pets"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Pets <span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Do you have pets that will be living in the property?
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {childrenValue && (
            <FormField
              control={form.control}
              name="additionalDetails.childrenDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label text-gray-700 font-medium">
                    Children Details <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please provide details about your children (ages, number, etc.)"
                      className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {petsValue && (
            <FormField
              control={form.control}
              name="additionalDetails.petDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label text-gray-700 font-medium">
                    Pet Details <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please provide details about your pets (type, breed, age, size, etc.)"
                      className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="additionalDetails.smoking"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Smoking</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Will anyone be smoking in the property?
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalDetails.parking"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Parking Required</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Do you require parking space?
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="additionalDetails.householdIncome"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-label text-gray-700 font-medium">
                  Household Income
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

          <FormField
            control={form.control}
            name="additionalDetails.additionalRequests"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-label text-gray-700 font-medium">
                  Additional Requests
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any additional requests or information you'd like to provide..."
                    className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default RHFAdditionalDetailsStep;
