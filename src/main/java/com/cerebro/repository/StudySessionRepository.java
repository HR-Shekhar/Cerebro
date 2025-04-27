package com.cerebro.repository;

import com.cerebro.model.StudySession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;

public interface StudySessionRepository extends JpaRepository<StudySession, Long> {

    // Daily summary
    @Query(value = """
      SELECT 
        DATE(CONVERT_TZ(start_time, '+00:00', @@session.time_zone)) AS local_date,
        SUM(duration_in_minutes) AS total_minutes
      FROM study_session
      GROUP BY DATE(CONVERT_TZ(start_time, '+00:00', @@session.time_zone))
      ORDER BY local_date DESC
      """, nativeQuery = true)
    List<Object[]> getRawDailySummary();

//     @Query(value = """
//   SELECT 
//     WEEKDAY(CONVERT_TZ(start_time, @@session.time_zone, '+00:00')) AS weekday_index,
//     SUM(duration_in_minutes) AS total_minutes
//   FROM study_session
//   WHERE start_time >= :startOfWeek
//   GROUP BY WEEKDAY(CONVERT_TZ(start_time, @@session.time_zone, '+00:00'))
//   """, nativeQuery = true)
// List<Object[]> getRawWeeklySummaryNative(@Param("startOfWeek") String startOfWeek);

    @Query("SELECT DISTINCT FUNCTION('DATE', s.startTime) " +
       "FROM StudySession s " +
       "WHERE s.startTime IS NOT NULL " +
       "ORDER BY FUNCTION('DATE', s.startTime) DESC")
    List<java.sql.Date> findDistinctStudyDatesOrderedDesc();
    

    // New feature: course/topic linkage
    List<StudySession> findByCourseId(Long courseId);
    List<StudySession> findByTopicId(Long topicId);
}
