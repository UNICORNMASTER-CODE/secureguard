import type { Express } from "express";
import { createServer, type Server } from "http";
import { downloadRequestSchema } from "@shared/schema";
import { CodeGenerator } from "./services/codeGenerator";

export async function registerRoutes(app: Express): Promise<Server> {
  const codeGenerator = new CodeGenerator();

  app.post("/api/generate", async (req, res) => {
    try {
      const { config } = downloadRequestSchema.parse(req.body);
      
      // Generate the combined Python tool
      const generatedCode = codeGenerator.generateCombinedTool(config);
      
      // Set headers for file download
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `secureguard_tool_${timestamp}.py`;
      
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', Buffer.byteLength(generatedCode, 'utf8'));
      
      // Send the generated code as a downloadable file
      res.send(generatedCode);
      
    } catch (error) {
      console.error('Error generating tool:', error);
      res.status(400).json({ 
        message: "Failed to generate security tool",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
