
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase } from "lucide-react";
import { useRHFFormContext } from "@/components/tenancy-application/RHFFormProvider";

const RHFEmploymentStep = () => {
  const { form } = useRHFFormContext();
  const applicants = form.watch("employment.applicants") || [];

  return (
    <div className="space-y-8 font-lexend">
      <div>
        <h3 className="text-2xl font-bold text-dark-grey mb-2">Employment Details</h3>
        <p className="text-light-grey mb-4">Tell us about your employment situation.</p>
        <div className="border-b border-gray-200 mb-6"></div>
      </div>

      {applicants.map((applicant, index) => (
        <Card key={applicant.id} className="border-2 border-orange-100 bg-gradient-to-br from-white to-orange-50/30">
          <CardHeader className="pb-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
            <CardTitle className="text-lg font-semibold flex items-center gap-3 text-white">
              <div className="p-2 bg-white/20 rounded-lg">
                <Briefcase className="h-5 w-5" />
              </div>
              Employment - Applicant {index + 1}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <FormField
              control={form.control}
              name={`employment.applicants.${index}.employmentStatus`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label text-gray-700 font-medium">
                    Employment Status <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="form-select border-gray-200 focus:border-orange-500 focus:ring-orange-500">
                        <SelectValue placeholder="Select employment status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border-gray-300 z-50">
                      <SelectItem value="full-time">Full-time employed</SelectItem>
                      <SelectItem value="part-time">Part-time employed</SelectItem>
                      <SelectItem value="self-employed">Self-employed</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="unemployed">Unemployed</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name={`employment.applicants.${index}.companyName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="form-label text-gray-700 font-medium">
                      Company Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter company name"
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
                name={`employment.applicants.${index}.jobTitle`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="form-label text-gray-700 font-medium">
                      Job Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter job title"
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
                name={`employment.applicants.${index}.annualIncome`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="form-label text-gray-700 font-medium">
                      Annual Income
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
                name={`employment.applicants.${index}.lengthOfService`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="form-label text-gray-700 font-medium">
                      Length of Service
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="form-select border-gray-200 focus:border-orange-500 focus:ring-orange-500">
                          <SelectValue placeholder="Select length of service" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white border-gray-300 z-50">
                        <SelectItem value="less-than-3-months">Less than 3 months</SelectItem>
                        <SelectItem value="3-6-months">3-6 months</SelectItem>
                        <SelectItem value="6-12-months">6-12 months</SelectItem>
                        <SelectItem value="1-2-years">1-2 years</SelectItem>
                        <SelectItem value="2-years">2+ years</SelectItem>
                      </SelectContent>
                    </Select>
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

export default RHFEmploymentStep;
