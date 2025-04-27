package com.cerebro.service;

import com.cerebro.model.Course;
import com.cerebro.model.Topic;
import com.cerebro.repository.CourseRepository;
import com.cerebro.repository.TopicRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CourseService {

    private final CourseRepository courseRepo;
    private final TopicRepository topicRepo;

    public CourseService(CourseRepository courseRepo,
                         TopicRepository topicRepo) {
        this.courseRepo  = courseRepo;
        this.topicRepo   = topicRepo;
    }

    public Course create(Course course) {
        return courseRepo.save(course);
    }

    public List<Course> getAll() {
        return courseRepo.findAll();
    }

    public Course getById(Long id) {
        return courseRepo.findById(id).orElse(null);
    }

    public void delete(Long id) {
        courseRepo.deleteById(id);
    }

    /** Pull all Topics under a Course, forcing course.name/description to load */
    public List<Topic> getTopicsByCourseId(Long courseId) {
        List<Topic> topics = topicRepo.findByCourseId(courseId);

        // ensure course.name + description are loaded
        for (Topic t : topics) {
            Course c = t.getCourse();
            if (c != null) {
                c.getName();
                c.getDescription();
            }
        }
        return topics;
    }
}