package com.cerebro.controller;

import com.cerebro.dto.CourseDTO;
import com.cerebro.model.Course;
import com.cerebro.model.Topic;
import com.cerebro.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:5173")
public class CourseController {
    private final CourseService service;

    public CourseController(CourseService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Course> create(@RequestBody Course course) {
        return ResponseEntity.ok(service.create(course));
    }

    @GetMapping
    public ResponseEntity<List<CourseDTO>> getAll() {
        List<CourseDTO> courseDTOs = service.getAll().stream()
                .map(course -> new CourseDTO(course.getId(), course.getName(), course.getDescription()))
                .toList();
        return ResponseEntity.ok(courseDTOs);
    }

    @GetMapping("/{courseId}/topics")
    public ResponseEntity<List<Topic>> getTopicsByCourse(@PathVariable Long courseId) {
        List<Topic> topics = service.getTopicsByCourseId(courseId);
        return ResponseEntity.ok(topics);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }
}