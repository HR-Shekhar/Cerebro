// src/main/java/com/cerebro/dto/AiSaveRequest.java
package com.cerebro.dto;

public class AiSaveRequest {
    private String prompt;
    private String answer;

    public String getPrompt() {
        return prompt;
    }
    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public String getAnswer() {
        return answer;
    }
    public void setAnswer(String answer) {
        this.answer = answer;
    }
}