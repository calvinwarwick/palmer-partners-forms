
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Plus, Trash2 } from "lucide-react";
import { useRHFFormContext } from "@/components/tenancy-application/RHFFormProvider";

const RHFPersonalInfoStep = () => {
  const { form, addApplicant, removeApplicant } = useRHFFormContext();
  const applicants = form.watch("personalInfo.applicants") || [];

  return (
    <div className="space-y-8 font-lexend">
      <div>
        <h3 className="text-2xl font-bold text-dark-grey mb-2">Personal Information</h3>
        <p className="text-light-grey mb-4">Tell us about yourself and any additional applicants.</p>
        <div className="border-b border-gray-200 mb-6"></div>
      </div>

      {applicants.map((applicant, index) => (
        <Card key={applicant.id} className="border-2 border-orange-100 bg-gradient-to-br from-white to-orange-50/30">
          <CardHeader className="pb-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
            <CardTitle className="text-lg font-semibold flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <User className="h-5 w-5" />
                </div>
                Applicant {index + 1}
              </div>
              {applicants.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeApplicant(index)}
                  className="text-white hover:bg-white/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name={`personalInfo.applicants.${index}.firstName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="form-label text-gray-700 font-medium">
                      First Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter first name"
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
                name={`personalInfo.applicants.${index}.lastName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="form-label text-gray-700 font-medium">
                      Last Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter last name"
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
                name={`personalInfo.applicants.${index}.email`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="form-label text-gray-700 font-medium">
                      Email Address <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter email address"
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
                name={`personalInfo.applicants.${index}.phone`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="form-label text-gray-700 font-medium">
                      Phone Number <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Enter phone number"
                        className="form-control border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name={`personalInfo.applicants.${index}.dateOfBirth`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label text-gray-700 font-medium">
                    Date of Birth <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
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
      ))}

      {applicants.length < 5 && (
        <div className="flex justify-center">
          <Button
            type="button"
            onClick={addApplicant}
            variant="outline"
            className="border-orange-500 text-orange-500 hover:bg-orange-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Applicant
          </Button>
        </div>
      )}
    </div>
  );
};

export default RHFPersonalInfoStep;
