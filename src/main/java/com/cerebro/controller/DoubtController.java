package com.cerebro.controller;

import com.cerebro.service.DoubtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/doubts")
public class DoubtController {

    @Autowired
    private DoubtService doubtService;

    @PostMapping
    public String ask(@RequestBody String question) {
        return doubtService.askDoubt(question);
    }
}
