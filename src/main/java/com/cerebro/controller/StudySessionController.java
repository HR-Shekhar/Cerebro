package com.cerebro.controller;

import com.cerebro.dto.DailyStudySummary;
import com.cerebro.model.StudySession;
import com.cerebro.service.InsightsService;
import com.cerebro.service.StudySessionService;
import com.cerebro.service.TopicService;
import com.cerebro.repository.TopicRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import com.cerebro.model.Topic;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "http://localhost:5173")
public class StudySessionController {
    private static final Logger log = LoggerFactory.getLogger(StudySessionController.class);
    private final StudySessionService service;
    private final InsightsService insightsService;
    private final TopicService topicService;
    private final TopicRepository topicRepo;

    public StudySessionController(StudySessionService service, InsightsService insightsService, TopicService topicService, TopicRepository topicRepo) {
        this.service = service;
        this.insightsService = insightsService;
        this.topicService = topicService;
        this.topicRepo = topicRepo;
    }

    @PostMapping
    public StudySession create(@RequestBody StudySession session) {
        return service.createSession(session);
    }

    @GetMapping
    public List<StudySession> getAll() {
        return service.getAllSessions();
    }

    @GetMapping("/{id}")
    public StudySession getById(@PathVariable Long id) {
        return service.getSession(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteSession(id);
    }

    @GetMapping("/daily-summary")
    public ResponseEntity<List<DailyStudySummary>> getDailySummary() {
        try {
            return ResponseEntity.ok(service.getDailySummary());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/weekly-summary")
    public ResponseEntity<Map<String, Integer>> getWeeklySummary() {
        return ResponseEntity.ok(service.getWeeklySummary());
    }

    @GetMapping("/streak")
    public ResponseEntity<Integer> getCurrentStreak() {
        log.info("🔔 /api/sessions/streak called");
        int streak = service.getCurrentStreak();
        log.info("🔔 Streak endpoint returning: {}", streak);
        return ResponseEntity.ok(streak);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<StudySession>> getByCourseId(@PathVariable Long courseId) {
        return ResponseEntity.ok(service.getSessionsByCourseId(courseId));
    }

    @GetMapping("/topic/{topicId}")
    public ResponseEntity<List<StudySession>> getByTopicId(@PathVariable Long topicId) {
        return ResponseEntity.ok(service.getSessionsByTopicId(topicId));
    }

    @GetMapping("/course/{courseId}/total")
    public ResponseEntity<Long> getTotalMinutesByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(service.getTotalMinutesByCourseId(courseId));
    }

    @GetMapping("/topic/{topicId}/total")
    public ResponseEntity<Long> getTotalMinutesByTopic(@PathVariable Long topicId) {
        return ResponseEntity.ok(service.getTotalMinutesByTopicId(topicId));
    }

    // ✅ New: Completion Percentage per Course
    @GetMapping("/insights/completion")
    public ResponseEntity<Map<String, Double>> getCourseCompletionInsights() {
        return ResponseEntity.ok(insightsService.getCourseCompletionPercentages());
    }
    @GetMapping("/insights/completion/{courseId}")
    public double getCourseCompletion(@PathVariable Long courseId) {
        // Fetch all topics related to the course
        List<Topic> topics = topicRepo.findByCourseId(courseId);
        
        // Count completed topics
        long completedCount = topics.stream().filter(Topic::isCompleted).count();
        
        // Calculate completion percentage
        return (double) completedCount / topics.size();
    }
}
