import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, ArrowLeft, Users, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Progress } from "@/components/ui/progress";

interface RegisterProps {
  onRegister: () => void;
  onBackToLogin: () => void;
}

const campuses = ["Main Campus", "North Campus", "South Campus", "International Campus"];

export const Register = ({ onRegister, onBackToLogin }: RegisterProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useLanguage();

  const titles = [
    { value: "mr", label: t('auth.titles.mr') },
    { value: "mrs", label: t('auth.titles.mrs') },
    { value: "ms", label: t('auth.titles.ms') },
    { value: "dr", label: t('auth.titles.dr') },
    { value: "prof", label: t('auth.titles.prof') }
  ];


  const registerSchema = z.object({
    title: z.string().min(1, t('auth.errors.titleRequired')),
    firstName: z.string().min(1, t('auth.errors.firstNameRequired')),
    lastName: z.string().min(1, t('auth.errors.lastNameRequired')),
    phoneNumber: z.string().min(1, t('auth.errors.phoneRequired')),
    email: z.string().email(t('auth.errors.emailInvalid')),
    password: z.string().min(6, t('auth.errors.passwordMin')),
    confirmPassword: z.string().min(1, t('auth.errors.passwordConfirmRequired')),
    children: z.array(z.object({
      firstName: z.string().min(1, t('auth.errors.firstNameRequired')),
      lastName: z.string().min(1, t('auth.errors.lastNameRequired')),
      dateOfBirth: z.string().min(1, "Date of birth is required"),
      interestedPrograms: z.array(z.string()).min(1, "Please select at least one program"),
    })).min(1, "At least one child is required"),
    agreeTerms: z.boolean().refine(val => val === true, {
      message: t('auth.errors.agreeTermsRequired'),
    }),
    agreePDPA: z.boolean().refine(val => val === true, {
      message: t('auth.errors.agreePDPARequired'),
    }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('auth.errors.passwordMismatch'),
    path: ["confirmPassword"],
  });

  type RegisterData = z.infer<typeof registerSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    watch,
    setValue,
    trigger,
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      children: [{ firstName: "", lastName: "", dateOfBirth: "", interestedPrograms: [] }],
      agreeTerms: false,
      agreePDPA: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "children",
  });

  const agreeTerms = watch("agreeTerms");
  const agreePDPA = watch("agreePDPA");

  const availablePrograms = [
    { value: "after-school", label: "After School Activities" },
    { value: "summer", label: "Summer Programs" },
    { value: "events", label: "Public Events" },
    { value: "workshops", label: "Workshops & Camps" },
  ];

  const onSubmit = async (data: RegisterData) => {
    console.log("External parent registration data:", { ...data, password: "[HIDDEN]", confirmPassword: "[HIDDEN]" });
    
    // Mock registration delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitted(true);
  };

  const nextStep = async () => {
    const isValid = await trigger([
      "title", "firstName", "lastName", "phoneNumber", 
      "email", "password", "confirmPassword"
    ]);
    
    if (isValid) {
      setCurrentStep(2);
    }
  };

  const addChild = () => {
    if (fields.length < 5) {
      append({ firstName: "", lastName: "", dateOfBirth: "", interestedPrograms: [] });
    }
  };

  const removeChild = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const toggleProgram = (childIndex: number, program: string) => {
    const currentPrograms = watch(`children.${childIndex}.interestedPrograms`) || [];
    const newPrograms = currentPrograms.includes(program)
      ? currentPrograms.filter(p => p !== program)
      : [...currentPrograms, program];
    setValue(`children.${childIndex}.interestedPrograms`, newPrograms);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Application Submitted!</CardTitle>
            <CardDescription>
              Thank you for your registration. Your application has been submitted for review.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-sm mb-2">What happens next?</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Our team will review your application</li>
                <li>• You'll receive an email within 2-3 business days</li>
                <li>• Once approved, you can access available programs</li>
                <li>• We'll contact you if additional information is needed</li>
              </ul>
            </div>
            <Button onClick={onBackToLogin} className="w-full">
              Return to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToLogin}
            className="absolute left-4 top-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Button>
          <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-secondary" />
          </div>
          <CardTitle className="text-2xl">Register as External Parent</CardTitle>
          <CardDescription>
            Join our community and get access to after-school activities, summer programs, and public events
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={currentStep === 1 ? 50 : 100} className="h-2" />
            <p className="text-sm text-muted-foreground text-center">
              {t('common.step')} {currentStep} {t('common.of')} 2: {currentStep === 1 ? "Parent Information" : "Children & Programs"}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-base">1. Parent Information</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">{t('auth.title')}*</Label>
                    <Select onValueChange={(value) => setValue("title", value)}>
                      <SelectTrigger className={errors.title ? "border-red-500" : ""}>
                        <SelectValue placeholder={t('auth.selectTitle')} />
                      </SelectTrigger>
                      <SelectContent>
                        {titles.map((title) => (
                          <SelectItem key={title.value} value={title.value}>{title.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.title && (
                      <p className="text-sm text-red-500">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t('auth.firstName')}*</Label>
                    <Input
                      id="firstName"
                      {...register("firstName")}
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-500">{errors.firstName.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">{t('auth.lastName')}*</Label>
                  <Input
                    id="lastName"
                    {...register("lastName")}
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">{errors.lastName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">{t('auth.phoneNumber')}*</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+66 XX XXX XXXX"
                    {...register("phoneNumber")}
                    className={errors.phoneNumber ? "border-red-500" : ""}
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.email')}*</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t('auth.password')}*</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}*</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...register("confirmPassword")}
                    className={errors.confirmPassword ? "border-red-500" : ""}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button
                  type="button"
                  onClick={nextStep}
                  className="w-full"
                >
                  Next: Children & Programs
                </Button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-base">2. Children & Program Interests</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addChild}
                    disabled={fields.length >= 5}
                    className="text-xs"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    {t('auth.addChild')} ({fields.length}/5)
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-sm">{t('auth.child')} {index + 1}</h5>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeChild(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                       <div className="space-y-1">
                         <Label>{t('auth.firstName')}*</Label>
                         <Input
                           {...register(`children.${index}.firstName`)}
                           className={errors.children?.[index]?.firstName ? "border-red-500" : ""}
                         />
                         {errors.children?.[index]?.firstName && (
                           <p className="text-xs text-red-500">{errors.children[index]?.firstName?.message}</p>
                         )}
                       </div>

                       <div className="space-y-1">
                         <Label>{t('auth.lastName')}*</Label>
                         <Input
                           {...register(`children.${index}.lastName`)}
                           className={errors.children?.[index]?.lastName ? "border-red-500" : ""}
                         />
                         {errors.children?.[index]?.lastName && (
                           <p className="text-xs text-red-500">{errors.children[index]?.lastName?.message}</p>
                         )}
                       </div>
                    </div>

                    <div className="space-y-1">
                      <Label>{t('auth.dateOfBirth')}*</Label>
                      <Input
                        type="date"
                        {...register(`children.${index}.dateOfBirth`)}
                        className={errors.children?.[index]?.dateOfBirth ? "border-red-500" : ""}
                      />
                      {errors.children?.[index]?.dateOfBirth && (
                        <p className="text-xs text-red-500">{errors.children[index]?.dateOfBirth?.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Interested Programs*</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {availablePrograms.map((program) => (
                          <div key={program.value} className="flex items-center space-x-2">
                            <Checkbox
                              checked={watch(`children.${index}.interestedPrograms`)?.includes(program.value) || false}
                              onCheckedChange={() => toggleProgram(index, program.value)}
                            />
                            <Label className="text-sm cursor-pointer">
                              {program.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {errors.children?.[index]?.interestedPrograms && (
                        <p className="text-xs text-red-500">{errors.children[index]?.interestedPrograms?.message}</p>
                      )}
                    </div>
                  </div>
                ))}

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="agreeTerms"
                      checked={agreeTerms || false}
                      onCheckedChange={(checked) => setValue("agreeTerms", !!checked)}
                    />
                    <div className="space-y-1">
                      <Label
                        htmlFor="agreeTerms"
                        className="text-sm font-normal cursor-pointer leading-tight"
                      >
                        {t('auth.acceptTerms')}{" "}
                        <Dialog>
                          <DialogTrigger asChild>
                            <button type="button" className="text-primary hover:underline font-medium">
                              {t('auth.termsOfService')}
                            </button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{t('auth.termsOfService')}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 text-sm">
                              <h3 className="font-semibold">1. Acceptance of Terms</h3>
                              <p>By registering as an external parent, you agree to comply with and be bound by these Terms and Conditions for accessing our programs and activities.</p>
                              
                              <h3 className="font-semibold">2. External User Registration</h3>
                              <p>External parent registration is subject to approval. You must provide accurate information and understand that access is limited to specific programs and activities.</p>
                              
                              <h3 className="font-semibold">3. Program Access</h3>
                              <p>As an external user, you have access to after-school activities, summer programs, and public events. Access to core academic services is not included.</p>
                              
                              <h3 className="font-semibold">4. Payment and Fees</h3>
                              <p>All program fees must be paid in advance. External users may be subject to different pricing than enrolled students.</p>
                              
                              <h3 className="font-semibold">5. Approval Process</h3>
                              <p>Your application will be reviewed within 2-3 business days. Approval is at the discretion of the school administration.</p>
                            </div>
                          </DialogContent>
                        </Dialog>
                        *
                      </Label>
                      {errors.agreeTerms && (
                        <p className="text-xs text-red-500">{errors.agreeTerms.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="agreePDPA"
                      checked={agreePDPA || false}
                      onCheckedChange={(checked) => setValue("agreePDPA", !!checked)}
                    />
                    <div className="space-y-1">
                      <Label
                        htmlFor="agreePDPA"
                        className="text-sm font-normal cursor-pointer leading-tight"
                      >
                        {t('auth.acceptTerms')}{" "}{t('auth.and')}{" "}
                        <Dialog>
                          <DialogTrigger asChild>
                            <button type="button" className="text-primary hover:underline font-medium">
                              {t('auth.privacyPolicy')}
                            </button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{t('auth.privacyPolicy')}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 text-sm">
                              <h3 className="font-semibold">Data Collection for External Users</h3>
                              <p>We collect and process personal data for external users in accordance with the Personal Data Protection Act, limited to program administration and communication purposes.</p>
                              
                              <h3 className="font-semibold">Types of Data Collected</h3>
                              <ul className="list-disc pl-5 space-y-1">
                                <li>Parent and child identification information</li>
                                <li>Contact information for program communications</li>
                                <li>Program enrollment and participation records</li>
                                <li>Payment and billing information</li>
                                <li>Emergency contact information</li>
                              </ul>
                              
                              <h3 className="font-semibold">Purpose of Data Processing</h3>
                              <ul className="list-disc pl-5 space-y-1">
                                <li>Program enrollment and administration</li>
                                <li>Communication regarding activities and events</li>
                                <li>Payment processing and billing</li>
                                <li>Safety and emergency procedures</li>
                                <li>Legal compliance and record keeping</li>
                              </ul>
                              
                              <h3 className="font-semibold">Data Retention</h3>
                              <p>External user data is retained only for the duration of program participation plus any required legal retention period.</p>
                            </div>
                          </DialogContent>
                        </Dialog>
                        *
                      </Label>
                      {errors.agreePDPA && (
                        <p className="text-xs text-red-500">{errors.agreePDPA.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};