// src/main/java/com/cerebro/service/InsightsService.java
package com.cerebro.service;

import com.cerebro.model.Course;
import com.cerebro.model.Topic;
import com.cerebro.repository.CourseRepository;
import com.cerebro.repository.TopicRepository;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class InsightsService {

    private final CourseRepository courseRepo;
    private final TopicRepository  topicRepo;

    public InsightsService(CourseRepository courseRepo,
                           TopicRepository topicRepo) {
        this.courseRepo = courseRepo;
        this.topicRepo  = topicRepo;
    }

    /**
     * Only the manual 'completed' flag on each Topic drives course completion.
     */
    public Map<String, Double> getCourseCompletionPercentages() {
        Map<String, Double> completionMap = new LinkedHashMap<>();

        // Iterate all courses
        for (Course course : courseRepo.findAll()) {
            List<Topic> topics = topicRepo.findByCourseId(course.getId());
            long total = topics.size();

            // Count only those topics whose 'completed' field is true
            long completedCount = topics.stream()
                    .filter(Topic::isCompleted)
                    .count();

            // Compute percentage (guard divide by zero)
            double pct = (total > 0)
                       ? (completedCount * 100.0 / total)
                       : 0.0;

            // Round to two decimals
            double roundedPct = Math.round(pct * 100.0) / 100.0;
            completionMap.put(course.getName(), roundedPct);
        }

        return completionMap;
    }
}