import { z } from "zod";

export const configurationSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z.string(),
  targetDir: z.enum([
    "test", 
    "documents", 
    "desktop", 
    "downloads", 
    "home",
    "mac_root",
    "windows_root", 
    "mac_system",
    "unix_system",
    "mac_applications",
    "mac_library",
    "windows_system",
    "windows_programs",
    "windows_programs_x86"
  ]),
  backupLocation: z.enum([
    "desktop", 
    "documents", 
    "external", 
    "custom",
    "none"
  ]),
  scanProfile: z.enum(["paranoid", "sneaky", "normal", "aggressive"]),
  threadCount: z.enum(["5", "10", "15", "20", "30"]),
  excludeImages: z.boolean(),
  excludeVideos: z.boolean()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type Configuration = z.infer<typeof configurationSchema>;

export const downloadRequestSchema = z.object({
  config: configurationSchema,
  timestamp: z.string()
});

export type DownloadRequest = z.infer<typeof downloadRequestSchema>;
