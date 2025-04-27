package com.cerebro.repository;

import com.cerebro.model.Doubt;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoubtRepository extends JpaRepository<Doubt, Long> {
}
