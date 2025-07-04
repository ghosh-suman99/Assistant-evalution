import OpenAI from "openai";
import { config } from "./config.js";
import fs from "fs";

class OpenAIClient {
  constructor() {
    this.client = new OpenAI({
      apiKey: config.openai.apiKey,
    });
  }

  async createThread() {
    const thread = await this.client.beta.threads.create();
    return thread.id;
  }

  async addMessage(threadId, content, fileIds = []) {
    // For OpenAI API v5, use 'attachments' instead of 'file_ids'
    const messageData = {
      role: "user",
      content: content,
    };

    // Only add attachments if there are files
    if (fileIds && fileIds.length > 0) {
      messageData.attachments = fileIds.map((fileId) => ({
        file_id: fileId,
        tools: [{ type: "file_search" }],
      }));
    }

    await this.client.beta.threads.messages.create(threadId, messageData);
  }

  async runAssistant(threadId) {
    const run = await this.client.beta.threads.runs.create(threadId, {
      assistant_id: config.openai.assistantId,
    });

    // Wait for completion with timeout
    let runStatus = await this.client.beta.threads.runs.retrieve(
      threadId,
      run.id
    );
    let attempts = 0;
    const maxAttempts = 60; // 60 seconds timeout

    while (
      (runStatus.status === "in_progress" || runStatus.status === "queued") &&
      attempts < maxAttempts
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      runStatus = await this.client.beta.threads.runs.retrieve(
        threadId,
        run.id
      );
      attempts++;
    }

    if (runStatus.status === "completed") {
      const messages = await this.client.beta.threads.messages.list(threadId);
      return {
        success: true,
        response: messages.data[0].content[0].text.value,
        functionCalls: this.extractFunctionCalls(runStatus),
      };
    } else if (runStatus.status === "requires_action") {
      // Handle function calls that require action
      return {
        success: true,
        response: "Function call required",
        functionCalls: this.extractFunctionCalls(runStatus),
      };
    } else {
      return {
        success: false,
        error:
          runStatus.last_error?.message ||
          `Run failed with status: ${runStatus.status}`,
        status: runStatus.status,
      };
    }
  }

  extractFunctionCalls(runStatus) {
    const functionCalls = [];

    // Check for required_action (function calls)
    if (runStatus.required_action?.submit_tool_outputs?.tool_calls) {
      for (const toolCall of runStatus.required_action.submit_tool_outputs
        .tool_calls) {
        try {
          functionCalls.push({
            name: toolCall.function.name,
            arguments: JSON.parse(toolCall.function.arguments),
          });
        } catch (e) {
          console.warn(
            "Failed to parse function arguments:",
            toolCall.function.arguments
          );
        }
      }
    }

    return functionCalls;
  }

  async uploadFile(filePath, purpose = "assistants") {
    try {
      const file = await this.client.files.create({
        file: fs.createReadStream(filePath),
        purpose: purpose,
      });
      return file.id;
    } catch (error) {
      console.error(`Failed to upload file ${filePath}:`, error.message);
      return null;
    }
  }
}

export default OpenAIClient;
