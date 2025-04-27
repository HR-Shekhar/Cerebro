package com.cerebro.controller;

import com.cerebro.model.Topic;
import com.cerebro.service.TopicService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/topics")
@CrossOrigin(origins = "http://localhost:5173")
public class TopicController {

    private final TopicService service;

    public TopicController(TopicService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Topic> create(@RequestBody Topic topic) {
        return ResponseEntity.ok(service.create(topic));
    }

    @GetMapping
    public ResponseEntity<List<Topic>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Topic> getById(@PathVariable Long id) {
        return ResponseEntity.of(service.findById(id));
    }

    @GetMapping("/by-course/{courseId}")
    public ResponseEntity<List<Topic>> getByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(service.getByCourseId(courseId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }

    // New toggle-complete endpoint
    @PatchMapping("/{id}/toggle-complete")
    public ResponseEntity<Topic> toggleComplete(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> payload
    ) {
        Boolean completed = payload.get("completed");
        if (completed == null) {
            return ResponseEntity.badRequest().build();
        }
        Topic updated = service.toggleComplete(id, completed);
        return (updated != null)
            ? ResponseEntity.ok(updated)
            : ResponseEntity.notFound().build();
    }
}