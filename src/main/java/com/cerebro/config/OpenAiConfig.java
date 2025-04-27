package com.cerebro.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAiConfig {

    @Value("${openai.api.key}")
    private String key;

    @Value("${openai.api.url}")
    private String url;

    @Value("${openai.api.model}")
    private String model;

    @Value("${openai.api.temperature}")
    private double temperature;

    @Value("${openai.api.max_tokens}")
    private int maxTokens;

    public String getKey() {
        return key;
    }

    public String getUrl() {
        return url;
    }

    public String getModel() {
        return model;
    }

    public double getTemperature() {
        return temperature;
    }

    public int getMaxTokens() {
        return maxTokens;
    }
}
