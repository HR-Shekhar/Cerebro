package com.cerebro.service;

import com.cerebro.config.OpenAiConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.core.ParameterizedTypeReference;

import java.util.*;

@Service
public class DoubtService {

    @Autowired
    private OpenAiConfig openAiConfig;

    private final RestTemplate restTemplate = new RestTemplate();

    public String askDoubt(String question) {
        // Headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openAiConfig.getKey());

        // Request Body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", openAiConfig.getModel());
        requestBody.put("temperature", openAiConfig.getTemperature());
        requestBody.put("max_tokens", openAiConfig.getMaxTokens());
        requestBody.put("messages", List.of(
                Map.of("role", "user", "content", question)
        ));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        // API Call
       try {
    ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
        openAiConfig.getUrl(),
        HttpMethod.POST,
        request,
        new ParameterizedTypeReference<>() {}
    );

    // your existing response parsing code...
    // Example:
    Map<String, Object> responseBody = response.getBody();
    if (responseBody != null && responseBody.containsKey("choices")) {
        return responseBody.get("choices").toString();
    } else {
        return "Invalid response from AI service.";
    }

} catch (HttpClientErrorException.TooManyRequests e) {
    return "You've hit the AI request limit. Please try again later.";
} catch (HttpClientErrorException e) {
    return "AI service error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString();
} catch (Exception e) {
    return "An unexpected error occurred: " + e.getMessage();
}

        // The redundant code block referencing 'response' has been removed.
    }
}
