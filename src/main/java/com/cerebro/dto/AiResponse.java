package com.cerebro.dto;

public class AiResponse {
    private String status;
    private String answer;

    public AiResponse() { }

    public AiResponse(String status, String answer) {
        this.status = status;
        this.answer = answer;
    }

    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

    public String getAnswer() {
        return answer;
    }
    public void setAnswer(String answer) {
        this.answer = answer;
    }
}