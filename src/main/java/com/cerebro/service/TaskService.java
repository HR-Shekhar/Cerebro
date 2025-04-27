package com.cerebro.service;

import com.cerebro.model.Task;
import com.cerebro.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository repo;

    public TaskService(TaskRepository repo) {
        this.repo = repo;
    }

    public Task create(Task task) {
        return repo.save(task);
    }

    public List<Task> getAll() {
        return repo.findAll();
    }

    public List<Task> getByStatus(boolean completed) {
        return repo.findByCompleted(completed);
    }

    public Optional<Task> update(Long id, Task updatedTask) {
        return repo.findById(id).map(task -> {
            task.setTitle(updatedTask.getTitle());
            task.setDueDate(updatedTask.getDueDate());
            task.setCompleted(updatedTask.isCompleted());
            return repo.save(task);
        });
    }

    public boolean delete(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return true;
        }
        return false;
    }
}
