package com.cerebro.service;

import com.cerebro.model.Topic;
import com.cerebro.model.Course;
import com.cerebro.repository.TopicRepository;
import com.cerebro.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TopicService {

    private final TopicRepository topicRepo;
    private final CourseRepository courseRepo;

    public TopicService(TopicRepository topicRepo, CourseRepository courseRepo) {
        this.topicRepo = topicRepo;
        this.courseRepo = courseRepo;
    }

    public List<Topic> getAll() {
        return topicRepo.findAll();
    }

    public Optional<Topic> findById(Long id) {
        return topicRepo.findById(id);
    }

    public List<Topic> getByCourseId(Long courseId) {
        return topicRepo.findByCourseId(courseId);
    }

    public Topic create(Topic topic) {
        if (topic.getCourse() != null && topic.getCourse().getId() != null) {
            Course c = courseRepo.findById(topic.getCourse().getId()).orElse(null);
            topic.setCourse(c);
        }
        return topicRepo.save(topic);
    }

    public void delete(Long id) {
        topicRepo.deleteById(id);
    }

    public Topic toggleComplete(Long id, boolean completed) {
        return topicRepo.findById(id).map(t -> {
            t.setCompleted(completed);
            return topicRepo.save(t);
        }).orElse(null);
    }
}