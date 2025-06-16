
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText } from "lucide-react";
import { useRHFFormContext } from "@/components/tenancy-application/RHFFormProvider";

const RHFTermsAndDataStep = () => {
  const { form } = useRHFFormContext();

  return (
    <div className="space-y-8 font-lexend">
      <div>
        <h3 className="text-2xl font-bold text-dark-grey mb-2">Terms and Data Sharing</h3>
        <p className="text-light-grey mb-4">Please review and accept the terms and conditions.</p>
        <div className="border-b border-gray-200 mb-6"></div>
      </div>

      <Card className="border-2 border-orange-100 bg-gradient-to-br from-white to-orange-50/30">
        <CardHeader className="pb-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
          <CardTitle className="text-lg font-semibold flex items-center gap-3 text-white">
            <div className="p-2 bg-white/20 rounded-lg">
              <FileText className="h-5 w-5" />
            </div>
            Data Sharing Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="termsAndData.dataSharing.utilities"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Utilities Data Sharing</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Allow us to share your data with utility providers for faster setup
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
              name="termsAndData.dataSharing.insurance"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Insurance Data Sharing</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Allow us to share your data with insurance providers for quotes
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
        </CardContent>
      </Card>

      <Card className="border-2 border-orange-100 bg-gradient-to-br from-white to-orange-50/30">
        <CardHeader className="pb-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
          <CardTitle className="text-lg font-semibold flex items-center gap-3 text-white">
            <div className="p-2 bg-white/20 rounded-lg">
              <FileText className="h-5 w-5" />
            </div>
            Electronic Signature
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <FormField
            control={form.control}
            name="termsAndData.signature"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-label text-gray-700 font-medium">
                  Electronic Signature <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Type your full name as your electronic signature"
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
            name="termsAndData.termsAccepted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I accept the terms and conditions <span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="text-sm text-muted-foreground">
                    By checking this box, you agree to our terms and conditions and privacy policy.
                  </div>
                </div>
              </FormItem>
            )}
          />
          <FormMessage />
        </CardContent>
      </Card>
    </div>
  );
};

export default RHFTermsAndDataStep;
