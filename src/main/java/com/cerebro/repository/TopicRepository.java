package com.cerebro.repository;

import com.cerebro.model.Topic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TopicRepository extends JpaRepository<Topic, Long> {
    List<Topic> findByCourseId(Long courseId);

    long countByCourseId(Long courseId);

    long countByCourseIdAndCompletedTrue(Long courseId);
}
